// Mock implementation for promotions since Supabase is removed.

export type Promotion = {
  id: string;
  created_at: string;
  title: string;
  description: string;
  image_url?: string;
  status: 'Upcoming' | 'Active' | 'Expired';
};

const mockPromotions: Omit<Promotion, 'id' | 'created_at'>[] = [
    {
        title: "Summer Trading Bonus",
        description: "Get a 10% bonus on all deposits made during the summer season. Don't miss out on this hot offer!",
        image_url: "https://placehold.co/600x400.png",
        status: "Active"
    },
    {
        title: "New User Welcome Gift",
        description: "All new users who verify their account receive a free $25 trading voucher.",
        image_url: "https://placehold.co/600x400.png",
        status: "Active"
    }
];

// Fetches all promotions from the mock data
export async function getPromotions(): Promise<Promotion[]> {
    // Add dynamic IDs and created_at dates to simulate a real database
    return mockPromotions.map((p, index) => ({
        ...p,
        id: `promo-${index + 1}`,
        created_at: new Date(Date.now() - (index + 1) * 2 * 24 * 60 * 60 * 1000).toISOString(),
    }));
}
