import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/courses", label: "Courses" },
  { to: "/live", label: "Live" },
  { to: "/news", label: "News" },
  { to: "/community", label: "Community" },
  { to: "/membership", label: "Membership" },
];

export const Navbar = () => {
  const linkBase = "px-3 py-2 rounded-md text-sm font-medium transition-colors hover:text-primary";
  const active = "text-primary";
  const inactive = "text-foreground/80";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gradient-to-tr from-primary to-accent" aria-hidden="true" />
          <span className="hidden sm:inline-block bg-gradient-to-r from-primary to-accent bg-clip-text text-lg font-semibold text-transparent">
            Finance Voyage Academy
          </span>
        </a>

        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `${linkBase} ${isActive ? active : inactive}`}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <Button variant="ghost" asChild>
            <a href="/dashboard">Dashboard</a>
          </Button>
          <Button variant="ghost" asChild>
            <a href="/auth">Log in</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/admin/login">Admin</a>
          </Button>
          <Button variant="premium" asChild>
            <a href="/membership">Go Premium</a>
          </Button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
