import { APP_CONSTANTS } from "../constants/appConstants.js";

// Tạo PDF từ DOM preview bằng html2canvas + jsPDF (tối ưu cho Application Form A4)
export async function generatePdf({ selector = "#preview-root" } = {}) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  const element = document.querySelector(selector);
  if (!element) throw new Error("Preview element not found");

  // Thêm class đặc biệt cho PDF generation
  const originalClasses = element.className;
  element.className += " pdf-generation";

  // Đợi CSS được áp dụng
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Cấu hình html2canvas tối ưu cho Application Form
  const canvas = await html2canvas(element, {
    scale: APP_CONSTANTS.PDF.SCALE, // Giảm scale để tránh lỗi memory
    useCORS: true,
    backgroundColor: "#ffffff",
    allowTaint: true,
    foreignObjectRendering: false, // Tắt để tránh lỗi
    logging: false,
    width: element.offsetWidth,
    height: element.offsetHeight,
    scrollX: 0,
    scrollY: 0,
    windowWidth: element.offsetWidth,
    windowHeight: element.offsetHeight,
    ignoreElements: (element) => {
      // Bỏ qua các element có thể gây lỗi
      return (
        element.classList.contains("preview-actions") ||
        element.classList.contains("preview-modal-header")
      );
    },
  });

  const imgData = canvas.toDataURL("image/jpeg", APP_CONSTANTS.PDF.QUALITY); // Sử dụng JPEG với chất lượng cao

  // Tạo PDF A4 với cấu hình tối ưu
  const pdf = new jsPDF({
    orientation: APP_CONSTANTS.PDF.ORIENTATION,
    unit: APP_CONSTANTS.PDF.UNIT,
    format: APP_CONSTANTS.PDF.FORMAT,
    compress: true,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Margin cho A4 (36pt = 12.7mm mỗi bên)
  const margin = APP_CONSTANTS.PDF.MARGIN;
  const contentWidth = pageWidth - margin * 2;
  const contentHeight = pageHeight - margin * 2;

  // Tính toán tỷ lệ để vừa với chiều rộng trang
  const scale = contentWidth / canvas.width;
  const scaledHeight = canvas.height * scale;

  // Nếu nội dung vừa trong 1 trang
  if (scaledHeight <= contentHeight) {
    pdf.addImage(imgData, "JPEG", margin, margin, contentWidth, scaledHeight);
  } else {
    // Nếu nội dung dài hơn 1 trang, chia thành nhiều trang
    let yPosition = margin;
    let sourceY = 0;
    const sourceHeight = contentHeight / scale;

    while (sourceY < canvas.height) {
      // Tạo canvas cho từng trang
      const pageCanvas = document.createElement("canvas");
      const pageCtx = pageCanvas.getContext("2d");

      pageCanvas.width = canvas.width;
      pageCanvas.height = Math.min(sourceHeight, canvas.height - sourceY);

      // Vẽ phần của ảnh gốc lên canvas trang
      pageCtx.drawImage(
        canvas,
        0,
        sourceY,
        canvas.width,
        pageCanvas.height,
        0,
        0,
        canvas.width,
        pageCanvas.height
      );

      const pageImgData = pageCanvas.toDataURL("image/jpeg", 0.95);
      const pageImgHeight = pageCanvas.height * scale;

      pdf.addImage(
        pageImgData,
        "JPEG",
        margin,
        yPosition,
        contentWidth,
        pageImgHeight
      );

      sourceY += sourceHeight;

      // Thêm trang mới nếu còn nội dung
      if (sourceY < canvas.height) {
        pdf.addPage();
        yPosition = margin;
      }
    }
  }

  // Tạo tên file với timestamp
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
  const fileName = `Application_Form_${timestamp}.pdf`;

  // Khôi phục class gốc
  element.className = originalClasses;

  // Download file
  pdf.save(fileName);

  return pdf.output("blob");
}

// Hàm tạo PDF với dữ liệu form và ảnh
export async function generatePdfFromData(formData, imageUrl) {
  // Tạo element tạm thời để render preview
  const tempContainer = document.createElement("div");
  tempContainer.style.position = "absolute";
  tempContainer.style.left = "-9999px";
  tempContainer.style.top = "-9999px";
  tempContainer.style.width = "794px"; // A4 width in pixels
  tempContainer.style.padding = "76px"; // 20mm in pixels
  tempContainer.style.background = "white";
  tempContainer.style.fontFamily = "Times New Roman, serif";
  tempContainer.style.fontSize = "12px";
  tempContainer.style.lineHeight = "1.4";
  tempContainer.style.color = "#000";
  tempContainer.style.boxSizing = "border-box";
  tempContainer.className = "pdf-generation";

  document.body.appendChild(tempContainer);

  try {
    // Import Preview component và render
    const { default: Preview } = await import(
      "../components/preview/Preview.jsx"
    );
    const { createRoot } = await import("react-dom/client");
    const React = await import("react");

    const root = createRoot(tempContainer);
    root.render(
      React.createElement(
        React.StrictMode,
        null,
        React.createElement(Preview, { data: formData, imageUrl })
      )
    );

    // Đợi render xong
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Tạo PDF và trả về blob
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);

    const element = tempContainer;
    if (!element) throw new Error("Preview element not found");

    // Thêm class đặc biệt cho PDF generation
    const originalClasses = element.className;
    element.className += " pdf-generation";

    // Đợi CSS được áp dụng
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Cấu hình html2canvas tối ưu cho Application Form
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      allowTaint: true,
      foreignObjectRendering: false,
      logging: false,
      width: element.offsetWidth,
      height: element.offsetHeight,
      scrollX: 0,
      scrollY: 0,
      windowWidth: element.offsetWidth,
      windowHeight: element.offsetHeight,
      ignoreElements: (element) => {
        return (
          element.classList.contains("preview-actions") ||
          element.classList.contains("preview-modal-header")
        );
      },
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.95);

    // Tạo PDF A4 với cấu hình tối ưu
    const pdf = new jsPDF({
      orientation: "p",
      unit: "pt",
      format: "a4",
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Margin cho A4 (36pt = 12.7mm mỗi bên)
    const margin = 36;
    const contentWidth = pageWidth - margin * 2;
    const contentHeight = pageHeight - margin * 2;

    // Tính toán tỷ lệ để vừa với chiều rộng trang
    const scale = contentWidth / canvas.width;
    const scaledHeight = canvas.height * scale;

    // Nếu nội dung vừa trong 1 trang
    if (scaledHeight <= contentHeight) {
      pdf.addImage(imgData, "JPEG", margin, margin, contentWidth, scaledHeight);
    } else {
      // Nếu nội dung dài hơn 1 trang, chia thành nhiều trang
      let yPosition = margin;
      let sourceY = 0;
      const sourceHeight = contentHeight / scale;

      while (sourceY < canvas.height) {
        // Tạo canvas cho từng trang
        const pageCanvas = document.createElement("canvas");
        const pageCtx = pageCanvas.getContext("2d");

        pageCanvas.width = canvas.width;
        pageCanvas.height = Math.min(sourceHeight, canvas.height - sourceY);

        // Vẽ phần của ảnh gốc lên canvas trang
        pageCtx.drawImage(
          canvas,
          0,
          sourceY,
          canvas.width,
          pageCanvas.height,
          0,
          0,
          canvas.width,
          pageCanvas.height
        );

        const pageImgData = pageCanvas.toDataURL("image/jpeg", 0.95);
        const pageImgHeight = pageCanvas.height * scale;

        pdf.addImage(
          pageImgData,
          "JPEG",
          margin,
          yPosition,
          contentWidth,
          pageImgHeight
        );

        sourceY += sourceHeight;

        // Thêm trang mới nếu còn nội dung
        if (sourceY < canvas.height) {
          pdf.addPage();
          yPosition = margin;
        }
      }
    }

    // Khôi phục class gốc
    element.className = originalClasses;

    return pdf.output("blob");
  } finally {
    // Cleanup
    document.body.removeChild(tempContainer);
  }
}
