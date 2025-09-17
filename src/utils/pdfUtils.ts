
import { PDFDocument } from 'pdf-lib';
import { addWatermarkToPdf } from './watermarkUtils';

/**
 * Generate chunk order based on selection (must be multiple of 3)
 * @param selection The selection value (must be positive multiple of 3)
 * @param totalPages Total number of pages in the document
 * @returns Array of page indices in chunk order with "Blank" placeholders
 */
function chunkOrder(selection: number, totalPages: number): (number | "Blank")[] {
  if (selection % 3 !== 0 || selection <= 0) {
    throw new Error("Selection must be a positive multiple of 3 (e.g., 3,6,9,12).");
  }

  // Use new logic specifically for 6-chunk order
  if (selection === 6) {
    const chunkSize = 2 * selection; // 12 total slots per chunk
    const numChunks = Math.ceil(totalPages / chunkSize);
    const result: (number | "Blank")[] = [];

    for (let chunkIdx = 0; chunkIdx < numChunks; chunkIdx++) {
      const startPage = chunkIdx * chunkSize + 1;
      const endPage = Math.min(startPage + chunkSize - 1, totalPages);
      const remaining = endPage - startPage + 1;

      let odds: (number | "Blank")[];
      let evensReordered: (number | "Blank")[];

      if (remaining === chunkSize) {
        // Full chunk
        // Odds
        odds = [];
        for (let i = 0; i < selection; i++) {
          const page = startPage + 2 * i;
          odds.push(page <= totalPages ? page : "Blank");
        }

        // Evens
        const evens: number[] = [];
        for (let i = 0; i < selection; i++) {
          evens.push(startPage + 2 * i + 1);
        }
        // Split evens into 2 blocks of 3 and reverse each
        const tempEvens: number[] = [];
        const blockSize = 3;
        for (let i = 0; i < evens.length; i += blockSize) {
          const block = evens.slice(i, i + blockSize);
          tempEvens.push(...block.reverse());
        }
        // Handle blanks
        evensReordered = tempEvens.map(p => p <= totalPages ? p : "Blank");
      } else {
        // Partial chunk
        const pages: number[] = [];
        for (let p = startPage; p <= endPage; p++) {
          pages.push(p);
        }
        const oddsSide = pages.filter((_, i) => i % 2 === 0);
        const evensSide = pages.filter((_, i) => i % 2 === 1);

        // Odds → pad to 6
        odds = [...oddsSide, ...Array(selection - oddsSide.length).fill("Blank")];

        // Evens → first half reversed, second half normal, pad with blanks in between
        const evensLen = evensSide.length;
        const firstHalfLen = Math.floor(evensLen / 2) + (evensLen % 2);
        const secondHalfLen = evensLen - firstHalfLen;

        const firstHalf = evensSide.slice(0, firstHalfLen).reverse();
        const secondHalf = evensSide.slice(firstHalfLen);
        const blanksCount = selection - firstHalf.length - secondHalf.length;
        evensReordered = [...firstHalf, ...Array(blanksCount).fill("Blank"), ...secondHalf];
      }

      // --- Combine odds + evens ---
      const chunkPages = [...odds, ...evensReordered];

      // --- Group into rows of 3 ---
      const groupSize = 3;
      for (let i = 0; i < chunkPages.length; i += groupSize) {
        const row = chunkPages.slice(i, i + groupSize);
        result.push(...row);
      }
    }

    return result;
  }

  // For other selections, use the original logic but return with "Blank" placeholders
  const S = selection;
  const chunkSize = 2 * S;

  const odds = Array.from({ length: S }, (_, i) => 2 * i + 1);
  const evens = Array.from({ length: S }, (_, i) => 2 * i + 2);

  // Special handling for 12-page chunk order with new partial chunk logic
  if (selection === 12) {
    const chunkSize = 2 * selection; // 24 total slots per chunk
    const blockSize = 4; // block_size for evens
    const result: (number | "Blank")[] = [];

    let start = 1;
    while (start <= totalPages) {
      const end = Math.min(start + chunkSize - 1, totalPages);
      const pages: number[] = [];
      for (let p = start; p <= end; p++) {
        pages.push(p);
      }
      const remaining = pages.length;

      let odds: (number | "Blank")[];
      let evensReordered: (number | "Blank")[];

      if (remaining >= chunkSize) {
        // Full chunk
        odds = [];
        for (let i = 0; i < selection; i++) {
          const page = start + 2 * i;
          odds.push(page <= totalPages ? page : "Blank");
        }
        const evens: number[] = [];
        for (let i = 0; i < selection; i++) {
          evens.push(start + 2 * i + 1);
        }
        // Reorder evens in blocks
        const tempEvens: number[] = [];
        for (let i = 0; i < evens.length; i += blockSize) {
          const block = evens.slice(i, i + blockSize);
          tempEvens.push(...block.reverse());
        }
        // Handle blanks
        evensReordered = tempEvens.map(p => p <= totalPages ? p : "Blank");
      } else {
        // Partial chunk: divide pages into two halves
        const halfLen = Math.ceil(remaining / 2);
        const firstHalfPages = pages.slice(0, halfLen);
        const secondHalfPages = pages.slice(halfLen);

        // First half: fill first 12 slots, pad with 'Blank'
        odds = [...firstHalfPages, ...Array(selection - firstHalfPages.length).fill("Blank")];

        // Second half: reversed in blocks, pad to 12
        evensReordered = [];
        for (let i = 0; i < secondHalfPages.length; i += blockSize) {
          const block = secondHalfPages.slice(i, i + blockSize);
          evensReordered.push(...block.reverse());
        }
        evensReordered.push(...Array(selection - evensReordered.length).fill("Blank"));
      }

      // Add chunk to final result
      result.push(...odds);
      result.push(...evensReordered);

      start += chunkSize;
    }

    return result;
  }

  // Specific logic for selection=9 based on provided Python code
  if (selection === 9) {
    const chunkSize = 2 * selection; // 18
    const numChunks = Math.ceil(totalPages / chunkSize);
    const result: (number | "Blank")[] = [];

    for (let chunkIdx = 0; chunkIdx < numChunks; chunkIdx++) {
      const startPage = chunkIdx * chunkSize + 1;
      const endPage = Math.min(startPage + chunkSize - 1, totalPages);
      const remaining = endPage - startPage + 1;

      let chunkPages: (number | "Blank")[];

      if (remaining === chunkSize) {
        // Full chunk
        // Odds (first half: 1,3,5,7,9,11,13,15,17)
        const odds: (number | "Blank")[] = [];
        for (let i = 0; i < selection; i++) {
          const page = startPage + 2 * i;
          odds.push(page <= totalPages ? page : "Blank");
        }

        // Evens (second half: 2,4,6,8,10,12,14,16,18)
        const evens: number[] = [];
        for (let i = 0; i < selection; i++) {
          const page = startPage + 2 * i + 1;
          if (page <= totalPages) evens.push(page);
        }

        // Reverse evens in blocks of 3
        const blockSize = selection / 3; // 3
        const evensReordered: (number | "Blank")[] = [];
        for (let b = 0; b < evens.length; b += blockSize) {
          const block = evens.slice(b, b + blockSize);
          evensReordered.push(...block.reverse());
        }

        // Pad evens to selection size
        while (evensReordered.length < selection) {
          evensReordered.push("Blank");
        }

        chunkPages = [...odds, ...evensReordered];
      } else {
        // Partial chunk
        const half1 = Math.ceil(remaining / 2); // odds side
        const half2 = remaining - half1; // evens side

        // Odds side (sequential fill)
        const odds: (number | "Blank")[] = [];
        for (let i = 0; i < half1; i++) {
          const page = startPage + 2 * i;
          if (page <= totalPages) odds.push(page);
        }
        while (odds.length < selection) {
          odds.push("Blank");
        }

        // Evens side (sequential, then reverse in blocks)
        const evenStart = startPage + 1;
        const evens: number[] = [];
        for (let i = 0; i < half2; i++) {
          const page = evenStart + 2 * i;
          if (page <= totalPages) evens.push(page);
        }

        // Reverse in blocks of 3
        const blockSize = selection / 3; // 3
        const evensReordered: (number | "Blank")[] = [];
        for (let b = 0; b < evens.length; b += blockSize) {
          const block = evens.slice(b, b + blockSize);
          evensReordered.push(...block.reverse());
        }
        while (evensReordered.length < selection) {
          evensReordered.push("Blank");
        }

        chunkPages = [...odds, ...evensReordered];
      }

      // Add chunk pages to result
      result.push(...chunkPages);
    }

    return result;
  }

  // For other multiples of 3 (3, etc.)
  const block = S / 3;
  const blocks: number[][] = [];
  for (let i = 0; i < evens.length; i += block) {
    blocks.push(evens.slice(i, i + block));
  }

  // Keep blocks in original order (no rotation)
  let rotated: number[][] = blocks;

  const evensReordered: number[] = [];
  for (const b of rotated) {
    evensReordered.push(...b.reverse());
  }

  const order = [...odds, ...evensReordered];

  // Convert to result with blanks for pages beyond totalPages
  const result: (number | "Blank")[] = [];
  for (const page of order) {
    if (page <= totalPages) result.push(page);
    else result.push("Blank");
  }
  return result;
}

/**
 * Compute blanks-aware chunk order for a given total page count and selection S.
 * Returns 0-indexed page indices with null placeholders for blanks.
 */
export function computeChunkOrderWithBlanks(totalPages: number, selection: number): Array<number | null> {
  if (!Number.isFinite(selection) || selection <= 0 || selection % 3 !== 0) {
    throw new Error("Selection must be a positive multiple of 3.");
  }

  // Use the new chunkOrder function and convert to 0-indexed
  const order = chunkOrder(selection, totalPages);
  return order.map(page => {
    if (page === "Blank") return null;
    return (page as number) - 1; // Convert from 1-indexed to 0-indexed
  });
}

/**
 * Convenience: 1-indexed human-readable with "Blank" placeholders.
 */
export function computeReadableChunkOrderWithBlanks(totalPages: number, selection: number): Array<number | "Blank"> {
  const zeroIndexed = computeChunkOrderWithBlanks(totalPages, selection);
  return zeroIndexed.map(v => (v === null ? "Blank" : v + 1));
}

/**
 * S=9 helpers (always 18 slots per set)
 */
export function computeReadableFirstSet18(totalPages: number): Array<number | "Blank"> {
  const full = computeReadableChunkOrderWithBlanks(totalPages, 9);
  return full.slice(0, 18);
}

export function computeReadableAllSets18(totalPages: number): Array<Array<number | "Blank">> {
  const full = computeReadableChunkOrderWithBlanks(totalPages, 9);
  const sets: Array<Array<number | "Blank">> = [];
  for (let i = 0; i < full.length; i += 18) {
    sets.push(full.slice(i, i + 18));
  }
  return sets;
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
    
    // Check if we have a complete block
    if (blockEnd <= nPages) {
      // Complete block - apply chunk order
      try {
        const chunkOrderResult = chunkOrder(chunkSize, nPages);
        
        // Apply the chunk order to the current block
        for (const relativePage of chunkOrderResult) {
          if (relativePage !== "Blank") {
            const page = blockStart + (relativePage as number) - 1; // Convert to 1-indexed
            if (page <= nPages) {
              finalOrder.push(page);
            }
          }
        }
      } catch (error) {
        console.error(`Error generating chunk order for size ${chunkSize}:`, error);
        // Fallback to sequential order for this block
        for (let i = 0; i < blockSize; i++) {
          const page = blockStart + i;
          if (page <= nPages) {
            finalOrder.push(page);
          }
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
 * @param userEmail User's email to check plan for watermarking
 * @returns Promise resolving to a Blob containing the reordered PDF
 */
export async function reorderPdf(file: File, sequenceType: string = "9", userEmail?: string): Promise<Blob> {
  console.log(`🔄 Starting PDF reordering for ${file.name} (${(file.size / 1024 / 1024).toFixed(2)}MB)`);

  try {
    // Read the uploaded PDF file
    const fileBuffer = await file.arrayBuffer();
    console.log("✅ File loaded into memory");

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(fileBuffer);
    console.log("✅ PDF document parsed");

    // Get total number of pages
    const pageCount = pdfDoc.getPageCount();
    console.log(`📄 PDF has ${pageCount} pages`);

    // Determine selection value (default to 9 if invalid), must be positive multiple of 3
    let selection = parseInt(sequenceType, 10);
    if (!Number.isFinite(selection) || selection <= 0 || selection % 3 !== 0) {
      selection = 9;
    }

    // Produce blanks-aware order (0-indexed with null placeholders)
    const orderWithNulls = computeChunkOrderWithBlanks(pageCount, selection);
    console.log(`🔢 Generated reordering sequence with ${orderWithNulls.length} positions`);

    // Create a new PDF document
    const newPdfDoc = await PDFDocument.create();

    // Determine a canonical page size for blanks (use first page if available, otherwise A4-ish)
    let blankWidth = 595.276; // A4 width in points (~8.27in * 72)
    let blankHeight = 841.89; // A4 height in points (~11.69in * 72)
    if (pageCount > 0) {
      const firstPage = pdfDoc.getPage(0);
      const size = firstPage.getSize();
      blankWidth = size.width;
      blankHeight = size.height;
    }

    // Build output, inserting blank pages where needed
    // Process in batches for better performance with large PDFs
    const batchSize = 50;
    for (let i = 0; i < orderWithNulls.length; i += batchSize) {
      const batch = orderWithNulls.slice(i, i + batchSize);

      for (const idx of batch) {
        if (idx === null) {
          newPdfDoc.addPage([blankWidth, blankHeight]);
        } else {
          const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [idx]);
          newPdfDoc.addPage(copiedPage);
        }
      }

      // Log progress for large PDFs
      if (orderWithNulls.length > 100 && i % 100 === 0) {
        console.log(`📝 Processed ${Math.min(i + batchSize, orderWithNulls.length)}/${orderWithNulls.length} pages`);
      }
    }

    console.log("✅ Page reordering completed");

    // Add watermark for Free users (only if not too many pages to avoid performance issues)
    if (pageCount <= 100) {
      await addWatermarkToPdf(newPdfDoc, userEmail);
      console.log("✅ Watermarking completed");
    } else {
      console.log("⚠️ Skipping watermark for large PDF (>100 pages) to maintain performance");
    }

    // Save the reordered PDF
    console.log("💾 Saving reordered PDF...");
    const reorderedPdfBytes = await newPdfDoc.save();

    console.log(`✅ PDF reordering completed successfully! Output size: ${(reorderedPdfBytes.length / 1024 / 1024).toFixed(2)}MB`);

    // Convert to Blob and return
    return new Blob([new Uint8Array(reorderedPdfBytes)], { type: 'application/pdf' });

  } catch (error) {
    console.error("❌ Error during PDF reordering:", error);
    throw new Error(`PDF processing failed: ${error.message}`);
  }
}
