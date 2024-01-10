import { Hash } from 'lucide-react';
import { FC } from 'react'
import MobileToggle from '@/components/MobileToggle';
import UserAvatar from '@/components/UserAvatar';
import { SocketIndicator } from '../SocketIndicator';

interface ChatHeaderProps {
  serverId:string;
  name:string;
  type:'channel'|'conversation';
  imageUrl?:string;
}

const ChatHeader: FC<ChatHeaderProps> = ({
  serverId,name,type,imageUrl
}) => {
  return (
    <div className='textmd font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2'>
      <MobileToggle serverId={serverId}/>
      {type==='channel'&&(
        <Hash className='w-5 h-5 text-zinc-500 dark:text-zinc-400 mr-2'/>
      )}
      {type==='conversation'&&(
        <UserAvatar className='w-5 h-5mr-2'
          src={imageUrl}
        />
      )}
      <p className='font-semibold text-md text-black dark:text-white'>
        {name}
      </p>
      <div className='ml-auto flex items-center'>
        <SocketIndicator/>
      </div>
        
    </div>
  )
}

export default ChatHeader;
