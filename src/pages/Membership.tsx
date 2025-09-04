import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

const Membership = () => {
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [userRoles, setUserRoles] = useState([]);
  const [membershipRequest, setMembershipRequest] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      
      // Check user roles
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id);
      
      setUserRoles(roles?.map(r => r.role) || []);

      // Check existing membership request
      const { data: request } = await supabase
        .from('membership_requests')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      setMembershipRequest(request);
    }
  };

  const handleMembershipRequest = async () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to request membership.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    const { error } = await supabase
      .from('membership_requests')
      .insert({
        user_id: user.id,
        message: 'Request for premium membership access'
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit membership request. Please try again.",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Request Submitted",
        description: "Your membership request has been sent to admin for approval.",
      });
      checkUser(); // Refresh to show the pending request
    }
    
    setLoading(false);
  };

  const isMember = userRoles.includes('member');
  const hasPendingRequest = membershipRequest?.status === 'pending';
  const wasRejected = membershipRequest?.status === 'rejected';

  return (
    <>
      <SEO
        title="Membership & Pricing | Finance Voyage Academy"
        description="Choose between Free access and Premium membership for advanced courses and live sessions."
      />
      <section className="container mx-auto py-10">
        <h1 className="mb-6 text-3xl font-bold">Membership & Pricing</h1>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <ul className="mb-6 list-disc pl-5 text-muted-foreground">
                <li>Introductory courses</li>
                <li>Selected community access</li>
                <li>Limited articles</li>
              </ul>
              <Button variant="outline">Get started</Button>
            </CardContent>
          </Card>

          <Card className="border-accent">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Premium
                {isMember && <Badge variant="secondary" className="text-xs">Active Member</Badge>}
                {hasPendingRequest && <Badge variant="outline" className="text-xs">Pending Approval</Badge>}
                {wasRejected && <Badge variant="destructive" className="text-xs">Request Rejected</Badge>}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <ul className="mb-6 list-disc pl-5 text-muted-foreground">
                <li>All courses & premium articles</li>
                <li>Weekly live webinars</li>
                <li>Priority community support</li>
              </ul>
              {!user ? (
                <Button variant="outline" disabled>
                  Login Required
                </Button>
              ) : isMember ? (
                <Button variant="premium" disabled>
                  ✓ Member Access Active
                </Button>
              ) : hasPendingRequest ? (
                <Button variant="outline" disabled>
                  Request Pending Admin Approval
                </Button>
              ) : (
                <Button 
                  variant="premium" 
                  onClick={handleMembershipRequest}
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Request Membership"}
                </Button>
              )}
              {wasRejected && (
                <p className="mt-2 text-xs text-red-600">
                  Your previous request was rejected. You can submit a new request.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
};

export default Membership;
