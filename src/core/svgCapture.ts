/** Rasterizes the on-screen radial map SVG to a PNG data URL for the PDF export. */
export async function captureRadialMapSvg(svgId = 'radial-garden-map-svg', size = 1200): Promise<string | null> {
  if (typeof document === 'undefined') return null;
  const svg = document.getElementById(svgId) as SVGSVGElement | null;
  if (!svg) return null;

  try {
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute('width', size.toString());
    clone.setAttribute('height', size.toString());

    let svgString = new XMLSerializer().serializeToString(clone);
    // Without the namespace the blob won't decode as an image.
    if (!svgString.includes('xmlns="http://www.w3.org/2000/svg"')) {
      svgString = svgString.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    }

    const blobUrl = URL.createObjectURL(new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' }));

    return new Promise<string | null>((resolve) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(null);
            return;
          }

          ctx.fillStyle = '#fafaf9'; // app background; PNG would otherwise be transparent
          ctx.fillRect(0, 0, size, size);
          ctx.drawImage(img, 0, 0, size, size);
          resolve(canvas.toDataURL('image/png'));
        } catch (e) {
          console.warn('Canvas export failed:', e);
          resolve(null);
        } finally {
          URL.revokeObjectURL(blobUrl);
        }
      };

      img.onerror = (e) => {
        console.warn('SVG image load error:', e);
        URL.revokeObjectURL(blobUrl);
        resolve(null);
      };

      img.src = blobUrl;
    });
  } catch (err) {
    console.warn('SVG serialization error:', err);
    return null;
  }
}
