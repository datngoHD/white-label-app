import { Dimensions, Image, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PIXEL_RATIO = PixelRatio.get();

export interface ImageSize {
  width: number;
  height: number;
}

export interface OptimizedImageSource {
  uri: string;
  width?: number;
  height?: number;
  cache?: 'default' | 'reload' | 'force-cache' | 'only-if-cached';
}

export const getOptimalImageSize = (
  desiredWidth: number,
  maxWidth: number = SCREEN_WIDTH
): number => {
  const optimalWidth = Math.min(desiredWidth, maxWidth);
  return Math.ceil(optimalWidth * PIXEL_RATIO);
};

export const getOptimizedImageUrl = (
  baseUrl: string,
  width: number,
  options?: {
    quality?: number;
    format?: 'webp' | 'jpg' | 'png';
  }
): string => {
  const { quality = 80, format = 'webp' } = options || {};
  const optimalWidth = getOptimalImageSize(width);

  // This is a generic implementation - adjust URL parameters based on your CDN
  const url = new URL(baseUrl);
  url.searchParams.set('w', optimalWidth.toString());
  url.searchParams.set('q', quality.toString());
  url.searchParams.set('f', format);

  return url.toString();
};

export const prefetchImages = async (urls: string[]): Promise<void> => {
  const prefetchPromises = urls.map((url) =>
    Image.prefetch(url).catch((error) => {
      console.warn(`Failed to prefetch image: ${url}`, error);
      return false;
    })
  );

  await Promise.all(prefetchPromises);
};

export const getImageSize = (uri: string): Promise<ImageSize> => {
  return new Promise((resolve, reject) => {
    Image.getSize(
      uri,
      (width, height) => {
        resolve({ width, height });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

export const calculateAspectRatioFit = (
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number
): ImageSize => {
  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  return {
    width: srcWidth * ratio,
    height: srcHeight * ratio,
  };
};

export const createOptimizedSource = (
  uri: string,
  width?: number,
  height?: number
): OptimizedImageSource => {
  return {
    uri,
    width: width ? getOptimalImageSize(width) : undefined,
    height,
    cache: 'force-cache',
  };
};

export const getPlaceholderSource = (
  width: number,
  height: number,
  color = '#E0E0E0'
): OptimizedImageSource => {
  // Return a data URI for a simple colored placeholder
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="100%" height="100%" fill="${color}"/></svg>`;
  const base64 = btoa(svg);
  return {
    uri: `data:image/svg+xml;base64,${base64}`,
    width,
    height,
  };
};
