
import { PDFDocument } from 'pdf-lib';

/**
 * Generate a fixed custom order for PDF pages
 * @param nPages Total number of pages
 * @returns Array of page indices in custom order
 */
export function generateFixedCustomOrder(nPages: number): number[] {
  const finalOrder: number[] = [];

  // Repeat the logic in 18-page blocks
  for (let blockStart = 1; blockStart <= nPages; blockStart += 18) {
    // Odd part: first 9 odd pages from block
    const oddPart: number[] = [];
    for (let i = 0; i < 18; i++) {
      const page = blockStart + i;
      if (page <= nPages && page % 2 === 1) {
        oddPart.push(page);
        if (oddPart.length === 9) break;
      }
    }

    // Even part: follow custom pattern using relative page positions
    const evenPart: number[] = [];
    for (const i of [6, 4, 2, 12, 10, 8, 18, 16, 14]) {
      const page = blockStart + (i - 1);
      if (page <= nPages && page % 2 === 0) {
        evenPart.push(page);
      }
    }

    // Combine and add to final sequence
    finalOrder.push(...oddPart, ...evenPart);
  }

  // Convert from 1-indexed to 0-indexed for PDF library
  return finalOrder.map(page => page - 1);
}

/**
 * Reorder PDF pages according to custom sequence
 * @param file The uploaded PDF file
 * @returns Promise resolving to a Blob containing the reordered PDF
 */
export async function reorderPdf(file: File): Promise<Blob> {
  // Read the uploaded PDF file
  const fileBuffer = await file.arrayBuffer();
  
  // Load the PDF document
  const pdfDoc = await PDFDocument.load(fileBuffer);
  
  // Get total number of pages
  const pageCount = pdfDoc.getPageCount();
  
  // Generate the custom page order
  const pageOrder = generateFixedCustomOrder(pageCount);
  
  // Create a new PDF document
  const newPdfDoc = await PDFDocument.create();
  
  // Copy pages in the specified order
  for (const pageIndex of pageOrder) {
    if (pageIndex < pageCount) {
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageIndex]);
      newPdfDoc.addPage(copiedPage);
    }
  }
  
  // Save the reordered PDF
  const reorderedPdfBytes = await newPdfDoc.save();
  
  // Convert to Blob and return
  return new Blob([reorderedPdfBytes], { type: 'application/pdf' });
}
