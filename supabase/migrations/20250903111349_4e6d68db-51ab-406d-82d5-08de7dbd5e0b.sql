-- Make expert_id nullable in courses table to allow courses without assigned experts
ALTER TABLE public.courses ALTER COLUMN expert_id DROP NOT NULL;