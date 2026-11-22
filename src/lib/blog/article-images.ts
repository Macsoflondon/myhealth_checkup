import clinicalImage from "@/assets/articles/clinical-education.webp";
import nutritionImage from "@/assets/articles/nutrition-education.webp";
import wellbeingImage from "@/assets/articles/wellbeing-education.webp";
import mriImage from "@/assets/articles/mri-education.webp";
import skinImage from "@/assets/articles/skin-education.webp";
import clinical480 from "@/assets/articles/clinical-education.webp?article-width=480";
import clinical768 from "@/assets/articles/clinical-education.webp?article-width=768";
import nutrition480 from "@/assets/articles/nutrition-education.webp?article-width=480";
import nutrition768 from "@/assets/articles/nutrition-education.webp?article-width=768";
import wellbeing480 from "@/assets/articles/wellbeing-education.webp?article-width=480";
import wellbeing768 from "@/assets/articles/wellbeing-education.webp?article-width=768";
import mri480 from "@/assets/articles/mri-education.webp?article-width=480";
import mri768 from "@/assets/articles/mri-education.webp?article-width=768";
import skin480 from "@/assets/articles/skin-education.webp?article-width=480";
import skin768 from "@/assets/articles/skin-education.webp?article-width=768";
import type { BlogArticle } from "@/types/blog.types";

const fallbackVariants = new Map([
  [clinicalImage, [clinical480, clinical768]],
  [nutritionImage, [nutrition480, nutrition768]],
  [wellbeingImage, [wellbeing480, wellbeing768]],
  [mriImage, [mri480, mri768]],
  [skinImage, [skin480, skin768]],
]);

export function articleFallbackSrcSet(
  article: Pick<BlogArticle, "title" | "category">,
): string {
  const source = articleFallbackImage(article);
  const variants = fallbackVariants.get(source);
  return `${variants?.[0] ?? source} 480w, ${variants?.[1] ?? source} 768w, ${source} 1024w`;
}

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
