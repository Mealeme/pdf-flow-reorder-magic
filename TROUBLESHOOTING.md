# Pricing Page Troubleshooting Guide

## White Screen Issue

If you see a white screen when accessing the pricing page, follow these steps:

### 1. Check Browser Console
- Open Developer Tools (F12)
- Go to Console tab
- Look for JavaScript errors

### 2. Common Error Causes

#### Route Not Configured
The pricing page route might not be set up in your router. Check `src/App.tsx` or router configuration:

```jsx
// Should include:
<Route path="/pricing" element={<Pricing />} />
```

#### Component Import Error
Ensure Pricing component is properly imported:

```jsx
import Pricing from "@/pages/Pricing";
```

#### Async Function Issues
If you see errors related to async functions, the issue might be in `usageUtils.ts`. The current implementation uses synchronous localStorage calls.

#### Missing Dependencies
Ensure all required packages are installed:
```bash
npm install
```

### 3. Verify Implementation

The pricing page should display:
- Free plan: ₹0, 1 PDF/day
- Pro plan: ₹20/week, 5 PDFs/day
- Pro+ plan: ₹40/month, unlimited PDFs

### 4. Test Steps

1. Navigate to `http://localhost:8080/`
2. Check if home page loads
3. Navigate to `http://localhost:8080/pricing`
4. Check console for errors

### 5. Backend Setup (For Production)

If using production mode:
1. Start backend: `npm start` (in backend directory)
2. Update frontend API calls to use production URLs
3. Ensure DynamoDB tables exist

### 6. Contact Support

If issues persist, provide:
- Browser console errors
- Network tab failures
- Exact URL where white screen occurs