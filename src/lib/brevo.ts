// Integration logic for Brevo (formerly Sendinblue) Transactional Email API
// This code runs on the backend (Express server) to prevent exposing the API key to the client.

export interface LeadSubmission {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
}

export async function sendEmailWithBrevo(lead: LeadSubmission) {
  const apiKey = process.env.BREVO_API_KEY;
  const toEmail = process.env.BREVO_TO_EMAIL || "info@bridgeportdentists.com";
  const fromEmail = process.env.BREVO_FROM_EMAIL || "noreply@bridgeportdentists.com";
  const fromName = process.env.BREVO_FROM_NAME || "Bridgeport Dentists";

  if (!apiKey) {
    console.warn("⚠️ BREVO_API_KEY is not defined. Simulating local email delivery.");
    return {
      success: true,
      message: "Simulation: Email processed successfully in local environment."
    };
  }

  const payload = {
    sender: {
      name: fromName,
      email: fromEmail
    },
    to: [
      {
        email: toEmail,
        name: fromName
      }
    ],
    replyTo: {
      email: lead.email,
      name: lead.name
    },
    subject: `New Dental Lead - ${lead.service} - ${lead.name}`,
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Dental Appointment Lead</title>
        <style>
          body { font-family: sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; background-color: #ffffff; }
          .header { border-bottom: 2px solid #0f4c81; padding-bottom: 12px; margin-bottom: 20px; }
          .header h2 { color: #0f4c81; margin: 0; }
          .field { margin-bottom: 16px; }
          .label { font-weight: bold; color: #4a5568; font-size: 14px; text-transform: uppercase; margin-bottom: 4px; }
          .value { font-size: 16px; color: #1a202c; padding: 8px; background-color: #f7fafc; border-radius: 4px; }
          .footer { margin-top: 30px; font-size: 12px; color: #718096; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>New Dental Appointment Lead</h2>
            <p>A user submitted a new contact/booking request from the Bridgeport Dentists website.</p>
          </div>
          
          <div class="field">
            <div class="label">Patient Name</div>
            <div class="value">${lead.name}</div>
          </div>
          
          <div class="field">
            <div class="label">Phone Number</div>
            <div class="value"><a href="tel:${lead.phone}">${lead.phone}</a></div>
          </div>
          
          <div class="field">
            <div class="label">Email Address</div>
            <div class="value"><a href="mailto:${lead.email}">${lead.email}</a></div>
          </div>
          
          <div class="field">
            <div class="label">Requested Service</div>
            <div class="value">${lead.service}</div>
          </div>
          
          <div class="field">
            <div class="label">Patient Message / Symptoms</div>
            <div class="value" style="white-space: pre-wrap;">${lead.message || "No additional comments provided."}</div>
          </div>
          
          <div class="footer">
            <p>Sent securely from the Bridgeport Dentists Lead Generation Platform.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": apiKey
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Brevo API responded with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    return {
      success: true,
      message: "Lead successfully submitted to the medical coordinator.",
      messageId: data.messageId
    };
  } catch (error: any) {
    console.error("❌ Error sending email via Brevo API:", error);
    return {
      success: false,
      error: error.message || "Unknown error during email transmission."
    };
  }
}
