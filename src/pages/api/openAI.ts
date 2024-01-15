import type { NextApiRequest, NextApiResponse } from 'next'
const { Configuration, OpenAIApi } = require("openai");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { message } = req.body

  if(!message || message == '') return res.status(400).json({error: 'you need to send a message'})

  try{

    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
  
    if (!configuration.apiKey) {
      res.status(500).json({
        error: "OpenAI API key not configured, please follow instructions in README.md"
      });
      return;
    }
  
    const openai = new OpenAIApi(configuration);
  
    //best model: text-davinci-003
    const response = await openai.createCompletion({
      model: process.env.OPENAI_API_MODEL,
      prompt: message,
      temperature: 0,
      max_tokens: 500,
    });
    
    return res.status(200).json(response.data.choices[0].text)

  }catch (error: any){

    if (error.response) {
      console.log(error.response.data)
      res.status(error.response.status).json(error.response.data.error.message);
      
    } else {

      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });

    }

  }

}