import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { RecipeAPIResponse } from '$lib/types/recpie';

export const load: PageLoad = async ({ fetch, url }) => {
    const query = url.searchParams.get('q')?.trim() ?? '';


    const endpoint = query
        ? `https://dummyjson.com/recipes/search?q=${encodeURIComponent(query)}`
        : 'https://dummyjson.com/recipes';

    try {
        const res = await fetch(endpoint);

        if (!res.ok) {
            throw error(res.status, `Failed to fetch recipes: ${res.statusText}`);
        }

        const data: RecipeAPIResponse = await res.json();

        return {
            recipes: data.recipes ?? [],
            query
        };
		
    } catch (err) {
        if (err && typeof err === 'object' && 'status' in err) {
            throw err;
        }
        throw error(500, 'An unexpected error occurred while fetching recipes.');
    }
};