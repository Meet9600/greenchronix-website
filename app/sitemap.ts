import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
	return [
		{
			url: 'https://greenchronix.com',
			lastModified: new Date(),
			changeFrequency: 'monthly',
			priority: 1,
		},
	]
}
