<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<bw-container grid="true">
	{#each data.recipes as recipe (recipe.id)}
		<bw-card 
            imgSrc={recipe.image}
            imgAlt={recipe.name}
            name={recipe.name}
            tagTitle="Tags:"
            tags={recipe.tags}
            populate="false"
            link={"/recipe/"+recipe.id}
        ></bw-card>
	{/each}
</bw-container>