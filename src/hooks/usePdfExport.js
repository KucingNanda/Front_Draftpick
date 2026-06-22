import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export function usePdfExport() {
  const exportToPDF = async (targetId) => {
    const captureTarget = document.getElementById(targetId);
    if (!captureTarget) return;

    Swal.fire({
      title: 'Memproses PDF...',
      text: 'Mohon tunggu sebentar, sedang mengabadikan hasil draft.',
      allowOutsideClick: false,
      background: '#1e293b',
      color: '#fff',
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const canvas = await html2canvas(captureTarget, {
        useCORS: true,
        scale: 2, 
        backgroundColor: '#0f172a'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`DraftPick_Result_${new Date().toISOString().slice(0,10)}.pdf`);

      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Dokumen PDF berhasil diunduh.',
        background: '#1e293b',
        color: '#fff'
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Terjadi kesalahan saat memproses gambar PDF.',
        background: '#1e293b',
        color: '#fff'
      });
    }
  };

  return { exportToPDF };
}
