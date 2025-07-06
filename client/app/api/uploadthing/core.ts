/* eslint-disable @typescript-eslint/no-unused-vars */
import { authOptions } from '@/lib/auth-options'
import { getServerSession } from 'next-auth'
import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'

const f = createUploadthing()

export const ourFileRouter = {
	imageUploader: f({ image: { maxFileSize: '4MB' } })
		.middleware(async () => {
			const token = await getServerSession(authOptions)
			if (!token) throw new UploadThingError('Unauthorized')
			return { token }
		})
		.onUploadComplete(async ({ file }) => {
			// Return void instead of the file object to fix the type error
		}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
