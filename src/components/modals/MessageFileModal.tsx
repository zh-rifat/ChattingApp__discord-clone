'use client'

import {Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle} from '@/components/ui/dialog'
import {Form, FormControl, FormItem, FormLabel,FormField,FormMessage} from '@/components/ui/form'
import { Button } from '@/components/ui/button';
import {useForm} from 'react-hook-form';
import * as z from 'zod';
import {zodResolver} from '@hookform/resolvers/zod';
import FileUpload from '@/components/FileUpload';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useModal } from '@/hooks/useModalHook';
import qs from 'query-string';


const formSchema = z.object({
  fileUrl: z.string().min(1, {
    message: "Attachment is required."
  })
});


const MessageFileModal = ({}) => {

  const form =useForm({
    resolver:zodResolver(formSchema),
    defaultValues: {
      fileUrl: "",
    }
  });

  const {isOpen,onClose,type,data}=useModal();
  const isModalOpen=isOpen&&type==='messageFile';

  const router=useRouter();
  const isLoading = form.formState.isSubmitting;

  const handleClose=()=>{
    form.reset();
    onClose();
  }
  const {apiUrl,query}=data;

  const onSubmit= async (values:z.infer<typeof formSchema>)=>{
    try {
      const url=qs.stringifyUrl({
        url:apiUrl||"",
        query,
      });
      await axios.post(url,{
        ...values,
        content: values.fileUrl
      })
      form.reset();
      router.refresh();
      onClose();
      
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className="pt-6 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Add an attachment

          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Send a file as message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="fileUrl"
                  render={({field})=>{
                    console.log(field)
                    return (
                    <FormItem>
                      <FormControl>
                        <FileUpload
                          endpoint="messageFile"
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>

                    </FormItem>

                  )}}
                />
              </div>
              
            </div>
            <DialogFooter className='bg-gray-100 px-6 py-4 sm:justify-center'>
              <Button variant='primary' disabled={isLoading}>
                Send
              </Button>

            </DialogFooter>
          </form>
        </Form>
      </DialogContent>

    </Dialog>
  )
}

export default MessageFileModal;
