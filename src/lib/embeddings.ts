const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function getEmbeddings(text: string) {
    const model = genAI.getGenerativeModel({ model: "embedding-001"});
    try {
      const tt = text.replace(/\n/g, " ");
      const result = await model.embedContent(tt);
      return result.embedding.values as number[];
    } catch (error) {
      console.log("error calling openai embeddings api", error);
      throw error;
    }
  }


