import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// GitHub config – reuse env vars
const GITHUB_TOKEN = process.env.HUB_TOKEN;
const GITHUB_REPO = process.env.HUB_REPO || 'devenspear/FutureFast_1.3';
const GITHUB_BRANCH = process.env.HUB_BRANCH || 'main';

export const runtime = 'edge'; // allow form data streaming

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Content = Buffer.from(arrayBuffer).toString('base64');

    // Generate unique filename preserving extension
    const extMatch = /\.([a-zA-Z0-9]+)$/.exec(file.name || '');
    const ext = extMatch ? extMatch[1] : 'png';
    const fileName = `${uuidv4()}.${ext}`;
    const filePath = `public/uploads/${fileName}`;

    if (!GITHUB_TOKEN) {
      // Fallback: save locally (development) – Node fs is not available in edge runtime, so return error
      return NextResponse.json({ error: 'Server not configured for uploads (missing GITHUB_TOKEN)' }, { status: 500 });
    }

    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;

    const createResponse = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `📸 Add thumbnail ${fileName}`,
        content: base64Content,
        branch: GITHUB_BRANCH,
      }),
    });

    if (!createResponse.ok) {
      const err = await createResponse.json();
      return NextResponse.json({ error: err.message || 'GitHub upload failed' }, { status: 500 });
    }

    // The deployed site will serve /uploads from public
    const imageUrl = `/uploads/${fileName}`;
    return NextResponse.json({ imageUrl, committed: true });
  } catch (error) {
    console.error('Upload error:', error);
    const msg = error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
