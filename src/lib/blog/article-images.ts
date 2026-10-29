import clinicalImage from "@/assets/articles/clinical-education.jpg";
import nutritionImage from "@/assets/articles/nutrition-education.jpg";
import wellbeingImage from "@/assets/articles/wellbeing-education.jpg";
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
