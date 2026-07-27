import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'GreenChronix | Lean Engineering Studio',
		short_name: 'GreenChronix',
		description:
			'A lean software engineering studio shipping web platforms, custom AI agents, blockchain systems and cloud infrastructure.',
		start_url: '/',
		display: 'standalone',
		background_color: '#0a0c0b',
		theme_color: '#0a0c0b',
		icons: [
			{
				src: '/icon.svg',
				sizes: 'any',
				type: 'image/svg+xml',
			},
			{
				src: '/icon.png',
				sizes: '512x512',
				type: 'image/png',
			},
		],
	}
}
