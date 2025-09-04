-- Create membership requests table
CREATE TABLE public.membership_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.membership_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own requests" 
ON public.membership_requests 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own requests" 
ON public.membership_requests 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all requests" 
ON public.membership_requests 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update requests" 
ON public.membership_requests 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add member role to enum
ALTER TYPE public.app_role ADD VALUE 'member';

-- Create trigger for updated_at
CREATE TRIGGER update_membership_requests_updated_at
BEFORE UPDATE ON public.membership_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();