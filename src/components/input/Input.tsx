import axios from 'axios'
import React, { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from 'react'

type Props = {
  setMessages: Dispatch<SetStateAction<Messages>>,
  chattype: string,
  context: string
}

const Input = ({setMessages, chattype, context}: Props) => {
  const [prompt, setPrompt] = useState<string>('')
  const [chatHistory, setChatHistory] = useState<any>(['Ted Stern: Hello, this is Ted Stern from Sleep Haven. How are you doing today? <END_OF_TURN>']);

  const handleSubmit = (e: FormEvent)=>{
    e.preventDefault();
    setPrompt('');
    const newChatHistory = [...chatHistory, prompt];

    //Show the Human Messgae into Header
    setMessages(p => [...p, {
      id: p.length + 1,
      type: 'human',
      message: prompt
    }]);

    switch(chattype){
      case '1':
        axios.post('/api/langChain', { message: prompt })
        .then(res => {
          setMessages(p => [...p, {
            id: p.length + 2,
            type: 'AI',
            message: res.data
          }]);
        })
        .catch((e) => console.log(e));
        break;
      case '2':
        if(context == ''){
          console.log("input the context!!!");
          setMessages(p => [...p, {
            id: p.length + 2,
            type: 'AI',
            message: "Alert!!!! Input the Context(Corner Top Right)"
          }]);
          return;
        }
        axios.post('/api/retrievalChain', { message: prompt, context: context })
        .then(res => {
          setMessages(p => [...p, {
            id: p.length + 2,
            type: 'AI',
            message: res.data
          }]);
        })
        .catch((e) => console.log(e));
        break;
      case '3':
        axios.post('/api/salesAgent', {message: newChatHistory})
        .then(res => {
          setMessages(p => [...p, {
            id: p.length + 2,
            type: 'AI',
            message: res.data.stepResponse
          }]);
          const {conversationHistory, stageResponse, stepResponse} = res.data;

          setChatHistory(conversationHistory);
        })
        .catch((e) => console.log(e));
        break;
    }
  }

  return (
    <form onSubmit={handleSubmit} className='min-h-[80px] flex gap-3 items-center justify-center w-full' >
      <input value={prompt} onChange={(e:ChangeEvent<HTMLInputElement>)=>setPrompt(e.target.value)} name='prompt' className='bg-transparent outline-transparent min-h-[40px] min-w-[270px] w-[60%] rounded-xl rounded-ee-none border-2 p-2 border-[#404040] focus:outline-0 focus:border-[#63b3ed]' type="text" placeholder='Message...' />
      <button className='rounded-full border-[#404040] border p-3' >
        <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.02658 0.581423C7.21941 0.223316 7.59329 0 8.00001 0C8.40673 0 8.78061 0.223316 8.97344 0.581423L15.6604 13C15.8033 13.2655 15.7734 13.5908 15.5843 13.8258C15.3953 14.0607 15.0839 14.1596 14.794 14.0767L10.7146 12.9112C9.94381 12.691 9.37897 12.0317 9.27953 11.2362L8.56203 5.49614C8.5266 5.2127 8.28565 5 8.00001 5C7.71436 5 7.47342 5.2127 7.43799 5.49614L6.72048 11.2362C6.62104 12.0317 6.0562 12.691 5.28537 12.9112L1.20605 14.0767C0.916097 14.1596 0.60473 14.0607 0.415685 13.8258C0.22664 13.5908 0.196687 13.2655 0.339652 13L7.02658 0.581423Z" fill="#585F5F"></path></svg>
      </button>
    </form>
  )
}

export default Input