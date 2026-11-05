CREATE TABLE public.reservation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email varchar(254) NOT NULL,
  phone varchar(40) NOT NULL,
  arrival_date date NOT NULL,
  departure_date date NOT NULL,
  guests smallint NOT NULL,
  message text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT reservation_requests_full_name_length CHECK (char_length(btrim(full_name)) BETWEEN 2 AND 120),
  CONSTRAINT reservation_requests_email_format CHECK (position('@' in email) > 1 AND position('.' in split_part(email, '@', 2)) > 1),
  CONSTRAINT reservation_requests_phone_length CHECK (char_length(btrim(phone)) BETWEEN 7 AND 40),
  CONSTRAINT reservation_requests_guest_limit CHECK (guests BETWEEN 1 AND 8),
  CONSTRAINT reservation_requests_dates_order CHECK (departure_date > arrival_date),
  CONSTRAINT reservation_requests_message_length CHECK (char_length(message) <= 2000)
);
GRANT INSERT ON public.reservation_requests TO anon, authenticated;
GRANT ALL ON public.reservation_requests TO service_role;
ALTER TABLE public.reservation_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Visitors can submit reservation requests"
  ON public.reservation_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);