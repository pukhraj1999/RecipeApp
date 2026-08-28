<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	let { recipe } = $derived(data);

	// Helper to generate a consistent subtle pastel badge background from a tag string
	function getTagColor(tag: string) {
		const colors = [
			{ bg: 'rgba(59, 130, 246, 0.15)', text: '#93c5fd', border: 'rgba(59, 130, 246, 0.3)' },  // Blue
			{ bg: 'rgba(236, 72, 153, 0.15)', text: '#fbcfe8', border: 'rgba(236, 72, 153, 0.3)' },  // Pink
			{ bg: 'rgba(16, 185, 129, 0.15)', text: '#6ee7b7', border: 'rgba(16, 185, 129, 0.3)' },  // Emerald
			{ bg: 'rgba(245, 158, 11, 0.15)', text: '#fde68a', border: 'rgba(245, 158, 11, 0.3)' },  // Amber
			{ bg: 'rgba(168, 85, 247, 0.15)', text: '#e9d5ff', border: 'rgba(168, 85, 247, 0.3)' }   // Purple
		];
		let hash = 0;
		for (let i = 0; i < tag.length; i++) hash = tag.charCodeAt(i) + ((hash << 5) - hash);
		return colors[Math.abs(hash) % colors.length];
	}
</script>

<svelte:head>
	<title>{recipe.name} - Recipe App</title>
</svelte:head>

<div class="page-container">
	<a href="/" class="back-link">
		<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
			<path d="M19 12H5M12 19l-7-7 7-7"/>
		</svg>
		Back to Recipes
	</a>

	<!-- Header Grid -->
	<header class="recipe-header">
		<div class="image-wrapper">
			<img src={recipe.image} alt={recipe.name} class="recipe-image" />
		</div>

		<div class="header-details">
			<h1>{recipe.name}</h1>
			<div class="sub-meta">
				<span>🍽️ {recipe.cuisine}</span>
				<span class="dot">•</span>
				<span>⚡ {recipe.difficulty}</span>
				<span class="dot">•</span>
				<span class="rating">⭐ {recipe.rating} <span class="reviews">({recipe.reviewCount} reviews)</span></span>
			</div>

			<!-- Quick Stats Card -->
			<div class="stats-card">
				<div class="stat-item">
					<span class="stat-icon">⏱️</span>
					<div>
						<p class="stat-label">Prep Time</p>
						<p class="stat-val">{recipe.prepTimeMinutes} mins</p>
					</div>
				</div>
				<div class="stat-item">
					<span class="stat-icon">🍳</span>
					<div>
						<p class="stat-label">Cook Time</p>
						<p class="stat-val">{recipe.cookTimeMinutes} mins</p>
					</div>
				</div>
				<div class="stat-item">
					<span class="stat-icon">👥</span>
					<div>
						<p class="stat-label">Servings</p>
						<p class="stat-val">{recipe.servings}</p>
					</div>
				</div>
				<div class="stat-item">
					<span class="stat-icon">🔥</span>
					<div>
						<p class="stat-label">Calories</p>
						<p class="stat-val">{recipe.caloriesPerServing} kcal</p>
					</div>
				</div>
			</div>

			<!-- Dynamic Tag Badges -->
			<div class="tags-wrapper">
				{#each recipe.tags as tag}
					{@const style = getTagColor(tag)}
					<span 
						class="colored-tag" 
						style="background: {style.bg}; color: {style.text}; border-color: {style.border};"
					>
						{tag}
					</span>
				{/each}
			</div>
		</div>
	</header>

	<hr class="divider" />

	<!-- Main Recipe Body -->
	<div class="recipe-grid">
		<!-- Modern Checkable Ingredients Panel -->
		<section class="panel ingredients-panel">
			<h2>Ingredients</h2>
			<p class="panel-subtitle">Check items off as you prep</p>
			
			<div class="ingredients-list">
				{#each recipe.ingredients as ingredient, index}
					<label class="ingredient-card">
						<input type="checkbox" id="ing-{index}" class="custom-checkbox" />
						<span class="ingredient-text">{ingredient}</span>
					</label>
				{/each}
			</div>
		</section>

		<!-- Numbered Steps Panel -->
		<section class="panel instructions-panel">
			<h2>Instructions</h2>
			<div class="instructions-list">
				{#each recipe.instructions as step, i}
					<div class="step-card">
						<span class="step-badge">{i + 1}</span>
						<p class="step-text">{step}</p>
					</div>
				{/each}
			</div>
		</section>
	</div>
</div>

<style>
	:global(body) {
		background-color: #0b0f19;
		color: #f1f5f9;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
	}

	.page-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem 1.5rem;
	}

	.back-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		color: #60a5fa;
		text-decoration: none;
		font-weight: 500;
		margin-bottom: 2rem;
		transition: transform 0.2s, color 0.2s;
	}

	.back-link:hover {
		color: #93c5fd;
		transform: translateX(-4px);
	}

	/* Header Setup */
	.recipe-header {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2.5rem;
	}

	@media (min-width: 868px) {
		.recipe-header {
			grid-template-columns: 440px 1fr;
		}
	}

	.image-wrapper {
		position: relative;
		border-radius: 20px;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.1);
		box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
	}

	.recipe-image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		min-height: 320px;
		display: block;
	}

	h1 {
		font-size: 2.5rem;
		font-weight: 800;
		line-height: 1.2;
		margin: 0 0 0.75rem 0;
		letter-spacing: -0.02em;
	}

	.sub-meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		color: #94a3b8;
		font-size: 0.95rem;
	}

	.dot {
		color: #475569;
	}

	.rating {
		color: #f59e0b;
		font-weight: 600;
	}

	.reviews {
		color: #64748b;
		font-weight: normal;
	}

	/* Stats Card */
	.stats-card {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1rem;
		background: #131b2e;
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 16px;
		padding: 1.25rem;
		margin: 1.5rem 0;
	}

	@media (min-width: 500px) {
		.stats-card {
			grid-template-columns: repeat(4, 1fr);
		}
	}

	.stat-item {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.stat-icon {
		font-size: 1.25rem;
		background: rgba(255, 255, 255, 0.05);
		padding: 0.5rem;
		border-radius: 10px;
	}

	.stat-label {
		margin: 0;
		font-size: 0.75rem;
		color: #64748b;
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.stat-val {
		margin: 0;
		font-size: 0.95rem;
		font-weight: 600;
		color: #e2e8f0;
	}

	/* Tags */
	.tags-wrapper {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.colored-tag {
		padding: 0.35rem 0.85rem;
		border-radius: 9999px;
		font-size: 0.85rem;
		font-weight: 600;
		border-width: 1px;
		border-style: solid;
		backdrop-filter: blur(4px);
	}

	.divider {
		border: 0;
		height: 1px;
		background: linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 100%);
		margin: 3rem 0;
	}

	/* Recipe Content Grid */
	.recipe-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
	}

	@media (min-width: 900px) {
		.recipe-grid {
			grid-template-columns: 380px 1fr;
		}
	}

	.panel {
		background: #131b2e;
		border: 1px solid rgba(255, 255, 255, 0.08);
		border-radius: 20px;
		padding: 1.75rem;
	}

	h2 {
		font-size: 1.5rem;
		margin: 0 0 0.25rem 0;
		letter-spacing: -0.01em;
	}

	.panel-subtitle {
		margin: 0 0 1.5rem 0;
		color: #64748b;
		font-size: 0.875rem;
	}

	/* Modern Interactive Ingredients List */
	.ingredients-list {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.ingredient-card {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		padding: 0.85rem 1rem;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.05);
		border-radius: 12px;
		cursor: pointer;
		transition: all 0.2s ease;
		user-select: none;
	}

	.ingredient-card:hover {
		background: rgba(255, 255, 255, 0.06);
		border-color: rgba(255, 255, 255, 0.1);
	}

	.custom-checkbox {
		appearance: none;
		width: 20px;
		height: 20px;
		border: 2px solid #475569;
		border-radius: 6px;
		outline: none;
		cursor: pointer;
		position: relative;
		transition: all 0.2s;
		flex-shrink: 0;
	}

	.custom-checkbox:checked {
		background-color: #3b82f6;
		border-color: #3b82f6;
	}

	.custom-checkbox:checked::after {
		content: '';
		position: absolute;
		left: 6px;
		top: 2px;
		width: 4px;
		height: 9px;
		border: solid white;
		border-width: 0 2px 2px 0;
		transform: rotate(45deg);
	}

	.ingredient-text {
		color: #cbd5e1;
		font-size: 0.95rem;
		transition: color 0.2s, text-decoration 0.2s;
	}

	.ingredient-card:has(.custom-checkbox:checked) .ingredient-text {
		color: #64748b;
		text-decoration: line-through;
	}

	/* Instruction Steps */
	.instructions-list {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-top: 1.25rem;
	}

	.step-card {
		display: flex;
		gap: 1.25rem;
		padding: 1.25rem;
		background: rgba(255, 255, 255, 0.02);
		border: 1px solid rgba(255, 255, 255, 0.05);
		border-radius: 14px;
	}

	.step-badge {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		background: #2563eb;
		color: #ffffff;
		border-radius: 10px;
		font-weight: 700;
		font-size: 0.9rem;
		flex-shrink: 0;
	}

	.step-text {
		margin: 0;
		color: #cbd5e1;
		line-height: 1.6;
		font-size: 0.98rem;
	}
</style>