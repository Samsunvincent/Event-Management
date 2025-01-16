exports.blockUserEmailTemplate = function (userName, description) {
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
                            <h2>Account Blocked</h2>
                        </div>
                        <div class="content">
                            <p>Dear ${userName},</p>
                            <p>We regret to inform you that your account has been blocked due to the following reason:</p>
                            <p><strong>Reason: </strong>${description}</p>
                            <p>If you believe this action was taken in error or if you have any questions, please contact our support team at <a href="mailto:support@yourcompany.com">support@yourcompany.com</a>.</p>
                            <p>We will be happy to assist you with any concerns you may have.</p>
                            <p>Thank you for your understanding.</p>
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
