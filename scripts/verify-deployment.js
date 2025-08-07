#!/usr/bin/env node

/**
 * Deployment Verification Script
 * Verifies that the deployment is working correctly
 */

const https = require('https');
const http = require('http');

// Configuration
const CONFIG = {
  timeout: 30000,
  retries: 3,
  retryDelay: 5000,
};

// Tests to run
const TESTS = [
  {
    name: 'Homepage Load Test',
    path: '/',
    expectedStatus: 200,
    expectedContent: ['AstralCore', 'Hyperdrive'],
  },
  {
    name: 'API Health Check',
    path: '/api/health',
    expectedStatus: 200,
    expectedContent: ['status', 'ok'],
  },
  {
    name: 'Dashboard Route Test',
    path: '/dashboard',
    expectedStatus: 200,
    expectedContent: ['dashboard'],
  },
  {
    name: 'Sitemap Test',
    path: '/api/sitemap',
    expectedStatus: 200,
    expectedContent: ['xml', 'urlset'],
  },
  {
    name: 'Robots.txt Test',
    path: '/api/robots',
    expectedStatus: 200,
    expectedContent: ['User-agent', 'Allow'],
  },
];

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function makeRequest(url, timeout = CONFIG.timeout) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const client = isHttps ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      timeout,
      headers: {
        'User-Agent': 'AstralCore-Deployment-Verifier/1.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    };

    const req = client.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

async function runTest(baseUrl, test, attempt = 1) {
  const url = `${baseUrl}${test.path}`;
  
  try {
    log(`  Testing: ${test.name} (${url})`, 'blue');
    
    const response = await makeRequest(url);
    
    // Check status code
    if (response.status !== test.expectedStatus) {
      throw new Error(`Expected status ${test.expectedStatus}, got ${response.status}`);
    }
    
    // Check content
    const bodyLower = response.body.toLowerCase();
    for (const expectedContent of test.expectedContent) {
      if (!bodyLower.includes(expectedContent.toLowerCase())) {
        throw new Error(`Expected content "${expectedContent}" not found in response`);
      }
    }
    
    log(`  ✅ ${test.name} passed`, 'green');
    return { success: true, test: test.name };
    
  } catch (error) {
    if (attempt < CONFIG.retries) {
      log(`  ⚠️  ${test.name} failed (attempt ${attempt}/${CONFIG.retries}): ${error.message}`, 'yellow');
      log(`  Retrying in ${CONFIG.retryDelay}ms...`, 'yellow');
      
      await new Promise(resolve => setTimeout(resolve, CONFIG.retryDelay));
      return runTest(baseUrl, test, attempt + 1);
    } else {
      log(`  ❌ ${test.name} failed: ${error.message}`, 'red');
      return { success: false, test: test.name, error: error.message };
    }
  }
}

async function verifyDeployment(baseUrl) {
  log(`\n🚀 Starting deployment verification for: ${baseUrl}`, 'blue');
  log(`⏱️  Timeout: ${CONFIG.timeout}ms, Retries: ${CONFIG.retries}\n`, 'blue');
  
  const results = [];
  
  for (const test of TESTS) {
    const result = await runTest(baseUrl, test);
    results.push(result);
  }
  
  // Summary
  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  log('\n📊 Test Results Summary:', 'blue');
  log(`  ✅ Passed: ${passed}`, passed > 0 ? 'green' : 'reset');
  log(`  ❌ Failed: ${failed}`, failed > 0 ? 'red' : 'reset');
  log(`  📈 Success Rate: ${((passed / results.length) * 100).toFixed(1)}%\n`, 'blue');
  
  if (failed > 0) {
    log('❌ Deployment verification failed!', 'red');
    log('\nFailed tests:', 'red');
    results
      .filter(r => !r.success)
      .forEach(r => log(`  - ${r.test}: ${r.error}`, 'red'));
    
    process.exit(1);
  } else {
    log('✅ All tests passed! Deployment verification successful.', 'green');
    process.exit(0);
  }
}

// Performance test
async function performanceTest(baseUrl) {
  log('\n⚡ Running performance test...', 'blue');
  
  const start = Date.now();
  try {
    await makeRequest(`${baseUrl}/`, 10000);
    const loadTime = Date.now() - start;
    
    log(`  Load time: ${loadTime}ms`, loadTime < 3000 ? 'green' : loadTime < 5000 ? 'yellow' : 'red');
    
    if (loadTime > 5000) {
      log('  ⚠️  Warning: Page load time is slower than recommended (>5s)', 'yellow');
    }
  } catch (error) {
    log(`  ❌ Performance test failed: ${error.message}`, 'red');
  }
}

// SSL certificate check
async function sslCheck(baseUrl) {
  if (!baseUrl.startsWith('https://')) {
    log('\n🔒 Skipping SSL check (not HTTPS)', 'yellow');
    return;
  }
  
  log('\n🔒 Checking SSL certificate...', 'blue');
  
  try {
    const urlObj = new URL(baseUrl);
    
    return new Promise((resolve, reject) => {
      const options = {
        hostname: urlObj.hostname,
        port: 443,
        method: 'GET',
        path: '/',
      };
      
      const req = https.request(options, (res) => {
        const cert = res.connection.getPeerCertificate();
        
        if (cert && cert.valid_from && cert.valid_to) {
          const validFrom = new Date(cert.valid_from);
          const validTo = new Date(cert.valid_to);
          const now = new Date();
          
          log(`  Certificate valid from: ${validFrom.toISOString()}`, 'green');
          log(`  Certificate valid to: ${validTo.toISOString()}`, 'green');
          
          if (now < validFrom || now > validTo) {
            log('  ❌ SSL certificate is not valid for current date', 'red');
          } else {
            log('  ✅ SSL certificate is valid', 'green');
          }
        }
        
        resolve();
      });
      
      req.on('error', (error) => {
        log(`  ❌ SSL check failed: ${error.message}`, 'red');
        resolve();
      });
      
      req.end();
    });
  } catch (error) {
    log(`  ❌ SSL check failed: ${error.message}`, 'red');
  }
}

// Main execution
async function main() {
  const baseUrl = process.argv[2];
  
  if (!baseUrl) {
    log('❌ Error: Base URL is required', 'red');
    log('Usage: node verify-deployment.js <base-url>', 'yellow');
    log('Example: node verify-deployment.js https://astralcore.io', 'yellow');
    process.exit(1);
  }
  
  try {
    new URL(baseUrl);
  } catch (error) {
    log('❌ Error: Invalid URL provided', 'red');
    process.exit(1);
  }
  
  log('🔍 AstralCore Deployment Verification Tool', 'blue');
  log('==========================================\n', 'blue');
  
  await verifyDeployment(baseUrl);
  await performanceTest(baseUrl);
  await sslCheck(baseUrl);
  
  log('\n🎉 Deployment verification completed!', 'green');
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  log(`❌ Uncaught exception: ${error.message}`, 'red');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log(`❌ Unhandled rejection at ${promise}: ${reason}`, 'red');
  process.exit(1);
});

if (require.main === module) {
  main();
}

module.exports = { verifyDeployment, performanceTest, sslCheck };
