// Auto-generated course content by AI Planner
// Course: Secure Shell Layer for Beginners
// Generated: 2026-01-24T12:32:26.817Z

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
	courseId: string;  // Course this module belongs to (for audio/video paths)
	title: string;
	subtitle: string;
	slides: SlideContent[];
}

export const module1Content: ModuleContent = {
	moduleNumber: 1,
	courseId: "secure-shell-layer-for-beginners",
	title: "Introduction to SSH",
	subtitle: "Module 1: Understanding SSH Basics",
	slides: [
		{
			name: "module1-title",
			type: "title",
			script: "Welcome to Secure Shell Layer for Beginners. In this module, we'll explore what SSH is and why it matters for secure remote access.",
			title: "Introduction to SSH",
			subtitle: "Module 1: Understanding SSH Basics",
		},
		{
			name: "what-is-ssh",
			type: "content-single",
			script: "SSH stands for Secure Shell. It's a protocol that lets you securely connect to remote computers over a network. SSH encrypts the connection, protecting your data from eavesdropping.",
			title: "What is SSH?",
			points: ["Secure protocol for remote access","Encrypts communication","Widely used in Linux and servers"],
		},
		{
			name: "why-use-ssh",
			type: "content-single",
			script: "SSH matters because it keeps your remote sessions private and safe. Without SSH, data like passwords could be intercepted. It's essential for managing servers and cloud environments securely.",
			title: "Why Use SSH?",
			points: ["Protects sensitive data","Secure remote server management","Foundation for cloud and DevOps work"],
		},
		{
			name: "ssh-handshake-overview",
			type: "content-two-card",
			script: "Let's look at how an SSH connection starts. The SSH handshake establishes trust and encryption keys between your client and the server.",
			title: "SSH Handshake Overview",
			points: ["Client and server exchange keys","Mutual authentication","Establish encrypted session"],
			imageSrc: "assets/generic.svg",
		},
		{
			name: "module1-summary",
			type: "content-single",
			script: "You now know what SSH is and why it is vital. We also introduced the handshake process as the start of a secure connection. Next, we'll dive into public key cryptography.",
			title: "Module 1 Summary",
			points: ["SSH enables secure remote access","Encryption protects data","Handshake sets up trust and keys"],
		},
	]
};

export const module2Content: ModuleContent = {
	moduleNumber: 2,
	courseId: "secure-shell-layer-for-beginners",
	title: "Public Key Cryptography and SSH Keys",
	subtitle: "Module 2: Keys and Authentication",
	slides: [
		{
			name: "module2-title",
			type: "title",
			script: "In this module, we'll explore public key cryptography and how SSH keys work to authenticate you securely without passwords.",
			title: "Public Key Cryptography and SSH Keys",
			subtitle: "Module 2: Keys and Authentication",
		},
		{
			name: "public-key-basics",
			type: "content-single",
			script: "Public key cryptography uses two keys: a public key you share and a private key you keep secret. This system lets you prove your identity without sending passwords.",
			title: "Public Key Cryptography Basics",
			points: ["Two keys: public and private","Private key stays secret","Public key is shared openly"],
		},
		{
			name: "ssh-key-pairs",
			type: "content-single",
			script: "SSH keys come in pairs. You generate a private key on your machine and share the public key with the server. This allows secure, password-less login.",
			title: "SSH Key Pairs",
			points: ["Generate keys with ssh-keygen","Private key stored securely","Public key placed on server"],
		},
		{
			name: "ssh-agent-intro",
			type: "content-single",
			script: "The ssh-agent program helps manage your private keys. It caches decrypted keys so you don't have to enter your passphrase every time you connect.",
			title: "Introducing ssh-agent",
			points: ["Manages private keys in memory","Improves convenience and security","Supports multiple SSH sessions"],
		},
		{
			name: "module2-summary",
			type: "content-single",
			script: "Now you understand public key cryptography and SSH key pairs. You also learned about ssh-agent for managing keys easily. Next, we'll see how to connect using these keys.",
			title: "Module 2 Summary",
			points: ["SSH keys enable secure login","Public and private keys work together","ssh-agent eases key management"],
		},
	]
};

export const module3Content: ModuleContent = {
	moduleNumber: 3,
	courseId: "secure-shell-layer-for-beginners",
	title: "Using SSH for Remote Connections",
	subtitle: "Module 3: Connecting to Servers",
	slides: [
		{
			name: "module3-title",
			type: "title",
			script: "This module covers how to connect to remote servers using SSH, with both password and key-based authentication methods.",
			title: "Using SSH for Remote Connections",
			subtitle: "Module 3: Connecting to Servers",
		},
		{
			name: "password-login",
			type: "content-single",
			script: "You can connect to a server by typing ssh username@server. If keys are not set up, the server will ask for your password to authenticate.",
			title: "Connecting with Passwords",
			points: ["Simple ssh command syntax","Password prompt for authentication","Less secure than key-based login"],
		},
		{
			name: "key-login",
			type: "content-single",
			script: "With SSH keys configured, you connect without typing passwords. The client uses your private key to prove your identity automatically.",
			title: "Connecting with SSH Keys",
			points: ["No password prompts","Faster and more secure login","Requires key setup on server"],
		},
		{
			name: "ssh-config-intro",
			type: "content-single",
			script: "SSH config files let you save connection details under short names. This simplifies your daily workflow by avoiding long commands.",
			title: "Using SSH Config Files",
			points: ["Store server info in ~/.ssh/config","Define hostnames, user, keys","Connect with simple aliases"],
		},
		{
			name: "module3-summary",
			type: "content-single",
			script: "You learned how to connect with passwords and keys. Using SSH config files makes repeated connections easier. Next, we'll explore copying files with SSH tools.",
			title: "Module 3 Summary",
			points: ["SSH supports password and key login","Config files simplify commands","Key login is more secure and convenient"],
		},
	]
};

export const module4Content: ModuleContent = {
	moduleNumber: 4,
	courseId: "secure-shell-layer-for-beginners",
	title: "File Transfer Using SCP and SFTP",
	subtitle: "Module 4: Secure File Transfers",
	slides: [
		{
			name: "module4-title",
			type: "title",
			script: "In this module, we'll cover how to securely transfer files between your computer and servers using SCP and SFTP.",
			title: "File Transfer Using SCP and SFTP",
			subtitle: "Module 4: Secure File Transfers",
		},
		{
			name: "scp-overview",
			type: "content-single",
			script: "SCP copies files over SSH quickly from your local machine to a server or vice versa. It uses simple commands similar to cp but works remotely.",
			title: "Using SCP",
			points: ["Secure copy over SSH","Command: scp source destination","Supports recursive copying"],
		},
		{
			name: "sftp-overview",
			type: "content-single",
			script: "SFTP is an interactive file transfer program over SSH. It lets you browse remote directories and transfer files securely.",
			title: "Using SFTP",
			points: ["Secure FTP over SSH","Interactive shell for file operations","Supports upload, download, and navigation"],
		},
		{
			name: "scp-vs-sftp",
			type: "comparison",
			script: "Let's compare SCP and SFTP to see which fits your needs best.",
			title: "SCP vs SFTP",
			leftTitle: "SCP",
			leftItems: ["Faster for simple copies","Non-interactive command","Good for scripts"],
			rightTitle: "SFTP",
			rightItems: ["Interactive file management","Supports complex tasks","Better for manual transfers"],
		},
		{
			name: "module4-summary",
			type: "content-single",
			script: "You now know how to transfer files securely using SCP and SFTP. Choose SCP for quick copies and SFTP for interactive file management.",
			title: "Module 4 Summary",
			points: ["SCP: fast, command-based copying","SFTP: interactive file transfer","Both use SSH for security"],
		},
	]
};

export const module5Content: ModuleContent = {
	moduleNumber: 5,
	courseId: "secure-shell-layer-for-beginners",
	title: "Port Forwarding, Tunnels, and Security Best Practices",
	subtitle: "Module 5: Advanced SSH Usage and Security",
	slides: [
		{
			name: "module5-title",
			type: "title",
			script: "This final module introduces port forwarding, SSH tunnels, and key security practices to harden your SSH setup.",
			title: "Port Forwarding, Tunnels, and Security Best Practices",
			subtitle: "Module 5: Advanced SSH Usage and Security",
		},
		{
			name: "local-port-forwarding",
			type: "content-single",
			script: "Local port forwarding lets you forward a local port to a remote service through SSH. It helps access internal resources securely.",
			title: "Local Port Forwarding",
			points: ["Forwards local port to remote host","Command uses -L option","Useful for accessing remote services"],
		},
		{
			name: "ssh-tunnels",
			type: "content-single",
			script: "SSH tunnels create encrypted paths for network traffic. They protect data and can bypass firewalls or insecure networks.",
			title: "SSH Tunnels",
			points: ["Encrypts network connections","Supports local and remote forwarding","Useful for secure communication"],
		},
		{
			name: "ssh-security-best-practices",
			type: "content-single",
			script: "To keep SSH secure, disable root login, use key-based authentication, keep software updated, and limit user access.",
			title: "SSH Security Best Practices",
			points: ["Disable root login","Use SSH keys, not passwords","Regularly update SSH software","Restrict user access"],
		},
		{
			name: "course-summary",
			type: "content-single",
			script: "You have learned SSH basics, keys, connections, file transfers, port forwarding, and security. Use these skills to access servers securely and confidently.",
			title: "Course Summary",
			points: ["SSH secures remote access","Keys improve authentication","SCP and SFTP transfer files","Port forwarding secures traffic","Follow best practices for safety"],
		},
	]
};

export const allModules: ModuleContent[] = [
	module1Content,
	module2Content,
	module3Content,
	module4Content,
	module5Content
];