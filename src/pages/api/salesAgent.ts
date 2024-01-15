import type { NextApiRequest, NextApiResponse } from 'next'
import { SalesGPT } from '../../langchain/salesgpt';
import { llm } from '../../langchain/llm';
import { CONVERSATION_STAGES } from '../../constants/conversation-stages';


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    const config = {
        salesperson_name: "Ted Stern",
        use_tools: true,
        product_catalog: "sample_product_catalog.txt",
    };
    const { message } = req.body

    const sales_agent = await SalesGPT.from_llm(llm, false, config);
    sales_agent.conversation_history = message;

    if(!message || message == '') return res.status(400).json({error: 'you need to send a message'})

    let stageResponse : string = await sales_agent.determine_conversation_stage();
    let stepResponse = await sales_agent.step();

    if(message[message.length -1].includes('Do I need to use a tool?')){
        console.log('revalidating-------------')
        stageResponse = await sales_agent.determine_conversation_stage();
        stepResponse = await sales_agent.step();    
    }
    const indexNubmer : String =  stageResponse.toString();
    console.log("------------------SteopResponse :", stepResponse);
    console.log("------------------StageResponse", CONVERSATION_STAGES[stageResponse as keyof typeof CONVERSATION_STAGES]);

    return res.status(200).json({ 
        conversationHistory: sales_agent.conversation_history, 
        stepResponse : stepResponse,
        stageResponse: CONVERSATION_STAGES[stageResponse as keyof typeof CONVERSATION_STAGES],
    });
}