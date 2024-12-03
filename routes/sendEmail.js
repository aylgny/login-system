const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Function to create the PDF
const createInvoicePDF = (name, email, address, invoiceProducts, invoiceDate) => { // Added invoiceDate parameter
    return new Promise((resolve, reject) => {
      // Create a unique filename based on timestamp
      const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
      const fileName = `invoice_${timestamp}.pdf`;
      const filePath = path.join(`./frontend/public/invoices`, fileName);
  
      // Ensure the `invoices` directory exists
      if (!fs.existsSync(`./frontend/public/invoices`)) {
        fs.mkdirSync(`./frontend/public/invoices`);
      }
  
      const doc = new PDFDocument({ margin: 50 });
  
      // Pipe the PDF into a file
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);
  
      // Add a title
      doc
        .fontSize(26)
        .fillColor('#007BFF')
        .text('Invoice', { align: 'center' })
        .moveDown(1);
  
      // Add the invoice date at the top right
      if (invoiceDate) { // Check if invoiceDate is provided
        const pageWidth = doc.page.width;
        const rightMargin = 150; // Adjust this value as needed
      
        doc
          .fontSize(12)
          .fillColor('#000')
          .text(`Date: ${invoiceDate}`, pageWidth - rightMargin, 50, { // Positioning near the right margin
            align: 'right',
            width: rightMargin // Defines the width for right alignment
          })
          .moveDown(1);
      }
  
      // Customer Information
      const leftMargin = 50;
      let currentY = doc.y;
      
      doc
        .fontSize(14)
        .fillColor('#000')
        .text('Bill To:', leftMargin, currentY, { align: 'left' })
        .moveDown(0.5);
      
      currentY = doc.y;
      
      doc.text(`Name: ${name}`, leftMargin, currentY, { align: 'left' });
      currentY = doc.y;
      doc.text(`Email: ${email}`, leftMargin, currentY, { align: 'left' });
      currentY = doc.y;
      doc.text(`Address: ${address}`, leftMargin, currentY, { align: 'left' });
      doc.moveDown(1);
      // Table Header
      const tableTop = doc.y;
      const itemWidth = 200;
      const quantityWidth = 100;
      const priceWidth = 100;
      const totalWidth = 100;
  
      doc
        .fontSize(12)
        .text('Description', 50, tableTop, { width: itemWidth, align: 'left' })
        .text('Quantity', 50 + itemWidth, tableTop, { width: quantityWidth, align: 'center' })
        .text('Unit Price', 50 + itemWidth + quantityWidth, tableTop, { width: priceWidth, align: 'right' })
        .text('Total', 50 + itemWidth + quantityWidth + priceWidth, tableTop, { width: totalWidth, align: 'right' });
  
      doc.moveDown(0.5);
      doc
        .strokeColor('#aaaaaa')
        .lineWidth(1)
        .moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke();
  
      // Product Details
      let subtotal = 0;
      let y = doc.y + 5;
  
      invoiceProducts.forEach((product) => {
        const productTotal = product.quantity * product.price;
        subtotal += productTotal;
  
        doc
          .fontSize(12)
          .text(product.description, 50, y, { width: itemWidth, align: 'left' })
          .text(product.quantity.toString(), 50 + itemWidth, y, { width: quantityWidth, align: 'center' })
          .text(`$${product.price.toFixed(2)}`, 50 + itemWidth + quantityWidth, y, { width: priceWidth, align: 'right' })
          .text(`$${productTotal.toFixed(2)}`, 50 + itemWidth + quantityWidth + priceWidth, y, { width: totalWidth, align: 'right' });
  
        y += 20; // Move to the next row
      });
  
      doc.moveTo(50, y)
        .lineTo(550, y)
        .stroke();
  
      // Subtotal
      y += 10;
      doc
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Subtotal', 50 + itemWidth + quantityWidth, y, { width: priceWidth, align: 'right' })
        .text(`$${subtotal.toFixed(2)}`, 50 + itemWidth + quantityWidth + priceWidth, y, { width: totalWidth, align: 'right' });
  
      // Footer Message
      const footerY = y + 30; // Adjust vertical position to ensure it starts below the table
      doc.moveTo(50, footerY)
        .fontSize(10)
        .fillColor('#555')
        .text(
          'Thank you for your business! If you have any questions about this invoice, please contact us.',
          50, // Align with grid starting point horizontally
          footerY,
          { align: 'left', width: 500 }
        );
  
      doc.end();
  
      writeStream.on('finish', () => resolve(filePath));
      writeStream.on('error', reject);
    });
  };
  

// Function to send an email with the generated invoice
const sendEmailWithInvoice = async (userDetails, invoiceProducts, invoiceDate) => { // Added invoiceDate parameter
  const { name, email, address } = userDetails;

  try {
    // Generate Invoice PDF
    const pdfPath = await createInvoicePDF(name, email, address, invoiceProducts, invoiceDate); // Pass invoiceDate

    // Email setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'cs308projectmail1276@gmail.com',
        pass: 'bjiv ftlk shtb hhse' // Replace with your actual App Password
      }
    });

    const mailOptions = {
      from: 'cs308projectmail1276@gmail.com',
      to: email, // Send to the user's email
      subject: 'Login Notification with Invoice',
      text: `Hello ${name},\n\nThank you for logging in! Please find your invoice attached.`,
      attachments: [
        {
          filename: path.basename(pdfPath),
          path: pdfPath
        }
      ]
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log(`Email sent with invoice attached: ${pdfPath}`);
    return pdfPath;

  } catch (error) {
    console.error('Error sending email with invoice:', error);
  }
};

module.exports = sendEmailWithInvoice;
