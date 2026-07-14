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
	title: 'GreenChronix | Lean tech, shipped fast.',
	description:
		'A lean engineering studio shipping web platforms, AI agents, blockchain systems and cloud infrastructure. Clean code, honest timelines, 15 to 35 day delivery.',
	keywords: [
		'web development',
		'AI agents',
		'blockchain development',
		'automation',
		'Next.js studio',
		'GreenChronix',
	],
	alternates: { canonical: 'https://greenchronix.com' },
	openGraph: {
		title: 'GreenChronix | Lean tech, shipped fast.',
		description:
			'Web platforms, AI agents, blockchain and cloud, engineered by a lean senior team. 15 to 35 day delivery, 30 days of support included.',
		url: 'https://greenchronix.com',
		siteName: 'GreenChronix',
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'GreenChronix | Lean tech, shipped fast.',
		description:
			'Web platforms, AI agents, blockchain and cloud, engineered by a lean senior team.',
	},
	generator: 'v0.app',
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
