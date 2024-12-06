import { db } from "@/db";
import { openai } from "@/lib/openai";
import { pinecone } from "@/lib/pinecone";
import { SendMessageValidator } from "@/lib/validators/sendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    // Authentication
    const { getUser } = getKindeServerSession();
    const user = await getUser();
    const { id: userId } = user;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Parse and validate input
    const body = await req.json();
    const { fileId, message } = SendMessageValidator.parse(body);

    // Find the user's file
    const file = await db.file.findFirst({
      where: {
        id: fileId,
        userId,
      },
    });

    if (!file) {
      return new NextResponse("File not found", { status: 404 });
    }

    // Initialize Pinecone and LangChain
    const pineconeIndex = pinecone.Index("leaper");
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex,
      namespace: file.id,
    });

    // Fetch relevant data
    const results = await vectorStore.similaritySearch(message, 4);

    const previousMessages = await db.message.findMany({
      where: { fileId },
      orderBy: { createdAt: "asc" },
      take: 6,
    });

    const formattedPrevMessages = previousMessages.map((msg) => ({
      role: msg.isUserMessage ? "user" : "assistant",
      content: msg.text,
    }));

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0,
      stream: true,
      messages: [
        {
          role: "system",
          content:
            "Use the following pieces of context (or previous conversation if needed) to answer the user's question in markdown format.",
        },
        {
          role: "user",
          content: `
      Use the following pieces of context and conversation history to answer the user's query:
      
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
      
      USER INPUT: ${message}
                `,
        },
      ],
    });

    // Call OpenAI's Chat Completion API

    // Stream the response
    const stream = OpenAIStream(response, {
      async onCompletion(completion) {
        await db.message.create({
          data: {
            text: completion,
            isUserMessage: false,
            fileId,
            userId,
          },
        });
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error in POST handler:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
