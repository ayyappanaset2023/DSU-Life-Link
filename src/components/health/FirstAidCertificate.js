import jsPDF from 'jspdf';

export const generateFirstAidCertificate = (userName, date, certificateId) => {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [800, 600]
  });

  // Background - Clean medical gray/white
  doc.setFillColor(252, 252, 252);
  doc.rect(0, 0, 800, 600, 'F');

  // Medical Border - Red & Blue theme
  doc.setDrawColor(220, 38, 38); // Red
  doc.setLineWidth(8);
  doc.rect(20, 20, 760, 560);
  
  doc.setDrawColor(30, 58, 138); // Dark Blue
  doc.setLineWidth(2);
  doc.rect(30, 30, 740, 540);

  // Red Cross Watermark (Subtle)
  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(1);
  doc.setGState(new doc.GState({ opacity: 0.05 }));
  // Horizontal bar
  doc.rect(300, 280, 200, 40, 'F');
  // Vertical bar
  doc.rect(380, 200, 40, 200, 'F');
  doc.setGState(new doc.GState({ opacity: 1 }));

  // Header Title
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.setFontSize(32);
  doc.text('DSU LIFELINK ACADEMY', 400, 80, { align: 'center' });

  doc.setTextColor(220, 38, 38);
  doc.setFontSize(24);
  doc.text('FIRST AID COURSE COMPLETION', 400, 120, { align: 'center' });

  // Verified Badge (Drawing)
  doc.setFillColor(30, 58, 138);
  doc.circle(700, 100, 40, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('VERIFIED', 700, 95, { align: 'center' });
  doc.text('BY LIFELINK', 700, 110, { align: 'center' });

  // Content
  doc.setTextColor(60, 60, 60);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(18);
  doc.text('This is to certify that', 400, 180, { align: 'center' });

  // User Name
  doc.setTextColor(20, 20, 20);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(44);
  doc.text((userName || 'RESCUE HERO').toUpperCase(), 400, 240, { align: 'center' });

  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(1);
  doc.line(200, 250, 600, 250);

  // Description
  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(16);
  doc.text('has successfully completed the comprehensive First Aid Training program,', 400, 290, { align: 'center' });
  doc.text('demonstrating excellence in emergency medical response and life-saving procedures.', 400, 315, { align: 'center' });

  // Certificate ID & Date
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(150, 150, 150);
  doc.text(`CERTIFICATE ID: ${certificateId || 'LL-FA-' + Date.now().toString().slice(-8)}`, 50, 550);
  doc.text(`ISSUED ON: ${date || new Date().toLocaleDateString()}`, 750, 550, { align: 'right' });

  // Signatures
  // Founder
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 58, 138);
  doc.setFontSize(18);
  doc.text('A. Ayyappan', 200, 480, { align: 'center' });
  doc.setDrawColor(150, 150, 150);
  doc.line(130, 490, 270, 490);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.text('Founder, DSU LifeLink', 200, 510, { align: 'center' });

  // Chief Medical Officer (Placeholder Signature)
  doc.setFont('helvetica', 'bold');
  doc.text('Dr. Sarah Johnson', 600, 480, { align: 'center' });
  doc.line(530, 490, 670, 490);
  doc.setFont('helvetica', 'normal');
  doc.text('Chief Medical Advisor', 600, 510, { align: 'center' });

  return doc.output('datauristring');
};
