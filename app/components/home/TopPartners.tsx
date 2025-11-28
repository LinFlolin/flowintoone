import { supabase } from "@/api/client";
import type { Profile } from "@/types/profile";

export default async function TopPartner() {
  const { data, error } = await supabase .from("profiles") .select("*")

  if (error) {
    console.error("Error fetching profiles:", error.message);
    return <div>Failed to load profiles</div>;
  }

  if (!data || data.length === 0) {
    return <div>No profiles found</div>;
  }

  const profiles: Profile[] = data;

  return (
    <div>
      <h2>Top profiles</h2>
      <ul>
        {profiles.map((p) => (
          <li key={p.id}>
            {p.full_name ?? p.username ?? "No name"}{" "}
            {p.website && <span>({p.website})</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
