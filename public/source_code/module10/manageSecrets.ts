// Manage Secrets Securely
// This is a code snippet from Module 10
// Note: This file may reference variables from other slides
// For a complete, runnable version, see index.ts in this directory

// Read secrets from configuration
const dbPassword = config.requireSecret("dbPassword");
const apiKey = config.requireSecret("apiKey");

// Use secrets in resources
const dbInstance = new aws.rds.Instance("db", {
    password: dbPassword, // Automatically encrypted
    // ... other configuration ...
});

// Set secrets via CLI (encrypted automatically)
// pulumi config set --secret dbPassword "MySecurePassword123!"
// pulumi config set --secret apiKey "sk-1234567890abcdef"

// Or in Pulumi.{stack}.yaml (encrypted by Pulumi service)
// config:
//   dbPassword:
//     secure: AAABAKdJZXl... (encrypted value)