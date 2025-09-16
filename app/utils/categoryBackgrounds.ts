export const categoryBackgrounds: Record<string, string> = {
  "Ethics & Society": "/images/alex-vasey-tDuQe2ShHpk-unsplash.jpg",
  "Leadership & Education":
    "/images/bergen-public-library-RQFWtk4w_yQ-unsplash.jpg",
  "Global & Cultural Perspectives":
    "/images/yunus-tug-5R6T0RRHYs4-unsplash.jpg",
  "Neuroscience & Cognitive Science":
    "/images/miguel-henriques--8atMWER8bI-unsplash.jpg",
  "Technology & Innovation":
    "/images/vishnu-mohanan-pfR18JNEMv8-unsplash (1).jpg",
};

export function getCategoryBackground(category: string): string | undefined {
  return categoryBackgrounds[category];
}
