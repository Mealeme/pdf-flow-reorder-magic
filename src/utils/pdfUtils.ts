import { PDFDocument } from 'pdf-lib';

/**
 * Generate a custom order based on the selected sequence type
 * @param nPages Total number of pages
 * @param sequenceType Type of sequence to generate
 * @returns Array of page indices in custom order
 */
export function generateCustomOrder(nPages: number, sequenceType: string): number[] {
  switch (sequenceType) {
    case "1":
      return generateSequence1(nPages);
    case "2":
      return generateSequence2(nPages);
    case "4":
      return generateSequence4(nPages);
    case "6":
      return generateSequence6(nPages);
    case "9":
      return generateFixedCustomOrder(nPages); // Our original sequence for 9
    case "12":
      return generateSequence6(nPages); // Using 6-page sequence for 12 option
    case "16":
      return generateSequence16(nPages);
    default:
      return generateFixedCustomOrder(nPages); // Default to original algorithm
  }
}

/**
 * Generate a fixed custom order for PDF pages (original algorithm)
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

// Sequence for option 1 (simple sequential)
function generateSequence1(nPages: number): number[] {
  return Array.from({ length: nPages }, (_, i) => i); // Just sequential order
}

// Sequence for option 2 (every second page)
function generateSequence2(nPages: number): number[] {
  const finalOrder: number[] = [];
  
  // First all odd pages, then all even pages
  for (let i = 0; i < nPages; i += 2) {
    finalOrder.push(i);
  }
  for (let i = 1; i < nPages; i += 2) {
    finalOrder.push(i);
  }
  
  return finalOrder;
}

// Sequence for option 4 (4-page grouping)
function generateSequence4(nPages: number): number[] {
  const finalOrder: number[] = [];
  
  for (let blockStart = 0; blockStart < nPages; blockStart += 4) {
    const pattern = [0, 3, 1, 2]; // Custom 4-page pattern
    for (const offset of pattern) {
      const page = blockStart + offset;
      if (page < nPages) {
        finalOrder.push(page);
      }
    }
  }
  
  return finalOrder;
}

// Sequence for option 6 (6-page grouping)
function generateSequence6(nPages: number): number[] {
  const finalOrder: number[] = [];
  
  for (let blockStart = 0; blockStart < nPages; blockStart += 6) {
    const pattern = [0, 5, 1, 4, 2, 3]; // Custom 6-page pattern
    for (const offset of pattern) {
      const page = blockStart + offset;
      if (page < nPages) {
        finalOrder.push(page);
      }
    }
  }
  
  return finalOrder;
}

// Sequence for option 16 (16-page grouping)
function generateSequence16(nPages: number): number[] {
  const finalOrder: number[] = [];
  
  for (let blockStart = 0; blockStart < nPages; blockStart += 16) {
    // First 8 odd, then 8 even in reverse order
    for (let i = 0; i < 16; i += 2) {
      const page = blockStart + i;
      if (page < nPages) {
        finalOrder.push(page);
      }
    }
    for (let i = 15; i > 0; i -= 2) {
      const page = blockStart + i;
      if (page < nPages) {
        finalOrder.push(page);
      }
    }
  }
  
  return finalOrder;
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
