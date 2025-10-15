<div class="min-h-screen flex items-center justify-center p-4">
  <div class="w-full max-w-md">
    <!-- Login Card -->
    <div class="retro-border-spaced p-8">
      <h1 class="text-4xl text-center mb-8 tracking-wider">LOGIN</h1>
      
      <form class="space-y-6">
        <!-- Username Field -->
        <div>
          <label for="username" class="block text-sm font-bold mb-2 tracking-wide uppercase">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            class="w-full px-4 py-3 bg-white border-2 border-black text-black focus:outline-none focus:border-[var(--color-accent-blue)]"
            placeholder="enter_username"
          />
        </div>
        
        <!-- Password Field -->
        <div>
          <label for="password" class="block text-sm font-bold mb-2 tracking-wide uppercase">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            class="w-full px-4 py-3 bg-white border-2 border-black text-black focus:outline-none focus:border-[var(--color-accent-blue)]"
            placeholder="enter_password"
          />
        </div>
        
        <!-- Login Button -->
        <button
          type="submit"
          class="w-full px-6 py-4 bg-[var(--color-accent-blue)] text-white font-bold border-2 border-[var(--color-border)] uppercase tracking-wider"
        >
          [ Login ]
        </button>
      </form>
      
      <!-- Divider -->
      <div class="my-8 border-t-2 border-[var(--color-text)] opacity-30"></div>
      
      <!-- Sign Up Link -->
      <div class="text-center space-y-4">
        <p class="text-sm tracking-wide">Don't have an account?</p>
        <a
          href="/signup"
          class="inline-block w-full px-6 py-3 bg-[var(--color-accent-green)] text-white font-bold border-2 border-[var(--color-border)] uppercase tracking-wider transition-all duration-100 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)]"
        >
          [ Create Account ]
        </a>
      </div>
    </div>
  </div>
</div>