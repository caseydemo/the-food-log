import { storyblokInit, apiPlugin } from '@storyblok/react/rsc';

export const getStoryblokApi = storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_TOKEN,
  use: [apiPlugin],
});

export async function fetchStory(slug: string) {
  const sb = getStoryblokApi();
  if (!sb) return null;

  try {
    const { data } = await sb.get(`cdn/stories/${slug}`, {
      version: process.env.NODE_ENV === 'production' ? 'published' : 'draft',
    });
    return data.story;
  } catch {
    return null;
  }
}
