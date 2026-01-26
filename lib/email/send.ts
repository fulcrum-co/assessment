import { Resend } from 'resend';
import { ContactInfo } from '@/lib/types/diagnostic';
import { DimensionScores } from '@/lib/types/scores';

// Lazy initialize Resend to avoid build-time errors when API key is not set
let resendClient: Resend | null = null;

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'diagnostic@fulcrumcollective.io';
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || 'joe@fulcrumcollective.io';
const BASE_URL = process.env.BASE_URL || 'https://diagnostic.fulcrumcollective.io';

interface SendReportEmailParams {
  contact: ContactInfo;
  scores: DimensionScores;
  reportId: string;
  pdfBuffer: Buffer;
}

// Send report to the user
export async function sendReportEmail({
  contact,
  scores,
  reportId,
  pdfBuffer,
}: SendReportEmailParams): Promise<{ success: boolean; error?: string }> {
  const resend = getResendClient();
  if (!resend) {
    console.warn('Resend API key not configured, skipping email');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const downloadUrl = `${BASE_URL}/api/report/${reportId}`;

    await resend.emails.send({
      from: `Fulcrum Collective <${FROM_EMAIL}>`,
      to: contact.email,
      subject: `Your Organizational Leverage Diagnostic Report - ${contact.companyName}`,
      attachments: [
        {
          filename: `${contact.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_Diagnostic_Report.pdf`,
          content: pdfBuffer,
        },
      ],
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; margin-bottom: 24px; }
            .score-box { background: #f9fafb; padding: 24px; border-radius: 8px; text-align: center; margin: 24px 0; }
            .score { font-size: 48px; font-weight: bold; color: #2563eb; }
            .score-label { font-size: 14px; color: #6b7280; }
            .button { display: inline-block; background: #1a1a1a; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; margin: 16px 0; }
            .footer { border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 32px; font-size: 14px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1 style="margin: 0; font-size: 24px;">Organizational Leverage Diagnostic</h1>
            <p style="margin: 8px 0 0; color: #6b7280;">Fulcrum Collective</p>
          </div>

          <p>Hi ${contact.name},</p>

          <p>Thank you for completing the Organizational Leverage Diagnostic. Your personalized report is attached to this email.</p>

          <div class="score-box">
            <div class="score">${scores.overall}</div>
            <div class="score-label">Organizational Leverage Score</div>
          </div>

          <p>Your report includes:</p>
          <ul>
            <li>Detailed analysis across six dimensions</li>
            <li>Pattern identification and key findings</li>
            <li>Benchmark comparison with similar organizations</li>
            <li>Prioritized recommendations for the next 90 days</li>
          </ul>

          <p>You can also download your report anytime:</p>
          <p><a href="${downloadUrl}" class="button">Download Report</a></p>

          <p>If you indicated interest in a conversation, we'll be in touch soon to schedule a diagnostic review call.</p>

          <div class="footer">
            <p><strong>Fulcrum Collective</strong><br>
            Strategy-to-Execution Partnership for SMB Leaders<br>
            <a href="https://fulcrumcollective.io">fulcrumcollective.io</a></p>
          </div>
        </body>
        </html>
      `,
      text: `
Organizational Leverage Diagnostic
Fulcrum Collective

Hi ${contact.name},

Thank you for completing the Organizational Leverage Diagnostic. Your personalized report is attached to this email.

Your Organizational Leverage Score: ${scores.overall}/100

Your report includes:
- Detailed analysis across six dimensions
- Pattern identification and key findings
- Benchmark comparison with similar organizations
- Prioritized recommendations for the next 90 days

You can also download your report anytime: ${downloadUrl}

If you indicated interest in a conversation, we'll be in touch soon to schedule a diagnostic review call.

---
Fulcrum Collective
Strategy-to-Execution Partnership for SMB Leaders
fulcrumcollective.io
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to send report email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

// Send notification to admin about new submission
export async function sendNotificationEmail({
  contact,
  scores,
  reportId,
}: Omit<SendReportEmailParams, 'pdfBuffer'>): Promise<void> {
  const resend = getResendClient();
  if (!resend) {
    console.warn('Resend API key not configured, skipping notification email');
    return;
  }

  try {
    const downloadUrl = `${BASE_URL}/api/report/${reportId}`;

    await resend.emails.send({
      from: `Fulcrum Diagnostic <${FROM_EMAIL}>`,
      to: NOTIFICATION_EMAIL,
      subject: `New Diagnostic Submission: ${contact.companyName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 20px; }
            .info-row { display: flex; border-bottom: 1px solid #e5e7eb; padding: 8px 0; }
            .label { font-weight: bold; width: 140px; }
            .score-box { background: #f9fafb; padding: 16px; border-radius: 8px; margin: 16px 0; }
          </style>
        </head>
        <body>
          <h1>New Diagnostic Submission</h1>

          <div class="info-row">
            <span class="label">Name:</span>
            <span>${contact.name}</span>
          </div>
          <div class="info-row">
            <span class="label">Email:</span>
            <span>${contact.email}</span>
          </div>
          <div class="info-row">
            <span class="label">Company:</span>
            <span>${contact.companyName}</span>
          </div>
          <div class="info-row">
            <span class="label">Role:</span>
            <span>${contact.role}</span>
          </div>

          <div class="score-box">
            <strong>Overall Score:</strong> ${scores.overall}/100<br>
            <strong>Strategic Clarity:</strong> ${scores.strategicClarity.score}/${scores.strategicClarity.maxScore} (${scores.strategicClarity.status})<br>
            <strong>Execution:</strong> ${scores.executionGap.score}/${scores.executionGap.maxScore} (${scores.executionGap.status})<br>
            <strong>Operations:</strong> ${scores.operationalMaturity.score}/${scores.operationalMaturity.maxScore} (${scores.operationalMaturity.status})<br>
            <strong>Capacity:</strong> ${scores.capacityModel.score}/${scores.capacityModel.maxScore} (${scores.capacityModel.status})<br>
            <strong>Advisory:</strong> ${scores.advisoryReadiness.score}/${scores.advisoryReadiness.maxScore} (${scores.advisoryReadiness.status})<br>
            <strong>Leverage:</strong> ${scores.leverageOpportunity.score}/${scores.leverageOpportunity.maxScore} (${scores.leverageOpportunity.status})
          </div>

          <p><a href="${downloadUrl}">Download Report</a></p>
        </body>
        </html>
      `,
    });
  } catch (error) {
    console.error('Failed to send notification email:', error);
    // Don't throw - notification failure shouldn't block the submission
  }
}
