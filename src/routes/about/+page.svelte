<svelte:head>
    <title>About - Recipe App</title>
</svelte:head>

<bw-container class="h-screen" pd="10px">
    <bw-container 
        primary="true" 
        radius="24px" 
        pd="3rem" 
        border="1px solid rgba(255, 255, 255, 0.08)" 
    >
        <!-- Header Section -->
        <h1 class="text-4xl md:text-5xl font-extrabold m-0 mb-6 text-white tracking-tight">
            About <span class="text-blue-400">RecipeApp</span>
        </h1>
        
        <p class="text-slate-400 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Welcome to your new favorite culinary companion. RecipeApp is designed to make discovering, saving, and cooking delicious meals entirely effortless. Whether you're a seasoned chef or a weekend meal-prepper, we bring thousands of recipes right to your fingertips.
        </p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
            <div class="bg-white/5 p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <div class="text-2xl mb-3">🔍</div>
                <h3 class="text-lg font-bold text-slate-200 mb-2 m-0">Smart Search</h3>
                <p class="text-sm text-slate-400 m-0 leading-relaxed">Instantly find recipes by title, ingredients, or tags to match your exact cravings.</p>
            </div>
            
            <div class="bg-white/5 p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <div class="text-2xl mb-3">❤️</div>
                <h3 class="text-lg font-bold text-slate-200 mb-2 m-0">Local Favorites</h3>
                <p class="text-sm text-slate-400 m-0 leading-relaxed">Save your top recipes directly to your device for lightning-fast offline access.</p>
            </div>
            
            <div class="bg-white/5 p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <div class="text-2xl mb-3">⚡</div>
                <h3 class="text-lg font-bold text-slate-200 mb-2 m-0">Lightning Fast</h3>
                <p class="text-sm text-slate-400 m-0 leading-relaxed">Built on modern web standards ensuring a snappy, seamless, app-like experience.</p>
            </div>
        </div>

        <div class="border-t border-white/10 pt-8 mt-8">
            <h2 class="text-2xl font-bold text-slate-200 mb-4 m-0">Under the Hood</h2>
            <p class="text-slate-400 mb-8 max-w-2xl mx-auto text-base">
                This project was built to demonstrate modern web development practices, leveraging a powerful and reactive tech stack.
            </p>
            
            <div class="flex flex-wrap justify-center gap-3 mb-10">
                <span class="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm font-semibold border border-blue-500/20">SvelteKit 5</span>
                <span class="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm font-semibold border border-blue-500/20">TypeScript</span>
                <span class="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm font-semibold border border-blue-500/20">Tailwind CSS</span>
                <span class="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm font-semibold border border-blue-500/20">Stencil Web Components</span>
                <span class="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full text-sm font-semibold border border-blue-500/20">DummyJSON API</span>
            </div>
        </div>
        
        <bw-container class="mt-4 block">
            <bw-btn size="1rem" name="Start Browsing Recipes" link="/" borderWidth="2px" radius="10px"></bw-btn>
        </bw-container>
    </bw-container>
</bw-container>