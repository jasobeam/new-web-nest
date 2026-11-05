import { createServerFn } from "@tanstack/react-start";

import { reservationInquirySchema } from "@/lib/reservation-rules";

export const submitReservationRequest = createServerFn({ method: "POST" })
  .inputValidator((input) => reservationInquirySchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("reservation_requests").insert({
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      arrival_date: data.arrivalDate,
      departure_date: data.departureDate,
      guests: data.guests,
      message: data.message,
    });

    if (error) {
      console.error("Could not store reservation inquiry.", error.message);
      throw new Error("No pudimos enviar tu solicitud. Inténtalo de nuevo.");
    }

    return { success: true };
  });