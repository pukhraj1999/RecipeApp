<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

    let queryValue:string = $state("");

    

</script>
<bw-container>
    <bw-container primary="true" mg="10px" pd="1.5rem">
        <h1 class="text-3xl font-bold">Search</h1>
        <bw-input label="Let's make Something special"  placeholder="Type Name, Description, tag"></bw-input>
        <bw-btn name="Search"></bw-btn>
    </bw-container>
    <bw-container grid="true">
        {#each data.recipes as recipe (recipe.id)}
            <bw-card 
                imgSrc={recipe.image}
                imgAlt={recipe.name}
                name={recipe.name}
                tagTitle="Tags:"
                tags={recipe.tags}
                populate="false"
            ></bw-card>
        {/each}
    </bw-container>
</bw-container>



