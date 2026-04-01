import { notFound } from 'next/navigation';
import { fetchStory } from '@/lib/storyblok';

type Props = { params: Promise<{ slug: string }> };

export default async function CmsPage({ params }: Props) {
  const { slug } = await params;
  const story = await fetchStory(slug);

  if (!story) notFound();

  return (
    <main>
      <h1>{story.name}</h1>
      {/* Storyblok rich-text / component rendering goes here */}
      <pre>{JSON.stringify(story.content, null, 2)}</pre>
    </main>
  );
}
