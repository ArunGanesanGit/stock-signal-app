# Deployment Guide

## Overview

This guide covers deploying Stock Signal to production using Vercel (frontend) and AWS (backend).

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account
- GitHub/GitLab repository connected to Vercel

### Step 1: Push to Repository

```bash
git init
git add .
git commit -m "Initial commit: Stock Signal application"
git remote add origin https://github.com/yourusername/stock-signal-app.git
git push -u origin main
```

### Step 2: Deploy to Vercel

**Option A: Using Vercel Dashboard**

1. Go to https://vercel.com/new
2. Import your repository
3. Select "Next.js" as framework
4. Configure project settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

**Option B: Using Vercel CLI**

```bash
npm i -g vercel
vercel deploy --prod

# Set environment variables
vercel env add NEXT_PUBLIC_API_URL
# Enter your backend API URL (e.g., https://api.example.com)
```

### Step 3: Configure Environment

In Vercel dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add `NEXT_PUBLIC_API_URL`
   - Development: `http://localhost:5000`
   - Production: `https://your-api-domain.com`

### Step 4: Monitor Deployment

- Vercel automatically deploys on `main` branch push
- View deployment logs in Vercel dashboard
- Preview URLs available for pull requests

---

## Backend Deployment (AWS Lambda)

### Prerequisites
- AWS account with Lambda, API Gateway, CloudWatch access
- AWS CLI configured: `aws configure`
- Node.js 18+ installed locally

### Option 1: Using Serverless Framework (Recommended)

#### Setup

```bash
# Install Serverless globally
npm install -g serverless

# Authenticate with AWS
serverless config credentials --provider aws --key YOUR_KEY --secret YOUR_SECRET
```

#### Deploy

```bash
cd backend

# Build the application
npm run build

# Deploy to AWS
serverless deploy --region us-east-1

# Output will show API endpoint
```

#### View Logs

```bash
# Real-time logs
serverless logs -f api --region us-east-1

# Tail logs
serverless logs -f api --tail --region us-east-1
```

#### Update Function

```bash
# After code changes
npm run build
serverless deploy function -f api --region us-east-1
```

### Option 2: Using AWS SAM

#### Setup

```bash
# Install AWS SAM
brew install aws-sam-cli

# Configure AWS credentials
aws configure
```

#### Deploy

```bash
cd backend

# Build
sam build

# Deploy (guided setup)
sam deploy --guided

# Follow prompts to create CloudFormation stack
```

#### View Deployment

```bash
# Show stack outputs
aws cloudformation describe-stacks \
  --stack-name stock-signal-api \
  --query 'Stacks[0].Outputs'
```

### Option 3: Manual AWS Console

1. **Create Lambda Function**
   - Runtime: Node.js 18.x
   - Handler: `dist/handler.handler`
   - Memory: 256 MB
   - Timeout: 30 seconds

2. **Upload Code**
   ```bash
   cd backend
   npm run build
   zip -r lambda.zip dist/ node_modules/
   ```
   - Upload `lambda.zip` via console or AWS CLI

3. **Configure Environment Variables**
   - `NODE_ENV`: `production`
   - `USE_MOCK_DATA`: `true`
   - Any API keys needed

4. **Create API Gateway**
   - Type: REST API
   - Create resource: `{proxy+}`
   - Method: ANY
   - Integration: Lambda Function
   - Enable CORS

5. **Deploy API**
   - Create new stage: `prod`
   - Note the API endpoint URL

---

## Database Integration (Optional)

### Adding RDS PostgreSQL

```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier stock-signal-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username admin \
  --allocated-storage 20

# Update backend .env
DATABASE_URL=postgresql://user:password@endpoint:5432/stock_signal
```

### Lambda VPC Configuration

In AWS Console:
1. Lambda → Function → Configuration → VPC
2. Select VPC and subnets for RDS access
3. Ensure security groups allow database traffic

---

## Environment Configuration

### Frontend (.env.production)

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### Backend (.env.production)

```env
NODE_ENV=production
USE_MOCK_DATA=false
ALPHA_VANTAGE_API_KEY=your_key
FINNHUB_API_KEY=your_key
NEWSAPI_KEY=your_key
DATABASE_URL=postgresql://...
AWS_REGION=us-east-1
```

---

## Monitoring & Logging

### CloudWatch Logs

```bash
# View recent logs
aws logs tail /aws/lambda/stock-signal-api --follow

# Search logs
aws logs filter-log-events \
  --log-group-name /aws/lambda/stock-signal-api \
  --filter-pattern "error"
```

### Metrics & Alarms

Create alarms in CloudWatch:
- Lambda errors
- API Gateway 5xx responses
- Duration > threshold

### Logging in Application

```typescript
// Backend
console.log("Event occurred");  // Info
console.error("Error details"); // Error

// Frontend
console.error("API error:", err); // Error logs
```

---

## Continuous Deployment (CD)

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy Frontend
        run: |
          npm install -g vercel
          vercel deploy --prod --token ${{ secrets.VERCEL_TOKEN }} --scope ${{ secrets.VERCEL_ORG_ID }}
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
      
      - name: Deploy Backend
        run: |
          cd backend
          npm install -g serverless
          serverless deploy --region us-east-1
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

---

## Cost Optimization

### Lambda
- Use provisioned concurrency only if consistent traffic
- Monitor execution time and optimize
- Use ephemeral storage efficiently

### API Gateway
- Consider caching with CloudFront
- Monitor request count

### Data Transfer
- Minimize API response sizes
- Use compression

---

## Security Checklist

- [ ] Never commit `.env` files
- [ ] Use AWS Secrets Manager for sensitive data
- [ ] Enable Lambda environment variable encryption
- [ ] Set up WAF on API Gateway
- [ ] Enable VPC for Lambda if using databases
- [ ] Use least privilege IAM roles
- [ ] Enable CloudTrail for audit logs
- [ ] Implement rate limiting on API
- [ ] Use HTTPS only
- [ ] Validate all inputs server-side

---

## Rollback Procedure

### Frontend (Vercel)

1. View deployments: Vercel Dashboard → Deployments
2. Click previous deployment
3. Select "Promote to Production"

### Backend (Lambda)

```bash
# List versions
aws lambda list-versions-by-function --function-name stock-signal-api

# Update alias to previous version
aws lambda update-alias \
  --function-name stock-signal-api \
  --name prod \
  --function-version 5
```

---

## Troubleshooting

### API Gateway CORS Errors

```bash
# Check CORS configuration
aws apigateway get-stage \
  --rest-api-id api-id \
  --stage-name prod
```

### Lambda Timeout Issues

- Increase timeout in Lambda settings (max 15 min)
- Optimize database queries
- Use connection pooling

### Cold Start Optimization

- Use Provisioned Concurrency
- Reduce package size
- Use Lambda Layers for dependencies

### Memory Issues

- Monitor using CloudWatch Insights
- Increase Lambda memory (increases CPU too)
- Optimize data structures
