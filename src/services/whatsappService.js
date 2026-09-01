// WhatsApp Deep Link & Message Dispatcher for Rx & Invoices

export const sendWhatsAppPrescription = (patientPhone, patientName, rxData, clinicData) => {
  if (!patientPhone) {
    alert('Patient phone number is missing');
    return;
  }

  const cleanPhone = patientPhone.replace(/\D/g, '').slice(-10);
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  const medsList = (rxData.medicines || []).map((m, idx) => 
    `${idx + 1}. *${m.drug_name}* (${m.form}) - ${m.dosage_pattern} [${m.timing}] for ${m.duration}`
  ).join('%0A');

  const text = `🏥 *${clinicData?.name || 'MediFlow Clinic'}*%0A` +
    `Hello *${patientName}*, here is your digital prescription summary:%0A%0A` +
    `👨‍⚕️ *Doctor:* ${rxData.doctor_name || 'Attending Physician'}%0A` +
    `📋 *Diagnosis:* ${Array.isArray(rxData.diagnosis) ? rxData.diagnosis.join(', ') : rxData.diagnosis}%0A%0A` +
    `💊 *Prescribed Medicines:*%0A${medsList}%0A%0A` +
    `🥗 *Dietary Advice:* ${rxData.dietary_advice || 'Drink plenty of fluids & take adequate rest.'}%0A` +
    `📅 *Next Follow-up:* ${rxData.followup_date || 'Within 7 days'}%0A%0A` +
    `_Get well soon! For queries, contact ${clinicData?.phone || ''}_`;

  const url = `https://wa.me/${formattedPhone}?text=${text}`;
  window.open(url, '_blank');
};

export const sendWhatsAppInvoice = (patientPhone, patientName, invoiceData, clinicData) => {
  if (!patientPhone) {
    alert('Patient phone number is missing');
    return;
  }

  const cleanPhone = patientPhone.replace(/\D/g, '').slice(-10);
  const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;

  const text = `🧾 *RECEIPT - ${clinicData?.name || 'MediFlow Clinic'}*%0A` +
    `Dear *${patientName}*, thank you for your visit.%0A%0A` +
    `📄 *Invoice No:* ${invoiceData.invoice_number}%0A` +
    `💰 *Total Paid:* ₹${Number(invoiceData.grand_total).toFixed(2)} (${invoiceData.payment_mode})%0A` +
    `✅ *Status:* PAID%0A%0A` +
    `_Wish you good health!_`;

  const url = `https://wa.me/${formattedPhone}?text=${text}`;
  window.open(url, '_blank');
};
