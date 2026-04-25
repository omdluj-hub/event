import { supabase } from '@/lib/supabase';
import HomeContent from '@/components/HomeContent';

// This makes the page fetch data on the server
export const revalidate = 0; // Disable cache for real-time like updates, or set to a number (e.g., 60) for caching

async function getImages() {
  try {
    const [rootResult, cnResult] = await Promise.all([
      supabase.storage.from('event-images').list('', { sortBy: { column: 'name', order: 'asc' } }),
      supabase.storage.from('event-images').list('cardnews', { sortBy: { column: 'name', order: 'asc' } })
    ]);

    if (rootResult.error) throw rootResult.error;
    if (cnResult.error) throw cnResult.error;

    const rootFiles = rootResult.data;
    const cnFiles = cnResult.data;

    const eventFile = rootFiles?.find(f => f.name.startsWith('event'));
    const eventImage = eventFile 
      ? supabase.storage.from('event-images').getPublicUrl(eventFile.name).data.publicUrl 
      : null;

    const cardnewsImages = cnFiles
      ?.filter(f => !f.name.startsWith('.'))
      .map(f => supabase.storage.from('event-images').getPublicUrl(`cardnews/${f.name}`).data.publicUrl) || [];

    return { eventImage, cardnewsImages };
  } catch (error) {
    console.error('Error fetching images on server:', error);
    return { eventImage: null, cardnewsImages: [] };
  }
}

export default async function Home() {
  const images = await getImages();

  return <HomeContent initialImages={images} />;
}
