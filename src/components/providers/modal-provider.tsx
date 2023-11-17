'use client'
import { useEffect, useState } from 'react';
import CreateChannelModal from '../modals/CreateChannelModal';
import EditServerModal from '../modals/EditServerModal';
import InviteModal from '../modals/InviteModal';
import MembersModal from '../modals/MembersModal';
import CreateServerModal from './../modals/CreateServerModal';


export const ModalProvider=()=>{
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { 
    setIsMounted(true);
  }, []);
  if(!isMounted)
    return null;
  return (
    <>
      <CreateServerModal/>
      <InviteModal/> 
      <EditServerModal/>
      <MembersModal/>
      <CreateChannelModal/>
    </>
  )
}
