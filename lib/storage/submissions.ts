import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FullReport } from '@/lib/types/report';

const SUBMISSIONS_DIR = path.join(process.cwd(), 'data', 'submissions');

// Ensure submissions directory exists
async function ensureDir() {
  try {
    await fs.mkdir(SUBMISSIONS_DIR, { recursive: true });
  } catch {
    // Directory may already exist
  }
}

// Save a submission
export async function saveSubmission(report: Omit<FullReport, 'id' | 'createdAt'>): Promise<FullReport> {
  await ensureDir();

  const id = uuidv4();
  const createdAt = new Date().toISOString();

  const fullReport: FullReport = {
    ...report,
    id,
    createdAt,
  };

  const filePath = path.join(SUBMISSIONS_DIR, `${id}.json`);
  await fs.writeFile(filePath, JSON.stringify(fullReport, null, 2));

  return fullReport;
}

// Get a submission by ID
export async function getSubmission(id: string): Promise<FullReport | null> {
  try {
    const filePath = path.join(SUBMISSIONS_DIR, `${id}.json`);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data) as FullReport;
  } catch {
    return null;
  }
}

// List all submissions
export async function listSubmissions(): Promise<FullReport[]> {
  await ensureDir();

  try {
    const files = await fs.readdir(SUBMISSIONS_DIR);
    const submissions: FullReport[] = [];

    for (const file of files) {
      if (file.endsWith('.json')) {
        const filePath = path.join(SUBMISSIONS_DIR, file);
        const data = await fs.readFile(filePath, 'utf-8');
        submissions.push(JSON.parse(data));
      }
    }

    // Sort by createdAt descending
    return submissions.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch {
    return [];
  }
}

// Delete a submission
export async function deleteSubmission(id: string): Promise<boolean> {
  try {
    const filePath = path.join(SUBMISSIONS_DIR, `${id}.json`);
    await fs.unlink(filePath);
    return true;
  } catch {
    return false;
  }
}
