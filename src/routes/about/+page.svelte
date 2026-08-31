<svelte:head>
	<title>About - Recipe App</title>
</svelte:head>

<bw-container class="h-screen" pd="10px">
	<bw-container primary="true" radius="24px" pd="3rem" border="1px solid rgba(255, 255, 255, 0.08)">
		<h1 class="m-0 mb-6 text-4xl font-extrabold tracking-tight text-white md:text-5xl">
			About <span class="text-blue-400">RecipeApp</span>
		</h1>

		<p class="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-400 md:text-xl">
			Welcome to your new favorite culinary companion. RecipeApp is designed to make discovering,
			saving, and cooking delicious meals entirely effortless. Whether you're a seasoned chef or a
			weekend meal-prepper, we bring thousands of recipes right to your fingertips.
		</p>

		<div class="mb-12 grid grid-cols-1 gap-6 text-left md:grid-cols-3">
			<div
				class="rounded-xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10"
			>
				<div class="mb-3 text-2xl">🔍</div>
				<h3 class="m-0 mb-2 text-lg font-bold text-slate-200">Smart Search</h3>
				<p class="m-0 text-sm leading-relaxed text-slate-400">
					Instantly find recipes by title, ingredients, or tags to match your exact cravings.
				</p>
			</div>

			<div
				class="rounded-xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10"
			>
				<div class="mb-3 text-2xl">❤️</div>
				<h3 class="m-0 mb-2 text-lg font-bold text-slate-200">Local Favorites</h3>
				<p class="m-0 text-sm leading-relaxed text-slate-400">
					Save your top recipes directly to your device for lightning-fast offline access.
				</p>
			</div>

			<div
				class="rounded-xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10"
			>
				<div class="mb-3 text-2xl">⚡</div>
				<h3 class="m-0 mb-2 text-lg font-bold text-slate-200">Lightning Fast</h3>
				<p class="m-0 text-sm leading-relaxed text-slate-400">
					Built on modern web standards ensuring a snappy, seamless, app-like experience.
				</p>
			</div>
		</div>

		<div class="mt-8 border-t border-white/10 pt-8">
			<h2 class="m-0 mb-4 text-2xl font-bold text-slate-200">Under the Hood</h2>
			<p class="mx-auto mb-8 max-w-2xl text-base text-slate-400">
				This project was built to demonstrate modern web development practices, leveraging a
				powerful and reactive tech stack.
			</p>

			<div class="mb-10 flex flex-wrap justify-center gap-3">
				<span
					class="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400"
					>SvelteKit 5</span
				>
				<span
					class="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400"
					>TypeScript</span
				>
				<span
					class="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400"
					>Tailwind CSS</span
				>
				<span
					class="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400"
					>Stencil Web Components</span
				>
				<span
					class="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-400"
					>DummyJSON API</span
				>
			</div>
		</div>

		<bw-container class="mt-4 block">
			<bw-btn size="1rem" name="Start Browsing Recipes" link="/" borderWidth="2px" radius="10px"
			></bw-btn>
		</bw-container>
	</bw-container>
</bw-container>
