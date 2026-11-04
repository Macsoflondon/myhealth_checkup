import general from "@/assets/wellness/general.webp";
import heart from "@/assets/wellness/heart.webp";
import cholesterol from "@/assets/wellness/cholesterol.webp";
import diabetes from "@/assets/wellness/diabetes.webp";
import iron from "@/assets/wellness/iron.webp";
import liver from "@/assets/wellness/liver.webp";
import kidney from "@/assets/wellness/kidney.webp";
import vitamins from "@/assets/wellness/vitamins.webp";
import allergy from "@/assets/wellness/allergy.webp";
import thyroid from "@/assets/wellness/thyroid.webp";

export interface CategoryVisual {
  /** Short card title shown over the image. */
  title: string;
  image: string;
  /** Representative biomarkers commonly measured in this category. */
  biomarkers: readonly string[];
}

/** Keyed by the dropdown item's path. */
export const wellnessCategoryVisuals: Record<string, CategoryVisual> = {
  "/wellness": {
    title: "General health",
    image: general,
    biomarkers: ["Full blood count", "Liver", "Kidney"],
  },
  "/wellness?subcategory=heart-health": {
    title: "Heart",
    image: heart,
    biomarkers: ["hs-CRP", "ApoB", "Lp(a)"],
  },
  "/wellness?subcategory=cholesterol": {
    title: "Lipids",
    image: cholesterol,
    biomarkers: ["LDL", "HDL", "Triglycerides"],
  },
  "/wellness?subcategory=diabetes": {
    title: "Metabolism",
    image: diabetes,
    biomarkers: ["Glucose", "HbA1c", "Insulin"],
  },
  "/wellness?subcategory=iron-anaemia": {
    title: "Iron",
    image: iron,
    biomarkers: ["Ferritin", "Iron", "Haemoglobin"],
  },
  "/wellness?subcategory=liver": {
    title: "Liver",
    image: liver,
    biomarkers: ["ALT", "GGT", "Bilirubin"],
  },
  "/wellness?subcategory=kidney": {
    title: "Kidney",
    image: kidney,
    biomarkers: ["Creatinine", "eGFR", "Urea"],
  },
  "/wellness?subcategory=vitamins": {
    title: "Vitamins",
    image: vitamins,
    biomarkers: ["Vitamin D", "B12", "Folate"],
  },
  "/wellness?subcategory=allergy": {
    title: "Allergy",
    image: allergy,
    biomarkers: ["Total IgE", "Specific IgE"],
  },
  "/wellness?subcategory=thyroid": {
    title: "Thyroid",
    image: thyroid,
    biomarkers: ["TSH", "Free T4", "Free T3"],
  },
};
