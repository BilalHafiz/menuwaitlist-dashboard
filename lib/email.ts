import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // ✅ Correct Gmail SMTP host
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER, // ✅ SMTP Gmail account
      pass: process.env.EMAIL_PASS, // ✅ App password
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM, // ✅ Can be same as EMAIL_USER or delegated
    to,
    subject,
    html,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error("Email sending failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export function generateTestFlightEmailHTML(
  recipientName: string,
  testFlightLink?: string,
  customMessage?: string
): string {
  // Determine if this is a TestFlight invitation or custom message
  const isTestFlight = testFlightLink && testFlightLink.trim();
  const isCustomMessage = customMessage && customMessage.trim();

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${isTestFlight ? "TestFlight Invitation" : "Message"}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f8f9fa;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .cta-button {
          display: inline-block;
          background: #007AFF;
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          color: #666;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${isTestFlight ? "🚀 TestFlight Invitation" : "📧 Message"}</h1>
        <p>${
          isTestFlight
            ? "You're invited to test our app!"
            : "You have a new message"
        }</p>
      </div>
      
      <div class="content">
        <h2>Hello ${recipientName || "there"}!</h2>
        
        ${
          isTestFlight
            ? `
          <p>Great news! You've been selected to participate in our app's beta testing program.</p>
          
          <p>To get started:</p>
          <ol>
            <li>Click the button below to join TestFlight</li>
            <li>Install the TestFlight app if you haven't already</li>
            <li>Download and test our app</li>
            <li>Share your feedback with us!</li>
          </ol>
          
          <div style="text-align: center;">
            <a href="${testFlightLink}" class="cta-button">
              Join TestFlight
            </a>
          </div>
          
          <p><strong>What to expect:</strong></p>
          <ul>
            <li>Early access to new features</li>
            <li>Ability to provide feedback directly to our team</li>
            <li>Help shape the future of our app</li>
          </ul>
        `
            : `
          <div style="background: white; padding: 20px; border-radius: 8px; border-left: 4px solid #007AFF;">
            <p style="margin: 0; font-size: 16px; line-height: 1.6;">${customMessage}</p>
          </div>
        `
        }
        
        <p>If you have any questions or need help, just reply to this email!</p>
        
        <p>Best regards,<br>The Development Team</p>
      </div>
      
      <div class="footer">
        <p>${
          isTestFlight
            ? "This is a beta testing invitation. Please do not share this link publicly."
            : "This message was sent to you from our waitlist system."
        }</p>
      </div>
    </body>
    </html>
  `;
}
