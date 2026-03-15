/** Profile returned by /api/profile/ and /api/auth/login/ */
export interface Profile {
  id: number;
  username: string;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string | null;
  address_line1: string;
  address_line2: string;
  city: string;
  postal_code: string;
  location: number | null;
  location_detail: Record<string, unknown> | null;
  current_tier: number | null;
  current_tier_detail: { tier_id: string; name: string } | null;
  theme_mode: string;
  updated_at: string;
}
