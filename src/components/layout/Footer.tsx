const Footer = () => {
  return (
    <footer className="border-t">
      <div className="container mx-auto py-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="mb-3 h-8 w-8 rounded-md bg-gradient-to-tr from-primary to-accent" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            Empowering smarter financial decisions through expert-led education.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-3">Explore</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="/courses" className="hover:text-primary">Courses</a></li>
            <li><a href="/live" className="hover:text-primary">Live Webinars</a></li>
            <li><a href="/news" className="hover:text-primary">News & Insights</a></li>
            <li><a href="/community" className="hover:text-primary">Community</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-primary">About</a></li>
            <li><a href="#" className="hover:text-primary">Careers</a></li>
            <li><a href="#" className="hover:text-primary">Contact</a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold mb-3">Legal</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-primary">Terms</a></li>
            <li><a href="#" className="hover:text-primary">Privacy</a></li>
            <li><a href="#" className="hover:text-primary">Cookies</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto py-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Finance Voyage Academy. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
