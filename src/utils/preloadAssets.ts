/**
 * Ultra-Fast High-Priority Preloader for all Meat Ghar image assets.
 * Executes during initial boot & 4-second splash screen so all images render instantly.
 */

// Eagerly resolve all local image assets through Vite's bundler
const viteImageModules = import.meta.glob<{ default: string }>('/src/assets/images/*.(jpg|jpeg|png|webp)', {
  eager: true,
});

const allImageFilenames: string[] = [
  'bg_1790503776302.jpg',
  'cat_chicken_1790504356265.jpg',
  'cat_cold_cuts_1790508827963.jpg',
  'cat_eggs_1790504403080.jpg',
  'cat_fish_1790504389877.jpg',
  'cat_mutton_1790504374485.jpg',
  'cat_prawns_seafood_1790508815698.jpg',
  'cat_ready_to_cook_1790507566251.jpg',
  'cat_special_cuts_1790507586236.jpg',
  'chicken_curry_cut_wide_1790508282856.jpg',
  'curry_cut_chicken_1790507633294.jpg',
  'delivery_partner_avatar_1790502025354.jpg',
  'hero_banner_meat_1790507616083.jpg',
  'map_delivery_illustration_1790502010289.jpg',
  'meat_bottom_platter_1790501395172.jpg',
  'meat_delivery_70_1790501379469.jpg',
  'meat_onboarding_1_1790501345494.jpg',
  'meat_onboarding_2_1790501365087.jpg',
  'mutton_boneless_cubes_1790507651522.jpg',
  'mutton_boneless_wide_1790508301717.jpg',
  'offer_chicken_card_1790507696774.jpg',
  'offer_mutton_card_1790507713635.jpg',
  'product_rohu_fish_1790507600370.jpg',
  'rohu_fish_wide_1790508321588.jpg',
];

const inMemoryImageCache = new Map<string, HTMLImageElement>();

export async function preloadAllImages(): Promise<void> {
  if (typeof window === 'undefined') return;

  const urlsToPreload = new Set<string>();

  // 1. Vite Hashed Asset URLs
  Object.values(viteImageModules).forEach((mod) => {
    if (mod && mod.default) {
      urlsToPreload.add(mod.default);
    }
  });

  // 2. Direct public paths
  allImageFilenames.forEach((filename) => {
    urlsToPreload.add(`/images/${filename}`);
    urlsToPreload.add(`/assets/images/${filename}`);
    urlsToPreload.add(`/src/assets/images/${filename}`);
  });

  // Load and decode in parallel
  const promises = Array.from(urlsToPreload).map((url) => {
    return new Promise<void>((resolve) => {
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
            // Ignore decode failure and resolve to continue
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
