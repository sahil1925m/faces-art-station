
import dotenv from 'dotenv';
dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

async function testGenerate() {
  console.log('Testing generate-composite...');
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/generate-composite`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ prompt: 'test prompt' }),
    });

    if (!response.ok) {
        console.error('Error status:', response.status);
        const text = await response.text();
        console.error('Error body:', text);
    } else {
        const data = await response.json();
        console.log('Success:', data);
    }
  } catch (error) {
    console.error('Fetch error:', error);
  }
}

testGenerate();
