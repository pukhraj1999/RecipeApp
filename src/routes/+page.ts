import type { PageLoad } from './$types';
import type { RecipeAPIResponse } from '$lib/types/recpie';

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch('https://dummyjson.com/recipes');
	const data: RecipeAPIResponse = await res.json();

	return {
		recipes: data.recipes
	};
};