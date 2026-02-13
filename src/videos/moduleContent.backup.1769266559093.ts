// Auto-generated course content by activateCourse.ts
// Course: Securing Websites with SSL
// Course ID: securing-websites-with-ssl
// Activated: 2026-01-24T14:35:08.614Z

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
	courseId: "securing-websites-with-ssl",
	title: "Introduction to SSL and HTTPS",
	subtitle: "Module 1: Understanding SSL and HTTPS",
	slides: [
		{
			name: "intro-title",
			type: "title",
			script: "Welcome to Securing Websites with SSL. In this course, you'll learn how SSL and TLS protect web traffic, how to get certificates, and configure servers to enable HTTPS.",
			title: "Securing Websites with SSL",
			subtitle: "Module 1: Understanding SSL and HTTPS",
		},
		{
			name: "what-is-https",
			type: "content-single",
			script: "HTTPS is HTTP secured by SSL/TLS encryption. It protects data exchanged between browsers and servers, preventing eavesdropping and tampering.",
			title: "What is HTTPS?",
			points: ["Encrypts HTTP traffic","Ensures data integrity","Prevents data interception"],
		},
		{
			name: "ssl-vs-tls",
			type: "comparison",
			script: "Let's compare SSL and TLS. SSL is the older protocol, while TLS is its modern, more secure successor used today.",
			title: "SSL vs TLS",
			leftTitle: "SSL",
			leftItems: ["Older protocol","Less secure","Deprecated"],
			rightTitle: "TLS",
			rightItems: ["Modern protocol","Stronger encryption","Widely used now"],
		},
		{
			name: "tls-handshake",
			type: "content-two-card",
			script: "The TLS handshake establishes secure communication by negotiating encryption keys and authenticating the server.",
			title: "TLS Handshake Overview",
			points: ["Client and server handshake","Exchanges keys securely","Verifies server identity"],
			imageSrc: "assets/generic.svg",
		},
		{
			name: "summary-intro",
			type: "content-single",
			script: "We covered HTTPS basics, differences between SSL and TLS, and the TLS handshake process. Next, we'll explore certificate authorities and certificates.",
			title: "Module Summary",
			points: ["HTTPS secures web traffic","TLS replaced SSL","Handshake sets secure keys"],
		},
	]
};

export const module2Content: ModuleContent = {
	moduleNumber: 2,
	courseId: "securing-websites-with-ssl",
	title: "Certificate Authorities and Certificates",
	subtitle: "Module 2: Understanding Certificates",
	slides: [
		{
			name: "cert-auth-title",
			type: "title",
			script: "In this module, we'll learn how certificates are issued and validated by Certificate Authorities to secure your website.",
			title: "Certificate Authorities and Certificates",
			subtitle: "Module 2: Understanding Certificates",
		},
		{
			name: "what-is-ca",
			type: "content-single",
			script: "A Certificate Authority, or CA, is a trusted organization that issues digital certificates to verify website identities.",
			title: "What is a Certificate Authority?",
			points: ["Trusted third party","Issues SSL/TLS certificates","Validates website ownership"],
		},
		{
			name: "certificate-structure",
			type: "content-two-card",
			script: "Certificates contain a public key, owner info, expiration, and are digitally signed by a CA to prove authenticity.",
			title: "Certificate Structure",
			points: ["Public key","Subject details","Expiration date","CA digital signature"],
			imageSrc: "assets/generic.svg",
		},
		{
			name: "chain-of-trust",
			type: "content-single",
			script: "Browsers trust certificates by verifying a chain from your site's certificate up to a trusted root CA certificate.",
			title: "Certificate Chain of Trust",
			points: ["Server certificate","Intermediate certificates","Root CA certificate"],
		},
		{
			name: "summary-ca",
			type: "content-single",
			script: "We covered what Certificate Authorities do, the structure of certificates, and how trust chains validate your site. Next, we'll request certificates.",
			title: "Module Summary",
			points: ["CAs issue certificates","Certificates contain keys and info","Trust chains link certificates"],
		},
	]
};

export const module3Content: ModuleContent = {
	moduleNumber: 3,
	courseId: "securing-websites-with-ssl",
	title: "Obtaining and Managing Certificates",
	subtitle: "Module 3: Requesting and Renewing Certificates",
	slides: [
		{
			name: "request-cert-title",
			type: "title",
			script: "This module teaches how to request certificates, automate renewals, and manage keys using tools like Let's Encrypt and ACME.",
			title: "Obtaining and Managing Certificates",
			subtitle: "Module 3: Requesting and Renewing Certificates",
		},
		{
			name: "lets-encrypt-overview",
			type: "content-single",
			script: "Let's Encrypt is a free, automated CA that issues SSL certificates to help secure your websites easily and affordably.",
			title: "Let's Encrypt Overview",
			points: ["Free SSL certificates","Automated issuance","Widely trusted"],
		},
		{
			name: "acme-protocol",
			type: "content-single",
			script: "ACME is a protocol that automates certificate issuance and renewal by proving domain control to the CA.",
			title: "The ACME Protocol",
			points: ["Automates validation","Simplifies renewals","Used by Let's Encrypt"],
		},
		{
			name: "automate-renewal",
			type: "content-two-card",
			script: "Automation tools like Certbot use ACME to renew certificates before they expire, keeping HTTPS uninterrupted.",
			title: "Automating Certificate Renewal",
			points: ["Scheduled renewals","No manual steps","Ensures continuous security"],
			imageSrc: "assets/generic.svg",
		},
		{
			name: "summary-managing",
			type: "content-single",
			script: "We learned about Let's Encrypt, the ACME protocol, and automating certificate renewals. Next, we'll configure your web server for HTTPS.",
			title: "Module Summary",
			points: ["Let's Encrypt provides free certs","ACME automates issuance","Renewals can be automated"],
		},
	]
};

export const module4Content: ModuleContent = {
	moduleNumber: 4,
	courseId: "securing-websites-with-ssl",
	title: "Configuring Web Servers for HTTPS",
	subtitle: "Module 4: HTTPS Setup on Nginx and Apache",
	slides: [
		{
			name: "config-https-title",
			type: "title",
			script: "Now, let's explore how to configure HTTPS on popular web servers like Nginx and Apache to secure your site.",
			title: "Configuring Web Servers for HTTPS",
			subtitle: "Module 4: HTTPS Setup on Nginx and Apache",
		},
		{
			name: "nginx-https-config",
			type: "code",
			script: "Here's a basic Nginx server block snippet enabling HTTPS with SSL certificate paths.",
			title: "Nginx HTTPS Configuration",
			code: "server {\n    listen 443 ssl;\n    server_name example.com;\n\n    ssl_certificate /etc/ssl/certs/example.crt;\n    ssl_certificate_key /etc/ssl/private/example.key;\n\n    location / {\n        root /var/www/html;\n    }\n}",
			language: "nginx",
		},
		{
			name: "apache-https-config",
			type: "code",
			script: "This Apache config snippet enables SSL and points to your certificate and key files.",
			title: "Apache HTTPS Configuration",
			code: "<VirtualHost *:443>\n    ServerName example.com\n\n    SSLEngine on\n    SSLCertificateFile /etc/ssl/certs/example.crt\n    SSLCertificateKeyFile /etc/ssl/private/example.key\n\n    DocumentRoot /var/www/html\n</VirtualHost>",
			language: "apache",
		},
		{
			name: "hsts-explanation",
			type: "content-single",
			script: "HSTS tells browsers to always use HTTPS for your site, preventing downgrade attacks and improving security.",
			title: "What is HSTS?",
			points: ["Enforces HTTPS usage","Set via HTTP headers","Protects against protocol downgrades"],
		},
		{
			name: "summary-config",
			type: "content-single",
			script: "We configured HTTPS on Nginx and Apache, and learned about HSTS headers to strengthen security. Next, let's explore TLS settings and best practices.",
			title: "Module Summary",
			points: ["Configured HTTPS on servers","Used SSL certificates","Implemented HSTS"],
		},
	]
};

export const module5Content: ModuleContent = {
	moduleNumber: 5,
	courseId: "securing-websites-with-ssl",
	title: "TLS Best Practices and Debugging",
	subtitle: "Module 5: Hardening and Troubleshooting SSL/TLS",
	slides: [
		{
			name: "tls-best-practices-title",
			type: "title",
			script: "This final module covers how to harden your TLS setup, test configurations, and debug common SSL errors.",
			title: "TLS Best Practices and Debugging",
			subtitle: "Module 5: Hardening and Troubleshooting SSL/TLS",
		},
		{
			name: "tls-version-ciphers",
			type: "content-two-card",
			script: "Use modern TLS versions like 1.2 or 1.3 and strong cipher suites to ensure secure connections.",
			title: "TLS Versions and Cipher Suites",
			points: ["Disable SSL and TLS 1.0/1.1","Prefer TLS 1.3 for speed and security","Choose strong ciphers only"],
			imageSrc: "assets/generic.svg",
		},
		{
			name: "testing-tools",
			type: "content-single",
			script: "Use tools like SSL Labs, OpenSSL, and curl to check your certificate chain, protocol support, and cipher strength.",
			title: "Tools to Test Your SSL Setup",
			points: ["SSL Labs for detailed reports","OpenSSL for command-line tests","curl to check HTTPS responses"],
		},
		{
			name: "common-errors-debug",
			type: "content-single",
			script: "Errors like 'certificate expired' or 'untrusted issuer' often stem from expired certs or missing intermediates. Check logs and certificate chains.",
			title: "Debugging Common SSL Errors",
			points: ["Check certificate expiration","Verify full chain is served","Review server logs"],
		},
		{
			name: "course-summary",
			type: "content-single",
			script: "You've learned how SSL and TLS secure web traffic, obtain and configure certificates, automate renewals, and harden your HTTPS setup.",
			title: "Course Summary",
			points: ["HTTPS and TLS fundamentals","Certificate authorities and chains","Server configuration and automation","Best practices and debugging"],
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