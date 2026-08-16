import ScrollVideo from "@/components/ScrollVideo";
import ProductCard from "@/components/ProductCard";
import Reveal from "@/components/Reveal";
import { getProducts } from "@/lib/shopify";

const VIDEO_A =
  "https://cdn.shopify.com/videos/c/vp/a973874d819e414f9c199d50eb09e285/a973874d819e414f9c199d50eb09e285.SD-480p-1.5Mbps-91731697.mp4";
const VIDEO_B =
  "https://cdn.shopify.com/videos/c/vp/c5139a9cc72a4fb48081eff1f68ec4cd/c5139a9cc72a4fb48081eff1f68ec4cd.SD-480p-1.5Mbps-91731696.mp4";

const INGREDIENTS = [
  { h: "חמאות שיאה, קקאו ומנגו", p: "חמאות עשירות בריכוז גבוה המזינות לעומק ומחזירות לעור רכות וגמישות." },
  { h: "שמנים בכבישה קרה", p: "חוחובה, רוז־היפ, קמיליה ואפרסק — לחות מתמשכת ותמיכה במחסום ההגנה הטבעי." },
  { h: "אנזימי פפאיה וחומצות פירות", p: "מרככים עור מחוספס וממיסים בעדינות תאי עור עודפים — לחלקות והתחדשות." },
  { h: "פחם פעיל ובוץ ים המלח", p: "מנקים לעומק, סופחים שאריות ומחליקים את העור לתחושת רעננות ומראה מטופח." },
];

export default async function Home() {
  const products = await getProducts();

  return (
    <main id="top">
      {/* ===== Section 1 — video that plays ~1s then scroll-scrubs ===== */}
      <ScrollVideo src={VIDEO_A} autoIntro introMs={1000} showCue>
        <p className="eyebrow" style={{ marginBottom: 22 }}>Professional Cosmetics</p>
        <h1 className="display">היופי מתחיל<br /><span className="gold-text">בתא.</span></h1>
        <p>קוסמטיקה מקצועית מבוססת טבע — קסם בגבול המודרני.</p>
      </ScrollVideo>

      {/* ===== Section 2 — static until scrolled into view, then scrubs ===== */}
      <ScrollVideo src={VIDEO_B}>
        <h2 className="display gold-text">טבע. מדע. מגע.</h2>
        <p>כל פורמולה נולדת מתוך דיוק — לעור רך, מוזן וזוהר.</p>
      </ScrollVideo>

      {/* ===== Marquee ===== */}
      <div className="marquee" aria-hidden>
        <div className="marquee__track">
          <span>חמאת שיאה</span><b>·</b><span>כבישה קרה</span><b>·</b><span>שמנים טבעיים</span><b>·</b>
          <span>לחות מתמשכת</span><b>·</b><span>עור רך</span><b>·</b><span>Professional Cosmetics</span><b>·</b>
          <span>חמאת שיאה</span><b>·</b><span>כבישה קרה</span><b>·</b><span>שמנים טבעיים</span><b>·</b>
          <span>לחות מתמשכת</span><b>·</b><span>עור רך</span><b>·</b><span>Professional Cosmetics</span><b>·</b>
        </div>
      </div>

      {/* ===== Products ===== */}
      <section className="section" id="products">
        <div className="section-head">
          <Reveal><span className="eyebrow">הסדרה</span></Reveal>
          <Reveal delay={1} as="h2">הפורמולות</Reveal>
          <Reveal delay={2} as="p">
            שמונה פורמולות. טקס אחד שלם. כל מוצר עומד בפני עצמו — ומתעצם יחד.
          </Reveal>
        </div>
        <div className="pgrid">
          {products.map((p) => (
            <ProductCard key={p.handle} product={p} />
          ))}
        </div>
      </section>

      {/* ===== Ingredients ===== */}
      <section className="section" id="ingredients">
        <div className="section-head">
          <Reveal><span className="eyebrow">המדע</span></Reveal>
          <Reveal delay={1} as="h2">רכיבים בהשראת הטבע</Reveal>
        </div>
        <div className="ings">
          {INGREDIENTS.map((it, i) => (
            <Reveal key={it.h} delay={(i % 3) as 0 | 1 | 2}>
              <div className="ing">
                <h3>{it.h}</h3>
                <p>{it.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== Story ===== */}
      <section className="section" id="story">
        <div className="split">
          <Reveal className="split__text">
            <span className="eyebrow" style={{ display: "block", marginBottom: 16 }}>הסיפור</span>
            <h2 className="display">כל טיפת יופי<br />מתחילה ברמה התאית.</h2>
            <p>
              בכרומוזום אנו מאמינים שהעור אינו זקוק לעוד — הוא זקוק למדויק.
              כל פורמולה משלבת חמאות ושמנים טבעיים בכבישה קרה, ומעוצבת כחוויית
              יוקרה שלמה: מהמרקם ועד המגע, מהריח ועד הזוהר.
            </p>
          </Reveal>
          <Reveal delay={1} className="split__media">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <video src={VIDEO_B} muted loop autoPlay playsInline />
          </Reveal>
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="footer">
        <div className="footer__top">
          <div>
            <div className="footer__brand display gold-text">CHROMOSOME</div>
            <p>טיפוח יוקרתי לידיים, לרגליים ולגוף — חמאות ושמנים טבעיים, עוצב באהבה.</p>
          </div>
          <div className="footer__links">
            <a href="#products">מוצרים</a>
            <a href="#ingredients">הרכיבים</a>
            <a href="#story">הסיפור</a>
            <a href="https://www.instagram.com/chromosome_cosmetics/" target="_blank" rel="noopener">Instagram</a>
          </div>
        </div>
        <div className="footer__base">
          <span>© {new Date().getFullYear()} CHROMOSOME · Professional Cosmetics</span>
          <span className="footer__made">Crafted with care</span>
        </div>

        <style>{`
          .footer { border-top: 1px solid var(--line); padding: clamp(56px,7vw,90px) clamp(20px,5vw,64px) 40px; max-width: var(--maxw); margin: 0 auto; }
          .footer__top { display: flex; justify-content: space-between; gap: 40px; flex-wrap: wrap; }
          .footer__brand { font-size: 1.8rem; letter-spacing: 0.12em; }
          .footer__top p { color: var(--ink-dim); max-width: 34ch; margin-top: 14px; font-size: 0.95rem; }
          .footer__links { display: flex; flex-direction: column; gap: 12px; }
          .footer__links a { color: var(--ink-soft); font-size: 0.98rem; transition: color 0.3s; }
          .footer__links a:hover { color: var(--gold-lt); }
          .footer__base { display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-top: 54px; padding-top: 24px; border-top: 1px solid var(--line); color: var(--ink-dim); font-size: 0.82rem; }
          .footer__made { color: var(--gold); }
        `}</style>
      </footer>
    </main>
  );
}
