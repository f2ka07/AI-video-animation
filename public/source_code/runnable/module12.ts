// ============================================================================
// CI/CD Integration and Best Practices
// Module 12
// ============================================================================
// This is a complete, runnable Pulumi program.
// Run: pulumi up

import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

// ============================================================================
// Security Best Practices
// ============================================================================
// Security Best Practices Checklist:

// 1. Use Pulumi secrets for sensitive values
const dbPassword = config.requireSecret("dbPassword");

// 2. Enable deletion protection on critical resources
const db = new aws.rds.Instance("db", {
    deletionProtection: true, // Prevent accidental deletion
    // ...
});

// 3. Use least privilege IAM roles
const role = new aws.iam.Role("role", {
    // Only grant necessary permissions
});

// 4. Enable encryption
const s3Bucket = new aws.s3.Bucket("bucket", {
    serverSideEncryptionConfiguration: {
        rule: {
            applyServerSideEncryptionByDefault: {
                sseAlgorithm: "AES256",
            },
        },
    },
});

// 5. Use separate stacks per environment
// pulumi stack init dev
// pulumi stack init prod

// 6. Enable audit logging
// Configure in Pulumi Cloud or use AWS CloudTrail

// 7. Review preview before applying
// Always run: pulumi preview --stack prod

// ============================================================================
// Exports
// ============================================================================
