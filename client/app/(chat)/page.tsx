/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useEffect, useState } from 'react'
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
import { useLoading } from '@/hooks/use-loading'
import { useSession } from 'next-auth/react'
import { axiosClient } from '@/http/axios'
import { IError, IUser } from '@/types'
import { generateToken } from '@/lib/generate-token'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

const HomePage = () => {
	const [contacts, setContacts] = useState<IUser[]>([])

	const { setCreating, setLoading, isLoading } = useLoading()
	const { currentContact } = useCurrentContact()
	const { data: session } = useSession()
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

	const getContacts = async () => {
		setLoading(true)
		const token = await generateToken(session?.currentUser?._id)
		try {
			const { data } = await axiosClient.get<{ contacts: IUser[] }>(
				'/api/user/contacts',
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			)
			setContacts(data.contacts)
		} catch {
			toast('Cannot fetch contacts')
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		router.replace('/')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (session?.currentUser?._id) {
			getContacts()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session?.currentUser])

	const onCreateContact = async (values: z.infer<typeof emailSchema>) => {
		setCreating(true)
		const token = await generateToken(session?.currentUser?._id)
		try {
			const { data } = await axiosClient.post<{ contact: IUser }>(
				'/api/user/contact',
				values,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			)
			setContacts(prev => [...prev, data.contact])
			toast('Contact added successfully')
			contactForm.reset()
		} catch (error: any) {
			if ((error as IError).response?.data?.message) {
				return toast((error as IError).response.data.message)
			}
			return toast('Something went wrong')
		} finally {
			setCreating(false)
		}
	}

	const onSendMessage = (values: z.infer<typeof messageSchema>) => {
		console.log(values)
	}
	return (
		<>
			{/* Sidebar */}
			<div className='w-80 h-screen border-r fixed inset-0 z-50'>
				{/* Loading */}
				{isLoading && (
					<div className='w-full h-[95vh] flex justify-center items-center'>
						<Loader2 size={50} className='animate-spin' />
					</div>
				)}

				{/* Contact list */}
				{!isLoading && <ContactList contacts={contacts} />}
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

export default HomePage
