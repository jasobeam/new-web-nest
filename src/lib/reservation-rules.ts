import { z } from "zod";

export const WEEKDAY_NIGHTLY_RATE_USD = 145;
export const WEEKEND_NIGHTLY_RATE_USD = 170;
export const MAX_GUESTS = 8;

export function nightlyRateForDate(date: string): number {
  const [year, month, day] = date.split("-").map(Number);
  const weekday = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return weekday === 5 || weekday === 6
    ? WEEKEND_NIGHTLY_RATE_USD
    : WEEKDAY_NIGHTLY_RATE_USD;
}

export const reservationInquirySchema = z
  .object({
    fullName: z.string().trim().min(2, "Escribe tu nombre completo.").max(120),
    email: z.string().trim().email("Escribe un correo válido.").max(254),
    phone: z.string().trim().min(7, "Escribe un teléfono válido.").max(40),
    arrivalDate: z.string().date("Elige una fecha válida."),
    departureDate: z.string().date("Elige una fecha válida."),
    guests: z.coerce.number().int().min(1).max(MAX_GUESTS),
    message: z.string().trim().max(2000),
  })
  .refine((data) => data.departureDate > data.arrivalDate, {
    message: "La salida debe ser después del ingreso.",
    path: ["departureDate"],
  })
  .refine((data) => data.arrivalDate >= new Date().toISOString().slice(0, 10), {
    message: "El ingreso no puede ser una fecha pasada.",
    path: ["arrivalDate"],
  });

export type ReservationInquiry = z.infer<typeof reservationInquirySchema>;
