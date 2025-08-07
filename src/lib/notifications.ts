// Mock implementation for notifications using a simple JSON structure.
import initialNotifications from '../../data/notifications.json';

let mockNotifications: Record<string, any[]> = initialNotifications;
const MOCK_USER_ID = 'mock-user-123';

export type Notification = {
  id: string;
  user_id?: string; // Made optional for mock
  created_at?: string; // Made optional for mock
  date: number; // Using timestamp for sorting
  title: string;
  content: string;
  read: boolean;
  href?: string;
};

// Fetches notifications for the mock user
export async function getNotifications(userId: string): Promise<Notification[]> {
    const userNotifications = mockNotifications[userId] || [];
    return userNotifications.sort((a, b) => b.date - a.date);
}

// Adds a notification for a specific user
export async function addNotification(userId: string, notificationData: Omit<Notification, 'id' | 'date' | 'read'>): Promise<void> {
    if (!mockNotifications[userId]) {
        mockNotifications[userId] = [];
    }
    const newNotification: Notification = {
        ...notificationData,
        id: `notif-${Date.now()}`,
        date: Date.now(),
        read: false,
    };
    mockNotifications[userId].unshift(newNotification);
}

// Mock function for platform notifications
export async function addPlatformNotification(notificationData: Omit<Notification, 'id' | 'date' | 'read' | 'user_id'>): Promise<void> {
    console.log("Platform Notification Added:", notificationData.title);
    // In a real non-Supabase setup, this would notify admins/mods via another service.
}

export const addAdminNotification = addPlatformNotification;

export async function markAllAsRead(userId: string): Promise<Notification[]> {
    if (mockNotifications[userId]) {
        mockNotifications[userId].forEach(n => n.read = true);
        return getNotifications(userId);
    }
    return [];
}

export async function clearNotifications(userId: string): Promise<void> {
    if (mockNotifications[userId]) {
        mockNotifications[userId] = [];
    }
}

export async function getAllNotifications(): Promise<Record<string, Notification[]>> {
    return mockNotifications;
}
