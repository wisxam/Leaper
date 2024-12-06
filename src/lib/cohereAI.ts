import { CohereClient } from "cohere-ai";

export const cohereAI = new CohereClient({
  token: process.env.COHERE_API_KEY,
});
