// Test OpenAI TTS API
require('dotenv').config();

const apiKey = process.env.OPENAI_API_KEY;

console.log('=== OpenAI TTS Test ===');
console.log('API Key:', apiKey ? `${apiKey.substring(0, 15)}...` : 'NOT SET');

if (!apiKey) {
    console.log('\nError: OPENAI_API_KEY not set');
    process.exit(1);
}

async function testAPI() {
    console.log('\nCalling OpenAI TTS API...');
    
    try {
        const response = await fetch('https://api.openai.com/v1/audio/speech', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'tts-1',
                voice: 'onyx',
                input: 'Hello, this is a test of OpenAI text to speech.',
                response_format: 'mp3'
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.log('Error:', response.status, errorText);
            return;
        }
        
        const audioBuffer = await response.arrayBuffer();
        console.log('\nSUCCESS!');
        console.log('Audio size:', audioBuffer.byteLength, 'bytes');
        console.log('\nOpenAI TTS is working. Available voices:');
        console.log('- alloy (neutral)');
        console.log('- echo (warm male)');
        console.log('- fable (expressive)');
        console.log('- onyx (deep male)');
        console.log('- nova (upbeat female)');
        console.log('- shimmer (professional female)');
        
    } catch (error) {
        console.log('\nNetwork error:', error.message);
    }
}

testAPI();
