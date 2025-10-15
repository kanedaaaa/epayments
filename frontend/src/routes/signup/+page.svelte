<script lang="ts">
	import { enhance } from '$app/forms';

	let { form } = $props();
</script>

<div class="fixed inset-0 flex items-center justify-center p-8 pt-28 overflow-hidden">
	<div class="w-full max-w-md">
		<!-- Signup Card -->
		<div class="retro-border-spaced bg-[var(--color-foreground)] p-8">
			<h1 class="mb-8 text-center text-4xl tracking-wider">SIGN UP</h1>

			{#if form?.error}
				<div class="mb-6 border-2 border-red-500 bg-red-100 p-4 text-red-700">
					<p class="font-bold">ERROR:</p>
					<p>{form.error}</p>
				</div>
			{/if}

			<form method="POST" use:enhance class="space-y-6">
				<!-- Email Field -->
				<div>
					<label for="email" class="mb-2 block text-sm font-bold uppercase tracking-wide"
						>Email</label
					>
					<input
						type="email"
						id="email"
						name="email"
						required
						class="w-full border-2 border-black bg-white px-4 py-3 text-black focus:border-[var(--color-accent-blue)] focus:outline-none"
						placeholder="enter_email"
					/>
				</div>

				<!-- Name Field -->
				<div>
					<label for="name" class="mb-2 block text-sm font-bold uppercase tracking-wide">Name</label
					>
					<input
						type="text"
						id="name"
						name="name"
						required
						class="w-full border-2 border-black bg-white px-4 py-3 text-black focus:border-[var(--color-accent-blue)] focus:outline-none"
						placeholder="enter_name"
					/>
				</div>

				<!-- Password Field -->
				<div>
					<label for="password" class="mb-2 block text-sm font-bold uppercase tracking-wide"
						>Password</label
					>
					<input
						type="password"
						id="password"
						name="password"
						required
						class="w-full border-2 border-black bg-white px-4 py-3 text-black focus:border-[var(--color-accent-blue)] focus:outline-none"
						placeholder="create_password"
					/>
				</div>

				<!-- Terms Checkbox -->
				<div class="flex items-start gap-3">
					<input
						type="checkbox"
						id="terms"
						name="terms"
						required
						class="mt-1 h-4 w-4 border-2 border-black"
					/>
					<label for="terms" class="text-sm">
						I agree to the Terms of Service and Privacy Policy
					</label>
				</div>

				<!-- Sign Up Button -->
				<button
					type="submit"
					class="w-full border-2 border-[var(--color-border)] bg-[var(--color-accent-green)] px-6 py-4 font-bold uppercase tracking-wider text-white"
				>
					[ Create Account ]
				</button>
			</form>

			<!-- Divider -->
			<div class="my-8 border-t-2 border-[var(--color-text)] opacity-30"></div>

			<!-- Login Link -->
			<div class="space-y-4 text-center">
				<p class="text-sm tracking-wide">Already have an account?</p>
				<a
					href="/login"
					class="inline-block w-full border-2 border-[var(--color-border)] bg-[var(--color-accent-blue)] px-6 py-3 font-bold uppercase tracking-wider text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)] transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)]"
				>
					[ Login ]
				</a>
			</div>
		</div>
	</div>
</div>
