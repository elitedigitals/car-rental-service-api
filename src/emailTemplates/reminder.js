const reminderTemplate = (customerName, carDetails, returnDate) => `
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2 style="color: #f39c12;">Rental Reminder</h2>
            <p>Dear ${customerName},</p>
            <p>This is a friendly reminder that your rental period for the following car is nearing its end:</p>
            <ul>
                <li><strong>Car:</strong> ${carDetails}</li>
                <li><strong>Return Date:</strong> ${returnDate}</li>
            </ul>
            <p>Please ensure the car is returned on time to avoid any additional charges. If you need to extend your rental period, contact us as soon as possible.</p>
            <p>Best regards,</p>
            <p><strong>Your Car Rental Team</strong></p>
        </body>
    </html>
`;

export default reminderTemplate;
