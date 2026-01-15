// Quick script to check if Gentle is running and accessible
// Run: npm run check-gentle

async function checkGentle() {
	const gentleUrl = process.env.GENTLE_URL || "http://localhost:8765";
	
	console.log(`Checking Gentle at ${gentleUrl}...\n`);

	try {
		const response = await fetch(gentleUrl);
		
		if (response.ok) {
			console.log("✅ Gentle is running and accessible!");
			console.log(`   URL: ${gentleUrl}\n`);
			console.log("You can now run:");
			console.log("   npm run extract-timings -- --gentle\n");
			return true;
		} else {
			console.log(`❌ Gentle responded with status ${response.status}`);
			console.log("   Make sure Gentle is running:\n");
			console.log("   Docker: docker run -p 8765:8765 lowerquality/gentle");
			console.log("   Or:     docker-compose up -d\n");
			return false;
		}
	} catch (error: any) {
		console.log("❌ Cannot connect to Gentle");
		console.log(`   Error: ${error.message}\n`);
		console.log("Gentle is not running. Start it with:\n");
		console.log("   # Using Docker:");
		console.log("   docker run -d -p 8765:8765 --name gentle lowerquality/gentle\n");
		console.log("   # Or using docker-compose:");
		console.log("   docker-compose up -d\n");
		console.log("   # Or check if it's already running:");
		console.log("   docker ps | grep gentle\n");
		return false;
	}
}

checkGentle().catch(console.error);
