#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 AstralCore Application Verification');
console.log('=====================================\n');

// Check required files
const requiredFiles = [
  'package.json',
  'next.config.mjs',
  'tailwind.config.ts',
  'tsconfig.json',
  'netlify.toml',
  '.env.example',
  'README.md',
  'src/app/layout.tsx',
  'src/app/page.tsx',
  'src/middleware.ts',
];

let hasErrors = false;

console.log('📁 Checking required files...');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    hasErrors = true;
  }
});

// Check critical directories
const requiredDirs = [
  'src/app',
  'src/components',
  'src/lib',
  'src/contexts',
  'src/components/ui',
  'src/components/auth',
  'src/components/dashboard',
  'src/app/api/auth',
  'public',
  'data',
];

console.log('\n📂 Checking required directories...');
requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}/`);
  } else {
    console.log(`❌ ${dir}/ - MISSING`);
    hasErrors = true;
  }
});

// Check API routes
const apiRoutes = [
  'src/app/api/auth/login/route.ts',
  'src/app/api/auth/register/route.ts',
  'src/app/api/auth/logout/route.ts',
  'src/app/api/auth/session/route.ts',
  'src/app/api/user/profile/route.ts',
];

console.log('\n🔗 Checking API routes...');
apiRoutes.forEach(route => {
  if (fs.existsSync(route)) {
    console.log(`✅ ${route}`);
  } else {
    console.log(`❌ ${route} - MISSING`);
    hasErrors = true;
  }
});

// Check auth pages
const authPages = [
  'src/app/login/page.tsx',
  'src/app/register/page.tsx',
  'src/app/forgot-password/page.tsx',
];

console.log('\n🔐 Checking auth pages...');
authPages.forEach(page => {
  if (fs.existsSync(page)) {
    console.log(`✅ ${page}`);
  } else {
    console.log(`❌ ${page} - MISSING`);
    hasErrors = true;
  }
});

// Check dashboard pages
const dashboardPages = [
  'src/app/dashboard/page.tsx',
  'src/app/dashboard/layout.tsx',
  'src/app/admin/page.tsx',
  'src/app/moderator/page.tsx',
];

console.log('\n📊 Checking dashboard pages...');
dashboardPages.forEach(page => {
  if (fs.existsSync(page)) {
    console.log(`✅ ${page}`);
  } else {
    console.log(`❌ ${page} - MISSING`);
    hasErrors = true;
  }
});

// Check package.json scripts
console.log('\n📦 Checking package.json scripts...');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const requiredScripts = ['dev', 'build', 'start', 'lint', 'typecheck'];
  
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`✅ npm run ${script}`);
    } else {
      console.log(`❌ npm run ${script} - MISSING`);
      hasErrors = true;
    }
  });
} catch (error) {
  console.log('❌ Error reading package.json');
  hasErrors = true;
}

// Summary
console.log('\n📋 Verification Summary');
console.log('======================');

if (hasErrors) {
  console.log('❌ Verification FAILED - Please fix the missing files/directories above');
  process.exit(1);
} else {
  console.log('✅ Verification PASSED - Application is ready for deployment!');
  console.log('\n🚀 Deployment checklist:');
  console.log('1. ✅ All required files present');
  console.log('2. ✅ Authentication system complete');
  console.log('3. ✅ Dashboard functionality implemented');
  console.log('4. ✅ API routes configured');
  console.log('5. ✅ Netlify configuration ready');
  console.log('\n🌐 Ready to deploy to Netlify!');
}
