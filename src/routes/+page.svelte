<script lang="ts">
    import { onMount } from 'svelte';
    import type { PageData } from './$types';
    import type { Recipe } from '$lib/types/recpie';

    let { data }: { data: PageData } = $props();

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
</script>

{#if data.recipes && data.recipes.length > 0}
    <bw-container grid="true">
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
    <bw-container primary="true" pd="2rem" class="text-center">
        <p class="text-slate-400">No recipes found.</p>
    </bw-container>
{/if}