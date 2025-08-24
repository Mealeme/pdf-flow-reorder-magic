
import { PDFDocument } from 'pdf-lib';

/**
 * Generate chunk order based on selection (must be multiple of 3)
 * @param selection The selection value (must be positive multiple of 3)
 * @returns Array of page indices in chunk order
 */
function chunkOrder(selection: number): number[] {
  if (selection % 3 !== 0 || selection <= 0) {
    throw new Error("Selection must be a positive multiple of 3 (e.g., 3,6,9,12).");
  }

  const S = selection;
  const chunkSize = 2 * S;

  const odds = Array.from({ length: S }, (_, i) => 2 * i + 1);
  const evens = Array.from({ length: S }, (_, i) => 2 * i + 2);

  // Special handling for 6-page chunk order
  if (selection === 6) {
    // For 6: [1,3,5,7,9,11,6,4,2,12,10,8]
    // Split evens into two blocks and reverse each block
    const block1 = evens.slice(0, 3).reverse(); // [6,4,2]
    const block2 = evens.slice(3, 6).reverse(); // [12,10,8]
    return [...odds, ...block1, ...block2];
  }

  // Special handling for 12-page chunk order
  if (selection === 12) {
    // For 12: [1,3,5,7,9,11,13,15,17,19,21,23,8,6,4,2,16,14,12,10,24,22,20,18]
    // Split evens into three blocks and reverse each block
    const block1 = evens.slice(0, 4).reverse(); // [8,6,4,2]
    const block2 = evens.slice(4, 8).reverse(); // [16,14,12,10]
    const block3 = evens.slice(8, 12).reverse(); // [24,22,20,18]
    return [...odds, ...block1, ...block2, ...block3];
  }

  // For other multiples of 3 (3, 9, 12, etc.)
  const block = S / 3;
  const blocks: number[][] = [];
  for (let i = 0; i < evens.length; i += block) {
    blocks.push(evens.slice(i, i + block));
  }

  // Keep blocks in original order (no rotation)
  let rotated: number[][];
  rotated = blocks;

  const evensReordered: number[] = [];
  for (const b of rotated) {
    evensReordered.push(...b.reverse());
  }

  return [...odds, ...evensReordered];
}

/**
 * Generate a custom order based on the selected sequence type
 * @param nPages Total number of pages
 * @param sequenceType Type of sequence to generate
 * @returns Array of page indices in custom order
 */
export function generateCustomOrder(nPages: number, sequenceType: string): number[] {
  switch (sequenceType) {
    case "6":
      return generateChunkOrderSequence(nPages, 6);
    case "9":
      return generateChunkOrderSequence(nPages, 9);
    case "12":
      return generateChunkOrderSequence(nPages, 12);
    default:
      return generateChunkOrderSequence(nPages, 9); // Default to 9-page chunk order
  }
}

/**
 * Generate sequence using chunk_order logic for multiples of 3
 * @param nPages Total number of pages
 * @param chunkSize The chunk size (must be multiple of 3)
 * @returns Array of page indices in chunk order
 */
function generateChunkOrderSequence(nPages: number, chunkSize: number): number[] {
  const finalOrder: number[] = [];
  
  // Process in blocks of chunkSize * 2 (18 pages for chunk size 9)
  const blockSize = chunkSize * 2;
  
  for (let blockStart = 1; blockStart <= nPages; blockStart += blockSize) {
    const blockEnd = blockStart + blockSize - 1;
    
    // Check if we have a complete 18-page block
    if (blockEnd <= nPages) {
      // Complete block - apply chunk order
      try {
        const chunkOrderResult = chunkOrder(chunkSize);
        
        // Apply the chunk order to the current block
        for (const relativePage of chunkOrderResult) {
          const page = blockStart + relativePage - 1; // Convert to 1-indexed
          finalOrder.push(page);
        }
      } catch (error) {
        console.error(`Error generating chunk order for size ${chunkSize}:`, error);
        // Fallback to sequential order for this block
        for (let i = 0; i < blockSize; i++) {
          const page = blockStart + i;
          finalOrder.push(page);
        }
      }
    } else {
      // Incomplete block - keep pages in original order
      for (let i = 0; i < blockSize; i++) {
        const page = blockStart + i;
        if (page <= nPages) {
          finalOrder.push(page);
        }
      }
    }
  }
  
  // Convert from 1-indexed to 0-indexed for PDF library
  return finalOrder.map(page => page - 1);
}













/**
 * Reorder PDF pages according to custom sequence
 * @param file The uploaded PDF file
 * @param sequenceType Type of sequence to generate
 * @returns Promise resolving to a Blob containing the reordered PDF
 */
export async function reorderPdf(file: File, sequenceType: string = "9"): Promise<Blob> {
  // Read the uploaded PDF file
  const fileBuffer = await file.arrayBuffer();
  
  // Load the PDF document
  const pdfDoc = await PDFDocument.load(fileBuffer);
  
  // Get total number of pages
  const pageCount = pdfDoc.getPageCount();
  
  // Generate the custom page order based on selected sequence
  const pageOrder = generateCustomOrder(pageCount, sequenceType);
  
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
