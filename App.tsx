import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Menu, X, Phone, Mail, Briefcase, FileText, Users,
  AlertCircle, ArrowRight, Scale, ShieldCheck, Check, ChevronDown
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

/* ─── Reveal hook ─── */
function useReveal(type = 'reveal', delay = 0) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTimeout(() => el.classList.add('visible'), delay); obs.unobserve(el); }
    }, { threshold: 0.12 });
    obs.observe(el);
    return () => { if (el) obs.unobserve(el); };
  }, [delay]);
  return { ref, className: type };
}

const R = ({ children, type = 'reveal', delay = 0, className = '' }: {
  children: React.ReactNode; type?: string; delay?: number; className?: string;
}) => {
  const { ref, className: rc } = useReveal(type, delay);
  return <div ref={ref} className={cn(rc, className)}>{children}</div>;
};

/* ─── Legal Page ─── */
const LegalPage = ({ title, children, onBack }: { title: string; children: React.ReactNode; onBack: () => void }) => (
  <div className="min-h-screen bg-ivory pt-32 pb-24 px-4">
    <div className="max-w-3xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-2 text-champagne text-xs tracking-widest uppercase font-semibold mb-10 hover:text-navy transition-colors">
        <ArrowRight size={13} className="rotate-180" /> Volver
      </button>
      <h1 className="font-serif text-5xl md:text-6xl mb-14 leading-tight">{title}</h1>
      <div className="font-sans text-warm-gray font-light leading-loose text-base space-y-6">{children}</div>
    </div>
  </div>
);

/* ─── Main ─── */
export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [heroIn, setHeroIn] = useState(false);
  const [page, setPage] = useState<'home' | 'aviso' | 'privacidad' | 'cookies'>('home');

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => { setLoading(false); setTimeout(() => setHeroIn(true), 250); }, 1800);
    return () => clearTimeout(t);
  }, []);

  const go = useCallback((id: string) => {
    setMenuOpen(false);
    if (page !== 'home') { setPage('home'); setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 120); }
    else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }, [page]);

  const goPage = (p: 'home' | 'aviso' | 'privacidad' | 'cookies') => { setPage(p); window.scrollTo(0, 0); setMenuOpen(false); };

  /* ── Legal pages ── */
  if (page === 'aviso') return (
    <LegalPage title="Aviso Legal" onBack={() => goPage('home')}>
      <p>En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se facilita la siguiente información:</p>
      <h3 className="font-serif text-2xl text-navy">Titular del sitio web</h3>
      <p>Nombre: Desirée Rubio Pérez<br />Actividad: Abogada — Derecho Laboral<br />Localización: Espartinas, Sevilla<br />Número de Colegiada: <em>[Pendiente de facilitar]</em><br />Email: <em>[Pendiente de facilitar]</em></p>
      <h3 className="font-serif text-2xl text-navy">Objeto y ámbito de aplicación</h3>
      <p>Las presentes condiciones regulan el acceso, navegación y uso del sitio web, así como las responsabilidades derivadas de su utilización. El acceso implica la aceptación íntegra de las presentes condiciones.</p>
      <h3 className="font-serif text-2xl text-navy">Propiedad intelectual</h3>
      <p>Los contenidos del sitio web, incluyendo textos, imágenes y logotipos, son propiedad de Desirée Rubio Pérez o se dispone de licencia para su uso. Queda prohibida su reproducción sin autorización expresa.</p>
      <h3 className="font-serif text-2xl text-navy">Responsabilidad</h3>
      <p>Los contenidos del sitio tienen carácter meramente informativo. El acceso a los mismos no establece relación profesional alguna entre el usuario y la titular del despacho.</p>
    </LegalPage>
  );

  if (page === 'privacidad') return (
    <LegalPage title="Política de Privacidad" onBack={() => goPage('home')}>
      <p>De conformidad con el Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD), se informa sobre el tratamiento de sus datos personales.</p>
      <h3 className="font-serif text-2xl text-navy">Responsable del tratamiento</h3>
      <p>Desirée Rubio Pérez, con domicilio en Espartinas, Sevilla. Email: <em>[Pendiente de facilitar]</em></p>
      <h3 className="font-serif text-2xl text-navy">Finalidad</h3>
      <p>Gestionar las consultas y solicitudes de información remitidas a través de los formularios y canales de contacto habilitados en el sitio web.</p>
      <h3 className="font-serif text-2xl text-navy">Legitimación</h3>
      <p>El consentimiento expreso del interesado, otorgado en el momento de enviar su solicitud.</p>
      <h3 className="font-serif text-2xl text-navy">Conservación</h3>
      <p>Los datos se conservarán durante el tiempo necesario para atender la consulta y, en su caso, durante el plazo legalmente exigido.</p>
      <h3 className="font-serif text-2xl text-navy">Derechos</h3>
      <p>Tiene derecho de acceso, rectificación, supresión, limitación, portabilidad y oposición. Puede ejercerlos contactando al email facilitado. Asimismo, puede reclamar ante la Agencia Española de Protección de Datos (www.aepd.es).</p>
    </LegalPage>
  );

  if (page === 'cookies') return (
    <LegalPage title="Política de Cookies" onBack={() => goPage('home')}>
      <p>Este sitio web utiliza cookies propias de carácter técnico, necesarias para el correcto funcionamiento de la página, que no requieren consentimiento previo del usuario.</p>
      <h3 className="font-serif text-2xl text-navy">¿Qué es una cookie?</h3>
      <p>Una cookie es un fichero de texto que un servidor web almacena en el dispositivo del usuario al visitar un sitio web. Su función es facilitar la navegación y mejorar la experiencia de uso.</p>
      <h3 className="font-serif text-2xl text-navy">Tipos de cookies utilizadas</h3>
      <p><strong>Técnicas y de sesión:</strong> Imprescindibles para el funcionamiento del sitio. No recogen datos personales ni requieren consentimiento.</p>
      <h3 className="font-serif text-2xl text-navy">Gestión y desactivación</h3>
      <p>Puede configurar su navegador para bloquear o eliminar las cookies. No obstante, la desactivación de las cookies técnicas puede afectar al correcto funcionamiento del sitio web.</p>
    </LegalPage>
  );

  /* ══════════════════════════════
       HOME PAGE
  ══════════════════════════════ */
  return (
    <>
      {/* LOADER */}
      <div className={cn('loading-screen', !loading && 'hidden')}>
        <img src="https://pub-261f320d11d74f43b95552577762d5dd.r2.dev/desiree%20abogada/Logotipo_elegante_de_abogada_con_monograma_DR-removebg-preview.png"
          alt="DR" className="loading-logo w-44 md:w-60 brightness-0 invert" />
        <div className="loading-line" />
        <div className="loading-text">Desirée Rubio Pérez</div>
      </div>

      <div className="min-h-screen bg-ivory text-navy">

        {/* ── HEADER ── */}
        <header className={cn('fixed top-0 w-full z-50 transition-all duration-500',
          scrolled ? 'glass-nav py-3 shadow-sm' : 'bg-transparent py-5')}>
          <div className="container mx-auto px-5 md:px-10 max-w-7xl flex justify-between items-center">
            {/* Logo */}
            <button onClick={() => go('inicio')} className="flex items-center gap-3">
              <img src="https://pub-261f320d11d74f43b95552577762d5dd.r2.dev/desiree%20abogada/Logotipo_elegante_de_abogada_con_monograma_DR-removebg-preview%20(1).png"
                alt="Logo" className="h-9 w-9 object-contain" />
              <div className="flex flex-col text-left">
                <span className="font-serif text-base md:text-lg leading-none font-semibold tracking-wider uppercase">Desirée Rubio Pérez</span>
                <span className="text-[9px] tracking-[0.28em] font-light mt-0.5 text-champagne uppercase">Abogada</span>
              </div>
            </button>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-9">
              {[['inicio','Inicio'],['sobre-mi','Sobre mí'],['servicios','Servicios'],['como-trabajo','Cómo trabajo'],['contacto','Contacto']].map(([id,label]) => (
                <button key={id} onClick={() => go(id)}
                  className="text-[12px] tracking-[0.12em] hover:text-champagne transition-colors duration-300">
                  {label}
                </button>
              ))}
              <button onClick={() => go('contacto')}
                className="btn-shine bg-navy text-white px-6 py-2.5 text-[11px] font-semibold tracking-wider hover:bg-navy/90 transition-colors">
                Solicitar consulta
              </button>
            </nav>

            <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>

          {/* Mobile Nav */}
          <div className={cn('lg:hidden absolute top-full left-0 w-full bg-ivory backdrop-blur-lg border-t border-champagne/10 shadow-xl overflow-hidden transition-all duration-400',
            menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0')}>
            <div className="flex flex-col py-6 px-6 gap-1">
              {[['inicio','Inicio'],['sobre-mi','Sobre mí'],['servicios','Servicios'],['como-trabajo','Cómo trabajo'],['contacto','Contacto']].map(([id,label]) => (
                <button key={id} onClick={() => go(id)}
                  className="text-left py-3 border-b border-navy/5 text-sm tracking-widest font-light hover:text-champagne transition-colors">
                  {label}
                </button>
              ))}
              <button onClick={() => go('contacto')} className="btn-shine mt-4 bg-navy text-white py-4 text-xs font-bold tracking-widest uppercase">
                Solicitar consulta
              </button>
            </div>
          </div>
        </header>

        {/* ══ HERO ══ */}
        <section id="inicio" className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
          {/* soft ambient */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full bg-champagne/6 blur-[80px]" />
            <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-champagne/25 to-transparent" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto">
            {/* BIG TITLE — Cormorant Garamond like logo */}
            <div
              className={cn('transition-all duration-1000', heroIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16')}
              style={{ transitionDelay: '100ms' }}
            >
              <h1 className="font-serif text-[12vw] sm:text-[10vw] md:text-[8vw] lg:text-[7rem] xl:text-[8.5rem] leading-[1] tracking-[0.12em] uppercase text-navy font-semibold">
                DESIRÉE<br />
                <span className="text-champagne">RUBIO</span> PÉREZ
              </h1>
              <p className="text-[10px] sm:text-xs tracking-[0.5em] uppercase text-navy/40 mt-4 font-sans font-medium">
                ── Abogada ──
              </p>
            </div>

            {/* gold line */}
            <div
              className={cn('h-px bg-champagne mx-auto my-8 transition-all duration-1000', heroIn ? 'w-24 opacity-100' : 'w-0 opacity-0')}
              style={{ transitionDelay: '500ms' }}
            />

            {/* Subtitle */}
            <div
              className={cn('transition-all duration-1000', heroIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}
              style={{ transitionDelay: '650ms' }}
            >
              <p className="font-serif italic text-2xl md:text-3xl text-navy/70 mb-3 font-light">
                Tu tranquilidad jurídica empieza con una buena defensa.
              </p>
              <p className="font-sans text-sm md:text-base text-warm-gray font-light max-w-xl mx-auto leading-relaxed mt-4">
                Asesoramiento jurídico personalizado en materia laboral, con compromiso, profesionalidad y atención cercana en cada etapa de tu caso.
              </p>
            </div>

            {/* Buttons */}
            <div
              className={cn('flex flex-col sm:flex-row justify-center gap-4 mt-12 transition-all duration-1000', heroIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}
              style={{ transitionDelay: '850ms' }}
            >
              <button onClick={() => go('contacto')}
                className="btn-shine bg-navy text-white px-10 py-4 text-xs font-semibold tracking-[0.18em] uppercase hover:bg-navy/90 transition-colors flex items-center justify-center gap-3 group">
                Solicitar consulta
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => go('servicios')}
                className="border border-navy/25 text-navy px-10 py-4 text-xs font-semibold tracking-[0.18em] uppercase hover:border-champagne hover:text-champagne transition-all">
                Servicios
              </button>
            </div>

            {/* Trust badges */}
            <div
              className={cn('flex flex-wrap justify-center gap-6 mt-14 text-[10px] tracking-[0.18em] text-navy/40 uppercase transition-all duration-1000', heroIn ? 'opacity-100' : 'opacity-0')}
              style={{ transitionDelay: '1050ms' }}
            >
              <span>Atención personalizada</span><span className="text-champagne">·</span>
              <span>Confidencialidad</span><span className="text-champagne hidden sm:inline">·</span>
              <span className="hidden sm:inline">Compromiso profesional</span>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 scroll-indicator">
            <ChevronDown size={22} className="text-champagne/40" />
          </div>
        </section>

        {/* ══ MARQUEE STRIP ══ */}
        <div className="bg-navy py-5 overflow-hidden select-none">
          <div className="marquee-track text-xs font-semibold tracking-[0.3em] uppercase text-white/30">
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} className="shrink-0">
                Derecho Laboral &nbsp;<span className="text-champagne">·</span>&nbsp; Asesoramiento Jurídico &nbsp;<span className="text-champagne">·</span>&nbsp; Espartinas, Sevilla &nbsp;<span className="text-champagne">·</span>&nbsp;
              </span>
            ))}
          </div>
        </div>

        {/* ══ BIG LOGO ══ */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-5xl text-center">
            <R type="reveal-scale">
              <img src="https://pub-261f320d11d74f43b95552577762d5dd.r2.dev/desiree%20abogada/Logotipo_elegante_de_abogada_con_monograma_DR-removebg-preview.png"
                alt="Logo DR" className="w-72 md:w-[420px] h-auto mx-auto" />
            </R>
          </div>
        </section>

        {/* ══ ABOUT — FOTO AQUÍ ══ */}
        <section id="sobre-mi" className="py-28 bg-ivory overflow-hidden">
          <div className="container mx-auto px-5 md:px-10 max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              {/* Photo side */}
              <R type="reveal-left">
                <div className="about-photo-wrap max-w-sm mx-auto lg:mx-0 relative z-10">
                  <img
                    src="https://pub-261f320d11d74f43b95552577762d5dd.r2.dev/desiree%20abogada/maria-desiree-rubio-perez-500x500__1_-removebg-preview.png"
                    alt="Desirée Rubio Pérez"
                    className="w-full h-auto object-cover relative z-10 bg-[#EAE5D9]"
                  />
                </div>
              </R>

              {/* Text side */}
              <div className="text-left">
                <R>
                  <div className="gold-line mb-10" />
                </R>
                <R delay={100}>
                  <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl leading-tight mb-10">
                    Compromiso,<br />
                    <span className="italic text-champagne">profesionalidad</span><br />
                    y cercanía.
                  </h2>
                </R>
                <R delay={200}>
                  <div className="space-y-5 text-warm-gray font-light leading-relaxed text-[17px] mb-14">
                    <p>Cada situación jurídica merece atención, dedicación y un análisis individualizado.</p>
                    <p>Mi compromiso es ofrecer un asesoramiento profesional y cercano, escuchando las necesidades de cada persona y acompañándola durante el proceso con claridad, responsabilidad y discreción.</p>
                    <p>Porque detrás de cada asunto legal hay una persona que necesita respuestas, orientación y confianza.</p>
                  </div>
                </R>
                <R delay={300}>
                  <div className="grid grid-cols-3 gap-6 pt-10 border-t border-champagne/20">
                    {[
                      { icon: <Check size={18}/>, label: 'Compromiso' },
                      { icon: <Check size={18}/>, label: 'Profesionalidad' },
                      { icon: <Check size={18}/>, label: 'Atención cercana' },
                    ].map((v,i) => (
                      <div key={i} className="hover-lift text-center">
                        <div className="text-champagne mb-3 flex justify-center">{v.icon}</div>
                        <p className="text-xs font-semibold tracking-widest uppercase text-navy/70">{v.label}</p>
                      </div>
                    ))}
                  </div>
                </R>
              </div>
            </div>
          </div>
        </section>

        {/* ══ SERVICES ══ */}
        <section id="servicios" className="py-28 bg-white">
          <div className="container mx-auto px-5 md:px-10 max-w-6xl">
            <div className="text-center mb-20">
              <R><div className="gold-line mx-auto mb-10" /></R>
              <R delay={100}>
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6">Asesoramiento jurídico laboral</h2>
                <p className="text-warm-gray font-light text-lg">Soluciones jurídicas adaptadas a cada situación.</p>
              </R>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
              {[
                { icon: <Briefcase className="w-5 h-5"/>, title: 'Despidos y extinción', desc: 'Análisis y defensa ante despidos disciplinarios, objetivos o extinciones por voluntad del trabajador.' },
                { icon: <Scale className="w-5 h-5"/>, title: 'Reclamaciones salariales', desc: 'Gestión de nóminas impagadas, diferencias salariales y horas extraordinarias no abonadas.' },
                { icon: <ShieldCheck className="w-5 h-5"/>, title: 'Derechos laborales', desc: 'Asesoramiento en excedencias, reducciones de jornada, vacaciones y conciliación familiar.' },
                { icon: <AlertCircle className="w-5 h-5"/>, title: 'Seguridad Social', desc: 'Tramitación de incapacidades laborales, accidentes de trabajo y prestaciones.' },
                { icon: <FileText className="w-5 h-5"/>, title: 'Modificación de condiciones', desc: 'Defensa ante cambios sustanciales en horarios, turnos, funciones o lugar de trabajo.' },
                { icon: <Users className="w-5 h-5"/>, title: 'Conflictos laborales', desc: 'Representación en procedimientos judiciales, conciliaciones y arbitrajes.' },
              ].map((s, i) => (
                <R key={i} delay={i * 90}>
                  <div className="service-card bg-ivory p-10 h-full flex flex-col">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-champagne mb-7 shadow-sm shrink-0">
                      {s.icon}
                    </div>
                    <h3 className="font-serif text-2xl mb-4">{s.title}</h3>
                    <p className="text-warm-gray font-light text-sm leading-relaxed flex-grow mb-8">{s.desc}</p>
                    <button onClick={() => go('contacto')}
                      className="text-[10px] font-bold tracking-widest uppercase flex items-center gap-2 hover:text-champagne transition-colors mt-auto">
                      Consultar <ArrowRight size={12}/>
                    </button>
                  </div>
                </R>
              ))}
            </div>
          </div>
        </section>

        {/* ══ VALUES DARK ══ */}
        <section className="py-28 bg-navy text-white relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full bg-champagne/4 blur-[80px]" />
          </div>
          <div className="container mx-auto px-5 max-w-5xl text-center relative z-10">
            <R><div className="gold-line mx-auto mb-10 opacity-40" /></R>
            <R delay={100}>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-24">
                La confianza se construye<br />
                <span className="italic text-champagne">con hechos.</span>
              </h2>
            </R>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-14">
              {[
                { n:'01', t:'Atención personalizada', d:'Cada situación requiere un análisis individual y una respuesta adaptada.' },
                { n:'02', t:'Compromiso profesional', d:'Dedicación y responsabilidad en cada asunto que asumo.' },
                { n:'03', t:'Comunicación clara', d:'Explicaciones comprensibles y transparencia durante todo el proceso.' },
                { n:'04', t:'Confidencialidad', d:'Respeto absoluto por la privacidad y el secreto profesional.' },
              ].map((it, i) => (
                <R key={i} type="reveal-blur" delay={i * 180}>
                  <div className="group text-center">
                    <div className="step-num w-14 h-14 mx-auto rounded-full border border-champagne/35 flex items-center justify-center mb-8">
                      <span className="font-serif text-champagne text-xl">{it.n}</span>
                    </div>
                    <h3 className="font-serif text-xl mb-4 group-hover:text-champagne transition-colors">{it.t}</h3>
                    <p className="text-white/45 font-light text-sm leading-relaxed">{it.d}</p>
                  </div>
                </R>
              ))}
            </div>
          </div>
        </section>

        {/* ══ HOW WE WORK ══ */}
        <section id="como-trabajo" className="py-28 bg-ivory">
          <div className="container mx-auto px-5 max-w-5xl text-center">
            <R><div className="gold-line mx-auto mb-10" /></R>
            <R delay={80}>
              <span className="text-champagne text-[9px] font-bold tracking-[0.4em] uppercase mb-4 block">Metodología</span>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-20">Cómo trabajamos</h2>
            </R>
            <div className="grid md:grid-cols-4 gap-10 relative">
              <div className="hidden md:block absolute top-[31px] left-[13%] right-[13%] h-px bg-champagne/18" />
              {[
                { s:'1', t:'Primer contacto', d:'Me explicas brevemente tu situación.' },
                { s:'2', t:'Análisis del caso', d:'Estudio la información y documentación.' },
                { s:'3', t:'Asesoramiento', d:'Opciones jurídicas y pasos a seguir.' },
                { s:'4', t:'Seguimiento', d:'Comunicación profesional constante.' },
              ].map((p, i) => (
                <R key={i} delay={i * 160}>
                  <div className="relative z-10 group">
                    <div className="step-num w-[62px] h-[62px] mx-auto bg-white rounded-full flex items-center justify-center font-serif text-2xl text-navy mb-8 border border-champagne/25 shadow-sm group-hover:bg-navy group-hover:text-white transition-all duration-500">
                      {p.s}
                    </div>
                    <h4 className="font-serif text-xl mb-3">{p.t}</h4>
                    <p className="text-warm-gray font-light text-xs leading-relaxed">{p.d}</p>
                  </div>
                </R>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CTA BAND ══ */}
        <section className="py-28 bg-navy text-center relative overflow-hidden">
          <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] rounded-full bg-champagne/5 blur-[80px]" />
          <div className="container mx-auto px-5 max-w-4xl relative z-10">
            <R><div className="gold-line mx-auto mb-10 opacity-40" /></R>
            <R delay={100}>
              <h2 className="font-serif text-3xl md:text-5xl lg:text-[3.5rem] text-white leading-snug mb-8">
                Cada situación tiene una solución que<br />
                <span className="italic text-champagne">merece ser estudiada.</span>
              </h2>
            </R>
            <R delay={200}>
              <p className="text-white/60 font-light text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
                Si necesitas asesoramiento laboral, puedes ponerte en contacto para explicar tu situación y valorar los siguientes pasos.
              </p>
            </R>
            <R delay={300}>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button onClick={() => go('contacto')}
                  className="btn-shine bg-champagne text-navy px-10 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-white transition-colors">
                  Contactar ahora
                </button>
                <a href="tel:652965280"
                  className="border border-champagne/50 text-champagne px-10 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-champagne/10 transition-colors flex items-center justify-center gap-2">
                  <Phone size={14}/> 652 965 280
                </a>
              </div>
            </R>
          </div>
        </section>

        {/* ══ CONTACT ══ */}
        <section id="contacto" className="py-28 bg-ivory">
          <div className="container mx-auto px-5 max-w-4xl">
            <div className="text-center mb-20">
              <R><div className="gold-line mx-auto mb-10" /></R>
              <R delay={80}>
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl mb-6">
                  Contacto <span className="italic text-champagne">profesional.</span>
                </h2>
                <p className="text-warm-gray font-light text-lg max-w-lg mx-auto">Solicita una consulta o resuelve tus dudas.</p>
              </R>
            </div>

            {/* Contact cards */}
            <div className="grid sm:grid-cols-2 gap-6 max-w-xl mx-auto mb-20">
              {[
                { icon:<Phone size={20}/>, label:'Llamar', val:'652 965 280', href:'tel:652965280' },
                { icon:<Mail size={20}/>, label:'Email', val:'[Pendiente]', href:'#' },
              ].map((c,i)=>(
                <R key={i} type="reveal-blur" delay={i*120}>
                  <a href={c.href} className="block bg-white p-8 text-center hover-lift shadow-sm border border-transparent hover:border-champagne/20 transition-all">
                    <div className="w-12 h-12 mx-auto mb-5 bg-ivory rounded-full flex items-center justify-center text-champagne">{c.icon}</div>
                    <h4 className="text-[10px] font-bold tracking-widest uppercase mb-2 text-navy/50">{c.label}</h4>
                    <p className="font-serif text-xl text-navy">{c.val}</p>
                  </a>
                </R>
              ))}
            </div>

            {/* Form */}
            <R type="reveal-scale" delay={150}>
              <div className="max-w-2xl mx-auto bg-white p-10 md:p-16 shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-champagne via-champagne/50 to-transparent" />
                <h3 className="font-serif text-3xl mb-12 text-center">Enviar consulta</h3>
                <form className="space-y-8" onSubmit={e=>{e.preventDefault();alert('Formulario decorativo — se configurará con el correo cuando esté disponible.');}}>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-bold tracking-widest uppercase text-navy/50 mb-3">Nombre</label>
                      <input type="text" required className="w-full border-b border-navy/10 bg-transparent py-3 text-sm focus:outline-none focus:border-champagne transition-colors"/>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold tracking-widest uppercase text-navy/50 mb-3">Teléfono</label>
                      <input type="tel" required className="w-full border-b border-navy/10 bg-transparent py-3 text-sm focus:outline-none focus:border-champagne transition-colors"/>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-navy/50 mb-3">Email</label>
                    <input type="email" required className="w-full border-b border-navy/10 bg-transparent py-3 text-sm focus:outline-none focus:border-champagne transition-colors"/>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest uppercase text-navy/50 mb-3">Mensaje</label>
                    <textarea rows={4} required className="w-full border-b border-navy/10 bg-transparent py-3 text-sm focus:outline-none focus:border-champagne transition-colors resize-none"/>
                  </div>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" id="priv" required className="mt-1 accent-champagne"/>
                    <label htmlFor="priv" className="text-[10px] text-warm-gray tracking-wider uppercase leading-relaxed">
                      Acepto la <button type="button" onClick={()=>goPage('privacidad')} className="underline hover:text-navy transition-colors">política de privacidad</button>
                    </label>
                  </div>
                  <div className="bg-ivory p-4 border border-champagne/10 flex items-start gap-3 text-xs text-navy/50">
                    <AlertCircle size={15} className="shrink-0 text-champagne/60 mt-0.5"/>
                    <span>No incluya información confidencial sensible en este formulario. Utilice un canal seguro tras el primer contacto.</span>
                  </div>
                  <button type="submit" className="btn-shine w-full bg-navy text-white py-5 text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-navy/90 transition-colors">
                    Enviar consulta
                  </button>
                </form>
              </div>
            </R>
          </div>
        </section>

        {/* ══ FOOTER ══ */}
        <footer className="bg-navy text-white/35 py-20 border-t border-white/5">
          <div className="container mx-auto px-5 max-w-6xl text-center">
            <img src="https://pub-261f320d11d74f43b95552577762d5dd.r2.dev/desiree%20abogada/Logotipo_elegante_de_abogada_con_monograma_DR-removebg-preview.png"
              alt="Logo DR" className="w-40 mx-auto mb-10 brightness-0 invert opacity-35"/>
            <div className="flex flex-wrap justify-center gap-10 mb-16 text-[10px] font-semibold tracking-[0.22em] uppercase">
              {[['inicio','Inicio'],['sobre-mi','Sobre mí'],['servicios','Servicios'],['contacto','Contacto']].map(([id,label])=>(
                <button key={id} onClick={()=>go(id)} className="hover:text-champagne transition-colors">{label}</button>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-10 mb-14 text-[10px] tracking-[0.18em] uppercase">
              <button onClick={()=>goPage('aviso')} className="hover:text-champagne transition-colors">Aviso Legal</button>
              <button onClick={()=>goPage('privacidad')} className="hover:text-champagne transition-colors">Privacidad</button>
              <button onClick={()=>goPage('cookies')} className="hover:text-champagne transition-colors">Cookies</button>
            </div>
            <div className="pt-10 border-t border-white/5 text-[10px] tracking-widest flex flex-col md:flex-row justify-between gap-4 text-white/20">
              <span>&copy; {new Date().getFullYear()} Desirée Rubio Pérez — Abogada Laboralista</span>
              <span>Espartinas, Sevilla</span>
            </div>
          </div>
        </footer>

        {/* Floating phone */}
        <a href="tel:652965280"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-navy text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-champagne hover:text-navy transition-all sm:hidden">
          <Phone size={22}/>
        </a>
      </div>
    </>
  );
}
