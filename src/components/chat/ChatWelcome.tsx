

import { Hash } from 'lucide-react';
import { FC } from 'react'

interface ChatWelcomeProps {
  name:string;
  type:'channel'|'conversation';

}

const ChatWelcome: FC<ChatWelcomeProps> = (p) => {
  return (
    <div className='space-y-2 px-4 mb-4'>
      {p.type==='channel'&&
        <div className='h-[75px] w-[75px] rounded-full bg-zinc-500 dark:bg-zinc-700 flex items-center justify-center'>
          <Hash className='h-12 w-12 text-white'/>
        </div>
      }
      <p className='text-xl md:text-3xl font-bold'>
        {p.type==='channel'?'Welcome to #':""}{p.name}
      </p>
      <p className='text-zinc-600 dark:text-zinc-400 text-sm'>
        {p.type==='channel'?
          `This is the start of the #${p.name} channel.`:
          `This is the of your conversation with ${name}`
        }

      </p>
    </div>
  )
}

export default ChatWelcome;

