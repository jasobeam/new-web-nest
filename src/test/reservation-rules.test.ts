import { describe, expect, it } from "vitest";

import { nightlyRateForDate, reservationInquirySchema } from "@/lib/reservation-rules";

describe("reservation rules", () => {
  it("charges $145 per night Sunday through Thursday", () => {
    for (const date of ["2030-11-10", "2030-11-11", "2030-11-12", "2030-11-13", "2030-11-14"]) {
      expect(nightlyRateForDate(date)).toBe(145);
    }
  });

  it("charges $170 per night Friday and Saturday", () => {
    expect(nightlyRateForDate("2030-11-08")).toBe(170);
    expect(nightlyRateForDate("2030-11-09")).toBe(170);
  });

  it("does not accept more than 8 guests", () => {
    const request = {
      fullName: "Alex García",
      email: "alex@example.com",
      phone: "+503 7000 0000",
      arrivalDate: "2030-11-08",
      departureDate: "2030-11-09",
      guests: 9,
      message: "",
    };

    expect(reservationInquirySchema.safeParse(request).success).toBe(false);
    expect(reservationInquirySchema.safeParse({ ...request, guests: 8 }).success).toBe(true);
  });

  it("requires departure after arrival", () => {
    const request = {
      fullName: "Alex García",
      email: "alex@example.com",
      phone: "+503 7000 0000",
      arrivalDate: "2030-11-08",
      departureDate: "2030-11-08",
      guests: 2,
      message: "",
    };

    expect(reservationInquirySchema.safeParse(request).success).toBe(false);
    expect(reservationInquirySchema.safeParse({ ...request, departureDate: "2030-11-09" }).success).toBe(true);
  });
});
