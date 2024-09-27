// app/api/emotion/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const response = await fetch("https://api.apilayer.com/text_to_emotion", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': '5O9CNlYFos7WYF6FV5fIsDBWJRb3tE01',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error from emotion API:', errorData);
      return NextResponse.json({ error: errorData.message || 'Error from emotion API' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Error in emotion analysis:', error);
    console.error('Error details:', error.message, error.stack);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
