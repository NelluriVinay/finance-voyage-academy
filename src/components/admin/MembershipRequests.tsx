import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, User } from "lucide-react";

interface MembershipRequest {
  id: string;
  user_id: string;
  status: string;
  message: string;
  created_at: string;
  updated_at: string;
  approved_by: string | null;
  approved_at: string | null;
}

interface Profile {
  user_id: string;
  full_name: string;
  email: string;
}

const MembershipRequests = () => {
  const { toast } = useToast();
  const [requests, setRequests] = useState<MembershipRequest[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      // Fetch membership requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('membership_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;

      // Fetch user profiles for the requests
      if (requestsData && requestsData.length > 0) {
        const userIds = [...new Set(requestsData.map(req => req.user_id))];
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('user_id, full_name, email')
          .in('user_id', userIds);

        if (profilesError) throw profilesError;

        const profilesMap = (profilesData || []).reduce((acc, profile) => {
          acc[profile.user_id] = profile;
          return acc;
        }, {} as Record<string, Profile>);

        setProfiles(profilesMap);
      }

      setRequests(requestsData || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: "Error",
        description: "Failed to fetch membership requests.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId: string, action: 'approved' | 'rejected', userId: string) => {
    try {
      // Update the request status
      const { error: updateError } = await supabase
        .from('membership_requests')
        .update({
          status: action,
          approved_by: (await supabase.auth.getUser()).data.user?.id,
          approved_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (updateError) throw updateError;

      // If approved, add member role to user
      if (action === 'approved') {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: 'member'
          });

        if (roleError && !roleError.message.includes('duplicate')) {
          throw roleError;
        }
      }

      toast({
        title: "Success",
        description: `Membership request ${action} successfully.`,
      });

      fetchRequests(); // Refresh the list
    } catch (error) {
      console.error('Error updating request:', error);
      toast({
        title: "Error",
        description: `Failed to ${action} membership request.`,
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="text-yellow-600"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'approved':
        return <Badge variant="secondary" className="text-green-600"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Membership Requests ({requests.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No membership requests found.</p>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => {
                const profile = profiles[request.user_id];
                return (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div>
                          <h4 className="font-medium">{profile?.full_name || 'Unknown User'}</h4>
                          <p className="text-sm text-muted-foreground">{profile?.email}</p>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{request.message}</p>
                      <p className="text-xs text-muted-foreground">
                        Requested: {formatDate(request.created_at)}
                        {request.approved_at && (
                          <span> • Processed: {formatDate(request.approved_at)}</span>
                        )}
                      </p>
                    </div>
                    {request.status === 'pending' && (
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-600 hover:bg-green-50"
                          onClick={() => handleRequestAction(request.id, 'approved', request.user_id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                          onClick={() => handleRequestAction(request.id, 'rejected', request.user_id)}
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MembershipRequests;