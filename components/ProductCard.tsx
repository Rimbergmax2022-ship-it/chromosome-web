"use client";

import Image from "next/image";
import { useState } from "react";
import { nis, STORE_URL, type Product } from "@/lib/products";

export default function ProductCard({ product }: { product: Product }) {
  const [busy, setBusy] = useState(false);
  const [label, setLabel] = useState("הוספה לעגלה");

  async function add() {
    // Live Shopify path: create a cart and go to hosted checkout.
    if (product.variantId) {
      setBusy(true);
      setLabel("רגע…");
      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ variantId: product.variantId, quantity: 1 }),
        });
        const data = await res.json();
        if (data.checkoutUrl) {
          window.location.href = data.checkoutUrl;
          return;
        }
        throw new Error();
      } catch {
        setBusy(false);
        setLabel("נסה שוב");
        setTimeout(() => setLabel("הוספה לעגלה"), 1500);
      }
      return;
    }
    // Fallback (no Storefront token yet): open the product on the store.
    window.open(STORE_URL + product.handle, "_blank", "noopener");
  }

  return (
    <article className="pcard">
      <a
        className="pcard__media"
        href={product.variantId ? undefined : STORE_URL + product.handle}
        target={product.variantId ? undefined : "_blank"}
        rel="noopener"
        aria-label={product.title}
        onClick={(e) => { if (product.variantId) e.preventDefault(); }}
      >
        {product.tag ? <span className="pcard__tag">{product.tag}</span> : null}
        {product.image ? (
          <Image
            src={product.image}
            alt={product.title}
            width={640}
            height={800}
            sizes="(max-width: 560px) 100vw, (max-width: 1000px) 50vw, 25vw"
          />
        ) : null}
      </a>
      <div className="pcard__body">
        <h3 className="pcard__name">{product.title}</h3>
        <span className="pcard__en">{product.en}</span>
        <p className="pcard__desc">{product.desc}</p>
        <div className="pcard__foot">
          <span className="pcard__price">{nis(product.price)}</span>
          <button className="pcard__add" onClick={add} disabled={busy}>{label}</button>
        </div>
      </div>
    </article>
  );
}
