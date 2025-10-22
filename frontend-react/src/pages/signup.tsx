export default function Signup() {
  return (
    <div className="relative w-[400px] max-w-md mx-auto p-6 border-border bg-foreground brand-border">
      {/* Inner frame */}
      <div className="pointer-events-none absolute inset-3 border border-black/90 rounded-[2px]" />

      {/* Cut-in title on the INNER top border */}
      <span className="absolute right-5 top-[12px] -translate-y-1/2 z-10 px-2 bg-foreground text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        Sign up to ePayment
      </span>

      {/* Form content */}
      <form className="flex flex-col gap-4 mt-6">
        <input
          type="text"
          placeholder="EMAIL"
          className="w-full px-4 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="text"
          placeholder="USERNAME"
          className="w-full px-4 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="password"
          placeholder="PASSWORD"
          className="w-full px-4 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <input
          type="password"
          placeholder="CONFIRM PASSWORD"
          className="w-full px-4 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button type="submit" className="button-like button-primary w-full">
          [ SIGNUP ]
        </button>

        <div className="flex items-center">
          <hr className="grow border-t border-border" />
          <span className="mx-1 text-sm text-muted-foreground">or</span>
          <hr className="grow border-t border-border" />
        </div>

        <button type="button" className="button-like button-secondary w-full">
          [ LOGIN ]
        </button>
      </form>
    </div>
  );
}
