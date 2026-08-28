import type { PageLoad } from './$types';
import type { RecipeAPIResponse } from '$lib/types/recpie';

export const load: PageLoad = async ({ fetch, url }) => {
	const query = url.searchParams.get('q') ?? '';

	// If query exists, call search endpoint; otherwise fetch all recipes
	const endpoint = query
		? `https://dummyjson.com/recipes/search?q=${encodeURIComponent(query)}`
		: 'https://dummyjson.com/recipes';

	const res = await fetch(endpoint);
	const data: RecipeAPIResponse = await res.json();

	return {
		recipes: data.recipes,
		query
	};
};