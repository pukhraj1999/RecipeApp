<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		const script = document.createElement('script');
		script.type = 'module';
		script.src = '/vendor/blackwall/blackwall.esm.js';
		document.head.appendChild(script);
	});

	// Navbar Configuration
	const homeLink:{name:string,link:string} = {name:"CookDish", link:"/"};
	const links:Array<{name:string,link:string}> = [
		{name:"Home", link:"/"},
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
