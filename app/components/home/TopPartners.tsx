  // import { supabase } from "@/api/client";
  // import type { Profile } from "@/types/profile";

  // export default async function TopPartner() {
  //   const { data, error } = await supabase .from("profiles") .select("*")

  //   if (error) {
  //     console.error("Error fetching profiles:", error.message);
  //     return <div>Failed to load profiles</div>;
  //   }

  //   if (!data || data.length === 0) {
  //     return <div>No profiles found</div>;
  //   }

  //   const profiles: Profile[] = data;

  //   return (
  //     <div>
  //       <h2>Top profiles</h2>
  //       <ul>
  //         {profiles.map((p) => (
  //           <li key={p.id}>
  //             {p.full_name ?? p.username ?? "No name"}{" "}
  //             {p.website && <span>({p.website})</span>}
  //           </li>
  //         ))}
  //       </ul>
  //     </div>
  //   );
  // }

export default function TopPartners() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Top Partners</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          <div className="flex items-center justify-center h-24 bg-gray-100 rounded-lg">
            <span className="text-gray-500">Partner 1</span>
          </div>
          <div className="flex items-center justify-center h-24 bg-gray-100 rounded-lg">
            <span className="text-gray-500">Partner 2</span>
          </div>
          <div className="flex items-center justify-center h-24 bg-gray-100 rounded-lg">
            <span className="text-gray-500">Partner 3</span>
          </div>
          <div className="flex items-center justify-center h-24 bg-gray-100 rounded-lg">
            <span className="text-gray-500">Partner 4</span>
          </div>
        </div>
      </div>
    </div>
  );
}