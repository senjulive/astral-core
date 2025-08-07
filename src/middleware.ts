import { NextRequest, NextResponse } from 'next/server';
import { getSecurityHeaders, rateLimit, configureCORS, getClientIP, logSecurityEvent } from '@/lib/security';
import { env } from '@/lib/env';

// Rate limiting configurations
const apiRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100,
  message: 'Too many API requests from this IP',
});

const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5,
  message: 'Too many authentication attempts',
});

const generalRateLimit = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  maxRequests: 60,
  message: 'Too many requests from this IP',
});

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;
  const ip = getClientIP(request);

  // Add security headers to all responses
  const securityHeaders = getSecurityHeaders();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Handle CORS for API routes
  if (pathname.startsWith('/api')) {
    configureCORS(request, response);
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers });
    }
  }

  // Apply rate limiting
  try {
    // Authentication endpoints - strict rate limiting
    if (pathname.startsWith('/api/auth/')) {
      const rateLimitResponse = authRateLimit(request);
      if (rateLimitResponse) {
        logSecurityEvent('rate_limit_exceeded', {
          endpoint: pathname,
          ip,
          type: 'auth',
        }, request);
        return rateLimitResponse;
      }
    }
    // API endpoints - moderate rate limiting
    else if (pathname.startsWith('/api/')) {
      const rateLimitResponse = apiRateLimit(request);
      if (rateLimitResponse) {
        logSecurityEvent('rate_limit_exceeded', {
          endpoint: pathname,
          ip,
          type: 'api',
        }, request);
        return rateLimitResponse;
      }
    }
    // General pages - lenient rate limiting
    else {
      const rateLimitResponse = generalRateLimit(request);
      if (rateLimitResponse) {
        logSecurityEvent('rate_limit_exceeded', {
          endpoint: pathname,
          ip,
          type: 'general',
        }, request);
        return rateLimitResponse;
      }
    }
  } catch (error) {
    console.error('Rate limiting error:', error);
    // Continue without rate limiting if there's an error
  }

  // Security checks for sensitive areas
  if (pathname.startsWith('/admin') || pathname.startsWith('/moderator')) {
    // Add additional security headers for admin areas
    response.headers.set('X-Frame-Options', 'SAMEORIGIN');
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    // Log access attempts to admin areas
    logSecurityEvent('admin_access_attempt', {
      path: pathname,
      ip,
    }, request);
  }

  // Block suspicious requests
  const userAgent = request.headers.get('user-agent') || '';
  const suspiciousPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /scanner/i,
  ];

  // Allow legitimate bots for SEO
  const legitimateBots = [
    /googlebot/i,
    /bingbot/i,
    /slurp/i,
    /duckduckbot/i,
    /facebookexternalhit/i,
    /twitterbot/i,
    /linkedinbot/i,
  ];

  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(userAgent)) &&
                     !legitimateBots.some(pattern => pattern.test(userAgent));

  if (isSuspicious && !pathname.startsWith('/api/robots') && !pathname.startsWith('/api/sitemap')) {
    // Block suspicious bots from sensitive areas
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/')) {
      logSecurityEvent('suspicious_bot_blocked', {
        userAgent,
        path: pathname,
        ip,
      }, request);
      
      return new NextResponse('Access Denied', { status: 403 });
    }
  }

  // Validate request size for API endpoints
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) { // 10MB limit
    logSecurityEvent('large_request_blocked', {
      contentLength,
      path: pathname,
      ip,
    }, request);
    
    return new NextResponse('Request Too Large', { status: 413 });
  }

  // Check for common attack patterns in URLs
  const suspiciousUrlPatterns = [
    /\.\./,           // Directory traversal
    /\/etc\/passwd/,  // Linux password file
    /\/windows\/system32/, // Windows system directory
    /<script/i,       // XSS attempts
    /union.*select/i, // SQL injection
    /eval\(/i,        // Code injection
  ];

  if (suspiciousUrlPatterns.some(pattern => pattern.test(pathname))) {
    logSecurityEvent('malicious_url_blocked', {
      path: pathname,
      ip,
    }, request);
    
    return new NextResponse('Bad Request', { status: 400 });
  }

  // Add request ID for tracking
  const requestId = crypto.randomUUID();
  response.headers.set('X-Request-ID', requestId);

  // Add timestamp header
  response.headers.set('X-Response-Time', Date.now().toString());

  // Development-only headers
  if (env.NODE_ENV === 'development') {
    response.headers.set('X-Environment', 'development');
    response.headers.set('X-Debug-IP', ip);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
