// Unified account + profile, linked to auth.users.id (UUID)
export type Profile = {
  id: string; // UUID = auth.users.id
  username?: string | null;
  fullName?: string | null;
  avatarUrl?: string | null;
  bio?: string | null;

  role: "owner" | "customer" | "admin";

  // account fields merged in:
  plan: "free" | "basic" | "premium" | "enterprise";
  status: "active" | "inactive" | "suspended" | "cancelled";
  renewalDate?: string | null;
  stripeCustomerId?: string | null;
  notes?: string | null;

  createdAt: string; // timestamptz
  updatedAt: string; // timestamptz
};

// Shop now points to Profile.id (UUID)
export type Shop = {
  id: number;
  name: string;
  address: string;
  partitaIva?: string | null;  // camelCase in TS, snake_case in DB is fine
  ownerId: string;             // UUID → profiles.id
  category: "artisan" | "shop" | "supplier" | "freelancer";
  description?: string | null;
  image?: string | null;
  createdAt: string;           // timestamptz
};
