import { NextResponse } from "next/server";
import { createCart, shopifyConfigured } from "@/lib/shopify";

/**
 * POST { variantId } -> { checkoutUrl }
 * Creates a Shopify cart and returns the hosted checkout URL to redirect to.
 */
export async function POST(req: Request) {
  if (!shopifyConfigured) {
    return NextResponse.json({ error: "Shopify not configured" }, { status: 503 });
  }
  try {
    const { variantId, quantity } = await req.json();
    if (!variantId) {
      return NextResponse.json({ error: "Missing variantId" }, { status: 400 });
    }
    const checkoutUrl = await createCart(String(variantId), Number(quantity) || 1);
    if (!checkoutUrl) {
      return NextResponse.json({ error: "Could not create cart" }, { status: 502 });
    }
    return NextResponse.json({ checkoutUrl });
  } catch (e) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
