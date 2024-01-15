import React, { useEffect, useRef } from 'react'
import s from './s.module.scss'
import ReactMarkdown from 'react-markdown';

type Props = {
  messages: Messages
}

const Header = ({messages}: Props) => {
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(()=>{
    if(chatRef.current)
    chatRef.current.scrollIntoView({block: 'end', behavior: 'smooth'})
  }, [messages])

  return (
    <section className={s.section} >
      <div ref={chatRef} className={s.container} >
      {
        messages && messages.map((v, i)=>(
          <div key={i} className={[v.type === 'AI' ? s.aiMessage : s.humanMessage, s.message].join(' ') } >
            <ReactMarkdown>
              {v.message}
            </ReactMarkdown>
          </div>
        ))
      }
      </div>
    </section>
  )
}

export default Header