import { Product, ProductSize } from './types';
import { isSupabaseConfigured, supabase } from './supabase';

type ProductRow = {
  id: string;
  name: string;
  category: string;
  base_price: number;
  images: string[] | null;
  sizes: ProductSize[] | null;
  description: string;
  specs: string[] | null;
  name_i18n: Product['nameI18n'] | null;
  description_i18n: Product['descriptionI18n'] | null;
  specs_i18n: Product['specsI18n'] | null;
  featured: boolean | null;
  visible: boolean | null;
  position: number | null;
};

export type CatalogSource = 'local' | 'supabase' | 'supabase-fallback';

const normalizeProduct = (product: Product): Product => ({
  ...product,
  images: Array.isArray(product.images) ? product.images : [],
  sizes: Array.isArray(product.sizes) ? product.sizes : [],
  specs: Array.isArray(product.specs) ? product.specs : [],
  featured: Boolean(product.featured),
  visible: product.visible !== false,
});

const rowToProduct = (row: ProductRow): Product =>
  normalizeProduct({
    id: row.id,
    name: row.name,
    category: row.category,
    basePrice: row.base_price,
    images: row.images || [],
    sizes: row.sizes || [],
    description: row.description,
    specs: row.specs || [],
    nameI18n: row.name_i18n || undefined,
    descriptionI18n: row.description_i18n || undefined,
    specsI18n: row.specs_i18n || undefined,
    featured: Boolean(row.featured),
    visible: row.visible !== false,
  });

const productToRow = (product: Product, position: number): ProductRow => ({
  id: product.id,
  name: product.name,
  category: product.category,
  base_price: product.basePrice,
  images: product.images,
  sizes: product.sizes,
  description: product.description,
  specs: product.specs,
  name_i18n: product.nameI18n || null,
  description_i18n: product.descriptionI18n || null,
  specs_i18n: product.specsI18n || null,
  featured: Boolean(product.featured),
  visible: product.visible !== false,
  position,
});

export const loadCatalogProducts = async (): Promise<{ products: Product[] | null; source: CatalogSource }> => {
  if (!isSupabaseConfigured || !supabase) {
    return { products: null, source: 'local' };
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select(
        'id,name,category,base_price,images,sizes,description,specs,name_i18n,description_i18n,specs_i18n,featured,visible,position'
      )
      .order('position', { ascending: true })
      .order('id', { ascending: true });

    if (error) throw error;

    return {
      products: (data as ProductRow[]).map(rowToProduct),
      source: 'supabase',
    };
  } catch {
    return { products: null, source: 'supabase-fallback' };
  }
};

export const saveCatalogProductsToSupabase = async (products: Product[]) => {
  if (!isSupabaseConfigured || !supabase) return { saved: false as const };

  const rows = products.map((product, index) => productToRow(normalizeProduct(product), index));
  const ids = rows.map((row) => row.id);

  const { error: upsertError } = await supabase.from('products').upsert(rows, { onConflict: 'id' });
  if (upsertError) throw upsertError;

  if (ids.length > 0) {
    const quotedIds = `(${ids.map((id) => `"${id}"`).join(',')})`;
    const { error: deleteError } = await supabase.from('products').delete().not('id', 'in', quotedIds);
    if (deleteError) throw deleteError;
  }

  return { saved: true as const };
};
