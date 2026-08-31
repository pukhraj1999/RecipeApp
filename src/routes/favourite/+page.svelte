<script lang="ts">
	import { onMount } from 'svelte';
	import type { Recipe } from '$lib/types/recpie';

	const FALLBACK_IMG = 'https://placehold.co/600x400/131b2e/60a5fa?text=No+Recipe+Image';
	const FAVORITES_KEY = 'recipe_app_favorites';

	let favoriteRecipes = $state<Recipe[]>([]);

	onMount(() => {
		loadFavorites();
	});

	function loadFavorites() {
		const saved = localStorage.getItem(FAVORITES_KEY);
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed)) {
					favoriteRecipes = parsed.filter(
						(item): item is Recipe => typeof item === 'object' && item !== null && 'id' in item
					);
				}
			} catch (e) {
				console.error('Failed to parse favorites from localStorage', e);
			}
		}
	}

	function removeFavorite(recipeId: number) {
		favoriteRecipes = favoriteRecipes.filter((recipe) => recipe.id !== recipeId);
		localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteRecipes));
	}
</script>

<svelte:head>
	<title>My Favorite Recipes - Recipe App</title>
</svelte:head>

<bw-container pd="10px">
	{#if favoriteRecipes && favoriteRecipes.length > 0}
		<header class="mb-8">
			<h1 class="m-0 mb-2 text-3xl font-extrabold md:text-4xl">
				My Favorite <span class="text-blue-400">Recipes</span>
			</h1>
			<p class="m-0 text-sm text-slate-400 md:text-base">
				Your saved recipes stored locally on your device.
			</p>
		</header>
		<bw-container grid="true" class="w-full">
			{#each favoriteRecipes as recipe (recipe.id)}
				<bw-container mg-v="10px">
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
									link={'/recipe/' + recipe.id}
									borderWidth="2px"
									radius="10px"
								></bw-btn>
							</bw-container>
							<bw-container primary="true" mg="5px">
								<bw-btn
									size="1rem"
									name="💔 Remove"
									borderWidth="2px"
									radius="10px"
									onpress={() => removeFavorite(recipe.id)}
								></bw-btn>
							</bw-container>
						</bw-container>
					</bw-card>
				</bw-container>
			{/each}
		</bw-container>
	{:else}
		<bw-container
			primary="true"
			pd="3rem"
			radius="15px"
			border="2px solid white"
			mgV="2rem"
			class="h-screen"
		>
			<h3 class="ms-2 text-lg font-bold text-slate-200">No Saved Favorites Yet</h3>
			<p class="m-4 text-sm text-slate-400">
				You haven't added any recipes to your favorites list.
			</p>
			<bw-btn size="1rem" name="Browse Recipes" link="/" borderWidth="2px" radius="10px"></bw-btn>
		</bw-container>
	{/if}
</bw-container>
