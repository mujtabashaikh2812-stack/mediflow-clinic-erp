// 80mm ESC/POS Thermal Receipt Print Service

export const triggerThermalPrint = (invoiceData, clinicData) => {
  const printWindow = window.open('', '_blank', 'width=380,height=600');
  if (!printWindow) {
    alert('Please allow popups to print receipt');
    return;
  }

  const itemsHtml = (invoiceData.line_items || []).map(item => `
    <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px;">
      <span style="flex: 2; text-align: left;">${item.name}</span>
      <span style="flex: 1; text-align: center;">${item.qty}</span>
      <span style="flex: 1; text-align: right;">₹${Number(item.total_amount || item.unit_price * item.qty).toFixed(2)}</span>
    </div>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Thermal Receipt - ${invoiceData.invoice_number}</title>
      <style>
        @page {
          margin: 0;
          size: 80mm auto;
        }
        body {
          font-family: 'Courier New', Courier, monospace;
          width: 76mm;
          margin: 0 auto;
          padding: 8px 4px;
          color: #000;
          background: #fff;
          font-size: 12px;
          line-height: 1.2;
        }
        .text-center { text-align: center; }
        .text-right { text-align: right; }
        .bold { font-weight: bold; }
        .border-dashed { border-bottom: 1px dashed #000; margin: 6px 0; }
        .header-title { font-size: 14px; font-weight: bold; }
        .footer { font-size: 10px; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="text-center">
        <div class="header-title">${clinicData?.name || 'APEX SPECIALTY CLINIC'}</div>
        <div style="font-size: 10px;">${clinicData?.address?.line1 || ''}, ${clinicData?.address?.city || ''}</div>
        <div style="font-size: 10px;">Ph: ${clinicData?.phone || ''}</div>
        ${clinicData?.gstin ? `<div style="font-size: 9px;">GSTIN: ${clinicData.gstin}</div>` : ''}
      </div>

      <div class="border-dashed"></div>

      <div style="font-size: 11px;">
        <div style="display: flex; justify-content: space-between;">
          <span>Inv: <b>${invoiceData.invoice_number}</b></span>
          <span>Date: ${new Date(invoiceData.created_at || Date.now()).toLocaleDateString()}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span>Pt: <b>${invoiceData.patient_name || 'Patient'}</b></span>
          <span>UHID: ${invoiceData.patient_uhid || ''}</span>
        </div>
        ${invoiceData.doctor_name ? `<div>Dr: ${invoiceData.doctor_name}</div>` : ''}
      </div>

      <div class="border-dashed"></div>

      <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: bold; margin-bottom: 4px;">
        <span style="flex: 2; text-align: left;">ITEM</span>
        <span style="flex: 1; text-align: center;">QTY</span>
        <span style="flex: 1; text-align: right;">AMT</span>
      </div>

      ${itemsHtml}

      <div class="border-dashed"></div>

      <div style="font-size: 11px;">
        <div style="display: flex; justify-content: space-between;">
          <span>Sub Total:</span>
          <span>₹${Number(invoiceData.subtotal || 0).toFixed(2)}</span>
        </div>
        ${invoiceData.discount_amount > 0 ? `
          <div style="display: flex; justify-content: space-between;">
            <span>Discount:</span>
            <span>- ₹${Number(invoiceData.discount_amount).toFixed(2)}</span>
          </div>
        ` : ''}
        ${invoiceData.tax_amount > 0 ? `
          <div style="display: flex; justify-content: space-between;">
            <span>Tax (GST):</span>
            <span>+ ₹${Number(invoiceData.tax_amount).toFixed(2)}</span>
          </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: bold; margin-top: 4px;">
          <span>GRAND TOTAL:</span>
          <span>₹${Number(invoiceData.grand_total || 0).toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 10px; margin-top: 2px;">
          <span>Paid via ${invoiceData.payment_mode || 'UPI'}:</span>
          <span>₹${Number(invoiceData.paid_amount || invoiceData.grand_total).toFixed(2)} [PAID]</span>
        </div>
      </div>

      <div class="border-dashed"></div>

      <div class="text-center footer">
        <div class="bold">*** GET WELL SOON ***</div>
        <div>${clinicData?.receipt_footer || 'Follow-up valid for 7 days.'}</div>
        <div style="font-size: 9px; margin-top: 4px;">Powered by MediFlow Clinic OS</div>
      </div>

      <script>
        window.onload = function() {
          window.print();
          setTimeout(function() { window.close(); }, 500);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
};
