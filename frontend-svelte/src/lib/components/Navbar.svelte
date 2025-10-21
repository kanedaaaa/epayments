<script lang="ts">
	import { page } from '$app/stores';

	interface User {
		id: string;
		name: string;
		email: string;
		isActive: boolean;
	}

	let { user }: { user: User | null } = $props();
	let showDropdown = $state(false);

	function toggleDropdown() {
		showDropdown = !showDropdown;
	}

	function closeDropdown() {
		showDropdown = false;
	}
</script>

<nav class="fixed left-0 right-0 top-0 z-50 w-full px-8 pt-4">
	<div
		class="mx-auto border-2 border-[var(--color-border)] bg-[var(--color-accent-blue)] p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)]"
	>
		<div class="flex items-center justify-between gap-4">
			<!-- Logo -->
			<a href="/" class="text-3xl font-[var(--font-family-logo)] font-bold tracking-wider">
				<span class="text-[var(--color-accent-green)]">e</span><span class="text-white"
					>Payments</span
				>
			</a>

			<!-- Navigation Buttons -->
			<div class="flex gap-4">
				<a
					href="/"
					class="border-2 border-[var(--color-border)] bg-[var(--color-accent-green)] px-4 py-2 text-sm font-bold uppercase tracking-wider text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)] transition-all duration-100 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)]"
				>
					[ Home ]
				</a>
				<a
					href="/dashboard"
					class="border-2 border-[var(--color-border)] bg-[var(--color-accent-green)] px-4 py-2 text-sm font-bold uppercase tracking-wider text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)] transition-all duration-100 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)]"
				>
					[ Dashboard ]
				</a>
				<a
					href="/help"
					class="border-2 border-[var(--color-border)] bg-[var(--color-accent-green)] px-4 py-2 text-sm font-bold uppercase tracking-wider text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)] transition-all duration-100 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)]"
				>
					[ Help ]
				</a>
				{#if user}
					<div class="relative">
						<button
							onclick={toggleDropdown}
							class="cursor-pointer border-2 border-[var(--color-border)] bg-[var(--color-foreground)] px-4 py-2 text-sm font-bold uppercase tracking-wider text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)] transition-all duration-100 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)]"
						>
							[ {user.name} ]
						</button>

						{#if showDropdown}
							<div
								class="absolute right-0 top-full z-50 mt-7 w-48 border-2 border-[var(--color-border)] bg-[var(--color-foreground)] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)]"
							>
								<a
									href="/settings"
									onclick={closeDropdown}
									class="block border-b-2 border-[var(--color-border)] px-4 py-3 text-sm font-bold uppercase tracking-wider text-black transition-colors hover:bg-[var(--color-accent-blue)] hover:text-white"
								>
									[ Settings ]
								</a>
								<form method="POST" action="/logout">
									<button
										type="submit"
										class="w-full cursor-pointer px-4 py-3 text-left text-sm font-bold uppercase tracking-wider text-black transition-colors hover:bg-red-600 hover:text-white"
									>
										[ Logout ]
									</button>
								</form>
							</div>
						{/if}
					</div>
				{:else}
					<a
						href="/login"
						class="cursor-pointer border-2 border-[var(--color-border)] bg-[var(--color-foreground)] px-4 py-2 text-sm font-bold uppercase tracking-wider text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)] transition-all duration-100 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.4)]"
					>
						[ LOGIN ]
					</a>
				{/if}
			</div>
		</div>
	</div>
</nav>
