import { useEffect, useState } from "react";
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, UserCheck, UserX, Crown, Video, Plus } from "lucide-react";
import VideoManagement from "@/components/admin/VideoManagement";

interface MemberData {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  roles: string[];
}

const Admin = () => {
  const [members, setMembers] = useState<MemberData[]>([]);
  const [loading, setLoading] = useState(true);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [makingAdmin, setMakingAdmin] = useState(false);
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    adminCount: 0,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      // Fetch profiles with their roles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      // Fetch all user roles
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rolesError) throw rolesError;

      // Combine profiles with their roles
      const membersWithRoles = profilesData.map((profile) => {
        const userRoles = rolesData
          .filter((role) => role.user_id === profile.user_id)
          .map((role) => role.role);

        return {
          ...profile,
          roles: userRoles,
        };
      });

      setMembers(membersWithRoles);

      // Calculate stats
      const totalMembers = membersWithRoles.length;
      const adminCount = membersWithRoles.filter((member) =>
        member.roles.includes("admin")
      ).length;

      setStats({
        totalMembers,
        activeMembers: totalMembers, // Assuming all profiles are active
        adminCount,
      });
    } catch (error) {
      console.error("Error fetching members:", error);
      toast({
        title: "Error",
        description: "Failed to fetch member data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "moderator":
        return "secondary";
      default:
        return "outline";
    }
  };

  const handleMakeAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address.",
        variant: "destructive",
      });
      return;
    }

    setMakingAdmin(true);
    try {
      const { error } = await supabase
        .rpc('make_user_admin' as any, {
          user_email: newAdminEmail.trim()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `User ${newAdminEmail} has been made an admin.`,
      });
      
      setNewAdminEmail("");
      fetchMembers(); // Refresh the members list
    } catch (error: any) {
      console.error("Error making user admin:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to make user admin.",
        variant: "destructive",
      });
    } finally {
      setMakingAdmin(false);
    }
  };

  return (
    <>
      <SEO
        title="Admin Dashboard | WealthWise Academy"
        description="Admin area for managing WealthWise Academy members and platform."
      />
      
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage members and monitor platform activity
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalMembers}</div>
                <p className="text-xs text-muted-foreground">
                  Registered users
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Members</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeMembers}</div>
                <p className="text-xs text-muted-foreground">
                  Currently active
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Administrators</CardTitle>
                <Crown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.adminCount}</div>
                <p className="text-xs text-muted-foreground">
                  Admin accounts
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Management Tabs */}
          <Tabs defaultValue="members" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="members" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Members
              </TabsTrigger>
              <TabsTrigger value="videos" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Videos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="members" className="mt-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>All Members</CardTitle>
                  <form onSubmit={handleMakeAdmin} className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Enter email to make admin"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                      className="w-64"
                    />
                    <Button 
                      type="submit" 
                      disabled={makingAdmin}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      {makingAdmin ? "Adding..." : "Make Admin"}
                    </Button>
                  </form>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-muted-foreground">Loading members...</div>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Roles</TableHead>
                            <TableHead>Joined</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {members.map((member) => (
                            <TableRow key={member.id}>
                              <TableCell className="font-medium">
                                {member.full_name || "No name provided"}
                              </TableCell>
                              <TableCell>{member.email}</TableCell>
                              <TableCell>
                                {member.phone || (
                                  <span className="text-muted-foreground">Not provided</span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-1 flex-wrap">
                                  {member.roles.length > 0 ? (
                                    member.roles.map((role) => (
                                      <Badge
                                        key={role}
                                        variant={getRoleBadgeVariant(role)}
                                        className="text-xs"
                                      >
                                        {role}
                                      </Badge>
                                    ))
                                  ) : (
                                    <Badge variant="outline" className="text-xs">
                                      user
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-muted-foreground">
                                {formatDate(member.created_at)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                      
                      {members.length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          No members found.
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="videos" className="mt-6">
              <VideoManagement />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Admin;
