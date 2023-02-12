import { defineCollection, z } from "astro:content";

const blurbCollection = defineCollection({
    schema: z
        .object({
            pubDate: z.date(),
            updatedDate: z.date(),
        })
        .strict(),
});

export const collections = {
    blurbs: blurbCollection,
};
