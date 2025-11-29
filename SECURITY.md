# Security Policy

## Overview

This AI/ML portfolio uses Large Language Models (LLMs) and may process user inputs. We take security seriously and have implemented multiple safeguards.

## Security Measures

### 1. API Keys

- ✅ **No keys committed**: All API keys are in `.env` (gitignored)
- ✅ **Environment variables**: Keys loaded via `python-dotenv`
- ✅ **Example file**: `.env.example` provided without real keys

### 2. LLM Usage

- ✅ **Graceful fallback**: Works offline without API keys
- ✅ **Mock responses**: Precomputed responses when LLM unavailable
- ✅ **Timeout protection**: 30-second timeout on all LLM calls
- ✅ **Rate limiting**: Recommended for production deployments

### 3. Agent Safety

- ✅ **Disabled by default**: Agent requires explicit opt-in
- ✅ **Sandboxed execution**: No file system or network access
- ✅ **Step limits**: Maximum 5 steps per task
- ✅ **Transparent execution**: All steps visible to user
- ✅ **User control**: Stop button to halt execution

### 4. Input Validation

- ✅ **Pydantic models**: All API inputs validated
- ✅ **Type checking**: TypeScript on frontend
- ✅ **CORS configuration**: Restrict origins in production
- ✅ **Content Security Policy**: Recommended for deployment

### 5. Dependencies

- ✅ **Regular updates**: Dependabot enabled
- ✅ **Vulnerability scanning**: GitHub security alerts
- ✅ **Minimal dependencies**: Only essential packages

## Responsible Disclosure

If you discover a security vulnerability, please:

1. **DO NOT** open a public issue
2. Email: security@example.com (TODO: Add your email)
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and work with you to address the issue.

## Known Limitations

### LLM Risks

- **Hallucination**: LLMs may generate incorrect information
- **Prompt Injection**: Malicious prompts could manipulate responses
- **Data Privacy**: User inputs sent to third-party LLM providers

**Mitigation**:
- Use RAG to ground responses in retrieved documents
- Implement prompt templates to reduce injection risk
- Clearly communicate data handling to users
- Offer offline mode for sensitive use cases

### Agent Risks

- **Unintended Actions**: Agents may take unexpected steps
- **Resource Consumption**: Long-running tasks could consume resources

**Mitigation**:
- Sandboxed execution environment
- Step and time limits
- Explicit user consent required
- Transparent step-by-step display

## Production Recommendations

When deploying to production:

1. **Environment Variables**
   ```bash
   # Use secrets management (e.g., Vercel Secrets, AWS Secrets Manager)
   # Never commit .env files
   ```

2. **CORS Configuration**
   ```python
   # backend/main.py
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["https://yourdomain.com"],  # Specific origins only
       allow_credentials=True,
       allow_methods=["GET", "POST"],
       allow_headers=["*"],
   )
   ```

3. **Rate Limiting**
   ```python
   # Add rate limiting middleware
   from slowapi import Limiter
   limiter = Limiter(key_func=get_remote_address)
   
   @app.post("/api/query")
   @limiter.limit("10/minute")
   async def query_rag(request: QueryRequest):
       ...
   ```

4. **Content Security Policy**
   ```typescript
   // next.config.js
   async headers() {
     return [{
       source: '/:path*',
       headers: [
         {
           key: 'Content-Security-Policy',
           value: "default-src 'self'; ..."
         }
       ]
     }]
   }
   ```

5. **Monitoring**
   - Enable error tracking (Sentry, LogRocket)
   - Monitor API usage and costs
   - Set up alerts for unusual activity

## Compliance

This project:
- ✅ Uses third-party APIs (OpenRouter, OpenAI, Anthropic)
- ✅ May process user inputs
- ✅ Does not store personal data by default
- ✅ Provides offline mode for privacy-sensitive use cases

**GDPR/Privacy**: If deploying in production, ensure compliance with applicable data protection regulations.

## Updates

This security policy was last updated: **2024-03-10**

We will update this policy as new security measures are implemented or vulnerabilities are discovered.

## Contact

For security concerns: security@example.com (TODO: Add your email)

For general questions: your.email@example.com (TODO: Add your email)

---

**Thank you for helping keep this project secure!**
