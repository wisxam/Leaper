import { db } from "@/db";
import { cohereAI } from "@/lib/cohereAI";
import { pinecone } from "@/lib/pinecone";
import { SendMessageValidator } from "@/lib/validators/sendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { CohereEmbeddings } from "@langchain/cohere";
import { PineconeStore } from "@langchain/pinecone";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  const { id: userId } = user;

  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const body = await req.json();
  const { fileId, message } = SendMessageValidator.parse(body);

  const file = await db.file.findFirst({
    where: {
      id: fileId,
      userId,
    },
  });

  if (!file) return new NextResponse("Not found", { status: 404 });

  // Create a readable stream to handle response streaming
  const readableStreamDefaultWriter = new ReadableStream({
    async start(controller) {
      try {
        const pineconeIndex = pinecone.Index("leaper");

        await db.message.create({
          data: {
            text: message,
            isUserMessage: true,
            userId,
            fileId,
          },
        });

        const embeddings = new CohereEmbeddings({
          model: "embed-english-v3.0",
          apiKey: process.env.COHERE_API_KEY,
        });

        const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
          pineconeIndex,
          namespace: file.id,
        });

        const results = await vectorStore.similaritySearch(message, 4);

        const previousMessages = await db.message.findMany({
          where: {
            fileId,
          },
          orderBy: {
            createdAt: "asc",
          },
          take: 6,
        });

        const formattedPrevMessages = previousMessages.map((msg) => ({
          role: msg.isUserMessage ? "user" : "assistant",
          content: msg.text,
        }));

        const combinedMessage = [
          "Use the following pieces of context (or previous conversation if needed) to answer the user's question in markdown format.",
          `If you don't know the answer, just say that you don't know, don't try to make up an answer. 
          ----------------
          PREVIOUS CONVERSATION:   
          ${formattedPrevMessages
            .map((message) => {
              if (message.role === "user") return `User: ${message.content}\n`;
              return `Assistant: ${message.content}\n`;
            })
            .join("")}
          ----------------
          CONTEXT:  
          ${results.map((r) => r.pageContent).join("\n\n")} 
          USER INPUT: ${message}`,
        ].join("\n\n");

        const response = await cohereAI.chat({
          model: "command-xlarge-nightly",
          temperature: 0.7,
          message: combinedMessage,
        });

        const assistantMessage = response.text;

        // Store the AI's response in the database
        await db.message.create({
          data: {
            // id: "ai-response",
            text: assistantMessage,
            isUserMessage: false,
            fileId,
            userId,
          },
        });

        // Stream the response back to the client
        controller.enqueue(`Assistant: ${assistantMessage}\n`);
        controller.close();
      } catch (error) {
        console.error("Error during streaming:", error);
        controller.error(error);
      }
    },
  });

  return new NextResponse(readableStreamDefaultWriter, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
      "Transfer-Encoding": "chunked",
    },
  });
};

// import { db } from "@/db";
// import { cohereAI } from "@/lib/cohereAI";
// import { pinecone } from "@/lib/pinecone";
// import { SendMessageValidator } from "@/lib/validators/sendMessageValidator";
// import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
// import { CohereEmbeddings } from "@langchain/cohere";
// import { PineconeStore } from "@langchain/pinecone";
// import { NextRequest, NextResponse } from "next/server";

// export const POST = async (req: NextRequest) => {
//   try {
//     console.log("Received POST request");
//     const body = await req.json();
//     const { getUser } = getKindeServerSession();
//     const user = await getUser();

//     const { id: userId } = user;

//     if (!userId) return new NextResponse("Unauthorized", { status: 401 });

//     const { fileId, message } = SendMessageValidator.parse(body);

//     const file = await db.file.findFirst({
//       where: {
//         id: fileId,
//         userId,
//       },
//     });

//     if (!file) return new NextResponse("Not found", { status: 404 });

//     await db.message.create({
//       data: {
//         text: message,
//         isUserMessage: true,
//         userId,
//         fileId,
//       },
//     });

//     const pineconeIndex = pinecone.Index("leaper");

//     const embeddings = new CohereEmbeddings({
//       model: "embed-english-v3.0",
//       apiKey: process.env.COHERE_API_KEY,
//     });

//     const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
//       pineconeIndex,
//       namespace: file.id,
//     });

//     const results = await vectorStore.similaritySearch(message, 4);

//     const previousMessages = await db.message.findMany({
//       where: {
//         fileId,
//       },
//       orderBy: {
//         createdAt: "asc",
//       },
//       take: 6,
//     });

//     const formattedPrevMessages = previousMessages.map((msg) => ({
//       role: msg.isUserMessage ? ("user" as const) : ("assistant" as const),
//       content: msg.text,
//     }));

//     const combinedMessage = [
//       "Use the following pieces of context (or previous conversation if needed) to answer the user's question in markdown format.",
//       `If you don't know the answer, just say that you don't know, don't try to make up an answer.
//       ----------------
//       PREVIOUS CONVERSATION:
//       ${formattedPrevMessages
//         .map((message) => {
//           if (message.role === "user") return `User: ${message.content}\n`;
//           return `Assistant: ${message.content}\n`;
//         })
//         .join("")}
//       ----------------
//       CONTEXT:
//       ${results.map((r) => r.pageContent).join("\n\n")}
//       USER INPUT: ${message}`,
//     ].join("\n\n");

//     const response = await cohereAI.chat({
//       model: "command-xlarge-nightly",
//       temperature: 0.7,
//       message: combinedMessage,
//     });

//     // Ensure we return a response
//     return new NextResponse(JSON.stringify({ reply: response.text }), {
//       status: 200,
//     });
//   } catch (error) {
//     console.log("Error in POST handler:", error);
//     return new NextResponse("Internal Server Error", { status: 500 });
//   }
// };
