import { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit2, Trash2, Upload, DollarSign, BookOpen } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Course = Database["public"]["Tables"]["courses"]["Row"];
type CourseInsert = Database["public"]["Tables"]["courses"]["Insert"];
type VideoCategory = Database["public"]["Enums"]["video_category"];

interface CourseFormData {
  title: string;
  description: string;
  price_inr: number;
  duration_hours: number;
  category: VideoCategory | "";
  level: string;
  thumbnail_url: string;
  is_active: boolean;
}

const CourseManagement = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [formData, setFormData] = useState<CourseFormData>({
    title: "",
    description: "",
    price_inr: 0,
    duration_hours: 0,
    category: "",
    level: "beginner",
    thumbnail_url: "",
    is_active: true,
  });
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast({
        title: "Error",
        description: "Failed to fetch courses.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCourse) {
        const updateData = {
          ...formData,
          category: formData.category || null,
        };
        
        const { error } = await supabase
          .from("courses")
          .update(updateData)
          .eq("id", editingCourse.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Course updated successfully.",
        });
      } else {
        const insertData: CourseInsert = {
          ...formData,
          category: formData.category || null,
          expert_id: null // No expert assigned initially
        };
        
        const { error } = await supabase
          .from("courses")
          .insert([insertData]);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Course created successfully.",
        });
      }

      setIsDialogOpen(false);
      setEditingCourse(null);
      resetForm();
      fetchCourses();
    } catch (error: any) {
      console.error("Error saving course:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save course.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (courseId: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", courseId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Course deleted successfully.",
      });
      
      fetchCourses();
    } catch (error: any) {
      console.error("Error deleting course:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete course.",
        variant: "destructive",
      });
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `course-thumbnails/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('course-thumbnails')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('course-thumbnails')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, thumbnail_url: data.publicUrl }));
      
      toast({
        title: "Success",
        description: "Thumbnail uploaded successfully.",
      });
    } catch (error: any) {
      console.error("Error uploading thumbnail:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload thumbnail.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      price_inr: 0,
      duration_hours: 0,
      category: "",
      level: "beginner",
      thumbnail_url: "",
      is_active: true,
    });
  };

  const openEditDialog = (course: Course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description || "",
      price_inr: course.price_inr,
      duration_hours: course.duration_hours || 0,
      category: course.category || "",
      level: course.level || "beginner",
      thumbnail_url: course.thumbnail_url || "",
      is_active: course.is_active || true,
    });
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingCourse(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Course Management</h2>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openAddDialog} className="flex items-center gap-2 shadow-lg">
              <Plus className="w-4 h-4" />
              Add Course
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                {editingCourse ? "Edit Course" : "Add New Course"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter course title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Difficulty Level</Label>
                  <Select value={formData.level} onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter course description"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (INR) *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="price"
                      type="number"
                      value={formData.price_inr}
                      onChange={(e) => setFormData(prev => ({ ...prev, price_inr: parseInt(e.target.value) || 0 }))}
                      placeholder="0"
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (Hours)</Label>
                  <Input
                    id="duration"
                    type="number"
                    value={formData.duration_hours}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration_hours: parseInt(e.target.value) || 0 }))}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value: VideoCategory) => setFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basics">Basics</SelectItem>
                      <SelectItem value="stocks">Stocks</SelectItem>
                      <SelectItem value="mutual_funds">Mutual Funds</SelectItem>
                      <SelectItem value="insurance">Insurance</SelectItem>
                      <SelectItem value="tax_planning">Tax Planning</SelectItem>
                      <SelectItem value="retirement">Retirement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.is_active.toString()} onValueChange={(value) => setFormData(prev => ({ ...prev, is_active: value === "true" }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailUpload}
                    disabled={uploading}
                  />
                  {formData.thumbnail_url && (
                    <img 
                      src={formData.thumbnail_url} 
                      alt="Thumbnail preview" 
                      className="w-16 h-16 object-cover rounded-md border"
                    />
                  )}
                </div>
                {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading}>
                  {editingCourse ? "Update Course" : "Create Course"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-0 shadow-xl bg-gradient-to-br from-card via-card to-card/95 backdrop-blur-sm">
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="w-6 h-6 border-2 border-primary border-r-transparent rounded-full animate-spin"></div>
                <span className="text-lg">Loading courses...</span>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border-0 shadow-inner bg-background/50 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 border-b-0 hover:bg-muted/50">
                            <TableHead className="font-semibold text-foreground h-14">Course</TableHead>
                            <TableHead className="font-semibold text-foreground">Level</TableHead>
                            <TableHead className="font-semibold text-foreground">Category</TableHead>
                    <TableHead className="font-semibold text-foreground">Price</TableHead>
                    <TableHead className="font-semibold text-foreground">Students</TableHead>
                    <TableHead className="font-semibold text-foreground">Status</TableHead>
                    <TableHead className="font-semibold text-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courses.map((course) => (
                    <TableRow key={course.id} className="hover:bg-muted/20 transition-colors border-b border-border/50">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-3">
                          {course.thumbnail_url ? (
                            <img 
                              src={course.thumbnail_url} 
                              alt={course.title}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                              <BookOpen className="w-6 h-6 text-primary" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">{course.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {course.duration_hours ? `${course.duration_hours}h` : "Duration not set"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge variant="outline" className="text-xs px-3 py-1">
                          {course.level || "Not set"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        {course.category ? (
                          <Badge variant="secondary" className="text-xs px-3 py-1">
                            {course.category}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground italic">Uncategorized</span>
                        )}
                      </TableCell>
                      <TableCell className="py-4 font-semibold">
                        {formatPrice(course.price_inr)}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{course.enrolled_count || 0}</span>
                          <span className="text-muted-foreground text-sm">enrolled</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge 
                          variant={course.is_active ? "default" : "secondary"}
                          className="text-xs px-3 py-1"
                        >
                          {course.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(course)}
                            className="text-xs px-3 py-1"
                          >
                            <Edit2 className="w-3 h-3 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(course.id, course.title)}
                            className="text-xs px-3 py-1"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {courses.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No courses found</h3>
                  <p>Create your first course to get started</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseManagement;