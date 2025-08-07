import { fetchAllData, fetchSystemStats, fetchUserData } from './data-aggregator';

export async function testDataFetching() {
  console.log('🚀 Testing data fetching functionality...');
  
  try {
    // Test system stats
    console.log('\n📊 Fetching system stats...');
    const stats = await fetchSystemStats();
    console.log('System Stats:', {
      totalUsers: stats.totalUsers,
      publicChatMessages: stats.publicChatMessageCount,
      totalNotifications: stats.totalNotifications,
    });

    // Test user data
    console.log('\n👤 Fetching user data for mock-user-123...');
    const userData = await fetchUserData('mock-user-123');
    console.log('User Data:', {
      hasUser: !!userData.user,
      hasProfile: !!userData.profile,
      notificationCount: userData.notifications.length,
      balance: userData.user?.balances,
    });

    // Test full data
    console.log('\n🗂️  Fetching all data...');
    const allData = await fetchAllData();
    console.log('All Data Summary:', {
      totalUsers: allData.users.totalUsers,
      walletsCount: Object.keys(allData.users.wallets).length,
      publicChatCount: allData.communications.publicChat.length,
      fetchTime: allData.metadata.fetchedAt,
    });

    console.log('\n✅ All data fetching tests completed successfully!');
    return { success: true, data: allData };
  } catch (error) {
    console.error('❌ Data fetching test failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Export for use in API or components
export { fetchAllData, fetchSystemStats, fetchUserData };
