'use client';

import { useEffect, useState } from 'react';
import { createShop, getMyShop, updateShop, deleteShop } from '@/api/shops_api';
import type { Shops } from '@/types/shop';

export default function ShopForm() {
  const [shop, setShop] = useState<Shops | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // READ: load current user's shop on mount
  useEffect(() => {
    (async () => {
      try {
        const s = await getMyShop();
        setShop(s);
        if (s) {
          setName(s.shop_name ?? '');
          setDescription(s.shop_description ?? '');
        }
      } catch (err: any) {
        setError(err.message ?? 'Failed to load shop');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!shop) {
        // CREAT
        const created = await createShop({
          shop_name: name,
          shop_description: description,
          shop_img_url: null,
          shop_categorie: null,
          shop_likes: 0,
          shop_adress: null,
          shop_slug: name.toLowerCase().replace(/\s+/g, '-'),
          layout_id: null,
          colors: null,
          fonts: null,
          config: null,
        });
        setShop(created);
      } else {
        // UPDATE
        const updated = await updateShop(shop.id, {
          shop_name: name,
          shop_description: description,
        });
        setShop(updated);
      }
    } catch (err: any) {
      setError(err.message ?? 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!shop) return;
    if (!confirm('Delete your shop?')) return;

    try {
      await deleteShop(shop.id);
      setShop(null);
      setName('');
      setDescription('');
    } catch (err: any) {
      setError(err.message ?? 'Delete failed');
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>{shop ? 'Edit Shop' : 'Create Shop'}</h2>

      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-md">
        <label>
          Shop name
          <input
            className="border px-2 py-1 w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Description
          <textarea
            className="border px-2 py-1 w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="border px-4 py-1 mt-2"
        >
          {saving ? 'Saving...' : shop ? 'Update shop' : 'Create shop'}
        </button>
      </form>

      {shop && (
        <button
          onClick={handleDelete}
          className="border px-4 py-1 mt-4"
        >
          Delete shop
        </button>
      )}
    </div>
  );
}
