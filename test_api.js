
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '.env');
const envConfig = fs.readFileSync(envPath, 'utf8');

const env = {};
envConfig.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
        env[key.trim()] = value.trim().replace(/"/g, '');
    }
});

const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = env.VITE_SUPABASE_PUBLISHABLE_KEY;

async function testGenerate() {
    console.log('Testing generate-composite...');
    console.log('URL:', `${SUPABASE_URL}/functions/v1/generate-composite`);
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
