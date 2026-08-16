# CHROMOSOME — Professional Cosmetics (Headless)

אתר headless יוקרתי למותג **Chromosome**, בעברית (RTL), בסגנון כהה־זהב
"קסום בגבול המודרני". בנוי ב-**Next.js (App Router)** ומתחבר ל-**Shopify
Storefront API** למוצרים, עגלה וצ׳קאאוט.

## הרצה מקומית
```bash
npm install
cp .env.example .env.local   # מלא את פרטי Shopify (ראו למטה)
npm run dev                  # http://localhost:3000
```
בלי טוקן Shopify האתר עדיין רץ ומשתמש בקטלוג מקומי (fallback).

## חיבור ל-Shopify (headless)
מלא ב-`.env.local` (ובהגדרות Vercel):
```
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=<Storefront API access token>
```
יצירת הטוקן: Shopify Admin → Settings → Apps → **Develop apps** → צור אפליקציה →
**Storefront API scopes**: `unauthenticated_read_product_listings`,
`unauthenticated_read_product_inventory`, `unauthenticated_write_checkouts`,
`unauthenticated_read_checkouts` → Install → העתק את ה-**Storefront access token**.

## מבנה
```
app/layout.tsx      — RTL, פונט Suez One, ניווט, מטא
app/page.tsx        — 2 סקשני וידאו (scroll-scrub) + מוצרים + רכיבים + סיפור + פוטר
app/globals.css     — מערכת העיצוב (כהה/זהב)
components/ScrollVideo.tsx — הווידאו שנשלט בגלילה (קדימה/אחורה)
components/ProductCard.tsx — כרטיס מוצר + הוספה לעגלה (Shopify)
lib/shopify.ts      — קליינט Storefront API (+ fallback)
lib/products.ts     — טיפוסים + קטלוג fallback
brand-assets/       — הלוגו והפונט המקוריים
```

## סרטוני ה-Hero
שני הסרטונים ב-`app/page.tsx` (`VIDEO_A`, `VIDEO_B`):
- **סרטון א׳** מתנגן ~שנייה לבד, ואז נשלט בגלילה (למטה=קדימה, למעלה=אחורה).
- **סרטון ב׳** סטטי עד שגוללים אליו, ואז נשלט בגלילה.

> ⚠️ הסרטונים הנוכחיים הם לגרסת **מובייל**. נדרשים סרטוני **דסקטופ** נפרדים
> (או טיפול נפרד לדסקטופ) — ראו TODO בקוד.

## פריסה
Vercel → Import את הריפו → הוסף את משתני הסביבה של Shopify → Deploy.
```
