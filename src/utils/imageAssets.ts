// Direct eager static image imports for all Meat Ghar visual assets
import bgImg from '../assets/images/bg_1790503776302.jpg';
import catChickenImg from '../assets/images/cat_chicken_1790504356265.jpg';
import catColdCutsImg from '../assets/images/cat_cold_cuts_1790508827963.jpg';
import catEggsImg from '../assets/images/cat_eggs_1790504403080.jpg';
import catFishImg from '../assets/images/cat_fish_1790504389877.jpg';
import catMuttonImg from '../assets/images/cat_mutton_1790504374485.jpg';
import catPrawnsImg from '../assets/images/cat_prawns_seafood_1790508815698.jpg';
import catReadyToCookImg from '../assets/images/cat_ready_to_cook_1790507566251.jpg';
import catSpecialCutsImg from '../assets/images/cat_special_cuts_1790507586236.jpg';
import chickenCurryWideImg from '../assets/images/chicken_curry_cut_wide_1790508282856.jpg';
import curryCutChickenImg from '../assets/images/curry_cut_chicken_1790507633294.jpg';
import deliveryPartnerImg from '../assets/images/delivery_partner_avatar_1790502025354.jpg';
import heroBannerImg from '../assets/images/hero_banner_meat_1790507616083.jpg';
import mapDeliveryImg from '../assets/images/map_delivery_illustration_1790502010289.jpg';
import meatBottomPlatterImg from '../assets/images/meat_bottom_platter_1790501395172.jpg';
import meatDelivery70Img from '../assets/images/meat_delivery_70_1790501379469.jpg';
import onboarding1Img from '../assets/images/meat_onboarding_1_1790501345494.jpg';
import onboarding2Img from '../assets/images/meat_onboarding_2_1790501365087.jpg';
import muttonBonelessCubesImg from '../assets/images/mutton_boneless_cubes_1790507651522.jpg';
import muttonBonelessWideImg from '../assets/images/mutton_boneless_wide_1790508301717.jpg';
import offerChickenImg from '../assets/images/offer_chicken_card_1790507696774.jpg';
import offerMuttonImg from '../assets/images/offer_mutton_card_1790507713635.jpg';
import productRohuFishImg from '../assets/images/product_rohu_fish_1790507600370.jpg';
import rohuFishWideImg from '../assets/images/rohu_fish_wide_1790508321588.jpg';

export const STATIC_IMAGES: Record<string, string> = {
  'bg_1790503776302.jpg': bgImg,
  'cat_chicken_1790504356265.jpg': catChickenImg,
  'cat_cold_cuts_1790508827963.jpg': catColdCutsImg,
  'cat_eggs_1790504403080.jpg': catEggsImg,
  'cat_fish_1790504389877.jpg': catFishImg,
  'cat_mutton_1790504374485.jpg': catMuttonImg,
  'cat_prawns_seafood_1790508815698.jpg': catPrawnsImg,
  'cat_ready_to_cook_1790507566251.jpg': catReadyToCookImg,
  'cat_special_cuts_1790507586236.jpg': catSpecialCutsImg,
  'chicken_curry_cut_wide_1790508282856.jpg': chickenCurryWideImg,
  'curry_cut_chicken_1790507633294.jpg': curryCutChickenImg,
  'delivery_partner_avatar_1790502025354.jpg': deliveryPartnerImg,
  'hero_banner_meat_1790507616083.jpg': heroBannerImg,
  'map_delivery_illustration_1790502010289.jpg': mapDeliveryImg,
  'meat_bottom_platter_1790501395172.jpg': meatBottomPlatterImg,
  'meat_delivery_70_1790501379469.jpg': meatDelivery70Img,
  'meat_onboarding_1_1790501345494.jpg': onboarding1Img,
  'meat_onboarding_2_1790501365087.jpg': onboarding2Img,
  'mutton_boneless_cubes_1790507651522.jpg': muttonBonelessCubesImg,
  'mutton_boneless_wide_1790508301717.jpg': muttonBonelessWideImg,
  'offer_chicken_card_1790507696774.jpg': offerChickenImg,
  'offer_mutton_card_1790507713635.jpg': offerMuttonImg,
  'product_rohu_fish_1790507600370.jpg': productRohuFishImg,
  'rohu_fish_wide_1790508321588.jpg': rohuFishWideImg,
};

// Also support Vite glob with proper {jpg,jpeg,png,webp} syntax
const globImages = import.meta.glob<{ default: string }>('/src/assets/images/*.{jpg,jpeg,png,webp,JPG,PNG}', {
  eager: true,
});

const imageMap: Record<string, string> = { ...STATIC_IMAGES };

for (const [path, module] of Object.entries(globImages)) {
  if (module && module.default) {
    const resolvedUrl = module.default;
    imageMap[path] = resolvedUrl;
    const filename = path.split('/').pop();
    if (filename) {
      imageMap[filename] = resolvedUrl;
      imageMap[`/src/assets/images/${filename}`] = resolvedUrl;
      imageMap[`src/assets/images/${filename}`] = resolvedUrl;
      imageMap[`/assets/images/${filename}`] = resolvedUrl;
      imageMap[`/images/${filename}`] = resolvedUrl;
    }
  }
}

// Add filename keys from STATIC_IMAGES
Object.entries(STATIC_IMAGES).forEach(([filename, resolvedUrl]) => {
  imageMap[filename] = resolvedUrl;
  imageMap[`/images/${filename}`] = resolvedUrl;
  imageMap[`/assets/images/${filename}`] = resolvedUrl;
  imageMap[`/src/assets/images/${filename}`] = resolvedUrl;
  imageMap[`src/assets/images/${filename}`] = resolvedUrl;
});

/**
 * Returns the 100% reliable resolved URL for any image.
 */
export function getImageUrl(path: string | undefined): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  if (imageMap[path]) {
    return imageMap[path];
  }

  const filename = path.split('/').pop()?.split('?')[0];
  if (filename && imageMap[filename]) {
    return imageMap[filename];
  }

  if (filename && STATIC_IMAGES[filename]) {
    return STATIC_IMAGES[filename];
  }

  return path;
}

export default getImageUrl;
