import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export const getContentBounds = async (pdf: any, pageNumber: number) => {
//   const page = await pdf.getPage(pageNumber);
//   const viewport = page.getViewport({ scale: 1 });
//   const textContent = await page.getTextContent();

//   let minX = viewport.width,
//     minY = viewport.height,
//     maxX = 0,
//     maxY = 0;

//   textContent.items.forEach((item) => {
//     const transform = item.transform;
//     const x = transform[4];
//     const y = viewport.height - transform[5]; // Invert Y-axis

//     minX = Math.min(minX, x);
//     minY = Math.min(minY, y);
//     maxX = Math.max(maxX, x + item.width);
//     maxY = Math.max(maxY, y);
//   });

//   return { minX, minY, maxX, maxY };
// };
