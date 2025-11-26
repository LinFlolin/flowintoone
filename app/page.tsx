import { supabase } from "@/api/client";
import type { Profile } from "@/types/profile";

export default async function Home() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*");

  console.log("DATA:", data);
  console.log("ERROR:", error);

  if (error) {
    return <main>Errore: {error.message}</main>;
  }

  return (
    <main>
      <h1>Users</h1>
      <ul>
        {data?.map((user: Profile) => (
          <li key={user.id}>
            {user.full_name}  {user.username}  {user.website}
          </li>
        ))}
      </ul>
    </main>
  );
}
