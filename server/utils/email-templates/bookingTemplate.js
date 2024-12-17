exports.bookingConfirmationEmail = function (customerName, eventName, eventDate, ticketCount, ticketAmount, totalPrice) {
    return new Promise((resolve, reject) => {
        try {
            const template = `
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 0;
                            background-color: #f4f4f4;
                        }
                        .container {
                            margin: 20px auto;
                            padding: 20px;
                            background-color: #ffffff;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                            max-width: 600px;
                        }
                        .header {
                            background-color: #FF6F61;
                            color: white;
                            text-align: center;
                            padding: 10px 0;
                            border-radius: 8px 8px 0 0;
                        }
                        .content {
                            padding: 20px;
                        }
                        .content h3 {
                            color: #333;
                        }
                        .content p {
                            color: #555;
                            font-size: 1em;
                        }
                        .summary {
                            margin-top: 20px;
                            background-color: #f9f9f9;
                            padding: 15px;
                            border-radius: 8px;
                            border: 1px solid #e0e0e0;
                        }
                        .summary p {
                            margin: 5px 0;
                        }
                        .summary .total {
                            font-size: 1.2em;
                            font-weight: bold;
                            color: #333;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 20px;
                            font-size: 0.8em;
                            color: #777;
                        }
                        .footer a {
                            color: #FF6F61;
                            text-decoration: none;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h2>Booking Confirmation</h2>
                        </div>
                        <div class="content">
                            <p>Dear ${customerName},</p>
                            <p>Thank you for booking with us! We're excited to confirm your booking for the following event:</p>
                            
                            <h3>${eventName}</h3>
                            <p><strong>Date:</strong> ${new Date(eventDate).toLocaleString()}</p>
                            <p><strong>Tickets:</strong> ${ticketCount} x ₹${ticketAmount} each</p>
                            
                            <div class="summary">
                                <p><strong>Booking Summary:</strong></p>
                                <p><b>Event:</b> ${eventName}</p>
                                <p><b>Tickets:</b> ${ticketCount} x ₹${ticketAmount}</p>
                                <p><b>Total Amount:</b> ₹${totalPrice}</p>
                            </div>

                            <p>We look forward to seeing you at the event!</p>
                            <p>If you have any questions or need further assistance, feel free to contact us.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; 2024 Your Company. All rights reserved.</p>
                            <p><a href="http://yourcompany.com/contact">Contact Us</a> | <a href="http://yourcompany.com/terms">Terms & Conditions</a></p>
                        </div>
                    </div>
                </body>
                </html>`;
            resolve(template);
        } catch (error) {
            reject(error);
        }
    });
};
