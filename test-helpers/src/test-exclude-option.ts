#!/usr/bin/env tsx
/**
 * Test script to verify the exclude option works for the precompiled-exclude fixture.
 *
 * Usage: tsx test-exclude-option.ts
 */

import { startFixture } from './startFixture';

async function main() {
  console.log('=== Testing precompiled-exclude fixture ===\n');

  // Test 1: Build SHOULD FAIL without exclude option
  console.log('Test 1: Build without exclude option (should fail)...');
  try {
    const server = await startFixture('precompiled-exclude', {
      type: 'vite',
      mode: 'production',
      basePort: 9000,
    } as any);
    await server.close();
    console.log('❌ UNEXPECTED: Build succeeded without exclude option');
    process.exit(1);
  } catch (err: any) {
    if (
      err.message?.includes('Invalid exports') ||
      err.toString().includes('Invalid exports')
    ) {
      console.log('✅ Build correctly failed with "Invalid exports" error\n');
    } else {
      console.log('❌ Build failed with unexpected error:', err.message);
      process.exit(1);
    }
  }

  // Test 2: Build SHOULD SUCCEED with exclude option
  console.log('Test 2: Build with exclude option (should succeed)...');
  try {
    const server = await startFixture('precompiled-exclude', {
      type: 'vite',
      mode: 'production',
      basePort: 9001,
      vanillaExtractOptions: {
        exclude: ['**/precompiled-lib/**'],
      },
    } as any);
    console.log('✅ Build succeeded with exclude option');
    console.log('   Server URL:', server.url);
    await server.close();
  } catch (err: any) {
    console.log('❌ Build failed with exclude option:', err.message);
    process.exit(1);
  }

  console.log('\n=== All tests passed! ===');
}

main();
