// Auto-generated course content by activateCourse API
// Course: Comprehensive Wireless Networks
// Course ID: comprehensive-wireless-networks
// Activated: 2026-02-07T03:22:33.429Z

export interface SlideContent {
	name: string;
	type: "title" | "content-two-card" | "content-single" | "code" | "code-diagram" | "comparison";
	script: string;
	title?: string;
	subtitle?: string;
	points?: string[];
	code?: string;
	language?: string;
	imageSrc?: string;
	leftTitle?: string;
	leftItems?: string[];
	rightTitle?: string;
	rightItems?: string[];
	scene?: string;
}

export interface ModuleContent {
	moduleNumber: number;
	courseId: string;
	title: string;
	subtitle: string;
	slides: SlideContent[];
}

export const module1Content: ModuleContent = {
	moduleNumber: 1,
	courseId: "comprehensive-wireless-networks",
	title: "Introduction to Wireless Networks",
	subtitle: "Module 1: Understanding Wireless Networking Fundamentals",
	slides: [
		{
			name: "intro-wireless-networks",
			type: "title",
			script: "Wireless networks let devices communicate without wires, using radio waves. This module explores what wireless networks are, why they matter, and the basic components involved. You'll learn how wireless technology connects us seamlessly in everyday life.",
			title: "Introduction to Wireless Networks",
			points: ["Wireless networks use radio waves","Devices communicate without wires","Basic components involved","Wireless technology connects us"],
		},
		{
			name: "wireless-networks-why-important",
			type: "content-two-card",
			script: "Wireless networks are important because they provide mobility, flexibility, and ease of installation. They enable devices like smartphones and laptops to connect anywhere. This freedom powers modern communication, smart homes, and IoT devices that rely on wireless connectivity.",
			title: "Why Wireless Networks Matter",
			points: ["Provide mobility and flexibility","Enable connection anywhere","Power modern communication","Support smart homes and IoT"],
		},
		{
			name: "wireless-network-components",
			type: "content-two-card",
			script: "Wireless networks consist of key components: access points that broadcast signals, client devices that connect, and routers that manage traffic. These parts work together to create a wireless environment where data flows without cables.",
			title: "Key Components of Wireless Networks",
			points: ["Access points broadcast signals","Client devices connect","Routers manage traffic","Parts create wireless environment"],
		},
		{
			name: "simple-wireless-connection-python",
			type: "code",
			script: "This Python script scans for available Wi-Fi networks using the platform's wireless tools. First, it runs a system command to list networks. Then, it parses and prints the network names, helping you see nearby wireless options.",
			title: "Scan Wi-Fi Networks with Python",
			code: "import subprocess\n\n# Run system command to scan Wi-Fi networks\nresult = subprocess.run(['nmcli', '-t', '-f', 'SSID', 'device', 'wifi', 'list'], stdout=subprocess.PIPE)\n\n# Decode and split output\nnetworks = result.stdout.decode().split('\\n')\n\n# Print available networks\nfor network in networks:\n    if network:\n        print(f'Found network: {network}')",
			language: "python",
		},
		{
			name: "explain-python-wifi-scan",
			type: "content-two-card",
			script: "This code runs a command-line tool to list Wi-Fi networks. It captures the output, decodes it from bytes to text, and separates each network name. Finally, it prints each network. This shows how software can interact with wireless hardware to discover networks.",
			title: "How the Wi-Fi Scan Code Works",
			points: ["Runs command-line Wi-Fi scan","Captures and decodes output","Separates network names","Prints each discovered network"],
		},
		{
			name: "wireless-standards-overview",
			type: "content-two-card",
			script: "Wireless networks follow standards like IEEE 802.11, which define how devices communicate. Different versions such as 802.11b, g, n, and ac vary in speed and range. Understanding these standards helps you choose the right wireless technology for your needs.",
			title: "Wireless Networking Standards",
			points: ["Follow IEEE 802.11 standards","Different versions: b, g, n, ac","Vary in speed and range","Choose technology wisely"],
		},
		{
			name: "wifi-standard-comparison",
			type: "comparison",
			script: "Let's compare popular Wi-Fi standards to see their differences in speed and range. This helps clarify why newer standards improve performance and support more devices simultaneously.",
			title: "Comparing Wi-Fi Standards",
			leftTitle: "802.11b/g",
			leftItems: ["Speed up to 54 Mbps","Range up to 100 meters","Older and widely supported","Lower throughput"],
			rightTitle: "802.11n/ac",
			rightItems: ["Speed up to 1 Gbps","Range up to 250 meters","Modern with MIMO tech","Higher throughput and capacity"],
		},
	]
};

export const module2Content: ModuleContent = {
	moduleNumber: 2,
	courseId: "comprehensive-wireless-networks",
	title: "Wireless Network Configuration and Security",
	subtitle: "Module 2: Setting Up and Securing Wireless Networks",
	slides: [
		{
			name: "wireless-network-configuration",
			type: "content-two-card",
			script: "Configuring a wireless network involves setting the SSID, choosing security protocols, and managing channels. Proper setup ensures reliable connections and prevents interference. We'll explore common configuration steps to get your network running smoothly.",
			title: "Wireless Network Configuration Basics",
			points: ["Set SSID (network name)","Choose security protocols","Manage wireless channels","Ensure reliable connections"],
		},
		{
			name: "wifi-security-protocols",
			type: "content-two-card",
			script: "Wireless security protects your network from unauthorized access. Common protocols include WEP, WPA, and WPA2. WPA2 is currently the most secure widely used standard, encrypting data to keep communications private and safe.",
			title: "Wireless Security Protocols",
			points: ["Protect network from intruders","Common protocols: WEP, WPA, WPA2","WPA2 is most secure","Encrypts wireless data"],
		},
		{
			name: "configure-wifi-ap-python",
			type: "code",
			script: "This Python example uses the 'subprocess' module to configure a wireless access point on Linux. It sets the SSID and password via 'nmcli' commands, demonstrating how scripts can automate network setup tasks.",
			title: "Configure Wireless Access Point with Python",
			code: "import subprocess\n\nssid = 'MyNetwork'\npassword = 'SecurePass123'\n\n# Set SSID\nsubprocess.run(['nmcli', 'device', 'wifi', 'hotspot', 'ifname', 'wlan0', 'ssid', ssid, 'password', password])\nprint(f'Configured AP with SSID: {ssid}')",
			language: "python",
		},
		{
			name: "explain-configure-ap-script",
			type: "content-two-card",
			script: "This script sets up a Wi-Fi hotspot by running a system command. It specifies the network interface, SSID, and password. Automating these steps makes configuring networks faster and reduces errors compared to manual setup.",
			title: "How the Access Point Script Works",
			points: ["Runs system command to set hotspot","Specifies network interface wlan0","Defines SSID and password","Automates network setup"],
		},
		{
			name: "wireless-channel-management",
			type: "content-two-card",
			script: "Wireless channels are frequency bands that networks use to communicate. Choosing the right channel reduces interference from other networks nearby. Tools can scan channels to find the least crowded one, improving connection quality.",
			title: "Managing Wireless Channels",
			points: ["Channels are frequency bands","Reduce interference by selection","Scan for least crowded channel","Improve connection quality"],
		},
		{
			name: "scan-wireless-channels-python",
			type: "code",
			script: "This Python code scans available Wi-Fi channels and shows their signal strengths. It helps identify which channels are crowded so you can pick a better one for your network.",
			title: "Scan Wi-Fi Channels with Python",
			code: "import subprocess\n\nresult = subprocess.run(['iwlist', 'wlan0', 'scan'], stdout=subprocess.PIPE)\noutput = result.stdout.decode()\n\nchannels = []\nfor line in output.split('\\n'):\n    if 'Channel:' in line:\n        channels.append(line.strip())\n\nprint('Detected Wi-Fi Channels:')\nfor ch in channels:\n    print(ch)",
			language: "python",
		},
		{
			name: "explain-channel-scan-code",
			type: "content-two-card",
			script: "The code runs a wireless scan command and decodes its output. It searches for lines mentioning 'Channel:' to collect channel info. Printing this lets you see which frequencies wireless devices nearby use, guiding your channel choice.",
			title: "How the Channel Scan Code Works",
			points: ["Runs wireless scan command","Decodes command output","Finds lines with 'Channel:'","Lists detected channels"],
		},
	]
};

export const module3Content: ModuleContent = {
	moduleNumber: 3,
	courseId: "comprehensive-wireless-networks",
	title: "Wireless Network Protocols and Data Transmission",
	subtitle: "Module 3: Understanding Protocols and How Data Moves Wirelessly",
	slides: [
		{
			name: "wireless-protocols-overview",
			type: "content-two-card",
			script: "Wireless protocols define rules for communication. They ensure data is sent and received correctly over the air. Examples include Wi-Fi protocols like 802.11 standards and Bluetooth. Understanding these helps you grasp how devices talk wirelessly.",
			title: "Wireless Network Protocols",
			points: ["Protocols define communication rules","Ensure correct data transmission","Examples: Wi-Fi and Bluetooth","Devices talk wirelessly"],
		},
		{
			name: "wireless-data-transmission-concepts",
			type: "content-two-card",
			script: "Data travels wirelessly in packets, small chunks of information. Protocols control packet size, timing, and error checking. This organized flow keeps wireless communication efficient and reliable despite interference or obstacles.",
			title: "How Data Transmits Wirelessly",
			points: ["Data sent in packets","Protocols control packet flow","Include error checking","Ensure efficient communication"],
		},
		{
			name: "send-receive-udp-python",
			type: "code",
			script: "This Python example demonstrates sending and receiving data over a wireless network using UDP sockets. One script sends a message, and another listens and prints it, showing basic wireless data transmission in action.",
			title: "Send and Receive Data with UDP in Python",
			code: "import socket\n\n# Sender\nsender = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)\nmessage = b'Hello Wireless World'\ndest = ('192.168.1.255', 5005)  # Broadcast address\nsender.sendto(message, dest)\nsender.close()",
			language: "python",
		},
		{
			name: "explain-udp-send-code",
			type: "content-two-card",
			script: "This code creates a UDP socket to send a broadcast message. It defines the broadcast IP and port, then sends a simple text message. UDP is connectionless, making it fast for real-time wireless communication but without guaranteed delivery.",
			title: "How the UDP Send Code Works",
			points: ["Creates UDP socket","Sends broadcast message","Uses IP and port","Fast but no delivery guarantee"],
		},
		{
			name: "receive-udp-python",
			type: "code",
			script: "Here is the listening Python script for UDP. It binds to a port and waits for messages. When a message arrives, it prints the sender’s address and the content, illustrating simple wireless reception.",
			title: "Receive UDP Messages in Python",
			code: "import socket\n\nreceiver = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)\nreceiver.bind(('0.0.0.0', 5005))\n\nprint('Listening for UDP messages...')\nwhile True:\n    data, addr = receiver.recvfrom(1024)\n    print(f'Received from {addr}: {data.decode()}')",
			language: "python",
		},
		{
			name: "explain-udp-receive-code",
			type: "content-two-card",
			script: "This script listens on a UDP port for incoming messages. It waits indefinitely and prints information when data arrives. This models how wireless devices can receive broadcast messages without needing a fixed connection.",
			title: "How the UDP Receive Code Works",
			points: ["Binds to UDP port","Waits for incoming messages","Prints sender and content","Models connectionless reception"],
		},
		{
			name: "wireless-errors-and-corrections",
			type: "content-two-card",
			script: "Wireless data can be corrupted by noise or interference. Protocols use error detection and correction techniques such as checksums and retransmissions to ensure data integrity. This keeps wireless communication reliable even in noisy environments.",
			title: "Error Handling in Wireless Networks",
			points: ["Data can be corrupted","Use checksums for detection","Retransmit on errors","Ensure data integrity"],
		},
	]
};

export const module4Content: ModuleContent = {
	moduleNumber: 4,
	courseId: "comprehensive-wireless-networks",
	title: "Advanced Wireless Networking Concepts and IoT Integration",
	subtitle: "Module 4: Exploring Advanced Topics and Internet of Things",
	slides: [
		{
			name: "mesh-networks-intro",
			type: "content-two-card",
			script: "Mesh networks consist of multiple nodes that connect directly and dynamically. This creates a self-healing system where data routes through various paths, improving coverage and reliability compared to traditional wireless networks.",
			title: "Introduction to Mesh Networks",
			points: ["Multiple nodes connect dynamically","Self-healing network system","Data routes through many paths","Improves coverage and reliability"],
		},
		{
			name: "mesh-network-python-example",
			type: "code",
			script: "This Python example simulates a simple mesh node communicating with neighbors. It sends messages to nodes in its list and listens for incoming ones, illustrating basic mesh communication principles.",
			title: "Simulate Mesh Node Communication in Python",
			code: "import socket\nimport threading\n\nneighbors = [('192.168.1.2', 5005), ('192.168.1.3', 5005)]\n\nsock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)\nsock.bind(('0.0.0.0', 5005))\n\ndef listen():\n    while True:\n        data, addr = sock.recvfrom(1024)\n        print(f'Message from {addr}: {data.decode()}')\n\ndef send_to_neighbors(msg):\n    for n in neighbors:\n        sock.sendto(msg.encode(), n)\n\nthreading.Thread(target=listen, daemon=True).start()\nsend_to_neighbors('Hello from mesh node')",
			language: "python",
		},
		{
			name: "explain-mesh-python-code",
			type: "content-two-card",
			script: "This script starts a UDP socket to listen for messages and sends a greeting to neighbor nodes. Using threads allows simultaneous listening and sending. This models how mesh nodes exchange data dynamically to maintain the network.",
			title: "How the Mesh Node Script Works",
			points: ["Starts UDP socket for listening","Sends message to neighbors","Uses threading for concurrency","Models dynamic mesh communication"],
		},
		{
			name: "iot-wireless-integration",
			type: "content-two-card",
			script: "Wireless networks are essential for Internet of Things devices, which connect sensors and appliances. Protocols like Zigbee and LoRa enable low-power, long-range communication, allowing IoT systems to operate efficiently and reliably.",
			title: "Wireless Networks in IoT",
			points: ["Connect sensors and appliances","Use protocols like Zigbee and LoRa","Enable low-power communication","Support efficient IoT systems"],
		},
		{
			name: "zigbee-communication-python-example",
			type: "code",
			script: "This example shows how to send a message over a Zigbee network using a Python library. It initializes the Zigbee device and sends data to a target node, demonstrating wireless IoT communication basics.",
			title: "Send Zigbee Message with Python",
			code: "from digi.xbee.devices import XBeeDevice\n\nPORT = '/dev/ttyUSB0'\nBAUD_RATE = 9600\n\ndevice = XBeeDevice(PORT, BAUD_RATE)\ndevice.open()\n\nremote_device = device.get_network().discover_device('0013A20040B41234')\nif remote_device:\n    device.send_data(remote_device, 'Hello Zigbee')\n    print('Message sent')\ndevice.close()",
			language: "python",
		},
		{
			name: "explain-zigbee-python-code",
			type: "content-two-card",
			script: "This code opens communication with a Zigbee device on a serial port. It discovers a remote device by address and sends a text message if found. This example highlights how Python can control wireless IoT devices.",
			title: "How the Zigbee Code Works",
			points: ["Opens Zigbee device connection","Discovers remote device","Sends message if device found","Controls wireless IoT devices"],
		},
		{
			name: "advanced-wireless-security",
			type: "content-two-card",
			script: "Advanced wireless security includes WPA3 and enterprise authentication methods. These offer stronger encryption and protect against modern threats, crucial for business and IoT environments where data privacy is vital.",
			title: "Advanced Wireless Security",
			points: ["Includes WPA3 protocols","Uses enterprise authentication","Offers stronger encryption","Protects data privacy"],
		},
		{
			name: "module-summary-wireless-advanced",
			type: "content-two-card",
			script: "This module covered mesh networking, IoT wireless protocols, and advanced security. These topics demonstrate how wireless technology evolves to meet demanding applications, offering flexibility, scalability, and safety.",
			title: "Module Summary: Advanced Wireless Topics",
			points: ["Mesh networking concepts","IoT wireless protocols","Advanced security methods","Flexible and scalable tech"],
		},
	]
};

export const allModules: ModuleContent[] = [
	module1Content,
	module2Content,
	module3Content,
	module4Content
];