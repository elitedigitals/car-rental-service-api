const paymentReceiptTemplate = (customerName, carDetails, paymentDate, amountPaid) => `
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #27ae60; text-align: center;">Payment Receipt</h2>
                <p>Dear ${customerName},</p>
                <p>Thank you for your payment. Here are the details of your transaction:</p>
                <ul style="list-style: none; padding: 0;">
                    <li><strong>Car:</strong> ${carDetails}</li>
                    <li><strong>Payment Date:</strong> ${paymentDate}</li>
                    <li><strong>Amount Paid:</strong> $${amountPaid}</li>
                </ul>
                <p>If you have any questions or need further assistance, feel free to contact us.</p>
                <p style="text-align: center; margin-top: 20px;">Best regards,</p>
                <p style="text-align: center;"><strong>Your Car Rental Team</strong></p>
            </div>
        </body>
    </html>
`;

export default paymentReceiptTemplate;
