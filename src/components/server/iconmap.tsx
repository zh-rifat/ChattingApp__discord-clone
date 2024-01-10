
import { ChannelType, MemberRole } from '@prisma/client';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';

export const iconMap={
  [ChannelType.TEXT]:<Hash className='mr-2 h-4 w-4'/>,
  [ChannelType.AUDIO]:<Mic className='mr-2 h-4 w-4'/>,
  [ChannelType.VIDEO]:<Video className='mr-2 h-4 w-4'/>
}
export const iconMapx={
  [ChannelType.TEXT]:Hash,
  [ChannelType.AUDIO]:Mic,
  [ChannelType.VIDEO]:Video
}

export const roleIconMap={
  [MemberRole.GUEST]:null,
  [MemberRole.MODERATOR]:<ShieldCheck className='mr-2 h-4 w-4 text-indigo-500'/>,
  [MemberRole.ADMIN]:<ShieldAlert className='mr-2 h-4 w-4 text-rose-500'/>,
}
