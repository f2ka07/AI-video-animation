// Auto-generated course content by AI Planner
// Course: Securing Websites with SSL/TLS
// Generated: 2026-01-24T14:55:59.088Z

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
	courseId: "securing-websites-with-ssl-tls",
	title: "Introduction to HTTPS and SSL/TLS",
	subtitle: "Module 1: Understanding Secure Web Communication",
	slides: [
		{
			name: "intro-title",
			type: "title",
			script: "Welcome to Securing Websites with SSL/TLS. In this module, we'll explore HTTPS fundamentals, why securing websites matters, and how SSL/TLS protocols protect web communication from attackers.",
			title: "Introduction to HTTPS and SSL/TLS",
		},
		{
			name: "what-is-https",
			type: "content-single",
			script: "HTTPS stands for HyperText Transfer Protocol Secure. It ensures data exchanged between browsers and servers is encrypted, protecting privacy and security. Without HTTPS, data is sent in clear text, making it vulnerable to interception and tampering.",
			title: "What is HTTPS?",
			points: ["Encrypts data between browser and server","Protects against eavesdropping and tampering","Foundation of secure internet communication"],
		},
		{
			name: "http-vs-https",
			type: "comparison",
			script: "Let's compare HTTP and HTTPS to understand their differences. HTTP sends data in plain text, while HTTPS encrypts data using SSL/TLS. This encryption prevents attackers from reading or modifying data in transit.",
			title: "HTTP vs HTTPS",
			leftTitle: "HTTP",
			leftItems: ["Data sent in plain text","No encryption","Vulnerable to interception"],
			rightTitle: "HTTPS",
			rightItems: ["Data encrypted with SSL/TLS","Ensures privacy and integrity","Protects user data"],
		},
		{
			name: "ssl-vs-tls",
			type: "content-single",
			script: "SSL and TLS are cryptographic protocols that encrypt data between web servers and clients. SSL was the original protocol but had vulnerabilities. TLS is the modern, more secure successor. Today, TLS 1.2 and 1.3 are the standards for secure websites.",
			title: "SSL vs TLS",
			points: ["SSL was the original encryption protocol","TLS is the modern, secure successor","TLS 1.2 and 1.3 are current standards"],
		},
		{
			name: "tls-handshake",
			type: "content-single",
			script: "The TLS handshake establishes a secure connection between client and server. It involves exchanging hello messages, certificates, and encryption keys. This process ensures both parties can communicate securely and verifies the server's identity.",
			title: "TLS Handshake Process",
			points: ["Client and server exchange hello messages","Server provides its certificate","Keys are securely exchanged","Encrypted communication begins"],
		},
		{
			name: "summary-intro",
			type: "content-single",
			script: "In this module, we covered HTTPS basics, the difference between SSL and TLS, and how the TLS handshake works. This knowledge sets the groundwork for obtaining and configuring certificates in later modules.",
			title: "Module Summary",
			points: ["HTTPS encrypts web communication","TLS replaced SSL for better security","TLS handshake establishes secure connections","Next: Obtaining SSL/TLS certificates"],
		},
	]
};

export const module2Content: ModuleContent = {
	moduleNumber: 2,
	courseId: "securing-websites-with-ssl-tls",
	title: "Certificate Authorities",
	subtitle: "Module 2: Understanding Trust in SSL/TLS",
	slides: [
		{
			name: "cert-auth-title",
			type: "title",
			script: "Welcome to Module 2. We will explore Certificate Authorities, how they establish trust, and the chain of trust that secures web communications.",
			title: "Certificate Authorities",
		},
		{
			name: "what-is-ca",
			type: "content-single",
			script: "A Certificate Authority is a trusted organization that issues digital certificates. CAs verify domain ownership before issuing certificates, enabling browsers to trust websites.",
			title: "What is a Certificate Authority?",
			points: ["Trusted entities that issue certificates","Verify domain ownership","Enable browser trust for HTTPS"],
		},
		{
			name: "chain-of-trust",
			type: "content-single",
			script: "The chain of trust connects your certificate to a root CA through intermediate certificates. Browsers trust root CAs, which in turn vouch for intermediates that sign your certificate.",
			title: "Chain of Trust",
			points: ["Root CAs are pre-trusted by browsers","Intermediate CAs sign end-entity certificates","Chain validates certificate authenticity"],
		},
		{
			name: "certificate-structure",
			type: "content-single",
			script: "Certificates contain important information like the domain name, public key, issuer details, validity dates, and digital signature. This data helps browsers verify authenticity.",
			title: "Certificate Structure",
			points: ["Domain name and public key","Issuer and serial number","Validity period","Digital signature of CA"],
		},
		{
			name: "summary-ca",
			type: "content-single",
			script: "In this module, we covered Certificate Authorities, how they establish trust, and the chain of trust model. This foundation helps you understand how certificates secure websites.",
			title: "Module Summary",
			points: ["CAs issue trusted certificates","Chain of trust validates authenticity","Certificate structure enables verification"],
		},
	]
}

export const module3Content: ModuleContent = {
	moduleNumber: 3,
	courseId: "securing-websites-with-ssl-tls",
	title: "Requesting Certificates",
	subtitle: "Module 3: Getting SSL/TLS Certificates",
	slides: [
		{
			name: "request-cert-title",
			type: "title",
			script: "Welcome to Module 3. We will learn how to request SSL/TLS certificates using Let's Encrypt and the ACME protocol for automated certificate management.",
			title: "Requesting Certificates",
		},
		{
			name: "lets-encrypt-overview",
			type: "content-single",
			script: "Let's Encrypt is a free, automated Certificate Authority. It provides domain-validated certificates at no cost, making HTTPS accessible to everyone.",
			title: "Let's Encrypt Overview",
			points: ["Free SSL/TLS certificates","Automated issuance and renewal","Widely trusted by browsers"],
		},
		{
			name: "acme-protocol",
			type: "content-single",
			script: "The ACME protocol automates certificate requests. It uses domain validation challenges to prove ownership before issuing certificates, enabling fully automated HTTPS setup.",
			title: "ACME Protocol",
			points: ["Automated Certificate Management Environment","HTTP and DNS validation challenges","Enables automated renewals"],
		},
		{
			name: "automate-renewal",
			type: "content-single",
			script: "Certificate renewal should be automated to prevent expiration. Tools like Certbot can automatically renew certificates before they expire, ensuring continuous HTTPS.",
			title: "Automating Renewal",
			points: ["Certificates expire every 90 days","Certbot automates renewal","Cron jobs ensure timely updates"],
		},
		{
			name: "summary-managing",
			type: "content-single",
			script: "In this module, we covered Let's Encrypt, the ACME protocol, and automated renewal. These tools make certificate management simple and cost-free.",
			title: "Module Summary",
			points: ["Let's Encrypt provides free certificates","ACME automates the process","Renewal automation prevents downtime"],
		},
	]
}

export const module4Content: ModuleContent = {
	moduleNumber: 4,
	courseId: "securing-websites-with-ssl-tls",
	title: "Configuring HTTPS",
	subtitle: "Module 4: Server Configuration for SSL/TLS",
	slides: [
		{
			name: "config-https-title",
			type: "title",
			script: "Welcome to Module 4. We will configure HTTPS on popular web servers including Nginx and Apache, and learn about HSTS for enhanced security.",
			title: "Configuring HTTPS",
		},
		{
			name: "nginx-https-config",
			type: "content-single",
			script: "Nginx HTTPS configuration involves specifying certificate paths, enabling TLS protocols, and setting up redirects from HTTP to HTTPS for all traffic.",
			title: "Nginx HTTPS Configuration",
			points: ["Specify ssl_certificate paths","Enable TLS 1.2 and 1.3","Redirect HTTP to HTTPS"],
		},
		{
			name: "apache-https-config",
			type: "content-single",
			script: "Apache uses mod_ssl for HTTPS. Configuration includes setting SSLCertificateFile paths, enabling modern protocols, and configuring virtual hosts for secure connections.",
			title: "Apache HTTPS Configuration",
			points: ["Enable mod_ssl module","Set SSLCertificateFile paths","Configure secure virtual hosts"],
		},
		{
			name: "hsts-explanation",
			type: "content-single",
			script: "HTTP Strict Transport Security forces browsers to only use HTTPS. Once set, browsers will automatically upgrade HTTP requests to HTTPS, preventing downgrade attacks.",
			title: "HSTS Explained",
			points: ["Forces HTTPS-only connections","Prevents protocol downgrade attacks","Add Strict-Transport-Security header"],
		},
		{
			name: "summary-config",
			type: "content-single",
			script: "In this module, we configured HTTPS on Nginx and Apache, and learned about HSTS. Proper configuration ensures your websites are securely accessible.",
			title: "Module Summary",
			points: ["Nginx and Apache HTTPS setup","HSTS enhances security","Proper config prevents vulnerabilities"],
		},
	]
}

export const module5Content: ModuleContent = {
	moduleNumber: 5,
	courseId: "securing-websites-with-ssl-tls",
	title: "TLS Best Practices",
	subtitle: "Module 5: Security and Troubleshooting",
	slides: [
		{
			name: "tls-best-practices-title",
			type: "title",
			script: "Welcome to Module 5. We will cover TLS best practices, testing tools, common errors, and wrap up the course with a comprehensive summary.",
			title: "TLS Best Practices",
		},
		{
			name: "tls-version-ciphers",
			type: "content-single",
			script: "Use TLS 1.2 or 1.3 only and disable older versions. Choose strong cipher suites that support forward secrecy to protect past communications if keys are compromised.",
			title: "TLS Versions and Ciphers",
			points: ["Use TLS 1.2 and 1.3 only","Disable SSLv3, TLS 1.0, TLS 1.1","Enable forward secrecy ciphers"],
		},
		{
			name: "testing-tools",
			type: "content-single",
			script: "Test your SSL/TLS configuration with tools like SSL Labs, testssl.sh, and OpenSSL. These tools identify vulnerabilities and configuration issues before attackers do.",
			title: "Testing Tools",
			points: ["SSL Labs online scanner","testssl.sh command-line tool","OpenSSL s_client for debugging"],
		},
		{
			name: "common-errors-debug",
			type: "content-single",
			script: "Common SSL errors include certificate mismatch, expired certificates, and incomplete chains. Debug using browser tools and server logs to identify and fix issues quickly.",
			title: "Common Errors and Debugging",
			points: ["Certificate name mismatch errors","Expired certificate warnings","Incomplete certificate chains"],
		},
		{
			name: "course-summary",
			type: "content-single",
			script: "Congratulations on completing this course! You learned HTTPS fundamentals, certificate management, server configuration, and security best practices. Apply this knowledge to secure your websites.",
			title: "Course Summary",
			points: ["HTTPS protects web communications","Certificates establish trust","Proper configuration is essential","Keep testing and updating"],
		},
	]
}




export const allModules: ModuleContent[] = [
	module1Content,
	module2Content,
	module3Content,
	module4Content,
	module5Content,
];