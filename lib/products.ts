/**
 * Product type + fallback catalogue.
 *
 * The fallback data below is the real Chromosome catalogue (pulled from the
 * store's products.json) and is used for local preview / when the Shopify
 * Storefront token is not configured. Once SHOPIFY_STORE_DOMAIN +
 * SHOPIFY_STOREFRONT_TOKEN are set, `getProducts()` in lib/shopify.ts fetches
 * live data from Shopify instead.
 */
export type Product = {
  handle: string;
  title: string;      // Hebrew display name
  en: string;         // English name
  tag: string;
  desc: string;
  price: number;
  image: string;      // primary image URL (Shopify CDN)
  variantId?: string; // Shopify variant GID (present when live data is used)
};

export const STORE_URL = "https://chromosomecosmetics.com/products/";

const CDN = "https://cdn.shopify.com/s/files/1/0792/1342/8965/files/";

export const FALLBACK_PRODUCTS: Product[] = [
  { handle: "deep-nourishing-cream", en: "Deep Nourishing Cream", tag: "רב מכר", title: "קרם הזנה עמוק",
    desc: "פורמולה עשירה מחמאת שיאה, מנגו ושמנים בכבישה קרה — הזנה עמוקה שמחזירה לעור רכות וברק טבעי.",
    price: 129.9, image: CDN + "IMG_8914.jpg?v=1767447064" },
  { handle: "cell-restore-cream", en: "Cell Restore Cream", tag: "פרימיום", title: "קרם לשיקום העור",
    desc: "קרם עשיר לשיקום עור יבש במיוחד, מגורה או סדוק. חמאת שיאה וקקאו וקומפלקס שמנים בכבישה קרה.",
    price: 169.9, image: CDN + "92B4262D-79F7-4E12-A262-722B4182B80D.jpg?v=1778480312" },
  { handle: "foot-cream", en: "Foot Cream", tag: "רגליים", title: "קרם רגליים",
    desc: "קרם עשיר המזין את עור כף הרגל ושומר על רכות, גמישות ולחות מתמשכת לאורך היום.",
    price: 119.9, image: CDN + "7980E029-1E3D-4BBA-A1E2-47269A7A0B11.png?v=1778480313" },
  { handle: "hand-cream", en: "Hand Cream", tag: "ידיים", title: "קרם ידיים",
    desc: "חמאת שיאה, אלוורה ושמני פירות טבעיים — מרקם קליל שנספג מהר ומותיר ידיים רכות ונעימות.",
    price: 119.9, image: CDN + "502D02F3-81E7-4BA9-83FC-3BB6FA0DCFE2.jpg?v=1778480312" },
  { handle: "body-cream", en: "Body Cream", tag: "גוף", title: "קרם גוף",
    desc: "נוסחה עשירה עם חמאת שיאה ואלוורה, ויטמין E ותמצית קלנדולה — הזנה עמוקה לעור גוף גמיש ורגוע.",
    price: 119.9, image: CDN + "DD5DC935-F231-43FB-A87D-24A78E41E7C7.png?v=1778480312" },
  { handle: "foot-scrub", en: "Foot Scrub", tag: "פילינג", title: "פילינג לכפות הרגליים",
    desc: "פילינג פחם פעיל ובוץ ים המלח לניקוי יסודי והחלקת עור כף הרגל, לתחושת רעננות ורכות.",
    price: 139.9, image: CDN + "c6d79b90-a29b-49aa-afbd-bb23bdd280f3.jpg?v=1768034543" },
  { handle: "callus-softing-spray", en: "Callus Softening Spray", tag: "רגליים", title: "תרסיס לריכוך יבלות",
    desc: "תרסיס חומצות פירות ותמציות בוטניות לריכוך עור מחוספס והסרת תאים יבשים, עם חומצה היאלורונית ללחות מיידית.",
    price: 118.0, image: CDN + "5AE8739B-A302-4DE0-85D1-9FAD3FF189EA.png?v=1778480312" },
  { handle: "enzimatic-cuticle-remover", en: "Enzymatic Cuticle Remover", tag: "מניקור", title: "מסיר עורמיות אנזימטי",
    desc: "אנזימים טבעיים מפפאיה המרככים את הקוטיקולה וממיסים בעדינות תאי עור עודפים — הסרה עדינה ובטוחה.",
    price: 89.9, image: CDN + "30E682BC-632F-40B4-A82A-D923B4993AE2.png?v=1778480312" },
];

export const nis = (n: number) => "₪" + n.toFixed(2).replace(/\.00$/, "");
