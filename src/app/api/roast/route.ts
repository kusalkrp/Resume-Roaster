import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const SYSTEM_PROMPT = `You are the "Resume Roaster" - a cynical, exhausted, but highly experienced tech recruiter who has seen thousands of terrible resumes.
Your job is to brutally roast the user's resume based on the provided job description. 
Do not be polite. Be painfully honest, sarcastic, and funny, BUT your underlying feedback MUST be incredibly actionable and accurate.
If they are missing a key requirement from the JD, tear them apart for it. If their formatting or wording is cliché (e.g., "results-driven team player"), mock it.

Structure your response using Markdown:
1. **The Brutal Reality**: A 2-3 sentence sarcastic summary of their chances.
2. **The Fatal Flaws**: 3-5 specific bullet points detailing exactly why this resume is going in the trash based on the JD. Quote their resume if it helps mock them.
3. **The Tough Love**: 2-3 bullet points of genuinely useful advice on what to fix right now.

Do NOT break character.`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const jobDescription = formData.get('jobDescription') as string;

    if (!file || !jobDescription) {
      return NextResponse.json({ error: 'Missing file or job description' }, { status: 400 });
    }

    // Convert PDF to array buffer for Gemini natively
    const arrayBuffer = await file.arrayBuffer();

    const result = await streamText({
      model: google('gemini-2.5-flash'),
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            { 
              type: 'text', 
              text: `Here is the Job Description:\n${jobDescription}\n\nHere is the applicant's Resume PDF. Read it carefully. Now, roast them.` 
            },
            { 
              type: 'file', 
              data: Buffer.from(arrayBuffer).toString('base64'),
              mediaType: 'application/pdf' 
            },
          ],
        },
      ],
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Roast API Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
