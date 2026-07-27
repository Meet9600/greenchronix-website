import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	metadataBase: new URL('https://greenchronix.com'),
	title: 'GreenChronix | Lean Engineering Studio | Web Platforms, AI Agents & Blockchain',
	description:
		'A lean software engineering studio shipping production web platforms, custom AI agents, blockchain systems, and cloud infrastructure. 15 to 35 day delivery.',
	keywords: [
		'GreenChronix',
		'Green Chronix engineering studio',
		'Next.js development company',
		'custom AI agent development service',
		'AI chatbot agency',
		'blockchain development services',
		'Web3 software studio',
		'MVP web app development',
		'lean tech engineering studio',
		'software development agency Gandhinagar',
		'business automation services',
	],
	alternates: { canonical: 'https://greenchronix.com' },
	openGraph: {
		title: 'GreenChronix | Lean Engineering Studio | Web Platforms, AI & Blockchain',
		description:
			'Web platforms, AI agents, blockchain and cloud, engineered by a lean senior team. 15 to 35 day delivery, 30 days of support included.',
		url: 'https://greenchronix.com',
		siteName: 'GreenChronix',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'GreenChronix | Lean Engineering Studio',
		description:
			'Web platforms, custom AI agents, blockchain systems and cloud infrastructure.',
	},
	generator: 'GreenChronix',
}

export const viewport: Viewport = {
	themeColor: '#0a0c0b',
	width: 'device-width',
	initialScale: 1,
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" className="bg-background">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				{children}
			</body>
		</html>
	)
}
