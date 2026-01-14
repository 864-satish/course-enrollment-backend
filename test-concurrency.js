/**
 * Test script to verify distributed locking prevents conflicting timetable entries
 * 
 * Usage: node test-concurrency.js
 * 
 * This script simulates two admins trying to create conflicting timetables:
 * - Admin 1: Tuesday 10:00-12:00
 * - Admin 2: Tuesday 11:00-13:00 (overlaps with Admin 1)
 * 
 * Expected: Admin 1 succeeds, Admin 2 fails with "Timetable clash detected"
 */

const BASE_URL = 'http://localhost:3000';

async function createTimetable(adminName, courseId, dayOfWeek, startTime, endTime) {
  try {
    console.log(`[${adminName}] Attempting to create timetable: ${dayOfWeek} ${startTime}-${endTime}`);
    
    const response = await fetch(`${BASE_URL}/courses/${courseId}/timetables`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        dayOfWeek,
        startTime,
        endTime,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log(`[${adminName}] ✓ SUCCESS - Timetable created:`, data);
      return { success: true, data };
    } else {
      console.log(`[${adminName}] ✗ FAILED - ${data.message || JSON.stringify(data)}`);
      return { success: false, error: data };
    }
  } catch (error) {
    console.log(`[${adminName}] ✗ ERROR - ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function testConcurrency() {
  console.log('='.repeat(60));
  console.log('Testing Concurrent Timetable Creation with Redlock');
  console.log('='.repeat(60));
  console.log();

  const courseId = 1; // Make sure this course exists in your database

  // Simulate two admins trying to create conflicting timetables simultaneously
  const [result1, result2] = await Promise.all([
    createTimetable('Admin 1', courseId, 'tuesday', '10:00:00', '12:00:00'),
    createTimetable('Admin 2', courseId, 'tuesday', '11:00:00', '13:00:00'),
  ]);

  console.log();
  console.log('='.repeat(60));
  console.log('Test Results:');
  console.log('='.repeat(60));
  
  if (result1.success && !result2.success) {
    console.log('✓ TEST PASSED: Admin 1 succeeded, Admin 2 failed (as expected)');
  } else if (!result1.success && result2.success) {
    console.log('✓ TEST PASSED: Admin 2 succeeded, Admin 1 failed (as expected)');
  } else if (result1.success && result2.success) {
    console.log('✗ TEST FAILED: Both admins succeeded (should not happen!)');
  } else {
    console.log('⚠ UNEXPECTED: Both admins failed');
  }
  
  console.log();
}

// Run the test
testConcurrency().catch(console.error);
