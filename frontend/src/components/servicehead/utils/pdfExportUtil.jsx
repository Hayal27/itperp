import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

/*
  Utility function to generate a PDF of selected sections.
  It clones the target container, renders it to a canvas, converts it to an image,
  and then places that image in a PDF which is subsequently saved.
*/
export const downloadPDFofSelectedSections = async (container) => {
  if (!container) {
    console.error("No container provided for PDF export.");
    return;
  }
  // Clone the container
  const exportContainer = container.cloneNode(true);
  exportContainer.style.padding = "20px";
  exportContainer.style.fontFamily = "Arial, sans-serif";
  exportContainer.style.position = "fixed";
  exportContainer.style.top = "-9999px";
  exportContainer.style.left = "-9999px";

  document.body.appendChild(exportContainer);
  try {
    // Delay to ensure the DOM is rendered
    await new Promise(resolve => setTimeout(resolve, 500));
    const canvas = await html2canvas(exportContainer, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("StaffDashboard.pdf");
  } catch (err) {
    console.error("PDF generation failed", err);
  }
  document.body.removeChild(exportContainer);
};