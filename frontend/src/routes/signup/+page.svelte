<div class="min-h-screen flex items-center justify-center p-8">
	<div class="w-full max-w-md">
		<!-- Signup Card -->
		<div class="retro-border-spaced bg-[var(--color-foreground)] p-8">
			<h1 class="text-4xl text-center mb-8 tracking-wider">SIGN UP</h1>

			<form class="space-y-6">
				<!-- Email Field -->
				<div>
					<label for="email" class="block text-sm font-bold mb-2 tracking-wide uppercase">Email</label>
					<input
						type="email"
						id="email"
						name="email"
						class="w-full px-4 py-3 bg-white border-2 border-black text-black focus:outline-none focus:border-[var(--color-accent-blue)]"
						placeholder="enter_email"
					/>
				</div>

				<!-- Username Field -->
				<div>
					<label for="username" class="block text-sm font-bold mb-2 tracking-wide uppercase">Username</label>
					<input
						type="text"
						id="username"
						name="username"
						class="w-full px-4 py-3 bg-white border-2 border-black text-black focus:outline-none focus:border-[var(--color-accent-blue)]"
						placeholder="choose_username"
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
						placeholder="create_password"
					/>
				</div>

				<!-- Terms Checkbox -->
				<div class="flex items-start gap-3">
					<input
						type="checkbox"
						id="terms"
						name="terms"
						class="mt-1 w-4 h-4 border-2 border-black"
					/>
					<label for="terms" class="text-sm">
						I agree to the Terms of Service and Privacy Policy
					</label>
				</div>

				<!-- Sign Up Button -->
				<button
					type="submit"
					class="w-full px-6 py-4 bg-[var(--color-accent-green)] text-white font-bold border-2 border-[var(--color-border)] uppercase tracking-wider"
				>
					[ Create Account ]
				</button>
			</form>

			<!-- Divider -->
			<div class="my-8 border-t-2 border-[var(--color-text)] opacity-30"></div>

			<!-- Login Link -->
			<div class="text-center space-y-4">
				<p class="text-sm tracking-wide">Already have an account?</p>
				<a
					href="/login"
					class="inline-block w-full px-6 py-3 bg-[var(--color-accent-blue)] text-white font-bold border-2 border-[var(--color-border)] uppercase tracking-wider transition-all duration-100 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)]"
				>
					[ Login ]
				</a>
			</div>
		</div>
	</div>
</div>
