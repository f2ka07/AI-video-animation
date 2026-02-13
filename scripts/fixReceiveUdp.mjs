import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const p = path.join(__dirname, '../courses/comprehensive-wireless-networks/content.json');
const data = JSON.parse(fs.readFileSync(p, 'utf8'));

const mod3 = data.modules[2];
const slide = mod3.slides.find((s) => s.name === 'receive-udp-python');
if (!slide) throw new Error('receive-udp-python not found');

delete slide.script;
slide.scripts = [
  'This Python script listens for UDP messages. It binds to a port and waits for incoming data.',
  'When a message arrives, it prints the sender address and content.',
  'This models how wireless devices receive broadcast messages.',
];
slide.code =
  '# Binds to UDP port\nimport socket\n\nreceiver = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)\nreceiver.bind(("0.0.0.0", 5005))\n\nprint("Listening for UDP messages...")\nwhile True:\n    data, addr = receiver.recvfrom(1024)\n    print(f"Received from {addr}: {data.decode()}")';

fs.writeFileSync(p, JSON.stringify(data) + '\n');
console.log('Fixed receive-udp-python: scripts array added');
