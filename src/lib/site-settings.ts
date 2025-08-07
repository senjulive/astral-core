

export type SiteSettings = {
  usdtDepositAddress: string;
  ethDepositAddress: string;
  btcDepositAddress: string;
};

export const defaultSiteSettings: SiteSettings = {
  usdtDepositAddress: 'TPAj58tX5n2hXpYZAe5V6b4s8g1zB4hP7x', // Default placeholder
  ethDepositAddress: '0x3F5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE', // Default placeholder
  btcDepositAddress: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', // Default placeholder
};

let cachedSettings: SiteSettings | null = null;

export async function getSiteSettings(): Promise<SiteSettings> {
  if (cachedSettings) {
    return cachedSettings;
  }
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/public-settings?key=siteSettings`);
    if (response.ok) {
        const data = await response.json();
        if (data) {
            cachedSettings = data;
            return data;
        }
    }
  } catch (error) {
    console.error("Could not fetch site settings, using defaults.", error);
  }

  cachedSettings = defaultSiteSettings;
  return defaultSiteSettings;
}
