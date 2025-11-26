## 🚀 Requirements

Before starting, install:

* **Node.js 18+**
* **npm**
* **Supabase account** → [https://supabase.com](https://supabase.com)
* **VS Code** (recommended)

---

## 📦 1. Install Dependencies

Clone the project and install packages:

```bash
git clone https://github.com/YOUR_USERNAME/flowintoone.git
cd flowintoone
npm install
```

This installs:

* Next.js
* React
* Supabase client
* TailwindCSS (if included)
* Supabase CLI (local dev dependency)

---

## 🔑 2. Create `.env.local`

Inside the project root, create:

```
.env.local
```

Add your Supabase keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

Find these in:

> Supabase Dashboard → Project Settings → API

⚠️ **Never commit `.env.local`** to Git.

---

## 🧠 3. Supabase CLI Setup

The CLI is installed locally.
Use `npx` to run it:

### Login:

```bash
npx supabase login
```

Follow the browser login flow.

---

## 🗄️ 4. Generate Supabase Types

Whenever the database schema changes (new table, new column…):

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_REF > types/supabase.ts
```

Find your project ref under:

> Supabase → Settings → General → **Project Reference**

This regenerates:

```
types/supabase.ts
```

It contains:

* All tables
* All columns
* Row / Insert / Update types
* Full typed database schema

✔️ **Commit this file** (it belongs in the repo).

---

## ▶️ 5. Run the Development Server

Start the app:

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

---

## 💡 6. Supabase Client (Already Configured)

Location:

```
/api/client.ts
```

Example usage:

```ts
import { supabase } from "@/api/client";

const { data, error } = await supabase
  .from("profiles")
  .select("*");
```

TypeScript knows all tables and columns because of:

```ts
import type { Database } from "@/types/supabase";
```

---

## 🧩 7. Typed Row Usage

```ts
import type { Database } from "@/types/supabase";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
```

Example:

```ts
const { data } = await supabase.from("profiles").select("*");

data?.map((user: Profile) => {
  console.log(user.full_name, user.username);
});
```

---

## 🌍 8. Build for Production

```bash
npm run build
npm start
```

Deploy to **Vercel** for best results.

Add environment variables in:

> Vercel → Project Settings → Environment Variables

---

## 🔄 9. Updating the Project After DB Changes

Whenever you:

* add a table
* add a column
* change structure

Regenerate the Supabase types:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_REF > types/supabase.ts
```

Commit the updated file.

Your code and Supabase database stay in sync.

---

## ✔️ 10. Summary for New Developers

| Task              | Command                                                                  |
| ----------------- | ------------------------------------------------------------------------ |
| Install all deps  | `npm install`                                                            |
| Run dev server    | `npm run dev`                                                            |
| Login to Supabase | `npx supabase login`                                                     |
| Generate types    | `npx supabase gen types typescript --project-id REF > types/supabase.ts` |
| Build             | `npm run build`                                                          |
| Production start  | `npm start`                                                              |

---
