#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Testing AstralCore Hyperdrive Platform...\n');

// Test 1: Check if key files exist
const keyFiles = [
  'src/app/page.tsx',
  'src/app/login/page.tsx',
  'src/app/dashboard/layout.tsx',
  'src/app/faq/page.tsx',
  'tailwind.config.ts',
  'src/lib/auth.ts',
  'netlify.toml',
  'public/sitemap.xml'
];

console.log('✅ Testing file existence...');
keyFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✓ ${file} exists`);
  } else {
    console.log(`   ✗ ${file} missing`);
  }
});

// Test 2: Check if old "Quantum" references still exist
console.log('\n🔍 Checking for remaining "Quantum" references...');
const checkFiles = [
  'src/app/page.tsx',
  'src/app/login/page.tsx',
  'src/app/dashboard/layout.tsx',
  'src/app/faq/page.tsx'
];

let quantumFound = false;
checkFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf-8');
    const quantumMatches = content.match(/quantum/gi);
    if (quantumMatches) {
      console.log(`   ⚠️  Found ${quantumMatches.length} "quantum" references in ${file}`);
      quantumFound = true;
    } else {
      console.log(`   ✓ No "quantum" references in ${file}`);
    }
  }
});

// Test 3: Check if "Hyperdrive" references exist
console.log('\n🔍 Checking for "Hyperdrive" references...');
let hyperdriveFound = false;
checkFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf-8');
    const hyperdriveMatches = content.match(/hyperdrive/gi);
    if (hyperdriveMatches) {
      console.log(`   ✓ Found ${hyperdriveMatches.length} "hyperdrive" references in ${file}`);
      hyperdriveFound = true;
    } else {
      console.log(`   ⚠️  No "hyperdrive" references in ${file}`);
    }
  }
});

// Test 4: Check package.json
console.log('\n✅ Testing package.json...');
if (fs.existsSync('package.json')) {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  console.log(`   ✓ Package name: ${pkg.name}`);
  console.log(`   ✓ Version: ${pkg.version}`);
  console.log(`   ✓ Dependencies: ${Object.keys(pkg.dependencies || {}).length} packages`);
}

// Summary
console.log('\n📋 Summary:');
if (quantumFound) {
  console.log('   ⚠️  Warning: Some "Quantum" references still exist');
} else {
  console.log('   ✅ All "Quantum" references have been updated');
}

if (hyperdriveFound) {
  console.log('   ✅ "Hyperdrive" branding is in place');
} else {
  console.log('   ⚠️  Warning: No "Hyperdrive" references found');
}

console.log('\n🎉 AstralCore Hyperdrive Platform verification complete!');
