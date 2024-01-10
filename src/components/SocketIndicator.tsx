'use client'

import { useSocket } from "./providers/socket-provider"
import { Badge } from "./ui/badge";
import { cn } from '../lib/utils';


export const SocketIndicator=()=>{
  const isConnected=useSocket();

  return (
    <Badge variant='outline' className={cn(
      'text-white border-none',
      isConnected?"bg-emerald-600":"bg-yellow-600"
    )}>
      {isConnected?
      (<>Live: Real-time updates</>):
      (<>Fallback: Polling every 1s</>)}
    </Badge>
  )
}
