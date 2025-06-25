'use client'

import React, { useEffect } from 'react'
import ContactList from './_components/contact-list'
import { useRouter } from 'next/navigation'
import AddContact from './_components/add-contact'
import { useCurrentContact } from '@/hooks/use-current'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { emailSchema, messageSchema } from '@/lib/validation'
import TopChat from './_components/top-chat'
import Chat from './_components/chat'

const HomePage = () => {
	const { currentContact, setCurrentContact } = useCurrentContact()
	const router = useRouter()

	const contactForm = useForm<z.infer<typeof emailSchema>>({
		resolver: zodResolver(emailSchema),
		defaultValues: {
			email: '',
		},
	})

	const messageForm = useForm<z.infer<typeof messageSchema>>({
		resolver: zodResolver(messageSchema),
		defaultValues: {
			text: '',
			image: '',
		},
	})

	useEffect(() => {
		router.replace('/')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const onCreateContact = (values: z.infer<typeof emailSchema>) => {
		console.log(values)
	}

	const onSendMessage = (values: z.infer<typeof messageSchema>) => {
		console.log(values)
	}
	return (
		<>
			{/* Sidebar */}
			<div className='w-80 h-screen border-r fixed inset-0 z-50'>
				{/* Loading */}
				{/* <div className='w-full h-[95vh] flex justify-center items-center'>
					<Loader2 size={50} className='animate-spin' />
				</div> */}

				{/* Contact list */}
				<ContactList contacts={contacts} />
			</div>

			{/* Chat area */}
			<div className='pl-80 w-full'>
				{/* Add contacts */}
				{!currentContact?._id && (
					<AddContact
						contactForm={contactForm}
						onCreateContact={onCreateContact}
					/>
				)}
				{/* Chat */}
				{currentContact?._id && (
					<div className='w-full relative'>
						{/* Top chat */}
						<TopChat />
						{/* Chat message */}
						<Chat messageForm={messageForm} onSendMessage={onSendMessage} />
					</div>
				)}
			</div>
		</>
	)
}

const contacts = [
	{
		email: 'john@gmail.com',
		_id: '1',
		avatar: 'https://github.com/shadcn.png',
		firstName: 'John',
		lastName: 'Doe',
		bio: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis repellat blanditiis hic reiciendis quibusdam voluptatem necessitatibus, minus sint maxime iste impedit cupiditate ab provident doloremque sed dicta, molestias nemo cum.',
	},
	{ email: 'amile@gmail.com', _id: '2' },
	{ email: 'faris@gmail.com', _id: '3' },
	{ email: 'abdo@gmail.com', _id: '4' },
	{ email: 'billi@gmail.com', _id: '5' },
]

export default HomePage
