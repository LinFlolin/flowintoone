export type Shop = {
  id: number;
  name: string;
  address: string;
  partitaIVA?: string;
  ownerId: number;
  category: "artisan" | "shop" | "supplier" | "freelancer";
  description?: string;
  image: string;
  createdAt: string;
};

export type User = {
  id: number;
  username: string;
  name: string;
  image: string;
  bio: string;
  role: "owner" | "customer" | "admin";
  createdAt: string;
};

export type Account = {
  id: number;
  userId: number; 
  plan: "free" | "basic" | "premium" | "enterprise";
  status: "active" | "inactive" | "suspended" | "cancelled";
  renewalDate?: string;
  createdAt: string;
  updatedAt: string;
  stripeCustomerId?: string;
  notes?: string;
};
