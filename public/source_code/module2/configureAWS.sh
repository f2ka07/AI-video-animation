// Configure AWS CLI Credentials
// This is a code snippet from Module 2
// Note: This file may reference variables from other slides
// For a complete, runnable version, see index.ts in this directory

# Configure AWS CLI with credentials
aws configure

# Or set environment variables
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
export AWS_DEFAULT_REGION=us-east-1

# Verify configuration
aws sts get-caller-identity