import { PDFDocument, PDFPage, rgb, StandardFonts } from 'pdf-lib';
import { getCurrentPlan } from './usageUtils';

/**
 * Add watermark to a PDF document for Free users only
 * @param pdfDoc The PDF document to add watermark to
 * @param userEmail User's email to check plan
 * @returns Promise<void>
 */
export async function addWatermarkToPdf(pdfDoc: PDFDocument, userEmail?: string): Promise<void> {
  const userPlan = getCurrentPlan(userEmail);
  
  // Only add watermark for Free users
  if (userPlan !== 'Free') {
    return;
  }

  try {
    // Get all pages
    const pages = pdfDoc.getPages();
    
    // Load font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    
    // Watermark text
    const watermarkText = 'newmicro.live';
    
    // Add watermark to each page
    for (const page of pages) {
      await addWatermarkToPage(page, watermarkText, font);
    }
  } catch (error) {
    console.error('Error adding watermark:', error);
    // Don't throw error - continue with PDF processing even if watermark fails
  }
}

/**
 * Add watermark to a single PDF page
 * @param page The PDF page to add watermark to
 * @param text The watermark text
 * @param font The font to use
 */
async function addWatermarkToPage(page: PDFPage, text: string, font: any): Promise<void> {
  const { width, height } = page.getSize();
  
  // Calculate center position
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Font size based on page size - smaller and more subtle
  const fontSize = Math.min(width, height) * 0.05; // Reduced from 8% to 5%
  
  // Get text dimensions
  const textWidth = font.widthOfTextAtSize(text, fontSize);
  
  // Add very subtle semi-transparent background rectangle
  page.drawRectangle({
    x: centerX - (textWidth / 2) - 15,
    y: centerY - (fontSize / 2) - 8,
    width: textWidth + 30,
    height: fontSize + 16,
    color: rgb(1, 1, 1), // White background
    opacity: 0.3, // Much more transparent
  });
  
  // Add the watermark text - much lighter and more subtle
  page.drawText(text, {
    x: centerX - (textWidth / 2),
    y: centerY - (fontSize / 2),
    size: fontSize,
    font: font,
    color: rgb(0.7, 0.7, 0.7), // Light gray text instead of blue
    opacity: 0.4, // Much more transparent
  });
}

/**
 * Add watermark to jsPDF document (for image to PDF conversion)
 * @param pdf The jsPDF instance
 * @param userEmail User's email to check plan
 */
export function addWatermarkToJsPdf(pdf: any, userEmail?: string): void {
  const userPlan = getCurrentPlan(userEmail);
  
  // Only add watermark for Free users
  if (userPlan !== 'Free') {
    return;
  }

  try {
    const pageCount = pdf.internal.getNumberOfPages();
    
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate center position
      const centerX = pageWidth / 2;
      const centerY = pageHeight / 2;
      
      // Set font and size - smaller and more subtle
      const fontSize = Math.min(pageWidth, pageHeight) * 0.05; // Reduced from 8% to 5%
      pdf.setFontSize(fontSize);
      
      // Add very subtle semi-transparent background
      pdf.setFillColor(255, 255, 255); // White
      pdf.setGState(pdf.GState({ opacity: 0.3 })); // Much more transparent
      
      const textWidth = pdf.getTextWidth('newmicro.live');
      const textHeight = fontSize;
      
      // Draw background rectangle - more subtle
      pdf.rect(
        centerX - (textWidth / 2) - 8,
        centerY - (textHeight / 2) - 4,
        textWidth + 16,
        textHeight + 8,
        'F'
      );
      
      // Add watermark text - much lighter
      pdf.setTextColor(180, 180, 180); // Light gray text instead of blue
      pdf.setGState(pdf.GState({ opacity: 0.4 })); // Much more transparent
      pdf.text('newmicro.live', centerX, centerY, { align: 'center' });
      
      // Reset opacity
      pdf.setGState(pdf.GState({ opacity: 1.0 }));
    }
  } catch (error) {
    console.error('Error adding watermark to jsPDF:', error);
    // Don't throw error - continue with PDF processing even if watermark fails
  }
}

/**
 * Check if user should get watermarked PDFs
 * @param userEmail User's email
 * @returns boolean indicating if watermark should be added
 */
export function shouldAddWatermark(userEmail?: string): boolean {
  const userPlan = getCurrentPlan(userEmail);
  return userPlan === 'Free';
}