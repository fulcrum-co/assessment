# Organizational Leverage Diagnostic

A web-based diagnostic assessment system that evaluates organizational operational leverage across six key dimensions and generates personalized PDF reports.

## Features

- **38-Question Multi-Step Form**: Comprehensive assessment covering organizational context, strategic clarity, execution capability, operational infrastructure, capacity model, advisory experience, leverage opportunity, and readiness
- **Six-Dimension Scoring Engine**: Calculates scores for Strategic Clarity, Execution Gap, Operational Maturity, Capacity & Team Model, Advisory Readiness, and Leverage Opportunity
- **Pattern Detection**: Automatically identifies critical patterns like Founder Trap, Planning Theater, Tool Sprawl, Shelf Consultant, and Capacity Crisis
- **Personalized PDF Report**: 5-page executive report with radar charts, findings, recommendations, and benchmarks
- **Email Delivery**: Automatic report delivery via Resend
- **Lead Capture**: Submissions stored as JSON for follow-up

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **PDF Generation**: @react-pdf/renderer
- **Email**: Resend
- **Validation**: Zod
- **Charts**: recharts (for PDF radar charts)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd fulcrum-assessment
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file and configure:
   ```bash
   cp .env.example .env.local
   ```

4. Edit `.env.local` with your values:
   ```
   RESEND_API_KEY=re_xxxxx
   FROM_EMAIL=diagnostic@yourdomain.com
   NOTIFICATION_EMAIL=admin@yourdomain.com
   BASE_URL=http://localhost:3000
   ```

5. Add Satoshi font files to `/public/fonts/`:
   - Satoshi-Regular.woff2
   - Satoshi-Medium.woff2
   - Satoshi-SemiBold.woff2
   - Satoshi-Bold.woff2

6. Run the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Redirect to /diagnostic
│   ├── diagnostic/
│   │   ├── page.tsx            # Multi-step form
│   │   └── complete/
│   │       └── page.tsx        # Confirmation page
│   └── api/
│       ├── submit/
│       │   └── route.ts        # Form submission handler
│       └── report/
│           └── [id]/
│               └── route.ts    # PDF download endpoint
├── components/
│   ├── ui/                     # Reusable UI components
│   ├── diagnostic/             # Form components
│   └── report/                 # PDF report components
├── lib/
│   ├── types/                  # TypeScript types
│   ├── questions.ts            # Question definitions
│   ├── scoring/                # Scoring engine
│   ├── content/                # Report content generation
│   ├── pdf/                    # PDF generation
│   ├── email/                  # Email sending
│   ├── storage/                # JSON storage
│   └── validation/             # Zod schemas
├── data/
│   └── submissions/            # Stored submissions (JSON)
└── public/
    └── fonts/                  # Satoshi font files
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `RESEND_API_KEY` | Resend API key for email delivery | Yes |
| `FROM_EMAIL` | Sender email address | Yes |
| `NOTIFICATION_EMAIL` | Admin notification email | Yes |
| `BASE_URL` | Base URL for report download links | Yes |

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Configure environment variables
4. Deploy

The `vercel.json` configuration extends function timeouts for PDF generation.

### Manual Deployment

```bash
npm run build
npm start
```

## API Endpoints

### POST /api/submit

Submits diagnostic responses, calculates scores, generates PDF, and sends email.

**Request Body**: Complete `DiagnosticResponses` object

**Response**:
```json
{
  "success": true,
  "id": "uuid",
  "overallScore": 65
}
```

### GET /api/report/[id]

Downloads the PDF report for a submission.

**Response**: PDF file attachment

## Scoring Dimensions

1. **Strategic Clarity Index** (16 points max)
   - How well strategy guides decisions

2. **Execution Gap Index** (21 points max)
   - Ability to translate plans to results

3. **Operational Maturity Index** (20 points max)
   - Systems and process maturity

4. **Capacity & Team Model Index** (20 points max)
   - Team structure and bandwidth

5. **Advisory Readiness Index** (5 points max)
   - Experience with external support

6. **Leverage Opportunity Index** (12 points max)
   - Awareness of growth multiplication

## License

Private - Fulcrum Collective
