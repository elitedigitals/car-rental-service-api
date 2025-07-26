const bookingCancellationTemplate = (customerName, carDetails, cancellationDate) => `
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #e74c3c; text-align: center;">Booking Cancellation</h2>
                <p>Dear ${customerName},</p>
                <p>We regret to inform you that your booking for the following car has been cancelled:</p>
                <ul style="list-style: none; padding: 0;">
                    <li><strong>Car:</strong> ${carDetails}</li>
                    <li><strong>Cancellation Date:</strong> ${cancellationDate}</li>
                </ul>
                <p>If you have any questions or would like to rebook, please contact us at your earliest convenience.</p>
                <p style="text-align: center; margin-top: 20px;">Best regards,</p>
                <p style="text-align: center;"><strong>Your Car Rental Team</strong></p>
            </div>
        </body>
    </html>
`;

export default bookingCancellationTemplate;
