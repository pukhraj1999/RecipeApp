<script lang="ts">
	import { onMount } from 'svelte';
    import type { PageData } from './$types';
    import type {Recipe} from "$lib/types/recpie";

    const STORAGE_KEY = 'svelte_recipes_data';
    let { data }: { data: PageData } = $props();
    let { recipe, param_id } = $derived(data);

    function getTagColor(tag: string) {
        const colors = [
            { bg: 'rgba(59, 130, 246, 0.15)', text: '#93c5fd', border: 'rgba(59, 130, 246, 0.3)' }, 
            { bg: 'rgba(236, 72, 153, 0.15)', text: '#fbcfe8', border: 'rgba(236, 72, 153, 0.3)' }, 
            { bg: 'rgba(16, 185, 129, 0.15)', text: '#6ee7b7', border: 'rgba(16, 185, 129, 0.3)' }, 
            { bg: 'rgba(245, 158, 11, 0.15)', text: '#fde68a', border: 'rgba(245, 158, 11, 0.3)' }, 
            { bg: 'rgba(168, 85, 247, 0.15)', text: '#e9d5ff', border: 'rgba(168, 85, 247, 0.3)' } 
        ];
        let hash = 0;
        for (let i = 0; i < tag.length; i++) hash = tag.charCodeAt(i) + ((hash << 5) - hash);
        return colors[Math.abs(hash) % colors.length];
    }

    onMount(()=>{
        let localRecipes:Array<Recipe> = JSON.parse(localStorage.getItem(STORAGE_KEY) as string);
        let selectedRecipes: Array<Recipe> = localRecipes.filter(item => (""+item.id) == param_id);
        if(selectedRecipes.length > 0){
            recipe = selectedRecipes[0];
        }
    })
</script>

<svelte:head>
    <title>{recipe.name} - Recipe App</title>
</svelte:head>

<bw-container class="block max-w-300 mx-auto px-6 py-8">
    <div class="mb-8">
        <bw-btn
            link="/"s
            name="Back to Recipes"
            radius="10px"
            size="0.95rem"
            border-width="1px"
            class="inline-flex items-center text-blue-400 font-medium transition-all duration-200 hover:text-blue-300 hover:-translate-x-1"
        >
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
            >
                <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
        </bw-btn>
    </div>

    <header class="grid grid-cols-1 min-[868px]:grid-cols-[440px_1fr] gap-10">
        <bw-container radius="20px" class="shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]">
            <bw-img
                img-src={recipe.image}
                img-alt={recipe.name}
                height="100%"
                width="100%"
                radius="20px"
                class="min-h-80 object-cover block"
            ></bw-img>
        </bw-container>

        <div>
            <h1 class="text-4xl font-extrabold leading-tight mb-3 tracking-tight">{recipe.name}</h1>
            <div class="flex items-center gap-3 text-slate-400 text-sm">
                <span>🍽️ {recipe.cuisine}</span>
                <span class="text-slate-600">•</span>
                <span>⚡ {recipe.difficulty}</span>
                <span class="text-slate-600">•</span>
                <span class="text-amber-500 font-semibold"
                    >⭐ {recipe.rating} <span class="text-slate-500 font-normal">({recipe.reviewCount} reviews)</span></span
                >
            </div>

            <bw-container
                primary={true}
                space-between={true}
                radius="16px"
                pd="1.25rem"
                border="1px solid rgba(255, 255, 255, 0.08)"
				mgV="10px"
            >
                <div class="flex items-center gap-3 m-2.5">
                    <span class="text-xl bg-white/5 p-2 rounded-lg">⏱️</span>
                    <div>
                        <p class="m-0 text-[0.75rem] text-slate-500 uppercase tracking-wider">Prep Time</p>
                        <p class="m-0 text-sm font-semibold text-slate-200">{recipe.prepTimeMinutes} mins</p>
                    </div>
                </div>
                <div class="flex items-center gap-3 m-2.5">
                    <span class="text-xl bg-white/5 p-2 rounded-lg">🍳</span>
                    <div>
                        <p class="m-0 text-[0.75rem] text-slate-500 uppercase tracking-wider">Cook Time</p>
                        <p class="m-0 text-sm font-semibold text-slate-200">{recipe.cookTimeMinutes} mins</p>
                    </div>
                </div>
                <div class="flex items-center gap-3 m-2.5">
                    <span class="text-xl bg-white/5 p-2 rounded-lg">👥</span>
                    <div>
                        <p class="m-0 text-[0.75rem] text-slate-500 uppercase tracking-wider">Servings</p>
                        <p class="m-0 text-sm font-semibold text-slate-200">{recipe.servings}</p>
                    </div>
                </div>
                <div class="flex items-center gap-3 m-2.5">
                    <span class="text-xl bg-white/5 p-2 rounded-lg">🔥</span>
                    <div>
                        <p class="m-0 text-[0.75rem] text-slate-500 uppercase tracking-wider">Calories</p>
                        <p class="m-0 text-sm font-semibold text-slate-200">{recipe.caloriesPerServing} kcal</p>
                    </div>
                </div>
            </bw-container>

            <div class="flex flex-wrap gap-2">
                {#each recipe.tags as tag}
                    {@const style = getTagColor(tag)}
                    <span
                        class="px-3.5 py-1 rounded-full text-xs font-semibold border border-solid backdrop-blur-sm"
                        style="background: {style.bg}; color: {style.text}; border-color: {style.border};"
                    >
                        {tag}
                    </span>
                {/each}
            </div>
        </div>
    </header>

    <hr class="border-0 h-px bg-linear-to-r from-white/10 to-white/2 my-12" />

    <div class="grid grid-cols-1 min-[900px]:grid-cols-[380px_1fr] gap-8">
        <bw-container
            primary={true}
            radius="20px"
            pd="1.75rem"
            border="1px solid rgba(255, 255, 255, 0.08)"
            class="block"
        >
            <h2 class="text-2xl font-bold mb-1 tracking-tight">Ingredients</h2>
            <p class="mt-0 mb-6 text-slate-500 text-sm">Check items off as you prep</p>

            <div class="flex flex-col gap-3">
                {#each recipe.ingredients as ingredient, index}
                    <label class="ingredient-card flex items-center gap-3.5 p-3.5 bg-white/3 border border-white/5 rounded-xl cursor-pointer transition-all duration-200 ease-in-out select-none hover:bg-white/6 hover:border-white/10">
                        <input type="checkbox" id="ing-{index}" class="custom-checkbox appearance-none w-5 h-5 border-2 border-slate-600 rounded-md outline-none cursor-pointer relative transition-all duration-200 shrink-0 checked:bg-blue-500 checked:border-blue-500" />
                        <span class="ingredient-text text-slate-300 text-sm transition-colors duration-200">{ingredient}</span>
                    </label>
                {/each}
            </div>
        </bw-container>

        <bw-container
            primary={true}
            radius="20px"
            pd="1.75rem"
            border="1px solid rgba(255, 255, 255, 0.08)"
            class="block"
        >
            <h2 class="text-2xl font-bold mb-1 tracking-tight">Instructions</h2>
            <div class="flex flex-col gap-4 mt-5">
                {#each recipe.instructions as step, i}
                    <div class="flex gap-5 p-5 bg-white/2 border border-white/5 rounded-2xl">
                        <span class="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-lg font-bold text-sm shrink-0">{i + 1}</span>
                        <p class="m-0 text-slate-300 leading-relaxed text-[0.98rem]">{step}</p>
                    </div>
                {/each}
            </div>
        </bw-container>
    </div>
</bw-container>

<style>
    :global(body) {
        background-color: #0b0f19;
        color: #f1f5f9;
        font-family:
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            'Segoe UI',
            Roboto,
            sans-serif;
    }

    .custom-checkbox:checked::after {
        content: '';
        position: absolute;
        left: 6px;
        top: 2px;
        width: 4px;
        height: 9px;
        border: solid white;
        border-width: 0 2px 2px 0;
        transform: rotate(45deg);
    }

    .ingredient-card:has(.custom-checkbox:checked) .ingredient-text {
        color: #64748b;
        text-decoration: line-through;
    }
</style>