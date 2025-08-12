import SEO from "@/components/SEO";

const Admin = () => {
  return (
    <>
      <SEO
        title="Admin Dashboard | Finance Voyage Academy"
        description="Admin area for managing Finance Voyage Academy."
      />
      <main className="container mx-auto max-w-3xl py-10">
        <h1 className="mb-4 text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">You have admin access.</p>
      </main>
    </>
  );
};

export default Admin;
