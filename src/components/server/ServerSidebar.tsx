
import { currentProfile } from '@/lib/current-profile';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { ChannelType, MemberRole } from '@prisma/client';
import ServerHeader from './ServerHeader';
import { ScrollArea } from '@/components/ui/scroll-area';
import { iconMap,roleIconMap } from '../../lib/iconmap';
import { ServerSearch } from './ServerSearch';
import { Separator } from '../ui/separator';
import ServerSection from './ServerSection';
import ServerChannel from './ServerChannel';
import ServerMember from './ServerMember';


interface ServerSidebarProps{
  serverId:string;
}



const ServerSidebar = async({serverId}:ServerSidebarProps) => {

  const profile=await currentProfile();

  if(!profile)  
    return redirect('/');

  const server=await db.server.findUnique({
    where:{id:serverId},
    include:{
      channels:{orderBy:{createdAt:'asc'}},
      members:{
        include:{profile:true},
        orderBy:{role:'asc'}
      }
    }
  });
  const textChannels=server?.channels.filter((channel)=>channel.type===ChannelType.TEXT);
  const audioChannels=server?.channels.filter((channel)=>channel.type===ChannelType.AUDIO);
  const videoChannels=server?.channels.filter((channel)=>channel.type===ChannelType.VIDEO);

  const members=server?.members.filter((member)=>member.profileId!==profile.id);

  if(!server)
    return redirect('/');

  const role = server.members.find((member)=>member.profileId===profile.id)?.role;

  return (
   <div className='flex flex-col h-full text-primary w-full  bg-[#F2F3F5] dark:bg-[#2b2d31]'>
     <ServerHeader server={server} role={role}/>
     <ScrollArea className='flex-1 px-3'>
      <div className='mt-2'>
        <ServerSearch 
          data={[
            {
              label:"Text Channels",
              type:'channel',
              data:textChannels?.map((channel)=>({
                id:channel.id,
                name:channel.name,
                icon:iconMap[channel.type]
              }))
            },
            {
              label:"Voice Channels",
              type:'channel',
              data:audioChannels?.map((channel)=>({
                id:channel.id,
                name:channel.name,
                icon:iconMap[channel.type]
              }))
            },
            {
              label:"Video Channels",
              type:'channel',
              data:videoChannels?.map((channel)=>({
                id:channel.id,
                name:channel.name,
                icon:iconMap[channel.type]
              }))
            },
            {
              label:"Members",
              type:'member',
              data:members?.map((member)=>({
                id:member.id,
                name:member.profile.name,
                icon:roleIconMap[member.role]
              }))
            },
          ]}  
        />
      </div>
      <Separator className='bg-zinc-200 dark:bg-zinc-700 rounded-md my-2'/>
			{!!textChannels?.length&&(
				<div className='mb-2'>
					<ServerSection
						sectionType='channels'
						channelType={ChannelType.TEXT}
						role={role}
						label="Text Channels"
					/>
          {textChannels.map((channel)=>(
            <ServerChannel 
              key={channel.id}
              channel={channel}
              role={role}
              server={server}
            />
          ))}
				</div>
			)}

      {!!audioChannels?.length&&(
				<div className='mb-2'>
					<ServerSection
						sectionType='channels'
						channelType={ChannelType.AUDIO}
						role={role}
						label="Voice Channels"
					/>
          <div className='space-y-[2px]'>
            {audioChannels.map((channel)=>(
              <ServerChannel 
                key={channel.id}
                channel={channel}
                role={role}
                server={server}
              />
            ))}
          </div>
				</div>
			)}

      {!!videoChannels?.length&&(
				<div className='mb-2'>
					<ServerSection
						sectionType='channels'
						channelType={ChannelType.VIDEO}
						role={role}
						label="Video Channels"
					/>
          <div className='space-y-[2px]'>
            {videoChannels.map((channel)=>(
              <ServerChannel 
                key={channel.id}
                channel={channel}
                role={role}
                server={server}
              />
            ))}
          </div>
				</div>
			)}

      {!!members?.length&&(
				<div className='mb-2'>
					<ServerSection
						sectionType='members'
						channelType={ChannelType.VIDEO}
						role={role}
						label="Members"
            server={server}
					/>
          <div className='space-y-[2px]'>
            {members.map((member)=>(
              <ServerMember key={member.id} member={member} server={server}/>
            ))}
          </div>
				</div>
			)}


     </ScrollArea >
   </div>
  )
}

export default ServerSidebar
