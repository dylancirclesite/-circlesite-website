import { useEffect, useRef, useState } from "react";
import "@/App.css";
import axios from "axios";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Lightning,
  ChatCircleDots,
  TrendUp,
  ArrowUpRight,
  Check,
  WhatsappLogo,
  EnvelopeSimple,
} from "@phosphor-icons/react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const WHATSAPP_URL =
  "https://wa.me/447356232144?text=Hi%20I%27m%20interested%20in%20getting%20a%20website%20built";
const EMAIL_URL = "mailto:hello@circlesite.uk?subject=Website%20Enquiry";

// ---------- Scroll reveal hook ----------
function useInViewReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// ---------- Navbar ----------
const Nav = () => {
  const [open, setOpen] = useState(false);
  const links = [
    { label: "Features", href: "#features" },
    { label: "Process", href: "#process" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];
  return (
    <header
      className="fixed top-0 inset-x-0 z-40 glass"
      data-testid="site-nav"
    >
      <div className="container-x flex items-center justify-between h-[72px]">
        <a href="#top" className="flex items-center gap-2" data-testid="nav-logo">
          <img src="/assets/logo.png" alt="CircleSite" className="h-9 w-9" />
          <span className="font-serif text-xl tracking-tight text-ink">
            CircleSite
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-ink/70 hover:text-ink transition-colors"
              data-testid={`nav-link-${l.label.toLowerCase()}`}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="btn-gold hidden sm:inline-flex"
            data-testid="nav-cta-button"
          >
            Get Started <ArrowUpRight size={16} weight="bold" />
          </a>
          <button
            className="md:hidden p-2 text-ink"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            data-testid="nav-mobile-toggle"
          >
            <div className="w-6 h-0.5 bg-ink mb-1.5" />
            <div className="w-6 h-0.5 bg-ink mb-1.5" />
            <div className="w-4 h-0.5 bg-ink" />
          </button>
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-borderLight bg-ivory"
          >
            <div className="container-x py-4 flex flex-col gap-3">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-sm text-ink py-1.5"
                  data-testid={`nav-mobile-link-${l.label.toLowerCase()}`}
                >
                  {l.label}
                </a>
              ))}
              <a href="#contact" className="btn-gold mt-2 self-start" onClick={() => setOpen(false)}>
                Get Started <ArrowUpRight size={16} weight="bold" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// ---------- Hero ----------
const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.2]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative pt-[120px] md:pt-[140px] pb-24 lg:pb-32 overflow-hidden grain"
      data-testid="hero-section"
    >
      <div className="container-x grid lg:grid-cols-12 gap-10 lg:gap-16 items-end">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.2, 0.8, 0.2, 1] }}
          className="lg:col-span-7"
        >
          <p className="overline mb-6" data-testid="hero-overline">— UK Web Design Studio</p>
          <h1 className="font-serif text-[48px] leading-[0.95] sm:text-[64px] md:text-[84px] lg:text-[104px] font-bold tracking-[-0.02em] text-ink text-balance">
            Websites that
            <br />
            <span className="italic font-medium text-gold">quietly</span> win you
            <br />
            more business.
          </h1>
          <p className="mt-8 max-w-xl text-inkSoft text-lg md:text-xl leading-relaxed">
            Simple, fast, crafted websites for small businesses in Southampton and across the UK, built to generate more calls, enquiries, and customers.r.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#contact" className="btn-primary" data-testid="hero-cta-primary">
              Free Website Review
              <ArrowUpRight size={18} weight="bold" />
            </a>
            <a href="#pricing" className="btn-outline" data-testid="hero-cta-secondary">
              See Pricing
            </a>
          </div>
          <div className="mt-12 flex items-center gap-6 text-inkSoft text-sm">
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
              Available for new projects
            </span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">Based in the UK</span>
          </div>
        </motion.div>

        <motion.div
          style={{ y, opacity }}
          className="lg:col-span-5 relative"
        >
          <div className="relative rounded-2xl overflow-hidden aspect-[4/5] shadow-[0_24px_60px_rgba(10,17,40,0.15)]">
            <img
              src="https://images.unsplash.com/photo-1740602552445-c71ac1dd04d9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1ODF8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3YXJtJTIwb2ZmaWNlJTIwaW50ZXJpb3J8ZW58MHx8fHwxNzc2NjIzOTYwfDA&ixlib=rb-4.1.0&q=85"
              alt="Modern warm workspace"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-ink/30 via-transparent to-transparent" />
            <div className="absolute left-6 bottom-6 right-6 text-ivory">
            </div>
          </div>
          <div className="absolute -left-6 -bottom-6 bg-sand border border-borderLight rounded-xl px-4 py-3 shadow-md hidden md:block">
            <p className="text-xs text-inkSoft">Avg. build time</p>
            <p className="font-serif text-2xl text-ink">10-14 days</p>
          </div>
        </motion.div>
      </div>

      {/* Marquee brand row */}
      <div className="mt-24 lg:mt-32 border-y border-borderLight py-6 marquee-mask">
        <div className="flex gap-16 whitespace-nowrap animate-marquee opacity-70 font-serif italic text-2xl md:text-3xl text-ink/60">
          {Array.from({ length: 2 }).flatMap((_, i) => [
            <span key={`a${i}`}>Crafted in Britain</span>,
            <span key={`b${i}`}>·</span>,
            <span key={`c${i}`}>For small businesses</span>,
            <span key={`d${i}`}>·</span>,
            <span key={`e${i}`}>Mobile-first</span>,
            <span key={`f${i}`}>·</span>,
            <span key={`g${i}`}>Lightning fast</span>,
            <span key={`h${i}`}>·</span>,
            <span key={`i${i}`}>Hand-built</span>,
            <span key={`j${i}`}>·</span>,
          ])}
        </div>
      </div>
    </section>
  );
};

// ---------- Features (Bento) ----------
const features = [
  {
    icon: TrendUp,
    title: "More customers.",
    desc: "Bold, clear websites that make your business stand out. Get found on Google. Mobile-optimised and smooth.",
    size: "tall",
  },
  {
    icon: ChatCircleDots,
    title: "Instant contact.",
    desc: "Quick call or WhatsApp. Fast ways for customers to reach you — no hesitation, no forms.",
    size: "wide",
  },
  {
    icon: Lightning,
    title: "Fast. Reliable.",
    desc: "Lightning-speed loads, simple layouts, every visitor lands exactly where you want them to.",
    size: "square",
  },
];

const Features = () => (
  <section id="features" className="section-pad bg-sand" data-testid="features-section">
    <div className="container-x">
      <div className="grid lg:grid-cols-12 gap-10 mb-16 reveal">
        <div className="lg:col-span-5">
          <p className="overline mb-4">— Why CircleSite</p>
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink leading-[1.05] text-balance">
            Built around the three things that actually grow a small business.
          </h2>
        </div>
        <div className="lg:col-span-6 lg:col-start-7 text-inkSoft text-lg leading-relaxed self-end">
          No bloated templates. No 200-page agency decks. Just honest websites
          that do their job, turning visitors into customers.
        </div>
      </div>

      <div className="grid md:grid-cols-6 gap-6 auto-rows-[minmax(180px,auto)]">
        {/* More customers - large left */}
        <div className="md:col-span-3 md:row-span-2 bg-ivory border border-borderLight rounded-2xl p-8 md:p-12 flex flex-col justify-between reveal hover:shadow-[0_16px_40px_rgba(10,17,40,0.08)] transition-shadow">
          <TrendUp size={40} weight="duotone" className="text-gold" />
          <div className="mt-auto">
            <h3 className="font-serif text-3xl md:text-4xl text-ink leading-tight">
              More customers, quietly.
            </h3>
            <p className="mt-4 text-inkSoft leading-relaxed">
              Bold, clear websites that make your business stand out. Found
              easily on Google. Mobile-optimised and smooth.
            </p>
          </div>
        </div>

        {/* Instant contact - top right wide */}
        <div className="md:col-span-3 bg-ink text-ivory rounded-2xl p-8 md:p-10 relative overflow-hidden reveal">
          <ChatCircleDots size={32} weight="duotone" className="text-gold mb-6" />
          <h3 className="font-serif text-2xl md:text-3xl leading-tight">
            Instant contact.
          </h3>
          <p className="mt-3 text-ivory/70 leading-relaxed text-sm md:text-base">
            WhatsApp, click to call, direct email buttons. Visitors reach you in one tap.
          </p>
          <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-gold/20 blur-2xl" />
        </div>

        {/* Fast reliable - bottom mid */}
        <div className="md:col-span-2 bg-ivory border border-borderLight rounded-2xl p-8 reveal">
          <Lightning size={32} weight="duotone" className="text-gold mb-6" />
          <h3 className="font-serif text-2xl text-ink leading-tight">
            Fast. Reliable.
          </h3>
          <p className="mt-3 text-inkSoft text-sm leading-relaxed">
            Lightning-speed loads. Every visitor lands where you want them to.
          </p>
        </div>

        {/* Small stat card */}
        <div className="md:col-span-1 bg-gold text-ink rounded-2xl p-6 flex flex-col justify-between reveal">
          <p className="text-xs uppercase tracking-[0.2em] font-semibold">Load time</p>
          <p className="font-serif text-5xl leading-none mt-auto">&lt;1s</p>
        </div>
      </div>
    </div>
  </section>
);

// ---------- Process ----------
const processSteps = [
  { n: "01", title: "Discovery call", desc: "A free 20 minute chat. We learn your business, your customers, and what you want this site to achieve." },
  { n: "02", title: "Design & draft", desc: "Your first draft is ready within 7 working days of your brief. Real copy, real design, not a mockup that goes nowhere." },
  { n: "03", title: "Refine together", desc: "Two free revisions included. We polish wording, images and flow until it feels unmistakably yours." },
  { n: "04", title: "Launch & care", desc: "We host, secure and maintain it for a small monthly fee, so you can focus on your business while we handle the tech." },
];

const Process = () => (
  <section id="process" className="section-pad" data-testid="process-section">
    <div className="container-x">
      <div className="max-w-3xl mb-20 reveal">
        <p className="overline mb-4">— How it works</p>
        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink leading-[1.05] text-balance">
          From first call to live website, without the faff.
        </h2>
      </div>

      <div className="relative">
        <div className="space-y-14">
          {processSteps.map((s, i) => (
            <div key={s.n} className="grid md:grid-cols-12 gap-6 md:gap-10 items-start reveal">
              <div className="md:col-span-3 flex items-center gap-4">
                <span className="font-serif text-5xl md:text-6xl text-gold">{s.n}</span>
              </div>
              <div className="md:col-span-9 md:pl-8 border-l-0 md:border-l md:border-borderLight">
                <h3 className="font-serif text-2xl md:text-3xl text-ink">{s.title}</h3>
                <p className="mt-3 text-inkSoft text-lg leading-relaxed max-w-2xl">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ---------- Pricing ----------
const tiers = [
  {
    tier: "Starter",
    setup: "£199",
    monthly: "£29",
    tagline: "Get online, quickly.",
    features: [
      "1-page professional site",
      "Mobile optimised",
      "Click-to-call & WhatsApp",
      "SSL & hosting included",
    ],
    highlighted: false,
  },
  {
    tier: "Standard",
    setup: "£299",
    monthly: "£39",
    tagline: "Our most popular build.",
    features: [
      "Up to 3 pages",
      "All contact features",
      "Image gallery / services",
      "Priority support",
    ],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    tier: "Pro",
    setup: "Custom",
    monthly: "£49",
    tagline: "For growing businesses.",
    features: [
      "Up to 10 pages",
      "Calendar / booking integrations",
      "Advanced SEO",
      "Custom design work",
      "Full ongoing support",
    ],
    highlighted: false,
  },
];

const Pricing = () => (
  <section id="pricing" className="section-pad bg-ink text-ivory relative overflow-hidden" data-testid="pricing-section">
    <div className="absolute inset-0 grain pointer-events-none" />
    <div className="container-x relative">
      <div className="max-w-2xl mb-16 reveal">
        <p className="overline mb-4" style={{ color: "#C49A45" }}>— Pricing</p>
        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05] text-balance">
          Transparent. Flexible. No surprises.
        </h2>
        <p className="mt-6 text-ivory/70 text-lg leading-relaxed">
          One honest build cost, then a small monthly fee to keep everything running smoothly.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {tiers.map((t) => (
          <div
            key={t.tier}
            className={`relative rounded-2xl p-8 md:p-10 flex flex-col reveal ${
              t.highlighted
                ? "tracing-border bg-ivory text-ink"
                : "bg-white/[0.04] border border-white/10 text-ivory"
            }`}
            data-testid={`pricing-card-${t.tier.toLowerCase()}`}
          >
            {t.badge && (
              <span className="absolute -top-3 left-8 bg-gold text-ink text-[10px] uppercase tracking-[0.2em] font-bold px-3 py-1.5 rounded-full">
                {t.badge}
              </span>
            )}
            <p className={`text-xs uppercase tracking-[0.22em] font-bold ${t.highlighted ? "text-gold" : "text-gold"}`}>
              {t.tier}
            </p>
            <p className={`mt-2 text-sm ${t.highlighted ? "text-inkSoft" : "text-ivory/60"}`}>
              {t.tagline}
            </p>
            <div className="mt-8">
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-5xl font-bold">{t.setup}</span>
                {t.setup !== "Custom" && <span className="text-sm opacity-60">one-off</span>}
              </div>
              <p className={`text-sm mt-2 ${t.highlighted ? "text-inkSoft" : "text-ivory/60"}`}>
                + {t.monthly}/mo hosting & support
              </p>
            </div>
            <ul className="mt-8 space-y-3 flex-1">
              {t.features.map((f) => (
                <li key={f} className="flex gap-3 items-start text-sm">
                  <Check size={16} weight="bold" className="text-gold mt-0.5 shrink-0" />
                  <span className={t.highlighted ? "text-ink" : "text-ivory/90"}>{f}</span>
                </li>
              ))}
            </ul>
            <a
              href="#contact"
              className={`mt-10 ${t.highlighted ? "btn-primary" : "btn-gold"}`}
              data-testid={`pricing-cta-${t.tier.toLowerCase()}`}
            >
              Book a free call
              <ArrowUpRight size={16} weight="bold" />
            </a>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ---------- FAQ ----------
const faqs = [
  { q: "How long does a website take to build?", a: "Most Starter and Standard sites go live within 2 weeks of the first call. Pro builds take longer, depending on scope." },
  { q: "What's included in the monthly fee?", a: "Fast UK hosting, SSL certificate, regular security updates, backups, and small content tweaks such as wording, images or opening hours. No hidden extras." },
  { q: "Do I own the website?", a: "Yes, 100%. We host and maintain it, but the design and content are yours." },
  { q: "Can you help with copy, photos and SEO?", a: "Absolutely. We'll write clear, converting copy with you, suggest photography, and set up on page SEO so you show up on Google for local searches." },
  { q: "What if I need changes later?", a: "Small updates are included in your monthly fee. Larger changes or new sections are quoted honestly and transparently, with no surprise invoices." },
  { q: "Do you work with businesses outside the UK?", a: "Our sweet spot is UK small businesses, but we occasionally take on international projects. Get in touch and we'll tell you honestly if we're a good fit." },
];

const FAQ = () => (
  <section id="faq" className="section-pad" data-testid="faq-section">
    <div className="container-x grid lg:grid-cols-12 gap-12">
      <div className="lg:col-span-4 reveal">
        <p className="overline mb-4">— Frequently asked</p>
        <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-ink leading-[1.05] text-balance">
          Everything you're wondering, answered.
        </h2>
        <p className="mt-6 text-inkSoft leading-relaxed">
          Still have a question? <a href="#contact" className="text-gold underline underline-offset-4">Ask us directly.</a>
        </p>
      </div>
      <div className="lg:col-span-8 lg:col-start-5 reveal">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-b border-borderLight">
              <AccordionTrigger
                className="text-left font-serif text-lg md:text-xl text-ink py-6 hover:no-underline hover:text-gold"
                data-testid={`faq-trigger-${i}`}
              >
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-inkSoft text-base leading-relaxed pb-6">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  </section>
);

// ---------- Contact ----------
const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      await axios.post(`${API}/contact`, form);
      setSent(true);
      toast.success("Thanks! We'll be in touch shortly.");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again or WhatsApp us.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-pad bg-ivory" data-testid="contact-section">
      <div className="container-x">
        <div className="rounded-3xl bg-ink text-ivory p-8 md:p-14 lg:p-20 grain relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full bg-gold/10 blur-3xl pointer-events-none" />
          <div className="relative grid lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="overline mb-4" style={{ color: "#C49A45" }}>— Let's talk</p>
              <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.02] text-balance">
                Get your free
                <br />
                <span className="italic text-gold">website review.</span>
              </h2>
              <p className="mt-6 text-ivory/75 text-lg leading-relaxed max-w-md">
                Fill in your details and we'll come back to you within a working day with honest, useful feedback. No sales pitch.
              </p>
              <div className="mt-10 space-y-4">
                <a href={EMAIL_URL} className="flex items-center gap-3 text-ivory/90 hover:text-gold transition-colors" data-testid="contact-email-link">
                  <EnvelopeSimple size={18} />
                  hello@circlesite.uk
                </a>
                <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-ivory/90 hover:text-gold transition-colors" data-testid="contact-whatsapp-link">
                  <WhatsappLogo size={18} />
                  WhatsApp us directly
                </a>
              </div>
            </div>

            <form onSubmit={onSubmit} className="lg:col-span-7 lg:col-start-6 space-y-5" data-testid="contact-form">
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-ivory/60">Name</label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  className="mt-2 h-12 bg-white/5 border-white/10 text-ivory placeholder:text-ivory/30 focus:border-gold focus-visible:ring-gold/40 rounded-xl"
                  data-testid="contact-input-name"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-ivory/60">Email</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@business.co.uk"
                  className="mt-2 h-12 bg-white/5 border-white/10 text-ivory placeholder:text-ivory/30 focus:border-gold focus-visible:ring-gold/40 rounded-xl"
                  data-testid="contact-input-email"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-[0.2em] text-ivory/60">Message</label>
                <Textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us a little about your business and what you need..."
                  rows={5}
                  className="mt-2 bg-white/5 border-white/10 text-ivory placeholder:text-ivory/30 focus:border-gold focus-visible:ring-gold/40 rounded-xl resize-none"
                  data-testid="contact-input-message"
                />
              </div>
              <button
                type="submit"
                disabled={loading || sent}
                className="btn-gold w-full md:w-auto disabled:opacity-60"
                data-testid="contact-submit-button"
              >
                {loading ? "Sending..." : sent ? "Thanks — we'll be in touch" : "Request my free review"}
                {!loading && !sent && <ArrowUpRight size={16} weight="bold" />}
              </button>
              <p className="text-xs text-ivory/50">We reply within one working day. No spam, ever.</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

// ---------- Footer ----------
const Footer = () => (
  <footer className="bg-ivory border-t border-borderLight" data-testid="site-footer">
    <div className="container-x py-14">
      <div className="grid md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="flex items-center gap-2">
            <img src="/assets/logo.png" alt="CircleSite" className="h-9 w-9" />
            <span className="font-serif text-xl text-ink">CircleSite</span>
          </div>
          <p className="mt-4 text-inkSoft max-w-sm leading-relaxed">
            Simple, professional websites for small UK businesses. Built by a small studio that cares.
          </p>
        </div>
        <div className="md:col-span-3">
          <p className="overline mb-4">Explore</p>
          <ul className="space-y-3 text-ink">
            <li><a href="#features" className="hover:text-gold transition-colors">Features</a></li>
            <li><a href="#process" className="hover:text-gold transition-colors">Process</a></li>
            <li><a href="#pricing" className="hover:text-gold transition-colors">Pricing</a></li>
            <li><a href="#faq" className="hover:text-gold transition-colors">FAQ</a></li>
          </ul>
        </div>
        <div className="md:col-span-4">
          <p className="overline mb-4">Get in touch</p>
          <ul className="space-y-3 text-ink">
            <li><a href={EMAIL_URL} className="hover:text-gold transition-colors">hello@circlesite.uk</a></li>
            <li><a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">WhatsApp: +447356232144</a></li>
          </ul>
        </div>
      </div>
      <div className="mt-14 pt-6 border-t border-borderLight flex flex-col md:flex-row justify-between gap-3 text-xs text-inkSoft">
        <p>© 2026 CircleSite. All rights reserved.</p>
        <p>Designed & hand-built in the UK.</p>
      </div>
    </div>
  </footer>
);

// ---------- Floating WhatsApp ----------
const FloatingWhatsApp = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3" data-testid="whatsapp-floating">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="w-[280px] bg-ivory rounded-2xl shadow-[0_20px_50px_rgba(10,17,40,0.2)] border border-borderLight overflow-hidden"
          >
            <div className="bg-[#25D366] p-4 flex items-center gap-3 text-white">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <WhatsappLogo size={22} weight="fill" />
              </div>
              <div>
                <p className="font-semibold text-sm">CircleSite</p>
                <p className="text-xs opacity-90">Typically replies in minutes</p>
              </div>
            </div>
            <div className="p-4">
              <div className="bg-sand rounded-2xl rounded-tl-sm p-3 text-sm text-ink">
                Hi 👋 — want a free website review? Tap below and we'll pick it up on WhatsApp.
              </div>
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white px-4 py-2.5 rounded-full text-sm font-semibold transition-colors"
                data-testid="whatsapp-popup-cta"
              >
                <WhatsappLogo size={16} weight="fill" />
                Start chat
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen((v) => !v)}
        className="relative group"
        aria-label="Open WhatsApp chat"
        data-testid="whatsapp-floating-button"
      >
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping-soft" />
        <span className="relative flex items-center justify-center w-[60px] h-[60px] rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_rgba(37,211,102,0.45)] group-hover:scale-[1.06] transition-transform animate-float-y">
          <WhatsappLogo size={28} weight="fill" />
        </span>
        <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-white border-2 border-[#25D366]" />
      </button>
    </div>
  );
};

// ---------- Main ----------
function App() {
  useInViewReveal();

  useEffect(() => {
    // Light ping so backend wakes (status check pattern kept minimal)
    axios.get(`${API}/`).catch(() => {});
  }, []);

  return (
    <div className="App bg-ivory min-h-screen">
      <Nav />
      <main>
        <Hero />
        <Features />
        <Process />
        <Pricing />
        <FAQ />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <Toaster position="top-center" richColors />
    </div>
  );
}

export default App;
