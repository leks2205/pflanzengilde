/**
 * Loads an image and returns it as a JPEG data URL for jsPDF, center-cropped (object-fit: cover)
 * to the target size so it is never distorted. Resolves null on error, timeout or a CORS-tainted canvas.
 */
async function loadImageAsDataUrl(
  url: string,
  targetWidthPx = 300,
  targetHeightPx = 300,
  timeoutMs = 4500
): Promise<string | null> {
  if (typeof window === 'undefined' || !url) return null;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const finish = (result: string | null) => {
      clearTimeout(timer);
      img.onload = null;
      img.onerror = null;
      resolve(result);
    };

    // Detach the handlers on timeout so a late load doesn't still do the canvas work.
    const timer = setTimeout(() => finish(null), timeoutMs);

    img.onload = () => {
      try {
        const imgW = img.naturalWidth || img.width || 100;
        const imgH = img.naturalHeight || img.height || 100;
        const targetAspect = targetWidthPx / targetHeightPx;

        let cropW = imgW;
        let cropH = imgH;
        let cropX = 0;
        let cropY = 0;
        if (imgW / imgH > targetAspect) {
          cropW = imgH * targetAspect;
          cropX = (imgW - cropW) / 2;
        } else {
          cropH = imgW / targetAspect;
          cropY = (imgH - cropH) / 2;
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetWidthPx;
        canvas.height = targetHeightPx;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          finish(null);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, targetWidthPx, targetHeightPx);
        finish(canvas.toDataURL('image/jpeg', 0.88));
      } catch (err) {
        console.warn('Canvas export of image failed (likely CORS restricted):', url, err);
        finish(null);
      }
    };

    img.onerror = () => finish(null);

    img.src = url;
  });
}

export async function preloadGuildImages(
  treeImageUrl?: string,
  plantImageUrls: { id: string; url: string }[] = []
): Promise<{ treeImage: string | null; plantImages: Map<string, string> }> {
  const plantImages = new Map<string, string>();

  const plantTasks = plantImageUrls.map(async (item) => {
    if (!item.url) return;
    const dataUrl = await loadImageAsDataUrl(item.url, 300, 300);
    if (dataUrl) {
      plantImages.set(item.id, dataUrl);
    }
  });

  const treePromise = treeImageUrl ? loadImageAsDataUrl(treeImageUrl, 300, 300) : Promise.resolve(null);

  const [treeImage] = await Promise.all([treePromise, ...plantTasks]);

  return {
    treeImage: treeImage || null,
    plantImages
  };
}
