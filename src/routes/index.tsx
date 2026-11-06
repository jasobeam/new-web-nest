import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import {
  ArrowDown,
  ArrowRight,
  Bath,
  BedDouble,
  Check,
  Clock3,
  CookingPot,
  House,
  Mail,
  MapPin,
  Menu,
  PawPrint,
  Phone,
  Plane,
  Sparkles,
  Tv,
  Users,
  Waves,
  Wifi,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import coastImage from "@/assets/el-salvador-coast.jpg";
import houseLogo from "@/assets/garcias-tropical-house-logo.png.asset.json";
import {
  nightlyRateForDate,
  reservationInquirySchema,
  type ReservationInquiry,
} from "@/lib/reservation-rules";
import { submitReservationRequest } from "@/lib/reservation.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Garcia's Tropical House | Casa vacacional en El Salvador" },
      {
        name: "description",
        content:
          "Descansa con hasta 8 personas en Garcia's Tropical House, cerca de Playa Cangrejera y La Bocana. Consulta disponibilidad y tarifas.",
      },
      { property: "og:title", content: "Garcia's Tropical House | Tu casa cerca del mar" },
      {
        property: "og:description",
        content:
          "Una casa vacacional cómoda en El Salvador, con espacio para compartir y las playas cerca.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const navItems = [
  { label: "La casa", href: "#casa" },
  { label: "Comodidades", href: "#comodidades" },
  { label: "Alrededores", href: "#alrededores" },
  { label: "Tarifas", href: "#tarifas" },
];

const amenities = [
  { icon: Wifi, title: "WiFi en toda la casa", detail: "Conéctate donde quieras." },
  { icon: BedDouble, title: "Dos habitaciones", detail: "Cuatro camas por habitación." },
  { icon: Bath, title: "Tres baños", detail: "Dos completos y uno social." },
  { icon: CookingPot, title: "Cocina equipada", detail: "Electrodomésticos y utensilios." },
  { icon: Tv, title: "Sala para compartir", detail: "Aire acondicionado y cable satelital." },
  { icon: PawPrint, title: "Mascotas bienvenidas", detail: "Consulta las restricciones." },
];

const houseFeatures = [
  "Hasta 8 huéspedes",
  "Aire acondicionado en habitaciones y sala",
  "Baños privados en las habitaciones",
  "Reuniones familiares permitidas",
  "Utensilios de cocina limpios y ordenados al salir",
  "Respeto a la capacidad máxima de 8 huéspedes",
];

const initialForm: ReservationInquiry = {
  fullName: "",
  email: "",
  phone: "",
  arrivalDate: "",
  departureDate: "",
  guests: 2,
  message: "",
};

const today = new Date().toISOString().slice(0, 10);

function HomePage() {
  const submitRequest = useServerFn(submitReservationRequest);
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState<ReservationInquiry>(initialForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  const updateField = (field: keyof ReservationInquiry, value: string | number) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setFormErrors((previous) => ({ ...previous, [field]: "" }));
  };

  async function handleReservationSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormStatus("idle");

    const parsed = reservationInquirySchema.safeParse(form);
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const field = String(issue.path[0] ?? "form");
        nextErrors[field] ??= issue.message;
      }
      setFormErrors(nextErrors);
      return;
    }

    setFormErrors({});
    setFormStatus("sending");
    try {
      await submitRequest({ data: parsed.data });
      setForm(initialForm);
      setFormStatus("sent");
    } catch {
      setFormStatus("failed");
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="site-header">
        <div className="site-header-inner">
          <a className="brand-lockup" href="#inicio" aria-label="Garcia's Tropical House, inicio">
            <img src={houseLogo.url} alt="Logotipo de Garcia's Tropical House" width={54} height={54} />
            <span className="brand-name">Garcia’s <span>Tropical House</span></span>
          </a>
          <nav className={`desktop-nav ${menuOpen ? "is-open" : ""}`} aria-label="Navegación principal">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
            <Button asChild className="nav-booking">
              <a href="#reservar" onClick={() => setMenuOpen(false)}>
                Reservar <ArrowRight aria-hidden="true" />
              </a>
            </Button>
          </nav>
          <Button
            variant="ghost"
            size="icon"
            className="mobile-menu-toggle"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>
      </header>

      <main>
        <section className="hero" id="inicio" aria-labelledby="hero-title">
          <img className="hero-image" src={coastImage} alt="Costa tropical del Pacífico salvadoreño" width={1536} height={1024} fetchPriority="high" />
          <div className="hero-scrim" aria-hidden="true" />
          <div className="hero-content">
            <span className="eyebrow eyebrow-light"><Waves aria-hidden="true" /> La escapada que estabas esperando</span>
            <h1 id="hero-title">Garcia’s<br />Tropical House</h1>
            <p>Tu casa vacacional cerca del mar en El Salvador.</p>
            <div className="hero-actions">
              <Button asChild size="lg" className="hero-cta">
                <a href="#reservar">Consultar disponibilidad <ArrowRight aria-hidden="true" /></a>
              </Button>
              <a className="hero-explore" href="#casa"><ArrowDown aria-hidden="true" /> Conoce la casa</a>
            </div>
            <div className="hero-note"><MapPin aria-hidden="true" /> El Salvador <span aria-hidden="true">·</span> Cerca de Playa Cangrejera y La Bocana</div>
          </div>
          <span className="hero-photo-note">Imagen de ambiente · Costa salvadoreña</span>
          <div className="hero-side-note" aria-hidden="true">Una pausa para volver a disfrutar</div>
        </section>

        <section className="intro-section section-shell" id="casa">
          <div className="intro-heading">
            <span className="eyebrow">Tu lugar para desconectar</span>
            <h2 id="intro-title">Bienvenidos a su casa cerca del mar.</h2>
          </div>
          <div className="intro-copy">
            <p>Un espacio cómodo y completamente equipado para disfrutar unos días de descanso con familia o amigos.</p>
            <p>Relájate en una casa pensada para compartir: habitaciones climatizadas, cocina equipada y una sala que invita a quedarse un rato más.</p>
            <a className="text-link" href="#comodidades">Descubre lo que te espera <ArrowRight aria-hidden="true" /></a>
          </div>
          <div className="intro-stats" aria-label="Características principales">
            <div><Users aria-hidden="true" /><strong>8</strong><span>huéspedes máx.</span></div>
            <div><BedDouble aria-hidden="true" /><strong>2</strong><span>habitaciones</span></div>
            <div><Waves aria-hidden="true" /><strong>8 min</strong><span>de la playa*</span></div>
          </div>
          <p className="fine-print intro-footnote">*Tiempo aproximado compartido por el propietario; puede variar según la ruta y el tráfico.</p>
        </section>

        <section className="amenities-section" id="comodidades">
          <div className="section-shell">
            <div className="section-heading section-heading-row">
              <div>
                <span className="eyebrow">Todo lo necesario, a tu ritmo</span>
                <h2>Comodidades para<br />sentirte como en casa.</h2>
              </div>
              <p>Haz planes para el día y deja que la casa se encargue del descanso.</p>
            </div>
            <div className="amenity-grid">
              {amenities.map(({ icon: Icon, title, detail }, index) => (
                <article className="amenity-item" key={title}>
                  <div className="amenity-icon"><Icon aria-hidden="true" /></div>
                  <span className="amenity-number">0{index + 1}</span>
                  <h3>{title}</h3>
                  <p>{detail}</p>
                </article>
              ))}
            </div>
            <div className="house-details-strip">
              <span className="details-symbol"><House aria-hidden="true" /></span>
              <div><strong>Más espacio para compartir</strong><p>2 habitaciones con 4 camas y baño completo privado cada una, más un baño social.</p></div>
              <span className="detail-divider" aria-hidden="true" />
              <div><strong>Horarios de estancia</strong><p><Clock3 aria-hidden="true" /> Ingreso 3:00 p. m. <span>·</span> Salida 1:00 p. m.</p></div>
            </div>
          </div>
        </section>

        <section className="coast-section" id="alrededores">
          <div className="coast-image-wrap">
            <img src={coastImage} alt="Mar y costa tropical de El Salvador" width={1536} height={1024} loading="lazy" />
            <span className="coast-image-label">El Salvador · imagen de ambiente</span>
          </div>
          <div className="coast-copy">
            <span className="eyebrow eyebrow-light">Alrededores</span>
            <h2>El mar, a unos minutos de tu puerta.</h2>
            <p className="coast-lede">Una ubicación para alternar días tranquilos en casa con salidas a la costa.</p>
            <div className="destination-list">
              <div><span className="destination-icon"><Waves aria-hidden="true" /></span><p><strong>Playa Cangrejera y La Bocana</strong><span>Aproximadamente 8 minutos</span></p></div>
              <div><span className="destination-icon"><Plane aria-hidden="true" /></span><p><strong>Aeropuerto Internacional de El Salvador</strong><span>Aproximadamente 15 minutos</span></p></div>
              <div><span className="destination-icon"><MapPin aria-hidden="true" /></span><p><strong>Surf City · Puerto de La Libertad</strong><span>Aproximadamente 20 minutos</span></p></div>
            </div>
            <p className="fine-print coast-footnote">Tiempos aproximados indicados por el propietario; no son tiempos de navegación verificados. La dirección exacta de la propiedad no fue incluida.</p>
          </div>
        </section>

        <section className="rates-section section-shell" id="tarifas">
          <div className="rates-intro">
            <span className="eyebrow">Tu próximo descanso empieza aquí</span>
            <h2>Una estancia<br />para recordar.</h2>
            <p>Envía tus fechas y el número de huéspedes. El propietario confirmará la disponibilidad antes de cualquier pago.</p>
            <a className="text-link" href="#reservar">Consulta tus fechas <ArrowRight aria-hidden="true" /></a>
          </div>
          <div className="rate-details">
            <div className="rate-listing">
              <div className="rate-row"><div><span>Domingo a jueves</span><small>Por noche</small></div><strong>$145 <small>USD</small></strong></div>
              <div className="rate-row"><div><span>Viernes y sábado</span><small>Por noche</small></div><strong>$170 <small>USD</small></strong></div>
            </div>
            <div className="payment-notes">
              <div><span className="check-icon"><Check aria-hidden="true" /></span><p><strong>Para confirmar</strong><span>Se requiere el 50 % del total al reservar; el resto se paga el día de ingreso.</span></p></div>
              <div><span className="check-icon"><Check aria-hidden="true" /></span><p><strong>Formas de pago</strong><span>Tarjetas de crédito o débito, transferencia, Zelle y depósito bancario.</span></p></div>
            </div>
            <div className="cancellation-note"><Sparkles aria-hidden="true" /><p>Más de 48 horas antes: cancelación gratuita. El propietario está confirmando si la penalización del 50 % del depósito aplica en las últimas 24 o 48 horas. Consulta el plazo exacto antes de reservar.</p></div>
          </div>
        </section>

        <section className="house-rules-section">
          <div className="section-shell rules-layout">
            <div className="rules-title"><span className="eyebrow">Un espacio para cuidar</span><h2>Detalles sencillos,<br />estancia más agradable.</h2></div>
            <div className="rules-list">
              {houseFeatures.map((feature) => <div key={feature}><Check aria-hidden="true" /><span>{feature}</span></div>)}
            </div>
          </div>
        </section>

        <section className="reservation-section" id="reservar">
          <div className="section-shell reservation-layout">
            <div className="reservation-copy">
              <span className="eyebrow eyebrow-light">Hagamos espacio para tu escapada</span>
              <h2>¿Cuándo te gustaría venir?</h2>
              <p>Cuéntanos un poco de tu plan. El propietario revisará disponibilidad y te dará seguimiento; no se realizará ningún cobro en este formulario.</p>
              <div className="reservation-direct">
                <p>¿Prefieres conversar directamente?</p>
                <a href="tel:+50376643096"><Phone aria-hidden="true" /> El Salvador · +503 7664-3096</a>
                <a href="tel:+17148355090"><Phone aria-hidden="true" /> Estados Unidos · +1 (714) 835-5090</a>
                <a href="mailto:florgarcia0406@gmail.com"><Mail aria-hidden="true" /> florgarcia0406@gmail.com</a>
              </div>
            </div>
            <form className="reservation-form" onSubmit={handleReservationSubmit} noValidate>
              <div className="form-heading"><div><span className="eyebrow">Solicitud de reserva</span><h3>Cuéntanos de tu visita.</h3></div><span className="form-step">01 <span>/ 01</span></span></div>
              <div className="form-fields">
                <label className="form-field form-field-wide">Nombre completo<Input autoComplete="name" name="fullName" placeholder="Tu nombre" value={form.fullName} onChange={(event) => updateField("fullName", event.target.value)} aria-invalid={Boolean(formErrors.fullName)} aria-describedby={formErrors.fullName ? "name-error" : undefined} required maxLength={120} />{formErrors.fullName && <span className="field-error" id="name-error">{formErrors.fullName}</span>}</label>
                <label className="form-field">Correo electrónico<Input autoComplete="email" type="email" name="email" placeholder="nombre@correo.com" value={form.email} onChange={(event) => updateField("email", event.target.value)} aria-invalid={Boolean(formErrors.email)} aria-describedby={formErrors.email ? "email-error" : undefined} required maxLength={254} />{formErrors.email && <span className="field-error" id="email-error">{formErrors.email}</span>}</label>
                <label className="form-field">Teléfono o WhatsApp<Input autoComplete="tel" type="tel" name="phone" placeholder="Tu número con código de país" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} aria-invalid={Boolean(formErrors.phone)} aria-describedby={formErrors.phone ? "phone-error" : undefined} required maxLength={40} />{formErrors.phone && <span className="field-error" id="phone-error">{formErrors.phone}</span>}</label>
                <label className="form-field">Fecha de ingreso<Input type="date" name="arrivalDate" min={today} value={form.arrivalDate} onChange={(event) => updateField("arrivalDate", event.target.value)} aria-invalid={Boolean(formErrors.arrivalDate)} aria-describedby={formErrors.arrivalDate ? "arrival-error" : undefined} required />{formErrors.arrivalDate && <span className="field-error" id="arrival-error">{formErrors.arrivalDate}</span>}</label>
                <label className="form-field">Fecha de salida<Input type="date" name="departureDate" min={form.arrivalDate || today} value={form.departureDate} onChange={(event) => updateField("departureDate", event.target.value)} aria-invalid={Boolean(formErrors.departureDate)} aria-describedby={formErrors.departureDate ? "departure-error" : undefined} required />{formErrors.departureDate && <span className="field-error" id="departure-error">{formErrors.departureDate}</span>}</label>
                <label className="form-field">Número de huéspedes<select name="guests" value={form.guests} onChange={(event) => updateField("guests", Number(event.target.value))}>{Array.from({ length: 8 }, (_, index) => index + 1).map((guests) => <option key={guests} value={guests}>{guests} {guests === 1 ? "huésped" : "huéspedes"}</option>)}</select>{formErrors.guests && <span className="field-error">{formErrors.guests}</span>}</label>
                <label className="form-field form-field-wide">Mensaje adicional <span className="optional-label">Opcional</span><Textarea name="message" placeholder="Cuéntanos un poco más sobre tu visita…" value={form.message} onChange={(event) => updateField("message", event.target.value)} maxLength={2000} rows={3} /><span className="character-count">{form.message.length}/2000</span></label>
              </div>
              {formStatus === "sent" && <p className="form-feedback form-feedback-success" role="status"><Check aria-hidden="true" /> Tu solicitud quedó enviada. El propietario revisará la disponibilidad.</p>}
              {formStatus === "failed" && <p className="form-feedback form-feedback-error" role="alert">No pudimos enviar tu solicitud. Inténtalo de nuevo o comunícate directamente.</p>}
              {formErrors.form && <p className="form-feedback form-feedback-error" role="alert">{formErrors.form}</p>}
              <div className="form-footer"><p>Enviar la solicitud no confirma una reserva ni genera un cobro.</p><Button type="submit" size="lg" className="submit-button" disabled={formStatus === "sending"}>{formStatus === "sending" ? "Enviando…" : <>Consultar disponibilidad <ArrowRight aria-hidden="true" /></>}</Button></div>
            </form>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="section-shell footer-inner">
          <a className="brand-lockup footer-brand" href="#inicio"><img src={houseLogo.url} alt="" width={48} height={48} /><span className="brand-name">Garcia’s <span>Tropical House</span></span></a>
          <p>Un lugar para descansar, compartir y disfrutar.</p>
          <a className="footer-top-link" href="#inicio">Volver al inicio <ArrowRight aria-hidden="true" /></a>
        </div>
        <div className="section-shell footer-bottom"><span>© {new Date().getFullYear()} Garcia’s Tropical House</span><span>El Salvador</span></div>
      </footer>
    </div>
  );
}