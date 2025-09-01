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

  const handleToggleAdmin = async (userEmail: string, currentRoles: string[]) => {
    const isAdmin = currentRoles.includes('admin');
    
    try {
      if (isAdmin) {
        // Remove admin role
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .match({ 
            user_id: members.find(m => m.email === userEmail)?.user_id,
            role: 'admin'
          });
        
        if (error) throw error;
        
        toast({
          title: "Success",
          description: `Removed admin role from ${userEmail}`,
        });
      } else {
        // Add admin role
        const { error } = await supabase
          .rpc('make_user_admin' as any, {
            user_email: userEmail
          });
        
        if (error) throw error;
        
        toast({
          title: "Success", 
          description: `Made ${userEmail} an admin`,
        });
      }
      
      fetchMembers(); // Refresh the list
    } catch (error: any) {
      console.error("Error changing role:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to change user role",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <SEO
        title="Admin Dashboard | WealthWise Academy"
        description="Admin area for managing WealthWise Academy members and platform."
      />
      
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20">
        <div className="container mx-auto py-12 px-6 max-w-7xl">
          {/* Header with rich styling */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                <Crown className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive platform management for WealthWise Academy
            </p>
          </div>

          {/* Elegant Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card via-card to-card/90 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Members</CardTitle>
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-foreground">{stats.totalMembers}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Registered users on platform
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card via-card to-card/90 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active Members</CardTitle>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <UserCheck className="h-5 w-5 text-emerald-600" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-foreground">{stats.activeMembers}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Currently active users
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card via-card to-card/90 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Administrators</CardTitle>
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Crown className="h-5 w-5 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-3xl font-bold text-foreground">{stats.adminCount}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Administrative accounts
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Management Tabs */}
          <div className="bg-card/50 backdrop-blur-sm rounded-2xl shadow-xl border-0 p-8">
            <Tabs defaultValue="members" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-14 bg-muted/50 rounded-xl p-1">
                <TabsTrigger value="members" className="flex items-center gap-3 h-12 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">Members Management</span>
                </TabsTrigger>
                <TabsTrigger value="videos" className="flex items-center gap-3 h-12 rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-lg transition-all">
                  <Video className="w-5 h-5" />
                  <span className="font-semibold">Content Management</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="members" className="mt-8">
                <Card className="border-0 shadow-xl bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm">
                  <CardHeader className="pb-6">
                    <CardTitle className="text-2xl font-bold flex items-center gap-3">
                      <Users className="w-6 h-6 text-primary" />
                      Member Directory
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="flex items-center justify-center py-16">
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <div className="w-6 h-6 border-2 border-primary border-r-transparent rounded-full animate-spin"></div>
                          <span className="text-lg">Loading members...</span>
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-xl border-0 shadow-inner bg-background/50 overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-muted/30 border-b-0 hover:bg-muted/50">
                              <TableHead className="font-semibold text-foreground h-14">Name</TableHead>
                              <TableHead className="font-semibold text-foreground">Email</TableHead>
                              <TableHead className="font-semibold text-foreground">Phone</TableHead>
                              <TableHead className="font-semibold text-foreground">Roles</TableHead>
                              <TableHead className="font-semibold text-foreground">Joined</TableHead>
                              <TableHead className="font-semibold text-foreground">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {members.map((member, index) => (
                              <TableRow key={member.id} className="hover:bg-muted/20 transition-colors border-b border-border/50">
                                <TableCell className="font-medium py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                                      <span className="text-sm font-semibold text-primary">
                                        {(member.full_name || member.email)[0].toUpperCase()}
                                      </span>
                                    </div>
                                    <span>{member.full_name || "No name provided"}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="py-4">{member.email}</TableCell>
                                <TableCell className="py-4">
                                  {member.phone || (
                                    <span className="text-muted-foreground italic">Not provided</span>
                                  )}
                                </TableCell>
                                <TableCell className="py-4">
                                  <div className="flex gap-2 flex-wrap">
                                    {member.roles.length > 0 ? (
                                      member.roles.map((role) => (
                                        <Badge
                                          key={role}
                                          variant={getRoleBadgeVariant(role)}
                                          className="text-xs font-semibold px-3 py-1 shadow-sm"
                                        >
                                          {role}
                                        </Badge>
                                      ))
                                    ) : (
                                      <Badge variant="outline" className="text-xs px-3 py-1">
                                        user
                                      </Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground py-4">
                                  {formatDate(member.created_at)}
                                </TableCell>
                                <TableCell className="py-4">
                                  <Button
                                    size="sm"
                                    variant={member.roles.includes('admin') ? "destructive" : "default"}
                                    onClick={() => handleToggleAdmin(member.email, member.roles)}
                                    className="text-xs font-medium px-4 py-2 shadow-sm hover:shadow-md transition-all"
                                  >
                                    {member.roles.includes('admin') ? 'Remove Admin' : 'Make Admin'}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                        
                        {members.length === 0 && (
                          <div className="text-center py-16 text-muted-foreground">
                            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-semibold mb-2">No members found</h3>
                            <p>Members will appear here once they register</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="videos" className="mt-8">
                <div className="bg-card/50 backdrop-blur-sm rounded-xl shadow-xl border-0 p-6">
                  <VideoManagement />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
