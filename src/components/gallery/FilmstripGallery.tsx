// Self-contained FilmstripGallery wrapper component
// Dependencies: the HoverExpand_001 component from expand-on-hover.tsx
// Usage:
// <FilmstripGallery images={[{ id: "1", src: "/img.png", alt: "...", aspectRatio: 1.5,
//   caption: { subject: "Name", profession: "Title" },
//   metadata: { title: "My Image", year: "2024", series: "my-series" }
// }]} />

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
