
async function testPollinations() {
    const prompt = 'sketch of a suspect, male, 30 years old';
    const encodedPrompt = encodeURIComponent(prompt);
    const url = `https://image.pollinations.ai/prompt/${encodedPrompt}`;
    console.log('Testing URL:', url);
    try {
        const response = await fetch(url);
        if (response.ok) {
            console.log('Success! Image URL:', response.url);
            // Check content type
            console.log('Content-Type:', response.headers.get('content-type'));
        } else {
            console.error('Error:', response.status);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

testPollinations();
