const bookingConfirmationTemplate = (customerName, carDetails, startDate, endDate, totalPrice) => `
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f9f9f9; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <h2 style="color: #2c3e50; text-align: center;">Booking Confirmation</h2>
                <p>Dear ${customerName},</p>
                <p>Thank you for choosing our car rental service. Your booking has been confirmed with the following details:</p>
                <ul style="list-style: none; padding: 0;">
                    <li><strong>Car:</strong> ${carDetails}</li>
                    <li><strong>Start Date:</strong> ${startDate}</li>
                    <li><strong>End Date:</strong> ${endDate}</li>
                    <li><strong>Total Price:</strong> $${totalPrice}</li>
                </ul>
                <p>If you have any questions or need further assistance, feel free to contact us.</p>
                <p style="text-align: center; margin-top: 20px;">Best regards,</p>
                <p style="text-align: center;"><strong>Your Car Rental Team</strong></p>
            </div>
        </body>
    </html>
`;

export default bookingConfirmationTemplate;
