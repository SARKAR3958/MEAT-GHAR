/**
 * Utility to preload and cache all application images in advance
 * Ensures instant, flicker-free rendering across all screens during demo.
 */

// Eagerly resolve all local image assets through Vite
const imageModules = import.meta.glob<{ default: string }>('/src/assets/images/*.jpg', {
  eager: true,
});

// Explicit list of known paths to guarantee resolution in all dev/prod environments
const imagePaths: string[] = [
  '/src/assets/images/bg_1790503776302.jpg',
  '/src/assets/images/cat_chicken_1790504356265.jpg',
  '/src/assets/images/cat_cold_cuts_1790508827963.jpg',
  '/src/assets/images/cat_eggs_1790504403080.jpg',
  '/src/assets/images/cat_fish_1790504389877.jpg',
  '/src/assets/images/cat_mutton_1790504374485.jpg',
  '/src/assets/images/cat_prawns_seafood_1790508815698.jpg',
  '/src/assets/images/cat_ready_to_cook_1790507566251.jpg',
  '/src/assets/images/cat_special_cuts_1790507586236.jpg',
  '/src/assets/images/chicken_curry_cut_wide_1790508282856.jpg',
  '/src/assets/images/curry_cut_chicken_1790507633294.jpg',
  '/src/assets/images/delivery_partner_avatar_1790502025354.jpg',
  '/src/assets/images/hero_banner_meat_1790507616083.jpg',
  '/src/assets/images/map_delivery_illustration_1790502010289.jpg',
  '/src/assets/images/meat_bottom_platter_1790501395172.jpg',
  '/src/assets/images/meat_delivery_70_1790501379469.jpg',
  '/src/assets/images/meat_onboarding_1_1790501345494.jpg',
  '/src/assets/images/meat_onboarding_2_1790501365087.jpg',
  '/src/assets/images/mutton_boneless_cubes_1790507651522.jpg',
  '/src/assets/images/mutton_boneless_wide_1790508301717.jpg',
  '/src/assets/images/offer_chicken_card_1790507696774.jpg',
  '/src/assets/images/offer_mutton_card_1790507713635.jpg',
  '/src/assets/images/product_rohu_fish_1790507600370.jpg',
  '/src/assets/images/rohu_fish_wide_1790508321588.jpg',
];

const cachedImages: HTMLImageElement[] = [];

export function preloadAllImages(): void {
  if (typeof window === 'undefined') return;

  const urlsToPreload = new Set<string>();

  // Add Vite resolved URLs
  Object.values(imageModules).forEach((mod) => {
    if (mod && mod.default) {
      urlsToPreload.add(mod.default);
    }
  });

  // Add explicit path URLs
  imagePaths.forEach((path) => urlsToPreload.add(path));

  urlsToPreload.forEach((src) => {
    try {
      const img = new Image();
      img.src = src;
      // Pre-decode so there is no decode stutter when navigating
      if ('decode' in img && typeof img.decode === 'function') {
        img.decode().catch(() => {
          // Ignore decode errors for preloaded assets
        });
      }
      cachedImages.push(img);
    } catch {
      // Ignore preload errors gracefully
    }
  });
}

// Automatically invoke on import so caching begins immediately
preloadAllImages();
