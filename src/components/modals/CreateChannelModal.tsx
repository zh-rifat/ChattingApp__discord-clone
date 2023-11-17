'use client'

import {Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle} from '@/components/ui/dialog'
import {Form, FormControl, FormItem, FormLabel,FormField,FormMessage} from '@/components/ui/form'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {useForm} from 'react-hook-form';
import * as z from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/useModalHook';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger

} from "@/components/ui/select"
import { ChannelType } from '@prisma/client';

const formSchema=z.object({
  name:z.string().min(1,{
    message:"Channel name is required"
  }).refine(name=>name!=='general',{
    message:'Channel name cannot `general`'
  })
  ,
  type:z.nativeEnum(ChannelType)
})
const CreateChannelModal = ({}) => {
  const {isOpen,onClose,type}=useModal();

  const isModalOpen=isOpen&&type==='createChannel';
  
  const router=useRouter();
  const form =useForm({
    resolver:zodResolver(formSchema),
    defaultValues:{
      name:"",
      type:ChannelType.TEXT
    }
  });
  const isLoading = form.formState.isSubmitting;

  const onSubmit= async (values:z.infer<typeof formSchema>)=>{
    try {
      await axios.post('/api/servers',values);
      form.reset();
      router.refresh();
      handleClose(); 
    } catch (error) {
      console.log(error);
    }
  }
  const handleClose=()=>{
    form.reset();
    onClose();
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className="pt-6 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Customize your server

          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your server a personality with a name and image. You can always change it later.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
             
              <FormField
                control={form.control}
                name="name"
                render={({field})=>(
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Channel name
                    </FormLabel>
                    <FormControl>
                      <Input disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder='Enter channel name'
                        {...field}
                      />
                        
                    </FormControl>
                    <FormMessage/>
                  </FormItem>
                )

                }  
              />
              <FormField
                control={form.control}
                name="type"
                render={({field})=>(
                  <FormItem>
                    <FormLabel>Channel Type</FormLabel>
                    <Select
                      disabled={isLoading}
                    >
                      
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className='bg-gray-100 px-6 py-4'>
              <Button variant='primary' disabled={isLoading}>
                Create
              </Button>

            </DialogFooter>
          </form>
        </Form>
      </DialogContent>

    </Dialog>
  )
}

export default CreateChannelModal;
