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

	// Navbar Configuration
	const homeLink:{name:string,link:string} = {name:"CookDish", link:"/"};
	const links:Array<{name:string,link:string}> = [
		{name:"Search", link:"/search"},
		{name:"Manage", link:"/manage"},
		{name:"Favourite", link:"/favourite"},
		{name:"Weekly Planner", link:"/planner"},
		{name:"About", link:"/about"}
	]

</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<bw-nav  homeLink={homeLink} navLinks={links}></bw-nav>
{@render children()}
