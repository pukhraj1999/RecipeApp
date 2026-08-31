import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Recipe } from '$lib/types/recpie';

export const load: PageLoad = async ({ fetch, params }) => {
	const res = await fetch(`https://dummyjson.com/recipes/${params.id}`);

	const recipe: Recipe = await res.json();

	return {
		recipe,
		param_id: params.id
	};
};