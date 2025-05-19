
/**
 * Convert an image file to PDF
 * @param imageFile The image file to convert
 * @returns Promise resolving to a Blob containing the PDF
 */
export async function convertImageToPdf(imageFile: File): Promise<Blob> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      // Create a canvas element to draw the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Create an image element
      const img = new Image();
      img.onload = () => {
        // Set canvas dimensions to match the image
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw the image on the canvas
        ctx?.drawImage(img, 0, 0);
        
        // Convert the canvas to PDF using a library like jspdf
        import('jspdf').then((jsPDFModule) => {
          const jsPDF = jsPDFModule.default;
          const pdf = new jsPDF({
            orientation: img.width > img.height ? 'landscape' : 'portrait',
            unit: 'px',
            format: [img.width, img.height]
          });
          
          // Add the image to the PDF
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, img.width, img.height);
          
          // Convert to blob and resolve
          const pdfBlob = pdf.output('blob');
          resolve(pdfBlob);
        });
      };
      
      // Set the image source
      img.src = e.target?.result as string;
    };
    
    // Read the image file
    reader.readAsDataURL(imageFile);
  });
}

/**
 * Combine multiple images into a single PDF
 * @param imageFiles Array of image files to convert
 * @returns Promise resolving to a Blob containing the PDF
 */
export async function combineImagesToPdf(imageFiles: File[]): Promise<Blob> {
  return new Promise((resolve) => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;
    
    imageFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          loadedImages[index] = img;
          loadedCount++;
          
          // When all images are loaded, create the PDF
          if (loadedCount === imageFiles.length) {
            import('jspdf').then((jsPDFModule) => {
              const jsPDF = jsPDFModule.default;
              const pdf = new jsPDF();
              
              // Add each image as a new page in the PDF
              loadedImages.forEach((img, idx) => {
                // For pages after the first, add a new page
                if (idx > 0) {
                  pdf.addPage();
                }
                
                const imgWidth = pdf.internal.pageSize.getWidth();
                const imgHeight = pdf.internal.pageSize.getHeight();
                
                // Create a canvas to draw and potentially resize the image
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                
                // Calculate aspect ratios
                const imgRatio = img.width / img.height;
                const pageRatio = imgWidth / imgHeight;
                
                let finalWidth = imgWidth;
                let finalHeight = imgHeight;
                
                // Adjust dimensions to fit the page while maintaining aspect ratio
                if (imgRatio > pageRatio) {
                  // Image is wider than the page ratio
                  finalHeight = finalWidth / imgRatio;
                } else {
                  // Image is taller than the page ratio
                  finalWidth = finalHeight * imgRatio;
                }
                
                // Set canvas size and draw the image
                canvas.width = img.width;
                canvas.height = img.height;
                ctx?.drawImage(img, 0, 0, img.width, img.height);
                
                // Add the image to the PDF
                pdf.addImage(
                  canvas.toDataURL('image/jpeg', 0.9), // Use JPEG format with 90% quality
                  'JPEG',
                  (imgWidth - finalWidth) / 2, // Center horizontally
                  (imgHeight - finalHeight) / 2, // Center vertically
                  finalWidth,
                  finalHeight
                );
              });
              
              // Convert to blob and resolve
              const pdfBlob = pdf.output('blob');
              resolve(pdfBlob);
            });
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  });
}

/**
 * Compress a PDF file
 * @param pdfFile The PDF file to compress
 * @param targetSizeKb Target size in kilobytes
 * @returns Promise resolving to a compressed PDF Blob
 */
export async function compressPdf(pdfFile: File, targetSizeKb: number): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    try {
      // Import pdf-lib
      const { PDFDocument } = await import('pdf-lib');
      
      // Read the PDF file
      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      
      // Get all pages
      const pages = pdfDoc.getPages();
      
      // Calculate compression ratio based on current size and target size
      const currentSizeKb = pdfFile.size / 1024;
      let compressionQuality = Math.min(0.9, (targetSizeKb / currentSizeKb) * 0.9);
      
      // Ensure compression quality is between 0.1 and 0.9
      compressionQuality = Math.max(0.1, Math.min(0.9, compressionQuality));
      
      console.log(`Compressing PDF to target size of ${targetSizeKb}KB`);
      console.log(`Current size: ${currentSizeKb.toFixed(2)}KB, Compression quality: ${compressionQuality.toFixed(2)}`);
      
      // Serialize the PDFDocument to bytes with compression
      const compressedPdfBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 100
      });
      
      // Create a blob from the compressed PDF bytes
      const compressedPdfBlob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
      
      resolve(compressedPdfBlob);
    } catch (error) {
      console.error("Failed to compress PDF:", error);
      reject(error);
    }
  });
}

/**
 * Convert PDF to text (simulated)
 * @param pdfFile The PDF file to convert
 * @returns Promise resolving to a text representation
 */
export async function pdfToText(pdfFile: File): Promise<string> {
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      // In a real implementation, you would extract text from the PDF
      resolve(`This is extracted text from ${pdfFile.name}. In a real implementation, this would contain the actual text content of the PDF document.`);
    }, 2000);
  });
}
