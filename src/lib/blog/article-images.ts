import clinicalImage from "@/assets/articles/clinical-education.webp";
import nutritionImage from "@/assets/articles/nutrition-education.webp";
import wellbeingImage from "@/assets/articles/wellbeing-education.webp";
import mriImage from "@/assets/articles/mri-education.webp";
import skinImage from "@/assets/articles/skin-education.webp";
import type { BlogArticle } from "@/types/blog.types";

export function isArticleImage(url: string | null | undefined): boolean {
  if (!url || /logo|placeholder|favicon|og[-_]?default/i.test(url))
    return false;
  try {
    return new URL(url).protocol === "https:";
  } catch {
    return false;
  }
}

export function articleFallbackImage(
  article: Pick<BlogArticle, "title" | "category">,
): string {
  const topic = `${article.category} ${article.title}`;
  if (/\bmri\b|magnetic resonance/i.test(topic)) return mriImage;
  if (/skin|keratosis|\bkp bumps\b|acne/i.test(topic)) return skinImage;
  if (/nutrition|vitamin|food|diet|iron|gut|microbiome/i.test(topic))
    return nutritionImage;
  if (
    /mental|sleep|stress|exercise|fitness|weight|longevity|wellness/i.test(
      topic,
    )
  )
    return wellbeingImage;
  return clinicalImage;
}
