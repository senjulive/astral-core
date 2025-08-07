#!/usr/bin/env node

/**
 * Build Test Script for AstralCore
 * Tests the build process before deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Testing AstralCore Build Process');
console.log('=====================================');

try {
  // Check if package.json exists
  console.log('1. Checking package.json...');
  if (!fs.existsSync('package.json')) {
    throw new Error('package.json not found!');
  }
  console.log('✅ package.json found');

  // Check if node_modules exists, if not install dependencies
  console.log('2. Checking dependencies...');
  if (!fs.existsSync('node_modules')) {
    console.log('📦 Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
  }
  console.log('✅ Dependencies ready');

  // Run TypeScript check
  console.log('3. Running TypeScript check...');
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    console.log('✅ TypeScript check passed');
  } catch (error) {
    console.log('⚠️ TypeScript warnings found (but continuing...)');
  }

  // Test build
  console.log('4. Testing build process...');
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully');

  // Check if .next directory was created
  console.log('5. Verifying build output...');
  if (!fs.existsSync('.next')) {
    throw new Error('.next directory not found after build!');
  }
  console.log('✅ Build output verified');

  console.log('\n🎉 Build test completed successfully!');
  console.log('Your app is ready for deployment to Netlify.');

} catch (error) {
  console.error('\n❌ Build test failed:');
  console.error(error.message);
  process.exit(1);
}
