/* eslint-disable react-hooks/exhaustive-deps */
import MessageCard from '@/components/cards/message.card'
import ChatLoading from '@/components/loadings/chat.loading'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { messageSchema } from '@/lib/validation'
import { Paperclip, Send, Smile } from 'lucide-react'
import { FC, useEffect, useRef } from 'react'
// import emojies from '@emoji-mart/data'
// import Picker from '@emoji-mart/react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { useTheme } from 'next-themes'
import { useLoading } from '@/hooks/use-loading'
import { IMessage } from '@/types'

interface Props {
	messageForm: UseFormReturn<z.infer<typeof messageSchema>>
	onReadMessages: () => Promise<void>
	onSendMessage: (values: z.infer<typeof messageSchema>) => Promise<void>
	messages: IMessage[]
}

const Chat: FC<Props> = ({
	onSendMessage,
	messageForm,
	messages,
	onReadMessages,
}) => {
	const { loadMessages } = useLoading()

	const scrollRef = useRef<HTMLFormElement | null>(null)
	const { resolvedTheme } = useTheme()
	const inputRef = useRef<HTMLInputElement | null>(null)

	useEffect(() => {
		scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
		onReadMessages()
	}, [messages])

	const handleEmojiSelect = (emoji: string) => {
		const input = inputRef.current
		if (!input) return

		const text = messageForm.getValues('text')
		const start = input.selectionStart ?? 0
		const end = input.selectionEnd ?? 0

		const newText = text.slice(0, start) + emoji + text.slice(end)
		messageForm.setValue('text', newText)

		setTimeout(() => {
			input.setSelectionRange(start + emoji.length, start + emoji.length)
		}, 0)
	}
	return (
		<div className='flex flex-col justify-end z-40 min-h-[92vh]'>
			{/* Loading */}
			{loadMessages && <ChatLoading />}
			{/* Messages */}
			{messages.map((message, index) => (
				<MessageCard key={index} message={message} />
			))}

			{/* Start conversation */}
			{messages.length === 0 && (
				<div className='w-full h-[88vh] flex items-center justify-center '>
					<div
						className='cursor-pointer flex flex-wrap flex-col justify-center items-center border border- border-secondary bg-secondary '
						onClick={() => onSendMessage({ text: '✋' })}
					>
						<p className='text-md mt-6'>No messages yet...</p>
						<p className='text-md'>Send a message or tap the greeting below.</p>
						<p className='text-[100px]'>✋</p>
					</div>
				</div>
			)}

			{/* Message input */}
			<Form {...messageForm}>
				<form
					onSubmit={messageForm.handleSubmit(onSendMessage)}
					className='w-full flex relative'
					ref={scrollRef}
				>
					<Button size={'icon'} type='button' variant={'secondary'}>
						<Paperclip />
					</Button>
					<FormField
						control={messageForm.control}
						name='text'
						render={({ field }) => (
							<FormItem className='w-full'>
								<FormControl>
									<Input
										className='bg-secondary border-l border-l-muted-foreground border-r border-r-muted-foreground h-9'
										placeholder='Type a message'
										value={field.value}
										onBlur={() => field.onBlur()}
										onChange={e => field.onChange(e.target.value)}
										ref={inputRef}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
					<Popover>
						<PopoverTrigger asChild>
							<Button size='icon' type='button' variant='secondary'>
								<Smile />
							</Button>
						</PopoverTrigger>
						<PopoverContent className='p-0 border-none rounded-md absolute right-6 bottom-0'>
							{/* <Picker
								data={emojies}
								theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
								onEmojiSelect={(emoji: { native: string }) =>
									handleEmojiSelect(emoji.native)
								}
							/> */}
						</PopoverContent>
					</Popover>

					<Button type='submit' size={'icon'}>
						<Send />
					</Button>
				</form>
			</Form>
		</div>
	)
}

export default Chat
