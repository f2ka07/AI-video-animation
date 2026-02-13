// Quick test of MiniMax API
require('dotenv').config();

const apiKey = process.env.MINIMAX_API_KEY;
const groupId = process.env.MINIMAX_GROUP_ID;

console.log('=== MiniMax API Test ===');
console.log('API Key:', apiKey ? `${apiKey.substring(0, 15)}...` : 'NOT SET');
console.log('Group ID:', groupId || 'NOT SET');

if (!apiKey || !groupId) {
    console.log('\nError: Missing credentials');
    process.exit(1);
}

async function testAPI() {
    const url = `https://api.minimax.chat/v1/t2a_v2?GroupId=${groupId}`;
    console.log('\nCalling:', url);
    
    const body = {
        model: 'speech-02-hd',
        text: 'Hello, this is a test.',
        stream: false,
        voice_setting: {
            voice_id: 'male-qn-jingying', // Default voice
            speed: 1.0,
            vol: 1.0,
            pitch: 0
        },
        audio_setting: {
            sample_rate: 32000,
            format: 'wav'
        }
    };
    
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(body)
        });
        
        const data = await response.json();
        
        console.log('\n=== Response ===');
        console.log('HTTP Status:', response.status);
        console.log('base_resp:', JSON.stringify(data.base_resp, null, 2));
        
        if (data.base_resp?.status_code === 0) {
            console.log('\nSUCCESS! Audio data received:', data.data?.audio ? 'Yes' : 'No');
        } else {
            console.log('\nFAILED:', data.base_resp?.status_msg);
            console.log('\nPossible issues:');
            console.log('1. API key format is wrong');
            console.log('2. Account needs API access enabled');
            console.log('3. Group ID does not match API key');
            console.log('4. Try generating a new API key from: https://platform.minimaxi.com/');
        }
    } catch (error) {
        console.log('\nNetwork error:', error.message);
    }
}

testAPI();
