# AWS Deployment Guide for Quick Space

This guide explains how to deploy the Quick Space React application to AWS using Amazon S3 for static hosting and CloudFront for a global CDN.

## Prerequisites
- An AWS Account
- AWS CLI installed and configured (`aws configure`)
- Node.js and npm installed

## Build the Production Application

First, generate the optimized production build of the Vite React app:

```bash
npm run build
```

This will create a `dist` folder containing the static assets.

## Deployment Steps

### 1. Create an S3 Bucket

Create an S3 bucket to store your static files.

```bash
aws s3 mb s3://your-quickspace-bucket-name
```

### 2. Configure S3 for Static Website Hosting

Enable static website hosting on the bucket:

```bash
aws s3 website s3://your-quickspace-bucket-name/ --index-document index.html --error-document index.html
```

### 3. Update Bucket Policy for Public Read Access

Create a file named `policy.json`:

```json
{
  "Version":"2012-10-17",
  "Statement":[{
    "Sid":"PublicReadGetObject",
    "Effect":"Allow",
    "Principal": "*",
    "Action":["s3:GetObject"],
    "Resource":["arn:aws:s3:::your-quickspace-bucket-name/*"]
  }]
}
```

Apply the policy:
```bash
aws s3api put-bucket-policy --bucket your-quickspace-bucket-name --policy file://policy.json
```

### 4. Upload Files to S3

Sync the `dist` folder to your S3 bucket:

```bash
aws s3 sync dist/ s3://your-quickspace-bucket-name/
```

### 5. Setup Amazon CloudFront (CDN)

For HTTPS and better performance globally, create a CloudFront distribution pointing to your S3 bucket's website endpoint.

```bash
# This is typically done via the AWS Console for easier ACM (SSL Certificate) configuration.
# 1. Go to CloudFront in AWS Console
# 2. Click "Create Distribution"
# 3. Select your S3 bucket as the Origin Domain Name
# 4. Set Viewer Protocol Policy to "Redirect HTTP to HTTPS"
# 5. Add your custom domain (e.g., quickspace.com) in "Alternate Domain Names (CNAMEs)"
# 6. Request or select an ACM certificate for your domain
# 7. Click "Create Distribution"
```

## Continuous Deployment (CI/CD)

For automated deployments, you can configure GitHub Actions or AWS CodePipeline. A sample GitHub Action for deployment:

```yaml
name: Deploy Quick Space to AWS S3

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install Dependencies
        run: npm ci
        
      - name: Build Application
        run: npm run build
        
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
          
      - name: Deploy to S3
        run: aws s3 sync dist/ s3://your-quickspace-bucket-name/ --delete
        
      - name: Invalidate CloudFront Cache
        run: aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DIST_ID }} --paths "/*"
```
