'use client'
import ActionTooltip from './../ActionTooltip';
import { cn } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';


interface NavigationItemProps{
  id:string;
  imageUrl:string;
  name:string;
}
const NavigationItem = ({id,imageUrl,name}:NavigationItemProps) => {

  const params=useParams();
  const router=useRouter();

  return (
   <ActionTooltip side='right' align='center' label={name}>
    <button onClick={()=>{router.push(`/server/${id}`)}} className="group relative flex items-center">
      <div className={cn(
        "absolute left-0 bg-primary rounded-r-full transition-all w-[4px]",
        params?.serverId!==id?"group-hover:h-[20px] h-[8px]":"h-[36px] "
      )}/>
      <div className={cn(
        "relative group flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] overflow-hidden transition-all",
        params?.serverId===id?"bg-primary/10 text-primary":""
      )}>
        <Image fill src={imageUrl} alt="server"/>
      </div>
    </button>
   </ActionTooltip>
  )
}

export default NavigationItem
