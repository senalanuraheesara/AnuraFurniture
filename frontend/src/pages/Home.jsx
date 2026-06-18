import { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { fetchProducts, fetchCategories } from "../store/slices/productSlice";
import { Helmet } from "react-helmet-async";
import heroFurnitureImg from "../assets/hero/hero-furniture.jpg";
import { getYearsInBusiness } from "../utils/dates";

const CATEGORY_FALLBACK = [
  { name: "Living Room", slug: "living-room", count: "Shop now", img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=90&w=900&auto=format&fit=crop" },
  { name: "Bedroom", slug: "bedroom", count: "Shop now", img: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=90&w=900&auto=format&fit=crop" },
  { name: "Dining", slug: "dining-room", count: "Shop now", img: "https://images.unsplash.com/photo-1617806118233-18e1de247200?q=90&w=900&auto=format&fit=crop" },
  { name: "Office", slug: "office", count: "Shop now", img: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=90&w=900&auto=format&fit=crop" },
  { name: "Outdoor", slug: "outdoor", count: "Shop now", img: "https://images.unsplash.com/photo-1600210492493-0946911123ea?q=90&w=900&auto=format&fit=crop" },
];

const TESTIMONIALS = [
  { name: "Kavindu Perera", city: "Colombo", initials: "KP", bg: "#EEF2FF", text: "The craftsmanship is extraordinary. My living room looks like a magazine spread — absolutely stunning.", stars: 5 },
  { name: "Nadeesha Silva", city: "Kandy", initials: "NS", bg: "#FFF7ED", text: "Seamless custom order process. Delivered 3 days ahead of schedule. The quality exceeded every expectation.", stars: 5 },
  { name: "Amal Fernando", city: "Galle", initials: "AF", bg: "#F0FDF4", text: "Used the AI Room Designer before buying — it showed exactly how the sofa would look. Game changing.", stars: 5 },
];

const MARQUEE_BASE = ["✦ Handcrafted in Sri Lanka", "✦ Free Island-wide Delivery", "✦ 5 Year Warranty", "✦ AI Room Designer", "✦ Custom Furniture Orders", "✦ Premium Solid Wood", "✦ 5,000+ Happy Homes"];

function getMarqueeItems() {
  return [
    ...MARQUEE_BASE.slice(0, 6),
    `✦ ${getYearsInBusiness()} Years of Excellence`,
    MARQUEE_BASE[6],
  ];
}

function Stars({ n = 5, size = 13 }) {
  return (
    <span style={{ display: "flex", gap: 2 }}>
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 12 12" fill="#F59E0B">
          <path d="M6 1l1.4 2.8 3.1.45-2.25 2.2.53 3.1L6 8.1 3.22 9.55l.53-3.1L1.5 4.25l3.1-.45z" />
        </svg>
      ))}
    </span>
  );
}

function getProductPath(product) {
  return `/product/${product.slug || product._id}`;
}

function getPrimaryImage(product) {
  return product.images?.find((img) => img.isPrimary) || product.images?.[0];
}

function getProductBadge(product) {
  if (product.isNewArrival) return { label: "New In", color: "#2D6A4F" };
  if (product.isBestSeller) return { label: "Bestseller", color: "#2563eb" };
  if (product.isTrending) return { label: "Trending", color: "#6C3483" };
  if (product.discount > 0 || product.isOnSale) return { label: "Sale", color: "#C0392B" };
  if (product.isFeatured) return { label: "Featured", color: "#2563eb" };
  return null;
}

function formatRs(amount) {
  return `Rs. ${Math.round(amount).toLocaleString()}`;
}

function FeaturedProductCard({ product, i }) {
  const [hovered, setHovered] = useState(false);
  const productPath = getProductPath(product);
  const badge = getProductBadge(product);
  const finalPrice = product.discount > 0
    ? product.price - (product.price * product.discount) / 100
    : product.price;
  const originalPrice = product.discount > 0
    ? product.price
    : (product.originalPrice > product.price ? product.originalPrice : null);
  const primaryImage = getPrimaryImage(product);
  const subtitle = product.category?.name
    || (product.materials?.length ? product.materials.slice(0, 2).join(" + ") : "Premium Furniture");

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.09, duration: 0.5 }}
      style={{ background: "#fff", borderRadius: 20, overflow: "hidden", border: "1px solid #EBEBEB", transition: "transform .3s, box-shadow .3s", transform: hovered ? "translateY(-8px)" : "translateY(0)", boxShadow: hovered ? "0 24px 64px rgba(0,0,0,0.10)" : "0 2px 20px rgba(0,0,0,0.05)" }}
    >
      <Link
        to={productPath}
        aria-label={`View ${product.name} details`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ textDecoration: "none", color: "inherit", display: "block", cursor: "pointer" }}
      >
        <div style={{ position: "relative", overflow: "hidden", background: "#F8F7F5", paddingTop: "100%" }}>
          <motion.img
            src={primaryImage?.url || "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=700"}
            alt={primaryImage?.alt || product.name}
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration: 0.6 }}
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          {badge && (
            <span style={{ position: "absolute", top: 14, left: 14, background: badge.color, color: "#fff", fontSize: 11, fontWeight: 700, padding: "5px 12px", borderRadius: 30, letterSpacing: ".04em" }}>
              {badge.label}
            </span>
          )}
          <AnimatePresence>
            {hovered && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.2 }}
                style={{ position: "absolute", bottom: 12, left: 12, right: 12, background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)", color: "#fff", borderRadius: 12, padding: "11px", textAlign: "center", fontSize: 13, fontWeight: 600, letterSpacing: ".03em", boxShadow: "0 8px 22px rgba(37,99,235,0.35)" }}>
                View Product Details
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div style={{ padding: "16px 18px 20px" }}>
          <p style={{ fontSize: 11, color: "#AAA", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 5, fontWeight: 500 }}>{subtitle}</p>
          <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontWeight: 600, fontSize: 17, color: "#111", marginBottom: 8, lineHeight: 1.25 }}>{product.name}</p>
          {product.numReviews > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <Stars n={Math.round(product.ratings) || 5} size={12} />
              <span style={{ fontSize: 11, color: "#AAA" }}>{product.ratings?.toFixed(1)} · {product.numReviews} reviews</span>
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 17, color: "#111" }}>{formatRs(finalPrice)}</span>
              {originalPrice && <span style={{ fontSize: 12, color: "#CCC", textDecoration: "line-through" }}>{formatRs(originalPrice)}</span>}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function FeaturedProductSkeleton() {
  return (
    <div style={{ background: "#fff", borderRadius: 20, overflow: "hidden", border: "1px solid #EBEBEB" }}>
      <div style={{ paddingTop: "100%", background: "#F0F0F0" }} />
      <div style={{ padding: "16px 18px 20px" }}>
        <div style={{ height: 10, width: "45%", background: "#F0F0F0", borderRadius: 6, marginBottom: 10 }} />
        <div style={{ height: 16, width: "75%", background: "#F0F0F0", borderRadius: 6, marginBottom: 12 }} />
        <div style={{ height: 12, width: "55%", background: "#F0F0F0", borderRadius: 6 }} />
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, categories, loading } = useSelector((s) => s.products);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 16 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  const featuredProducts = useMemo(() => {
    if (!products?.length) return [];
    const featured = products.filter((p) => p.isFeatured || p.isBestSeller || p.isNewArrival || p.isTrending);
    return (featured.length ? featured : products).slice(0, 4);
  }, [products]);

  const yearsInBusiness = getYearsInBusiness();
  const marqueeItems = useMemo(() => getMarqueeItems(), [yearsInBusiness]);

  const displayCategories = useMemo(() => {
    if (categories?.length > 0) {
      return categories.slice(0, 5).map((c, i) => ({
        name: c.name,
        slug: c.slug,
        count: `${products?.filter((p) => p.category?.slug === c.slug || p.category?._id === c._id).length || 0} pieces`,
        img: c.image?.url || CATEGORY_FALLBACK[i]?.img,
      }));
    }
    return CATEGORY_FALLBACK;
  }, [categories, products]);

  const heroProduct = featuredProducts[0] || products?.[0];
  const heroPrimaryImage = heroProduct ? getPrimaryImage(heroProduct) : null;
  const heroProductImg = heroPrimaryImage?.url
    || "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=90&w=1000&auto=format&fit=crop";
  const heroProductPrice = heroProduct
    ? formatRs(heroProduct.discount > 0
      ? heroProduct.price - (heroProduct.price * heroProduct.discount) / 100
      : heroProduct.price)
    : null;

  // Hero image tilt
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [8, -8]), { stiffness: 150, damping: 20 });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [-6, 6]), { stiffness: 150, damping: 20 });
  const heroRef = useRef(null);
  const handleHeroMove = e => {
    if (!heroRef.current) return;
    const r = heroRef.current.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const heroReset = () => { mx.set(0); my.set(0); };

  return (
    <div style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif", background: "#fff", color: "#111", overflowX: "hidden" }}>
      <Helmet>
        <title>Anura Furniture – Dekatana | Furniture කලාවේ මහ ගෙදර</title>
        <meta name="description" content="Shop premium furniture at Anura Furniture Dekatana. Sofas, beds, dining sets & custom orders with free island-wide delivery across Sri Lanka." />
      </Helmet>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@600;700;800;900&family=Abhaya+Libre:wght@400;500;600;700;800&family=Noto+Sans+Sinhala:wght@500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:5px;} ::-webkit-scrollbar-track{background:#fff;} ::-webkit-scrollbar-thumb{background:#DDD;border-radius:3px;}
        @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .cat-card{cursor:pointer;transition:transform .3s;}
        .cat-card:hover{transform:translateY(-6px);}
        .hero-fullscreen{
          position:relative;
          height:100vh;
          min-height:100vh;
          width:100%;
          overflow:hidden;
        }
        .hero-bg{
          position:absolute;
          inset:0;
          background-size:cover;
          background-position:center;
          background-repeat:no-repeat;
        }
        .hero-overlay{
          position:absolute;
          inset:0;
          background:linear-gradient(90deg,rgba(255,255,255,0.55) 0%,rgba(255,255,255,0.25) 40%,rgba(255,255,255,0.08) 70%,rgba(255,255,255,0) 100%);
          pointer-events:none;
        }
        .hero-inner{
          position:relative;
          z-index:2;
          height:100%;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:calc(5.5rem + 40px) clamp(1.25rem,4vw,3rem) 2.5rem;
          width:100%;
        }
        .hero-content{
          width:min(100%,620px);
          transform:translateX(clamp(-6%,-4vw,-2%));
          margin-right:clamp(8%,14vw,18%);
        }
        .hero-title-en{
          display:block;
          font-family:'Playfair Display',Georgia,'Times New Roman',serif;
          font-size:clamp(70px,7vw,120px);
          font-weight:800;
          font-style:normal;
          line-height:0.95;
          letter-spacing:-.03em;
          background:linear-gradient(to right,#1E3A8A 0%,#2563EB 50%,#38BDF8 100%);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
          background-clip:text;
        }
        .hero-title-si{
          display:block;
          margin-top:clamp(8px,1.4vw,16px);
          font-family:'Abhaya Libre','Noto Sans Sinhala','Iskoola Pota',sans-serif;
          font-size:clamp(28px,4.2vw,60px);
          font-weight:700;
          line-height:1.12;
          letter-spacing:.02em;
        }
        .hero-si-dark{color:#0F172A;font-weight:800;}
        .hero-si-blue{color:#2563EB;font-weight:800;}
        .hero-desc{
          font-size:clamp(15px,1.6vw,17px);
          color:#334155;
          line-height:1.8;
          margin-bottom:clamp(28px,4vw,40px);
          max-width:480px;
          text-shadow:0 1px 12px rgba(255,255,255,0.6);
        }
        .hero-actions{
          display:flex;
          flex-wrap:wrap;
          gap:12px;
          margin-bottom:clamp(32px,4vw,44px);
        }
        .hero-btn-primary{
          background:linear-gradient(135deg,#2563eb 0%,#06b6d4 100%);
          color:#fff;
          border:none;
          border-radius:14px;
          padding:15px 32px;
          font-size:14px;
          font-weight:600;
          cursor:pointer;
          display:inline-flex;
          align-items:center;
          gap:9px;
          letter-spacing:.01em;
          transition:transform .15s,box-shadow .15s;
          box-shadow:0 12px 30px rgba(37,99,235,0.32);
        }
        .hero-btn-primary:hover{transform:translateY(-2px);}
        .hero-btn-secondary{
          background:rgba(255,255,255,0.92);
          color:#1e3a8a;
          border:1.5px solid #BFDBFE;
          border-radius:14px;
          padding:15px 28px;
          font-size:14px;
          font-weight:600;
          cursor:pointer;
          display:inline-flex;
          align-items:center;
          gap:8px;
          transition:border-color .15s,background .15s;
        }
        .hero-btn-secondary:hover{border-color:#2563eb;background:#EFF6FF;}
        .hero-trust{
          display:flex;
          gap:40px;
          background:rgba(255,255,255,0.55);
          backdrop-filter:blur(8px);
          -webkit-backdrop-filter:blur(8px);
          padding:12px 24px;
          border-radius:14px;
          width:fit-content;
          border:1px solid rgba(255,255,255,0.45);
          box-shadow:0 4px 24px rgba(0,0,0,0.06);
        }
        .hero-trust-item{
          display:flex;
          flex-direction:column;
          gap:3px;
        }
        .hero-trust-number{
          font-family:'Cormorant Garamond',Georgia,serif;
          font-size:clamp(18px,2.2vw,22px);
          font-weight:800;
          color:#2563EB;
          line-height:1.2;
        }
        .hero-trust-label{
          font-family:'Inter','Segoe UI',sans-serif;
          font-size:clamp(11px,1.1vw,13px);
          font-weight:600;
          color:#111827;
          line-height:1.3;
        }
        @media (max-width:768px){
          .hero-overlay{
            background:linear-gradient(180deg,rgba(255,255,255,0.55) 0%,rgba(255,255,255,0.25) 45%,rgba(255,255,255,0.08) 75%,rgba(255,255,255,0) 100%);
          }
          .hero-inner{align-items:flex-end;padding:calc(5.5rem + 40px) 1.25rem 3rem;}
          .hero-content{margin-right:0;transform:none;width:100%;}
          .hero-trust{gap:16px 20px;flex-wrap:wrap;padding:10px 18px;}
          .hero-trust-item{min-width:auto;}
          .hero-actions{flex-direction:column;}
          .hero-btn-primary,.hero-btn-secondary{width:100%;justify-content:center;}
        }
        @media (min-width:769px) and (max-width:1024px){
          .hero-content{width:min(100%,540px);}
        }
      `}</style>

      {/* ══ HERO ════════════════════════════════════════════════ */}
      <section className="hero-fullscreen" aria-label="Hero">
        <div
          className="hero-bg"
          style={{ backgroundImage: `url(${heroFurnitureImg})` }}
          role="img"
          aria-label="Luxury furniture showroom"
        />
        <div className="hero-overlay" />

        <div className="hero-inner">
          <div className="hero-content">
            <motion.h1
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.span
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22, duration: 0.7 }}
                className="hero-title-en"
              >
                Furniture
              </motion.span>

              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.7 }}
                className="hero-title-si"
              >
                <motion.span
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.46, duration: 0.6 }}
                  className="hero-si-dark"
                >
                  කලාවේ
                </motion.span>
                {" "}
                <motion.span
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.54, duration: 0.6 }}
                  className="hero-si-blue"
                >
                  මහ ගෙදර
                </motion.span>
              </motion.span>
            </motion.h1>

            <motion.p
              className="hero-desc"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.65 }}
            >
              Transform your space with Sri Lanka&apos;s premium furniture collection. Crafted with artistry and designed for modern living.
            </motion.p>

              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
                style={{ display: "flex", gap: 12, marginBottom: 52 }}>
                <button onClick={() => navigate("/shop")} style={{ background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)", color: "#fff", border: "none", borderRadius: 14, padding: "15px 32px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 9, letterSpacing: ".01em", transition: "transform .15s", boxShadow: "0 12px 30px rgba(37,99,235,0.32)" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                  Explore Collection
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
                <button onClick={() => navigate("/ai-room-designer")} style={{ background: "#fff", color: "#1e3a8a", border: "1.5px solid #BFDBFE", borderRadius: 14, padding: "15px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "border-color .15s, background .15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.background = "#EFF6FF"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#BFDBFE"; e.currentTarget.style.background = "#fff"; }}>
                  ✦ AI Room Designer
                </button>
              </motion.div>

              {/* Trust row */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                style={{ display: "flex", gap: 0, borderTop: "1px solid #F0F0F0", paddingTop: 28 }}>
                {[["5,000+", "Happy homes"], ["500+", "Products"], ["15 yrs", "Experience"], ["4.9★", "Rating"]].map(([v, l], i) => (
                  <div key={l} style={{ flex: 1, borderRight: i < 3 ? "1px solid #F0F0F0" : "none", paddingRight: 20, paddingLeft: i > 0 ? 20 : 0 }}>
                    <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 700, color: "#1e3a8a", lineHeight: 1 }}>{v}</p>
                    <p style={{ fontSize: 12, color: "#AAA", marginTop: 4 }}>{l}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* RIGHT: HERO IMAGE COMPOSITION */}
            <div ref={heroRef} onMouseMove={handleHeroMove} onMouseLeave={heroReset}
              style={{ position: "relative", height: "calc(100vh - 80px)", minHeight: 560, maxHeight: 720, perspective: 1800, overflow: "visible" }}>

              {/* Blue glow behind composition */}
              <div style={{ position: "absolute", inset: "8% 4% 12% 8%", background: "radial-gradient(ellipse, rgba(37,99,235,0.22) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(40px)", pointerEvents: "none", zIndex: 0 }} />

              <motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d", height: "100%", position: "relative", zIndex: 1 }}>

                {/* Main hero image */}
                <motion.div
                  initial={{ opacity: 0, x: 40, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    position: "absolute", top: "2%", left: "10%", right: "2%", bottom: "6%",
                    borderRadius: 28, overflow: "hidden",
                    boxShadow: "0 32px 80px rgba(37,99,235,0.22), 0 12px 40px rgba(15,23,42,0.12)",
                    transform: "translateZ(0px)",
                    border: "3px solid rgba(255,255,255,0.85)",
                  }}
                >
                  <img src={heroProductImg} alt={heroProduct?.name || "Anura Furniture showroom"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, transparent 85%, rgba(15,23,42,0.08) 100%)" }} />
                </motion.div>

                {/* Rating card — top left, prominent */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.85, y: -12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.6 }}
                  className="fa hero-float"
                  style={{
                    position: "absolute", top: "0%", left: "0%",
                    borderRadius: 22, padding: "18px 22px",
                    display: "flex", alignItems: "center", gap: 14,
                    transform: "translateZ(90px)", minWidth: 200,
                  }}
                >
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg,#FEF3C7,#FDE68A)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>⭐</div>
                  <div>
                    <p style={{ fontWeight: 800, fontSize: 26, color: "#1e3a8a", lineHeight: 1, fontFamily: "'Playfair Display', serif" }}>4.9/5</p>
                    <p style={{ fontSize: 12, color: "#64748b", marginTop: 5, fontWeight: 500 }}>5,000+ happy reviews</p>
                    <div style={{ marginTop: 6 }}><Stars n={5} size={12} /></div>
                  </div>
                </motion.div>

                {/* Real product card — bottom left, large & clickable */}
                {heroProduct && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85, x: -16 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                    className="fb hero-float"
                    onClick={() => navigate(getProductPath(heroProduct))}
                    style={{
                      position: "absolute", bottom: "10%", left: "-2%",
                      borderRadius: 22, padding: "14px 16px",
                      display: "flex", gap: 12, alignItems: "center",
                      transform: "translateZ(110px)", maxWidth: 240, cursor: "pointer",
                    }}
                  >
                    <div style={{ width: 64, height: 64, borderRadius: 16, overflow: "hidden", flexShrink: 0, border: "2px solid #EFF6FF" }}>
                      <img src={heroProductImg} alt={heroProduct.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div>
                      <span style={{ background: "linear-gradient(135deg,#2563eb,#06b6d4)", color: "#fff", fontSize: 9, fontWeight: 800, padding: "3px 10px", borderRadius: 20, letterSpacing: ".08em" }}>
                        {heroProduct.isBestSeller ? "BESTSELLER" : heroProduct.isFeatured ? "FEATURED" : "SHOP NOW"}
                      </span>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a", marginTop: 6, lineHeight: 1.25, fontFamily: "'Cormorant Garamond', serif" }}>{heroProduct.name}</p>
                      <p style={{ fontSize: 15, fontWeight: 800, color: "#2563eb", marginTop: 4 }}>{heroProductPrice}</p>
                    </div>
                  </motion.div>
                )}

                {/* Free delivery — top right, bold */}
                <motion.div
                  initial={{ opacity: 0, y: -12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.85, duration: 0.55 }}
                  className="fa hero-float-accent"
                  style={{
                    position: "absolute", top: "4%", right: "0%",
                    borderRadius: 20, padding: "14px 18px",
                    display: "flex", alignItems: "center", gap: 12,
                    transform: "translateZ(100px)",
                  }}
                >
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🚚</div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1 }}>Free Delivery</p>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 3 }}>Island-wide · Same week</p>
                  </div>
                </motion.div>

                {/* New arrivals pill — bottom right */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.95 }}
                  className="fb"
                  style={{
                    position: "absolute", bottom: "6%", right: "0%",
                    background: "#fff", border: "2px solid #BBF7D0",
                    borderRadius: 20, padding: "12px 18px",
                    boxShadow: "0 12px 36px rgba(22,163,74,0.15)",
                    transform: "translateZ(80px)",
                  }}
                >
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#15803D" }}>✦ New arrivals weekly</p>
                </motion.div>

              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* ══ MARQUEE ═════════════════════════════════════════════ */}
      <div style={{ background: "linear-gradient(90deg, #1e3a8a 0%, #2563eb 50%, #1e3a8a 100%)", padding: "15px 0", overflow: "hidden" }}>
        <div style={{ display: "flex", gap: 48, whiteSpace: "nowrap", animation: "marquee 26s linear infinite" }}>
          {[...marqueeItems, ...marqueeItems].map((t, i) => (
            <span key={i} style={{ color: "rgba(255,255,255,0.45)", fontSize: 12, fontWeight: 500, letterSpacing: ".06em", flexShrink: 0 }}>{t}</span>
          ))}
        </div>
      </div>

      {/* ══ CATEGORIES ══════════════════════════════════════════ */}
      <section style={{ padding: "100px 48px", background: "#fff", maxWidth: 1320, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 52 }}>
          <div>
            <p style={{ fontSize: 11, color: "#AAA", textTransform: "uppercase", letterSpacing: ".14em", marginBottom: 10 }}>Browse</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 3.5vw, 52px)", fontWeight: 600, color: "#111", lineHeight: 1.1 }}>
              Shop by <em style={{ fontStyle: "italic", color: "#2563eb" }}>Room</em>
            </h2>
          </div>
          <button onClick={() => navigate("/shop")} style={{ background: "none", border: "1.5px solid #E0E0E0", borderRadius: 12, padding: "10px 22px", fontSize: 13, color: "#555", cursor: "pointer", fontWeight: 500, display: "flex", alignItems: "center", gap: 7 }}>
            View all rooms
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </motion.div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gridTemplateRows: "280px 280px", gap: 14 }}>
          {displayCategories.map((cat, i) => {
            const spans = [
              { gridColumn: "1", gridRow: "1 / 3" },
              { gridColumn: "2", gridRow: "1" },
              { gridColumn: "3", gridRow: "1" },
              { gridColumn: "2", gridRow: "2" },
              { gridColumn: "3", gridRow: "2" },
            ];
            return (
              <motion.div key={cat.slug || cat.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                onClick={() => navigate(`/shop/${cat.slug}`)}
                className="cat-card"
                style={{ ...spans[i], position: "relative", borderRadius: 20, overflow: "hidden", cursor: "pointer" }}>
                <img src={cat.img} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform .6s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.05) 50%, transparent 100%)" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: i === 0 ? "28px 28px" : "18px 18px" }}>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", color: "#fff", fontWeight: 600, fontSize: i === 0 ? 28 : 18, lineHeight: 1.2, marginBottom: 4 }}>{cat.name}</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)" }}>{cat.count}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ══ FEATURED PRODUCTS ═══════════════════════════════════ */}
      <section style={{ padding: "80px 48px 100px", background: "#FAFAFA" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48 }}>
            <div>
              <p style={{ fontSize: 11, color: "#AAA", textTransform: "uppercase", letterSpacing: ".14em", marginBottom: 10 }}>Handpicked</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(30px, 3vw, 48px)", fontWeight: 600, color: "#111" }}>Featured <em style={{ color: "#2563eb" }}>Collection</em></h2>
            </div>
            <button onClick={() => navigate("/shop?isFeatured=true")} style={{ background: "none", border: "1.5px solid #E0E0E0", borderRadius: 12, padding: "10px 22px", fontSize: 13, color: "#555", cursor: "pointer", fontWeight: 500, display: "flex", alignItems: "center", gap: 7 }}>
              View all <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </motion.div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 }}>
            {loading && Array.from({ length: 4 }).map((_, i) => <FeaturedProductSkeleton key={i} />)}
            {!loading && featuredProducts.map((product, i) => (
              <FeaturedProductCard key={product._id} product={product} i={i} />
            ))}
            {!loading && featuredProducts.length === 0 && (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "48px 24px", color: "#888" }}>
                <p style={{ fontSize: 16, marginBottom: 12 }}>No products available yet.</p>
                <button onClick={() => navigate("/shop")} style={{ background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)", color: "#fff", border: "none", borderRadius: 12, padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                  Browse Shop
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══ SPLIT: AI ROOM DESIGNER ═════════════════════════════ */}
      <section style={{ background: "#fff", padding: "100px 48px", overflow: "hidden" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 80, alignItems: "center" }}>
          {/* Image side */}
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ position: "relative" }}>
            <div style={{ borderRadius: 28, overflow: "hidden", boxShadow: "0 28px 80px rgba(0,0,0,0.10)" }}>
              <img src="https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=90&w=1100&auto=format&fit=crop" alt="AI room design" style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
            </div>
            {/* Price pins */}
            {[
              { label: "Osaka Sofa", price: "Rs. 188,000", top: "18%", left: "10%" },
              { label: "Walnut Table", price: "Rs. 56,000", bottom: "22%", right: "8%" },
            ].map(tag => (
              <motion.div key={tag.label} initial={{ opacity: 0, scale: 0.7 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                style={{ position: "absolute", ...(tag.top ? { top: tag.top } : { bottom: tag.bottom }), ...(tag.left ? { left: tag.left } : { right: tag.right }), background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderRadius: 14, padding: "9px 14px", boxShadow: "0 8px 28px rgba(0,0,0,0.10)", border: "1px solid rgba(255,255,255,0.8)", display: "flex", alignItems: "center", gap: 7 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2563eb", flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 12, fontWeight: 600, color: "#111" }}>{tag.label}</p>
                  <p style={{ fontSize: 11, color: "#888" }}>{tag.price}</p>
                </div>
              </motion.div>
            ))}
            {/* AI badge */}
            <motion.div className="fb" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              style={{ position: "absolute", top: "6%", right: "-6%", background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)", borderRadius: 20, padding: "16px 20px", boxShadow: "0 16px 48px rgba(37,99,235,0.35)" }}>
              <p style={{ fontSize: 28, marginBottom: 6 }}>🤖</p>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>AI Room Designer</p>
              <p style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", marginTop: 2 }}>Powered by Gemini</p>
            </motion.div>
          </motion.div>

          {/* Copy */}
          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p style={{ fontSize: 11, color: "#AAA", textTransform: "uppercase", letterSpacing: ".14em", marginBottom: 14 }}>✦ AI Powered</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(30px, 3vw, 52px)", fontWeight: 600, color: "#111", lineHeight: 1.12, marginBottom: 20 }}>
              See it in your room<br />
              <em style={{ fontStyle: "italic", color: "#555" }}>before you buy</em>
            </h2>
            <p style={{ fontSize: 15, color: "#666", lineHeight: 1.85, marginBottom: 36, maxWidth: 420 }}>
              Upload a photo of your space and our AI places real furniture into it instantly. Explore different layouts, colors and styles in lifelike detail — for free.
            </p>
            {["Real-time furniture placement in your photo", "Explore unlimited layouts and colorways", "Share with family before you buy", "Works on mobile, tablet & desktop"].map((f, i) => (
              <div key={f} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#F0FDF4", border: "1px solid #BBF7D0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
                </div>
                <span style={{ fontSize: 14, color: "#444" }}>{f}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: 12, marginTop: 40 }}>
              <button onClick={() => navigate("/ai-room-designer")} style={{ background: "linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)", color: "#fff", border: "none", borderRadius: 14, padding: "14px 28px", fontSize: 14, fontWeight: 600, cursor: "pointer", letterSpacing: ".01em", boxShadow: "0 12px 30px rgba(37,99,235,0.3)" }}>
                Launch Room Designer
              </button>
              <button onClick={() => navigate("/shop")} style={{ background: "#fff", color: "#1e3a8a", border: "1.5px solid #BFDBFE", borderRadius: 14, padding: "14px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                Browse Furniture
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ STATS ════════════════════════════════════════════════ */}
      <section style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #0891b2 100%)", padding: "72px 48px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
          {[["5,000+", "Happy families across Sri Lanka", "🏠"], ["500+", "Premium products available", "🛋️"], [`${yearsInBusiness}+`, "Years of craftsmanship", "🏆"], ["99%", "Customer satisfaction rate", "⭐"]].map(([v, l, icon], i) => (
            <motion.div key={l} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              style={{ textAlign: "center", padding: "20px 32px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{icon}</div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 52, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{v}</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 8, lineHeight: 1.5 }}>{l}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ TESTIMONIALS ════════════════════════════════════════ */}
      <section style={{ background: "#FAFAFA", padding: "100px 48px" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 60 }}>
            <p style={{ fontSize: 11, color: "#AAA", textTransform: "uppercase", letterSpacing: ".14em", marginBottom: 12 }}>Testimonials</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(30px, 3vw, 52px)", fontWeight: 600, color: "#111" }}>
              Loved by <em style={{ fontStyle: "italic", color: "#2563eb" }}>5,000+ homes</em>
            </h2>
          </motion.div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {TESTIMONIALS.map(({ name, city, initials, text, stars, bg }, i) => (
              <motion.div key={name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                style={{ background: "#fff", borderRadius: 24, padding: "32px", border: "1px solid #EBEBEB", cursor: "pointer", transition: "transform .3s, box-shadow .3s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 56px rgba(0,0,0,0.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 64, color: "#EEE", lineHeight: 0.6, marginBottom: 24 }}>"</div>
                <Stars n={stars} size={13} />
                <p style={{ color: "#555", fontSize: 15, lineHeight: 1.8, margin: "16px 0 28px", fontStyle: "italic" }}>"{text}"</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 20, borderTop: "1px solid #F0F0F0" }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 14, color: "#111" }}>{initials}</div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14, color: "#111" }}>{name}</p>
                    <p style={{ fontSize: 12, color: "#AAA" }}>{city}, Sri Lanka</p>
                  </div>
                  <div style={{ marginLeft: "auto" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DDD" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA ══════════════════════════════════════════════════ */}
      <section style={{ padding: "80px 48px 100px", background: "#fff" }}>
        <div style={{ maxWidth: 1320, margin: "0 auto" }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ position: "relative", borderRadius: 36, overflow: "hidden" }}>
            <img src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=90&w=1800&auto=format&fit=crop" alt="Beautiful interior" style={{ width: "100%", height: 480, objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)" }} />
            <div style={{ position: "absolute", top: "50%", left: "8%", transform: "translateY(-50%)", maxWidth: 520 }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: ".14em", marginBottom: 16 }}>✦ Design Your Space</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 4vw, 62px)", fontWeight: 600, color: "#fff", lineHeight: 1.1, marginBottom: 20 }}>
                Transform your<br />
                <em style={{ fontStyle: "italic" }}>home today</em>
              </h2>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, lineHeight: 1.75, marginBottom: 36, maxWidth: 400 }}>
                Premium furniture crafted for every style and budget. Free delivery across Sri Lanka.
              </p>
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => navigate("/shop")} style={{ background: "#fff", color: "#111", border: "none", borderRadius: 14, padding: "15px 32px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "transform .15s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
                  Shop Now
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
                <button onClick={() => navigate("/custom-order")} style={{ background: "transparent", color: "#fff", border: "1.5px solid rgba(255,255,255,0.4)", borderRadius: 14, padding: "15px 28px", fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "background .2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  Custom Order
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
}