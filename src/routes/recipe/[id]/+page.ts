import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Recipe } from '$lib/types/recpie';

export const load: PageLoad = async ({ fetch, params }) => {
	const res = await fetch(`https://dummyjson.com/recipes/${params.id}`);

	if (!res.ok) {
		throw error(404, { message: 'Recipe not found' });
	}

	const recipe: Recipe = await res.json();

	return {
		recipe
	};
};