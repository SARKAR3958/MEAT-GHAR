import { STATIC_IMAGES } from './imageAssets';

/**
 * Ultra-Fast High-Priority Preloader & In-Memory Cache for all Meat Ghar image assets.
 * Executes during initial boot & 4-second splash screen so all images render instantly.
 */

const inMemoryImageCache = new Map<string, HTMLImageElement>();

export async function preloadAllImages(): Promise<void> {
  if (typeof window === 'undefined') return;

  const urlsToPreload = new Set<string>();

  // 1. Direct Static Hashed Bundled URLs
  Object.values(STATIC_IMAGES).forEach((url) => {
    if (url) urlsToPreload.add(url);
  });

  // 2. Direct public paths
  Object.keys(STATIC_IMAGES).forEach((filename) => {
    urlsToPreload.add(`/images/${filename}`);
    urlsToPreload.add(`/assets/images/${filename}`);
    urlsToPreload.add(`/src/assets/images/${filename}`);
  });

  // 3. Online Seed URLs for products and categories (Unsplash fast cache)
  const unsplashUrls = [
    'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1603048588665-791ca8aea617?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80',
    'https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=500&q=80',
  ];
  unsplashUrls.forEach(url => urlsToPreload.add(url));

  // Load and decode all images in parallel
  const promises = Array.from(urlsToPreload).map((url) => {
    return new Promise<void>((resolve) => {
      // Check if already in cache
      if (inMemoryImageCache.has(url)) {
        resolve();
        return;
      }

      const img = new Image();
      img.src = url;
      img.loading = 'eager';

      if ('decode' in img && typeof img.decode === 'function') {
        img
          .decode()
          .then(() => {
            inMemoryImageCache.set(url, img);
            resolve();
          })
          .catch(() => {
            inMemoryImageCache.set(url, img);
            resolve();
          });
      } else {
        img.onload = () => {
          inMemoryImageCache.set(url, img);
          resolve();
        };
        img.onerror = () => resolve();
      }
    });
  });

  try {
    await Promise.allSettled(promises);
  } catch {
    // Ignore any global preload error
  }
}

// Immediately trigger background preload on bundle load
preloadAllImages();
