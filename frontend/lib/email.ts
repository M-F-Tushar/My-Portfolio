/**
 * Email Service using Resend
 * 
 * Handles sending emails for the contact form.
 * Configure RESEND_API_KEY in .env.local
 */

// Note: Install Resend with: npm install resend

interface EmailOptions {
    to: string;
    from: string;
    subject: string;
    html: string;
    text?: string;
    replyTo?: string;
}

interface SendEmailResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

/**
 * Send email using Resend API
 */
export async function sendEmail(options: EmailOptions): Promise<SendEmailResult> {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
        console.warn('RESEND_API_KEY not configured. Email not sent.');
        return { 
            success: false, 
            error: 'Email service not configured' 
        };
    }

    try {
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                from: options.from,
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text,
                reply_to: options.replyTo,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to send email');
        }

        const data = await response.json();
        return { 
            success: true, 
            messageId: data.id 
        };
    } catch (error) {
        console.error('Email send error:', error);
        return { 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
        };
    }
}

/**
 * Send contact form notification email
 */
export async function sendContactNotification(data: {
    name: string;
    email: string;
    message: string;
}): Promise<SendEmailResult> {
    const toEmail = process.env.CONTACT_EMAIL || process.env.ADMIN_EMAIL;
    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
    
    if (!toEmail) {
        console.warn('CONTACT_EMAIL not configured. Using fallback logging.');
        return { success: true, messageId: 'logged-only' };
    }

    const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 16px; }
        .label { font-weight: 600; color: #667eea; margin-bottom: 4px; }
        .value { background: white; padding: 12px; border-radius: 4px; border: 1px solid #e5e7eb; }
        .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="margin: 0; font-size: 24px;">📬 New Contact Form Submission</h1>
        </div>
        <div class="content">
            <div class="field">
                <div class="label">From</div>
                <div class="value">${escapeHtml(data.name)}</div>
            </div>
            <div class="field">
                <div class="label">Email</div>
                <div class="value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></div>
            </div>
            <div class="field">
                <div class="label">Message</div>
                <div class="value">${escapeHtml(data.message).replace(/\n/g, '<br>')}</div>
            </div>
        </div>
        <div class="footer">
            <p>This email was sent from your portfolio contact form.</p>
        </div>
    </div>
</body>
</html>
    `;

    const text = `
New Contact Form Submission

From: ${data.name}
Email: ${data.email}

Message:
${data.message}

---
This email was sent from your portfolio contact form.
    `;

    return sendEmail({
        to: toEmail,
        from: fromEmail,
        subject: `Portfolio Contact: ${data.name}`,
        html,
        text,
        replyTo: data.email,
    });
}

/**
 * Escape HTML to prevent XSS in emails
 */
function escapeHtml(text: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (char) => map[char]);
}

export default { sendEmail, sendContactNotification };
