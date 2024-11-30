import React, { useState } from "react";
import "./InvoicesPage.css";

const sampleInvoices = [
  {
    id: 1,
    customerName: "John Doe",
    date: "2024-11-30",
    items: [
      { name: "Product A", quantity: 2, unitPrice: 15.0 },
      { name: "Product B", quantity: 1, unitPrice: 25.0 },
    ],
    shipping: 5.0,
  },
  {
    id: 2,
    customerName: "Jane Smith",
    date: "2024-11-29",
    items: [
      { name: "Product X", quantity: 1, unitPrice: 50.0 },
      { name: "Product Y", quantity: 3, unitPrice: 10.0 },
    ],
    shipping: 10.0,
  },
  {
    id: 3,
    customerName: "Michael Johnson",
    date: "2024-11-28",
    items: [
      { name: "Product Z", quantity: 4, unitPrice: 12.0 },
      { name: "Product W", quantity: 2, unitPrice: 8.0 },
    ],
    shipping: 7.0,
  },
  {
    id: 34,
    customerName: "Michael Johnson",
    date: "2024-11-28",
    items: [
      { name: "Product Z", quantity: 4, unitPrice: 12.0 },
      { name: "Product W", quantity: 2, unitPrice: 8.0 },
    ],
    shipping: 7.0,
  },
  {
    id: 5,
    customerName: "Michael Johnson",
    date: "2024-11-28",
    items: [
      { name: "Product Z", quantity: 4, unitPrice: 12.0 },
      { name: "Product W", quantity: 2, unitPrice: 8.0 },
    ],
    shipping: 7.0,
  },
  {
    id: 899,
    customerName: "Michael Johnson",
    date: "2024-11-28",
    items: [
      { name: "Product Z", quantity: 4, unitPrice: 12.0 },
      { name: "Product W", quantity: 2, unitPrice: 8.0 },
    ],
    shipping: 7.0,
  },
];

const InvoiceSample = () => {
  const [selectedInvoice, setSelectedInvoice] = useState(sampleInvoices[0]);

  const calculateTotalPrice = (items) =>
    items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

  return (
    <div className="invoice-sample-container">
      <div className="invoice-list-container">
        <h2>Invoices</h2>
        {sampleInvoices.map((invoice) => (
          <div
            key={invoice.id}
            className={`invoice-card ${
              selectedInvoice?.id === invoice.id ? "selected" : ""
            }`}
            onClick={() => setSelectedInvoice(invoice)}
          >
            <h3>Invoice #{invoice.id}</h3>
            <p>{invoice.customerName}</p>
            <p>{invoice.date}</p>
            <p>
              Total: €
              {(
                calculateTotalPrice(invoice.items) + invoice.shipping
              ).toFixed(2)}
            </p>
          </div>
        ))}
      </div>
      <div className="invoice-preview-container">
        <h2>Invoice Preview</h2>
        {selectedInvoice ? (
          <>
            <h3>Invoice #{selectedInvoice.id}</h3>
            <p><strong>Customer:</strong> {selectedInvoice.customerName}</p>
            <p><strong>Date:</strong> {selectedInvoice.date}</p>
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoice.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>€ {item.unitPrice.toFixed(2)}</td>
                    <td>€ {(item.quantity * item.unitPrice).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="invoice-total">
              <p><strong>Shipping:</strong> € {selectedInvoice.shipping.toFixed(2)}</p>
              <p>
                <strong>Grand Total:</strong> €
                {(
                  calculateTotalPrice(selectedInvoice.items) +
                  selectedInvoice.shipping
                ).toFixed(2)}
              </p>
            </div>
          </>
        ) : (
          <p>Please select an invoice to view details.</p>
        )}
      </div>
    </div>
  );
};

export default InvoiceSample;
