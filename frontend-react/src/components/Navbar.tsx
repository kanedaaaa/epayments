import logoLight from "../assets/logo-light.png";

export default function Navbar() {
  return (
    <nav className="w-full max-w-7xl mx-auto mt-5 flex items-center justify-between px-6 py-3 bg-foreground border-b-2 brand-border">
      <img src={logoLight} alt="Logo" className="h-13" />

      <div className="flex gap-4 text-sm">
        <a href="/" className="button-like">
          [ Home ]
        </a>

        <a href="/dashboard" className="button-like">
          [ Dashboard ]
        </a>

        <a href="/user" className="button-like">
          [ User ]
        </a>
      </div>
    </nav>
  );
}
