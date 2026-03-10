// FilmstripGallery wrapper component
// Transforms gallery image data into the format expected by HoverExpand_001

import { HoverExpand_001 } from '@/components/ui/expand-on-hover';

export interface GalleryImageData {
  id: string;
  src: string;
  alt: string;
  aspectRatio: number;
  caption: { subject: string; profession: string };
  metadata: {
    title: string;
    year: string;
    description?: string;
    location?: string;
    camera?: string;
    series: string;
  };
  objectFit?: string;
}

export interface FilmstripGalleryProps {
  images: GalleryImageData[];
  className?: string;
}

export function FilmstripGallery({ images, className = '' }: FilmstripGalleryProps) {
  const transformedImages = images.map((image) => ({
    src: image.src,
    alt: image.alt,
    code: image.metadata.year ? `${image.metadata.title} - ${image.metadata.year}` : image.metadata.title,
    objectFit: image.objectFit,
  }));

  if (images.length === 0) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">No images to display</p>
      </div>
    );
  }

  return (
    <HoverExpand_001 images={transformedImages} className={className} />
  );
}
