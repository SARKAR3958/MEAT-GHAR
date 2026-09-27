// Utility to preload all image assets in the background
export const ALL_APP_IMAGES = [
  '/src/assets/images/bg_1790503776302.jpg',
  '/src/assets/images/meat_onboarding_1_1790501345494.jpg',
  '/src/assets/images/meat_onboarding_2_1790501365087.jpg',
  '/src/assets/images/meat_delivery_70_1790501379469.jpg',
  '/src/assets/images/meat_bottom_platter_1790501395172.jpg',
  '/src/assets/images/map_delivery_illustration_1790502010289.jpg',
  '/src/assets/images/delivery_partner_avatar_1790502025354.jpg',
];

export const preloadImages = (urls: string[] = ALL_APP_IMAGES): Promise<void[]> => {
  const promises = urls.map((url) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.src = url;
      img.onload = () => resolve();
      img.onerror = () => resolve(); // Resolve anyway so build isn't blocked
    });
  });

  return Promise.all(promises);
};
