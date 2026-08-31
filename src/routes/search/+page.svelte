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

<bw-container pd="10px">
	<bw-container
		primary={true}
		radius="20px"
		pd="2rem"
		border="1px solid rgba(255, 255, 255, 0.08)"
		class="mb-8 block"
	>
		<h1 class="m-0 mb-6 text-3xl font-extrabold md:text-4xl">
			Search <span class="text-blue-400">Recipes</span>
		</h1>

		<form
			onsubmit={handleSearch}
			class="srounded-xl flex flex-wrap items-center border border-white/10 bg-white/4 px-4 py-2"
		>
			<svg
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				stroke="#64748b"
				stroke-width="2"
				class="shrink-0"
			>
				<circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
			</svg>
			<input
				type="text"
				placeholder="Search by title, ingredient, or tag..."
				bind:value={searchQuery}
				class="flex-1 border-none bg-transparent text-base text-slate-100 outline-none placeholder:text-slate-500"
			/>
			<bw-container grid="true" primary="true" mgV="5px">
				<button
					type="submit"
					class="pointer flex justify-center border-2 border-white p-2 text-xl hover:bg-white"
				>
					Search
				</button>
			</bw-container>
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
									link={'/recipe/' + recipe.id}
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
		<bw-container
			primary={true}
			radius="14px"
			pd="3rem"
			border="1px solid rgba(255, 255, 255, 0.08)"
			class="text-center"
		>
			<p class="m-0 text-base text-slate-400">
				No recipes found matching "<strong class="text-slate-200">{data.query ?? ''}</strong>"
			</p>
		</bw-container>
	{/if}
</bw-container>
