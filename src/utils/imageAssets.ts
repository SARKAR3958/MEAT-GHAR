// Central Image Resolver with Vite Bundler Resolution + Public Fallbacks
const localImages = import.meta.glob<{ default: string }>('/src/assets/images/*.(jpg|jpeg|png|webp)', {
  eager: true,
});

const imageMap: Record<string, string> = {};

// Populate map with both full path and plain filenames
for (const [path, module] of Object.entries(localImages)) {
  if (module && module.default) {
    const resolvedUrl = module.default;
    imageMap[path] = resolvedUrl;
    
    // Extract filename e.g. "chicken_curry_cut_wide_1790508282856.jpg"
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

/**
 * Returns the production-ready hashed/resolved image URL for any image path.
 * If not found in bundle, returns the path directly or public fallback.
 */
export function getImageUrl(path: string | undefined): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  // Check map directly
  if (imageMap[path]) {
    return imageMap[path];
  }

  const filename = path.split('/').pop();
  if (filename && imageMap[filename]) {
    return imageMap[filename];
  }

  return path;
}

export default getImageUrl;
