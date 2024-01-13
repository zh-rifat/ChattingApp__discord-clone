import qs from 'query-string';
import {useInfiniteQuery} from '@tanstack/react-query';

import { useSocket } from '@/components/providers/socket-provider';

interface ChatQueryProps{
  queryKey:string;
  apiUrl:string;
  paramKey:'channelId'|"conversationId";
  paramValue:string;
}

export const useChatQuery=(p:ChatQueryProps)=>{
  const {isConnected}=useSocket();

  const fetchMessages=async({pageParam=undefined})=>{
    const url=qs.stringifyUrl({
      url:p.apiUrl,
      query:{
        cursor:pageParam,
        [p.paramKey]:p.paramValue
      }
    },{skipNull:true});

    const res=await fetch(url);
    return res.json();

  }
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useInfiniteQuery({
    queryKey:[p.queryKey],
    queryFn:fetchMessages,
    getNextPageParam:(lastPage)=>lastPage.nextCursor,
    refetchInterval:isConnected?false:1000,
  });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
}