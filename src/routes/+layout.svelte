<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(async () => {
    // Import the Stencil component loader dynamically on client load
    const { defineCustomElements } = await import('blackwall/loader');
    defineCustomElements(window);
  });
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
