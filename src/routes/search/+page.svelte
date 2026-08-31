<script lang="ts">
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';
    import type { PageData } from './$types';
    import type { Recipe } from '$lib/types/recpie';

    let { data }: { data: PageData } = $props();
    
    // svelte-ignore state_referenced_locally
    let searchQuery = $state(data.query ?? '');

    const FALLBACK_IMG = 'https://placehold.co/600x400/131b2e/60a5fa?text=No+Recipe+Image';
    const FAVORITES_KEY = 'recipe_app_favorites';

    let favorites = $state<Recipe[]>([]);

    onMount(() => {
        const saved = localStorage.getItem(FAVORITES_KEY);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) {
                    favorites = parsed.filter(
                        (item): item is Recipe => typeof item === 'object' && item !== null && 'id' in item
                    );
                }
            } catch (e) {
                console.error('Failed to parse favorites from localStorage', e);
            }
        }
    });

    function toggleFavorite(recipe: Recipe) {
        const exists = favorites.some((fav) => fav.id === recipe.id);

        if (exists) {
            favorites = favorites.filter((fav) => fav.id !== recipe.id);
        } else {
            favorites = [...favorites, recipe];
        }

        localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    }

    function handleSearch(e: Event) {
        e.preventDefault();
        if (searchQuery.trim()) {
            goto(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            goto('/search');
        }
    }
</script>

<svelte:head>
    <title>Search Recipes - Recipe App</title>
</svelte:head>

<bw-container class="block max-w-300 mx-auto px-6 py-8 box-border min-h-screen bg-[#0b0f19] text-slate-100 font-sans">
    <bw-container primary={true} radius="20px" pd="2rem" border="1px solid rgba(255, 255, 255, 0.08)" class="mb-8 block">
        <h1 class="text-3xl md:text-4xl font-extrabold m-0 mb-6">
            Search <span class="text-blue-400">Recipes</span>
        </h1>
        
        <form onsubmit={handleSearch} class="flex items-center gap-3 bg-white/4 border border-white/10 rounded-xl px-4 py-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" class="shrink-0">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
            <input 
                type="text" 
                placeholder="Search by title, ingredient, or tag..." 
                bind:value={searchQuery}
                class="flex-1 bg-transparent border-none outline-none text-slate-100 text-base placeholder:text-slate-500"
            />
            <button 
                type="submit" 
                class="bg-blue-600 text-white border-none px-5 py-2.5 rounded-lg font-semibold cursor-pointer text-sm hover:bg-blue-700 transition-colors"
            >
                Search
            </button>
        </form>
    </bw-container>

    {#if data.recipes && data.recipes.length > 0}
        <bw-container grid="true" class="w-full">
            {#each data.recipes as recipe (recipe.id)}
                {@const isFavorited = favorites.some((fav) => fav.id === recipe.id)}
                <bw-container mg="10px">
                    <bw-card
                        card-radius="15px"
                        img-src={recipe.image ? recipe.image : FALLBACK_IMG}
                        img-alt={recipe.name}
                        name={recipe.name}
                        tag-title="Tags:"
                        rating={recipe.rating}
                        tags={recipe.tags}
                        populate="false"
                    >
                        <bw-container primary="true" split="true">
                            <bw-container primary="true" mg="5px">
                                <bw-btn 
                                    size="1rem" 
                                    name="Check" 
                                    link={"/recipe/" + recipe.id} 
                                    borderWidth="2px" 
                                    radius="10px"
                                ></bw-btn>
                            </bw-container>
                            <bw-container primary="true" mg="5px">
                                <bw-btn 
                                    size="1rem" 
                                    name={isFavorited ? '❤️ Favorited' : '🤍 Favourite'} 
                                    borderWidth="2px" 
                                    radius="10px"
                                    onpress={() => toggleFavorite(recipe)}
                                ></bw-btn>
                            </bw-container>
                        </bw-container>    
                    </bw-card>
                </bw-container>
            {/each}
        </bw-container>
    {:else}
        <bw-container primary={true} radius="14px" pd="3rem" border="1px solid rgba(255, 255, 255, 0.08)" class="text-center">
            <p class="m-0 text-slate-400 text-base">
                No recipes found matching "<strong class="text-slate-200">{data.query ?? ''}</strong>"
            </p>
        </bw-container>
    {/if}
</bw-container>