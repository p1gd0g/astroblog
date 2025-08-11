import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) => z.object({
		title: z.string(),
		description: z.string().optional(),
		// Transform string to Date object
		pubDate: z.string().transform((x) => {

			// parse x with format '2025 年 5 月 14 日 16:33:52' to Date
			const parts = x.match(/(\d+) 年 (\d+) 月 (\d+) 日 (\d+):(\d+):(\d+)/);
			if (!parts) return new Date();
			const year = parseInt(parts[1]);
			const month = parseInt(parts[2]) - 1; // Months are 0-indexed
			const day = parseInt(parts[3]);
			const hour = parseInt(parts[4]);
			const minute = parseInt(parts[5]);
			const second = parseInt(parts[6]);
			return new Date(year, month, day, hour, minute, second);
		}
		),
		updatedDate: z.string().transform((x) => {

			// parse x with format '2025 年 5 月 14 日 16:33:52' to Date
			const parts = x.match(/(\d+) 年 (\d+) 月 (\d+) 日 (\d+):(\d+):(\d+)/);
			if (!parts) return new Date();
			const year = parseInt(parts[1]);
			const month = parseInt(parts[2]) - 1; // Months are 0-indexed
			const day = parseInt(parts[3]);
			const hour = parseInt(parts[4]);
			const minute = parseInt(parts[5]);
			const second = parseInt(parts[6]);
			return new Date(year, month, day, hour, minute, second);
		}
		).optional(),
		heroImage: image().optional(),
		tags: z.array(z.string()).optional(),
	}),
});

export const collections = { blog };
