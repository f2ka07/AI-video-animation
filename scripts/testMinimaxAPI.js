// Quick test of MiniMax Direct TTS API (global endpoint)
require('dotenv').config();

const apiKey = process.env.MINIMAX_API_KEY;
const groupId = process.env.MINIMAX_GROUP_ID;

console.log('=== MiniMax API Test ===');
console.log('API Key:', apiKey ? `${apiKey.substring(0, 15)}...` : 'NOT SET');
console.log('Group ID:', groupId || 'NOT SET');

if (!apiKey || !groupId) {
	console.log('\nError: Set MINIMAX_API_KEY and MINIMAX_GROUP_ID in .env');
	process.exit(1);
}

async function testAPI() {
	const url = `https://api.minimax.io/v1/t2a_v2?GroupId=${encodeURIComponent(groupId)}`;
	console.log('\nCalling:', url);

	const body = {
		model: 'speech-02-hd',
		text: 'Hello, this is a test of agentic AI course narration.',
		stream: false,
		output_format: 'hex',
		voice_setting: {
			voice_id: 'English_expressive_narrator',
			speed: 1,
			vol: 1,
			pitch: 0,
		},
		audio_setting: {
			sample_rate: 32000,
			bitrate: 128000,
			format: 'wav',
			channel: 1,
		},
	};

	try {
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify(body),
		});

		const data = await response.json();
		console.log('\nHTTP Status:', response.status);
		console.log('base_resp:', JSON.stringify(data.base_resp, null, 2));

		const audioHex = data.data?.audio || data.audio;
		if (data.base_resp?.status_code === 0 && audioHex) {
			console.log('\nSUCCESS! Audio hex length:', audioHex.length);
		} else {
			console.log('\nFAILED:', data.base_resp?.status_msg || data.status_msg);
		}
	} catch (error) {
		console.log('\nNetwork error:', error.message);
	}
}

testAPI();
