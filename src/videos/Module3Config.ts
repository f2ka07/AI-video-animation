// Configuration for Module 3 video
// Auto-generated from moduleContent.ts - DO NOT EDIT MANUALLY

import { getAudioDuration } from "../utils/audioDuration";

const audioDurations = [
	getAudioDuration("introduction-to-computer-networks/module3-protocols-introduction"),
	getAudioDuration("introduction-to-computer-networks/module3-tcp-and-udp"),
	getAudioDuration("introduction-to-computer-networks/module3-http-and-https"),
	getAudioDuration("introduction-to-computer-networks/module3-dns"),
	getAudioDuration("introduction-to-computer-networks/module3-story-beat-dns"),
	getAudioDuration("introduction-to-computer-networks/module3-ftp-and-sftp"),
	getAudioDuration("introduction-to-computer-networks/module3-email-protocols"),
	getAudioDuration("introduction-to-computer-networks/module3-story-beat-protocols-recap"),
	getAudioDuration("introduction-to-computer-networks/module3-protocols-conclusion")
];

const whooshDuration = 0.57;
const slideBuffer = 1.0;
const lastSlideBuffer = 1.2;
const totalDuration = 141.47;

export const Module3Config = {
	id: "module-3",
	title: "Networking Protocols",
	fps: 30,
	width: 1920,
	height: 1080,
	totalDuration,
};
