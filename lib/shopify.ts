/**
 * Shopify Storefront API client (headless).
 *
 * Configure via environment variables (e.g. .env.local, or Vercel project env):
 *   SHOPIFY_STORE_DOMAIN      = your-store.myshopify.com
 *   SHOPIFY_STOREFRONT_TOKEN  = the public Storefront API access token
 *
 * Until those are set, the app falls back to the bundled catalogue so the site
 * still renders. Cart/checkout require the token (createCart returns a Shopify
 * checkoutUrl to redirect the customer to).
 */
import { FALLBACK_PRODUCTS, type Product } from "./products";

const DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;
const API_VERSION = "2024-07";

export const shopifyConfigured = Boolean(DOMAIN && TOKEN);

async function storefront<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!DOMAIN || !TOKEN) throw new Error("Shopify Storefront API is not configured.");
  const res = await fetch(`https://${DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
    // Revalidate product data periodically (ISR-friendly).
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Shopify API error ${res.status}`);
  const json = (await res.json()) as { data: T; errors?: unknown };
  if (json.errors) throw new Error(`Shopify GraphQL error: ${JSON.stringify(json.errors)}`);
  return json.data;
}

type GqlProducts = {
  products: {
    edges: {
      node: {
        handle: string;
        title: string;
        description: string;
        tags: string[];
        featuredImage: { url: string } | null;
        priceRange: { minVariantPrice: { amount: string } };
        variants: { edges: { node: { id: string } }[] };
      };
    }[];
  };
};

/** Returns the live catalogue from Shopify, or the bundled fallback. */
export async function getProducts(): Promise<Product[]> {
  if (!shopifyConfigured) return FALLBACK_PRODUCTS;
  try {
    const data = await storefront<GqlProducts>(`
      query Products {
        products(first: 24, sortKey: CREATED_AT, reverse: true) {
          edges { node {
            handle title description tags
            featuredImage { url }
            priceRange { minVariantPrice { amount } }
            variants(first: 1) { edges { node { id } } }
          } }
        }
      }
    `);
    return data.products.edges
      .filter((e) => !e.node.tags.includes("packages"))
      .map((e) => ({
        handle: e.node.handle,
        title: e.node.title,
        en: e.node.title,
        tag: e.node.tags[0] ?? "",
        desc: e.node.description,
        price: Number(e.node.priceRange.minVariantPrice.amount),
        image: e.node.featuredImage?.url ?? "",
        variantId: e.node.variants.edges[0]?.node.id,
      }));
  } catch {
    return FALLBACK_PRODUCTS;
  }
}

/** Creates a Shopify cart with one line and returns its checkout URL. */
export async function createCart(merchandiseId: string, quantity = 1): Promise<string | null> {
  if (!shopifyConfigured) return null;
  const data = await storefront<{ cartCreate: { cart: { checkoutUrl: string } } }>(
    `mutation Create($lines: [CartLineInput!]) {
       cartCreate(input: { lines: $lines }) {
         cart { checkoutUrl }
         userErrors { message }
       }
     }`,
    { lines: [{ merchandiseId, quantity }] }
  );
  return data.cartCreate?.cart?.checkoutUrl ?? null;
}
