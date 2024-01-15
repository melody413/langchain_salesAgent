import Image from 'next/image'
import React, { ChangeEvent, Dispatch, FormEvent, SetStateAction, useState } from 'react'

type Props = {
  setType: Dispatch<SetStateAction<string>>,
  setContext: Dispatch<SetStateAction<string>>
}

const Navbar = ({setType, setContext}: Props) => {
  
  const [ type, settype ] = useState("1");
  const [displaySideBar, setDisplay] = useState(false);
  const [context, setcontext] = useState("");

  const selectChatType = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    settype(e.target.value);
    setType(e.target.value);
  }

  const onInputchange = (e: ChangeEvent<HTMLInputElement>) => {
    setcontext(e.target.value);
    console.log("Context :", e.target.value);
  }

  const loadContext = () => {
    console.log("Saved Clicked!!:", context);
    setContext(context);
    setDisplay(false);
  }

  return (
    <nav className='flex items-center justify-around w-full min-h-[60px] bg-[#404040]' >
      <Image src='/bot-image.png' width={30} height={30} alt='' />
      <span className='text-[24px] font-bold' >LangChain Experimental Project</span>
      <select className='text-[black] text-[18px] p-[5px] rounded-[5px]' name="chattype" onChange={(e)=>selectChatType(e)}>
        <option value="1">Chat With GPT Model</option>
        <option value="2">Chat With specific context</option>
        <option value="3">Chat with SalesAgent</option>
      </select>
      {
        type == "2" ? 
        <button onClick={() => setDisplay(true)} className='p-[20px]'
        >
          <svg width="16" height="4" viewBox="0 0 16 4" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 2C4 3.10457 3.10457 4 2 4C0.89543 4 0 3.10457 0 2C0 0.895431 0.89543 0 2 0C3.10457 0 4 0.895431 4 2Z" fill="#E4E7E7"></path><path d="M10 2C10 3.10457 9.10457 4 8 4C6.89543 4 6 3.10457 6 2C6 0.895431 6.89543 0 8 0C9.10457 0 10 0.895431 10 2Z" fill="#E4E7E7"></path><path d="M14 4C15.1046 4 16 3.10457 16 2C16 0.895431 15.1046 0 14 0C12.8954 0 12 0.895431 12 2C12 3.10457 12.8954 4 14 4Z" fill="#E4E7E7"></path></svg>
        </button>
        : ""
      }

      {
        displaySideBar &&
        <div
          className="bg-[darkslategrey] p-8 rounded-sm absolute right-0 top-[60px] w-[500px] text-white transition-transform duration-500 ease-in-out w-2/5 overflow-y-auto"
        >
            <div
                className="absolute z-10 top-4 right-4 opacity-50 cursor-pointer"
                onClick={() => setDisplay(false)}
            >❌</div>
            <div className="flex flex-row justify-evenly mt-[30px] items-center">
                <h1>Input the URL :</h1>
                <input type='text' name="context" className='rounded-[5px] text-[20px] text-[black] w-[300px]' value={context} onChange={(e:ChangeEvent<HTMLInputElement>) => {onInputchange(e)}}/>
            </div>
            <div className='flex justify-evenly mt-[30px]'>
              <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center" onClick={() => loadContext()}>
                Save
              </button>
              <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center" onClick={() => setDisplay(false)}>
                Cancel
              </button>
             
            </div>
        </div>
      }
      
    </nav>
  )
}

export default Navbar