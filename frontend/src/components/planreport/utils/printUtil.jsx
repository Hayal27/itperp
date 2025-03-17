/*
  Utility function to print selected sections.
  It clones the target container, opens a new window, writes the HTML into it, and triggers the print action.
*/
export const printSelectedSections = (container) => {
    if (!container) {
      console.error("No container provided for printing.");
      return;
    }
    // Clone the container to avoid manipulating the live DOM.
    const exportContainer = container.cloneNode(true);
    exportContainer.style.padding = "20px";
    exportContainer.style.fontFamily = "Arial, sans-serif";
    exportContainer.style.position = "fixed";
    exportContainer.style.top = "-9999px";
    exportContainer.style.left = "-9999px";
    
    document.body.appendChild(exportContainer);
    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow) {
      printWindow.document.write(exportContainer.outerHTML);
      printWindow.document.close();
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
        document.body.removeChild(exportContainer);
      }, 500);
    } else {
      console.error("Unable to open print window.");
      document.body.removeChild(exportContainer);
    }
  };