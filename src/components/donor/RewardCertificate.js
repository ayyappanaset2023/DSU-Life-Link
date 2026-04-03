import jsPDF from 'jspdf';

export const generateCertificate = (donorName, bloodGroup, date, type = "Registered Blood Donor Certificate") => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [800, 600]
  });

  // Background color
  doc.setFillColor(255, 250, 250);
  doc.rect(0, 0, 800, 600, 'F');

  // Gold Border for premium DSU look
  doc.setDrawColor(218, 165, 32); 
  doc.setLineWidth(12);
  doc.rect(20, 20, 760, 560);
  doc.setDrawColor(184, 134, 11);
  doc.setLineWidth(4);
  doc.rect(34, 34, 732, 532);

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(218, 165, 32); // Gold
  doc.setFontSize(40);
  doc.text(type.toUpperCase(), 400, 110, { align: 'center' });

  // Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.setFontSize(22);
  doc.text('PROUDLY PRESENTED TO', 400, 160, { align: 'center' });

  // Donor Name
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(48);
  doc.text((donorName || 'GUEST HERO').toUpperCase(), 400, 220, { align: 'center' });

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(2);
  doc.line(250, 230, 550, 230);

  // Appreciation text
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(20);
  if (type === "Registered Blood Donor Certificate") {
      doc.text('For officially joining the community of life savers', 400, 270, { align: 'center' });
      doc.text(`as a committed ${bloodGroup || 'A+'} blood donor.`, 400, 295, { align: 'center' });
  } else {
      doc.text('For your extraordinary and selfless contribution of saving a life', 400, 270, { align: 'center' });
      doc.text(`by donating ${bloodGroup || 'A+'} blood. Your generosity brings hope.`, 400, 295, { align: 'center' });
  }

  // DSU Branding
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(26);
  doc.setTextColor(229, 57, 53); // Red Lifelink color
  doc.text('DSU LifeLink', 400, 380, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(16);
  doc.setTextColor(100, 100, 100);
  doc.text('Organizer: Dhanalakshmi Srinivasan University', 400, 410, { align: 'center' });
  
  // Date and Signature labels
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('A. Ayyappan', 600, 490, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.line(530, 500, 670, 500);
  doc.text('Founder', 600, 520, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.text(date || new Date().toISOString().split('T')[0], 200, 490, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.line(130, 500, 270, 500);
  doc.text('Issue Date', 200, 520, { align: 'center' });

  // Return base64 URI String instead of forcefully downloading it instantly
  return doc.output('datauristring');
};
