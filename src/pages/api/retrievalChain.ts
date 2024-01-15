import type { NextApiRequest, NextApiResponse } from 'next'
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { MessagesPlaceholder } from "@langchain/core/prompts";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { createRetrieverTool } from "langchain/tools/retriever";
import { pull } from "langchain/hub";
import { createOpenAIFunctionsAgent, AgentExecutor } from "langchain/agents";
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { message, context } = req.body
    try {
        const chatModel = new ChatOpenAI({
            openAIApiKey: process.env.OPENAI_API_KEY,
          });
        const loader = new CheerioWebBaseLoader(
            context
        );
        const docs = await loader.load();
        // console.log("Doc Length :", docs.length);
        // console.log("Doc Page Content Length :", docs[0].pageContent.length);

        //Doc Splitter
        const splitter = new RecursiveCharacterTextSplitter();
        const splitDocs = await splitter.splitDocuments(docs);
        console.log("SplitDocs Length :", splitDocs.length);
        console.log("SplitDocs Page Content Length :", splitDocs[0].pageContent.length);

        const embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY,
          });

        const vectorstore = await MemoryVectorStore.fromDocuments(
            splitDocs,
            embeddings
        );

        const retriever = vectorstore.asRetriever();

        const retrieverTool = await createRetrieverTool(retriever, {
            name: "langsmith_search",
            description:
              "Search for information about LangSmith. For any questions about LangSmith, you must use this tool!",
          });

        const tools = [retrieverTool];
        const agentPrompt = await pull<ChatPromptTemplate>(
            "hwchase17/openai-functions-agent"
        );
        
        const agentModel = new ChatOpenAI({
            openAIApiKey: process.env.OPENAI_API_KEY,
            modelName: "gpt-3.5-turbo-1106",
            temperature: 0,
        });
        
        const agent = await createOpenAIFunctionsAgent({
            llm: agentModel,
            tools,
            prompt: agentPrompt,    
        });
        
        const agentExecutor = new AgentExecutor({
            agent,
            tools,
            verbose: true,
        });

        const agentResult = await agentExecutor.invoke({
            input: message,
        });
        
        // console.log("Question 5 :", agentResult.output);    
        return res.status(200).json(agentResult.output);

    }catch (error: any){
        if (error.response) {
        
        console.error(`Error with OpenAI API request: ${error.message}`);
        res.status(500).json({
            error: {
            message: 'An error occurred during your request.',
            }
        });
        }
    }
}