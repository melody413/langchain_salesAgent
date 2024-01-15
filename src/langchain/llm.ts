import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";


export const llm = new ChatOpenAI({
    streaming: true,
    //verbose: true,
    temperature: 0,
    openAIApiKey: process.env.OPENAI_API_KEY,
});

export const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
});
  
