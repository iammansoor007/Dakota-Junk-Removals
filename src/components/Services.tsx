import { useRef, useEffect, useState, memo } from "react";
import { motion } from "framer-motion";
import {
  Wrench, Home, Building2, Sun, CloudRain, Shield,
  TreePine, Droplets, Hammer, Square, ArrowRight,
  Layout, Building, CheckCircle, Phone, Zap,
} from "lucide-react";
import completeData from "../src/data/completeData.json";
import imgJunkRemoval from "@/assets/junkremoval.jfif";
import imgPropertyCleanout from "@/assets/propertycleanout.jfif";
import imgLightDemolition from "@/assets/lightdemolition.jfif";
import imgInteriorTearouts from "@/assets/interiortearouts.jfif";
import imgMovingServices from "@/assets/movingservices.jfif";
import imgConstructionSiteCleanup from "@/assets/constructionsitecleanup.jfif";
import imgGeneralHauling from "@/assets/generalhauling.jfif";
import imgGarageCleanouts from "@/assets/garagecleanouts.jfif";
import imgShedRemoval from "@/assets/shedremoval.jfif";
import imgLandlordCleanout from "@/assets/landlordcleanout.jfif";

const serviceImageMap: Record<string, string> = {
  "01": imgJunkRemoval,
  "02": imgPropertyCleanout,
  "03": imgLightDemolition,
  "04": imgInteriorTearouts,
  "05": imgMovingServices,
  "06": imgConstructionSiteCleanup,
  "07": imgGeneralHauling,
  "08": imgGarageCleanouts,
  "09": imgShedRemoval,
  "10": imgLandlordCleanout,
};

const iconMap: Record<string, React.ElementType> = {
  Wrench, Home, Building2, Sun, CloudRain, Shield,
  TreePine, Droplets, Hammer, Square, Layout, Building,
  Search: Zap, CloudSun: Sun, Thermometer: Zap,
};

// ── Animated Number ───────────────────────────────────────────────
const AnimatedNumber = ({ value, suffix = "" }: { value: number; suffix: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let t0: number;
        const run = (ts: number) => {
          if (!t0) t0 = ts;
          const p = Math.min((ts - t0) / 2000, 1);
          setDisplay(Math.floor(value * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(run);
          else setDisplay(value);
        };
        requestAnimationFrame(run);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return <span ref={ref} className="tabular-nums">{display}{suffix}</span>;
};

// ── Service Card ──────────────────────────────────────────────────
const ServiceCard = memo(({
  service, index, orphan = false,
}: { service: any; index: number; orphan?: boolean }) => {
  const [hovered, setHovered] = useState(false);
  const Icon = iconMap[service.icon as keyof typeof iconMap] || Wrench;
  const img = serviceImageMap[service.number];

  return (
    <motion.a
      href="#contact"
      initial={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={`group relative rounded-2xl overflow-hidden flex flex-col cursor-pointer transform-gpu will-change-transform transition-all duration-500 hover:-translate-y-2 ${orphan ? "md:col-start-2" : ""}`}
      style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 4px 24px rgba(0,0,0,0.03)" }}
      onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.borderColor = "#9AD12240"}
      onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.borderColor = "#E2E8F0"}
    >
      {/* Orange left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top z-10" style={{ background: "#4D7C0F" }} />

      {/* Image */}
      <div className="relative h-48 overflow-hidden shrink-0 bg-gradient-to-br from-[#111111]/5 to-[#111111]/10">
        {img ? (
          <>
            <img src={img} alt={service.title} loading="eager"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform transform-gpu" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon className="w-20 h-20 text-[#111111]/20" />
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-lg" style={{ background: "#4D7C0F", color: "#FFFFFF" }}>
            {service.tag}
          </span>
        </div>
        <div className="absolute bottom-4 right-4">
          <span className="font-black text-4xl leading-none select-none" style={{ color: "#11111110" }}>
            {service.number}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110" style={{ background: "#11111105", border: "1px solid #11111115" }}>
            <Icon className="w-5 h-5" style={{ color: "#111111" }} />
          </div>
          <h3 className="text-lg font-black transition-colors duration-300 leading-tight text-[#1F2937] group-hover:text-[#4D7C0F]">
            {service.title}
          </h3>
        </div>

        <p className="text-sm leading-relaxed mb-4 line-clamp-2" style={{ color: "#1F2937" }}>
          {service.description}
        </p>

        <div className="grid grid-cols-2 gap-2 mb-5 flex-1">
          {service.features?.slice(0, 4).map((f: string, i: number) => (
            <div key={i} className="flex items-center gap-1.5 text-xs" style={{ color: "#1F293799" }}>
              <CheckCircle className="w-3 h-3 shrink-0" style={{ color: "#4D7C0F" }} />
              <span className="truncate">{f}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-2 text-sm font-black uppercase tracking-widest transition-colors duration-300" style={{ color: "#4D7C0F" }}>
          <span>Get Free Estimate</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 shrink-0" />
        </div>
      </div>
    </motion.a>
  );
});

ServiceCard.displayName = "ServiceCard";

// ── Main Component ────────────────────────────────────────────────
const Services = () => {
  const { badge, headline, description, stats, services, cta } = completeData.services;

  return (
    <section className="relative bg-background overflow-hidden py-20 md:py-28">

      {/* Top accent */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-8">

        {/* ══ HEADER — split, heading left / desc+stats right ════ */}
        <div className="mb-14 md:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">

            {/* LEFT: Badge + Headline */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5" style={{ background: "#4D7C0F10", border: "1px solid #4D7C0F30" }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#4D7C0F" }} />
                <span className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: "#4D7C0F" }}>
                  {badge}
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl xl:text-[3.25rem] font-black leading-[1.1] tracking-tight" style={{ color: "#1F2937", fontFamily: "'Outfit', sans-serif" }}>
                {headline.prefix}{" "}
                <span style={{ color: "#4D7C0F" }}>{headline.highlight}</span>{" "}
                <span style={{ color: "#1F2937" }}>{headline.suffix}</span>
              </h2>
            </motion.div>

            {/* RIGHT: Description + Stat cards */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="flex flex-col gap-8"
            >
              <p className="text-base md:text-lg leading-relaxed" style={{ color: "#1F2937" }}>
                {description[0]}
              </p>
              {/* Stat cards */}
              <div className="grid grid-cols-3 gap-3">
                {stats.map((stat: any) => (
                  <div
                    key={stat.label}
                    className="relative rounded-xl p-4 overflow-hidden transition-all duration-300 shadow-md"
                    style={{ background: "#FFFFFF", border: "1px solid #E2E8F0" }}
                  >
                    <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl" style={{ background: "linear-gradient(90deg, #4D7C0F, #111111)" }} />
                    <div className="text-2xl md:text-3xl font-black leading-none mb-1 pt-1" style={{ color: "#111111" }}>
                      <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest leading-tight" style={{ color: "#1F293799" }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Separator line */}
          <div className="mt-12 h-px" style={{ background: "linear-gradient(to right, #4D7C0F44, #E2E8F0, transparent)" }} />
        </div>

        {/* ══ SERVICES GRID ══════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mb-12 md:mb-16">
          {services.map((service: any, index: number) => {
            const isOrphan = services.length % 3 === 1 && index === services.length - 1;
            return (
              <ServiceCard key={service.number} service={service} index={index} orphan={isOrphan} />
            );
          })}
        </div>

        {/* ══ PREMIUM GRADIENT CTA ═══════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65 }}
          className="relative overflow-hidden rounded-3xl"
          style={{
            background: "#111111",
            boxShadow: "0 25px 60px rgba(0,0,0,0.15)",
            border: "1px solid rgba(255, 255, 255, 0.08)"
          }}
        >
          {/* Technical Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
              backgroundSize: '45px 45px'
            }}
          />

          {/* Content */}
          <div className="relative z-10 px-8 py-14 md:px-16 md:py-16">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

              {/* Left text */}
              <div className="text-center lg:text-left max-w-xl">
                <div className="inline-flex items-center gap-2.5 mb-6 rounded-full px-4 py-2" style={{ border: "1px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.05)" }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#4D7C0F" }} />
                  <span className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: "#4D7C0F" }}>
                    Free Consultation Available
                  </span>
                </div>

                <h3 className="text-3xl md:text-4xl xl:text-5xl font-black leading-[1.05] tracking-tight mb-5" style={{ color: "#fff", fontFamily: "'Outfit', sans-serif" }}>
                  {cta.title}
                </h3>

                <p className="text-base md:text-lg leading-relaxed mb-7" style={{ color: "#E2E8F0" }}>
                  {cta.description}
                </p>

                {/* Trust badges */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                  {["Licensed & Insured", "Locally Owned", "Free Estimates"].map((t) => (
                    <div key={t} className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)" }}>
                        <CheckCircle className="w-2.5 h-2.5" style={{ color: "#4D7C0F" }} />
                      </div>
                      <span className="text-xs font-semibold" style={{ color: "#E2E8F0" }}>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right buttons */}
              <div className="flex flex-col gap-3 w-full lg:w-auto lg:min-w-[240px] shrink-0">

                {/* Primary Button */}
                <motion.a
                  href={cta.buttonLink}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold transition-all duration-300"
                  style={{ background: "#4D7C0F", color: "#FFFFFF", boxShadow: "0 12px 40px rgba(77, 124, 15, 0.3)" }}
                >
                  {cta.buttonText}
                  <ArrowRight className="w-5 h-5" />
                </motion.a>

                {/* Secondary Button */}
                <motion.a
                  href="tel:+16056514228"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-bold transition-all duration-300"
                  style={{ background: "transparent", color: "#FFF", border: "2px solid rgba(255,255,255,0.3)" }}
                >
                  <Phone className="w-5 h-5" />
                  Call Now
                </motion.a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Integrated Elegant Transition Fade */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
    </section>
  );
};

export default Services;
