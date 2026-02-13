// Deploy to Multiple Environments
// This is a code snippet from Module 10
// Note: This file may reference variables from other slides
// For a complete, runnable version, see index.ts in this directory

// Create stacks for each environment
// pulumi stack init dev
// pulumi stack init staging
// pulumi stack init prod

// Set configuration per environment
// pulumi stack select dev
// pulumi config set instanceType t3.micro
// pulumi config set --secret dbPassword dev-password
// pulumi up

// pulumi stack select staging
// pulumi config set instanceType t3.small
// pulumi config set --secret dbPassword staging-password
// pulumi up

// pulumi stack select prod
// pulumi config set instanceType t3.large
// pulumi config set --secret dbPassword prod-password
// pulumi config set enableMultiAz true
// pulumi up

// All use the same code, different configuration!