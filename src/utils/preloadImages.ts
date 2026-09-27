export const APP_IMAGES = [
  '/src/assets/images/bg_1790503776302.jpg',
  '/src/assets/images/meat_onboarding_1_1790501345494.jpg',
  '/src/assets/images/meat_onboarding_2_1790501365087.jpg',
  '/src/assets/images/meat_delivery_70_1790501379469.jpg',
  '/src/assets/images/meat_bottom_platter_1790501395172.jpg',
  '/src/assets/images/cat_chicken_1790504356265.jpg',
  '/src/assets/images/cat_mutton_1790504374485.jpg',
  '/src/assets/images/cat_fish_1790504389877.jpg',
  '/src/assets/images/cat_eggs_1790504403080.jpg',
  '/src/assets/images/map_delivery_illustration_1790502010289.jpg',
  '/src/assets/images/delivery_partner_avatar_1790502025354.jpg',
];

export function preloadAllImages(): Promise<void[]> {
  const promises = APP_IMAGES.map((src) => {
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => resolve();
      img.onerror = () => resolve(); // continue even if one fails
    });
  });
  return Promise.all(promises);
}
