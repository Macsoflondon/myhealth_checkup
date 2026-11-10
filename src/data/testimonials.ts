export interface Testimonial {
  quote: string;
  name: string;
  detail: string;
  context: string;
  stars: number;
}

export const testimonials: Testimonial[] = [
  {
    quote:
      "I compared five different thyroid panels in under two minutes. Prices, biomarkers, turnaround time — all in one place. I wish I had found this sooner.",
    name: "Jackie O.",
    detail: "NW London",
    context: "Blood Tests Comparison",
    stars: 5,
  },
  {
    quote:
      "Knowing every provider listed uses UKAS-accredited labs made my decision straightforward. I did not have to second-guess the quality.",
    name: "Tiago L.",
    detail: "NW London",
    context: "Blood Tests Comparison",
    stars: 5,
  },
  {
    quote:
      "The health quiz narrowed down exactly which blood test matched my concerns. No account required, no pressure — just clear information.",
    name: "Italo O.",
    detail: "NW London",
    context: "Health Quiz",
    stars: 5,
  },
  {
    quote:
      "Other sites buried the total cost behind add-ons. Here, the pricing was upfront and honest. That transparency earned my trust.",
    name: "Nathanial S.",
    detail: "South London",
    context: "Full Body MOT Comparison",
    stars: 5,
  },
  {
    quote:
      "As a first-timer, I had no idea where to start. The side-by-side comparison made it simple to understand what each test actually covers.",
    name: "Kristijan G.",
    detail: "SE London",
    context: "Hormone Panel Comparison",
    stars: 5,
  },
  {
    quote:
      "Completely free, no sign-up, and genuinely independent. I have recommended it to everyone in my family.",
    name: "Liam D.",
    detail: "West London",
    context: "Vitamin Testing",
    stars: 5,
  },
];
