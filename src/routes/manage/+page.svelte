<script lang="ts">
	import { onMount } from 'svelte';
	import type { Recipe, Difficulty, MealType } from '$lib/types/recpie';

	const STORAGE_KEY = 'svelte_recipes_data';

	let recipes = $state<Recipe[]>([]);

	let isInitialized = false;
	$effect(() => {
		if (isInitialized) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
		}
	});

	onMount(() => {
		const saved = localStorage.getItem(STORAGE_KEY);
		if (saved) {
			try {
				recipes = JSON.parse(saved);
			} catch (e) {
				console.error('Failed to parse recipes from localStorage', e);
			}
		}
		isInitialized = true;
	});

	let isModalOpen = $state(false);
	let isEditing = $state(false);
	let currentEditingId = $state<number | null>(null);
	let isDropdownOpen = $state(false);

	let formData = $state({
		name: '',
		cuisine: '',
		prepTimeMinutes: 15,
		cookTimeMinutes: 20,
		servings: 4,
		difficulty: 'Easy' as Difficulty,
		caloriesPerServing: 250,
		image: '',
		userId: 1,
		rating: 5.0,
		reviewCount: 0,
		rawIngredients: '',
		rawInstructions: '',
		rawTags: '',
		rawMealType: ''
	});

	let processedIngredients = $derived(
		formData.rawIngredients
			.split('\n')
			.map((item) => item.trim())
			.filter((item) => item.length > 0)
	);

	let processedInstructions = $derived(
		formData.rawInstructions
			.split('\n')
			.map((item) => item.trim())
			.filter((item) => item.length > 0)
	);

	let processedTags = $derived(
		formData.rawTags
			.split(/[\n,]/)
			.map((tag) => tag.trim())
			.filter((tag) => tag.length > 0)
	);

	let processedMealTypes = $derived(
		formData.rawMealType
			.split(/[\n,]/)
			.map((mt) => mt.trim())
			.filter((mt) => mt.length > 0) as MealType[]
	);

	function resetForm() {
		formData = {
			name: '',
			cuisine: '',
			prepTimeMinutes: 15,
			cookTimeMinutes: 20,
			servings: 4,
			difficulty: 'Easy',
			caloriesPerServing: 250,
			image: '',
			userId: 1,
			rating: 5.0,
			reviewCount: 0,
			rawIngredients: '',
			rawInstructions: '',
			rawTags: '',
			rawMealType: ''
		};
		isEditing = false;
		currentEditingId = null;
		isDropdownOpen = false;
	}

	function openCreateModal() {
		resetForm();
		isModalOpen = true;
	}

	function openEditModal(recipe: Recipe) {
		isEditing = true;
		currentEditingId = recipe.id;
		formData = {
			name: recipe.name,
			cuisine: recipe.cuisine,
			prepTimeMinutes: recipe.prepTimeMinutes,
			cookTimeMinutes: recipe.cookTimeMinutes,
			servings: recipe.servings,
			difficulty: recipe.difficulty as Difficulty,
			caloriesPerServing: recipe.caloriesPerServing,
			image: recipe.image,
			userId: recipe.userId,
			rating: recipe.rating,
			reviewCount: recipe.reviewCount,
			rawIngredients: recipe.ingredients.join('\n'),
			rawInstructions: recipe.instructions.join('\n'),
			rawTags: recipe.tags.join(', '),
			rawMealType: recipe.mealType.join(', ')
		};
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
		resetForm();
	}

	function handleSave() {
		if (
			!formData.name ||
			!formData.cuisine ||
			processedIngredients.length === 0 ||
			processedInstructions.length === 0
		) {
			alert('Please fill out Name, Cuisine, Ingredients, and Instructions.');
			return;
		}

		if (isEditing && currentEditingId !== null) {
			recipes = recipes.map((r) => {
				if (r.id === currentEditingId) {
					return {
						...r,
						name: formData.name,
						cuisine: formData.cuisine,
						prepTimeMinutes: formData.prepTimeMinutes,
						cookTimeMinutes: formData.cookTimeMinutes,
						servings: formData.servings,
						difficulty: formData.difficulty,
						caloriesPerServing: formData.caloriesPerServing,
						image: formData.image || 'https://via.placeholder.com/300x200?text=No+Image',
						ingredients: processedIngredients,
						instructions: processedInstructions,
						tags: processedTags,
						mealType: processedMealTypes
					};
				}
				return r;
			});
		} else {
			const newRecipe: Recipe = {
				id: Date.now(),
				name: formData.name,
				cuisine: formData.cuisine,
				prepTimeMinutes: formData.prepTimeMinutes,
				cookTimeMinutes: formData.cookTimeMinutes,
				servings: formData.servings,
				difficulty: formData.difficulty,
				caloriesPerServing: formData.caloriesPerServing,
				userId: formData.userId,
				rating: formData.rating,
				reviewCount: formData.reviewCount,
				image: formData.image || 'https://via.placeholder.com/300x200?text=No+Image',
				ingredients: processedIngredients,
				instructions: processedInstructions,
				tags: processedTags,
				mealType: processedMealTypes
			};
			recipes = [...recipes, newRecipe];
		}

		localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));

		closeModal();
	}

	function handleDelete(id: number, name: string) {
		if (confirm(`Are you sure you want to delete "${name}"?`)) {
			recipes = recipes.filter((r) => r.id !== id);
		}
	}

	function selectDifficulty(diff: Difficulty) {
		formData.difficulty = diff;
		isDropdownOpen = false;
	}
</script>

<!-- Root Container directly set to full viewport min-height without extra wrappers -->
<bw-container pd="1.5rem" mg="0" radius="0px">
	<bw-container
		flex={true}
		radius="15px"
		spaceBetween={true}
		pdV="1rem"
		pdH="1.5rem"
		mg="0 0 2rem 0"
		primary={true}
	>
		<div>
			<h1 class="text-3xl font-extrabold tracking-tight">
				Manage <span class="text-blue-400">Recipes</span>
			</h1>
			<p class="mt-1 text-sm text-slate-400">Local CRUD Management</p>
		</div>
		<div>
			<bw-btn name="+ Create Recipe" radius="10px" size="0.95rem" onpress={openCreateModal}
			></bw-btn>
		</div>
	</bw-container>

	{#if recipes.length > 0}
		<div class="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
			{#each recipes as recipe (recipe.id)}
				<bw-card
					populate={false}
					name={recipe.name}
					imgSrc={recipe.image}
					imgAlt={recipe.name}
					rating={String(recipe.rating)}
					tagTitle="Tags:"
					tags={recipe.tags}
					description={`Cuisine: ${recipe.cuisine} | Prep: ${recipe.prepTimeMinutes}m | Cook: ${recipe.cookTimeMinutes}m | Calories: ${recipe.caloriesPerServing}`}
					cardRadius="16px"
				>
					<div class="mt-4 flex justify-center gap-3">
						<bw-btn name="Check" radius="8px" size="0.82rem" link={"recipe/"+recipe.id}
						></bw-btn>
						<bw-btn name="✏️ Edit" radius="8px" size="0.82rem" onpress={() => openEditModal(recipe)}
						></bw-btn>
						<bw-btn
							name="🗑️ Delete"
							radius="8px"
							size="0.82rem"
							onpress={() => handleDelete(recipe.id, recipe.name)}
						></bw-btn>
					</div>
				</bw-card>
			{/each}
		</div>
	{:else}
		<bw-container
			pd="4rem"
			radius="15px"
			center={true}
			border="1px solid rgba(255,255,255,0.1)"
			primary={true}
		>
			<div class="text-center text-slate-400">
				<h3 class="text-lg font-semibold text-slate-200">Your collection is empty</h3>
				<p class="mt-1 text-sm text-slate-400">
					Click "Create Recipe" above to add your first entry.
				</p>
			</div>
		</bw-container>
	{/if}
</bw-container>

<bw-modal
	isOpen={isModalOpen}
	name={isEditing ? 'Edit Recipe' : 'Create New Recipe'}
	onmodalClosed={closeModal}
>
	<div class="no-scrollbar flex max-h-[75vh] flex-col gap-4 overflow-y-auto p-2 text-slate-100">
		<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
			<div class="flex flex-col gap-1.5">
				<label for="name" class="text-xs font-medium text-slate-400">Recipe Name*</label>
				<input
					id="name"
					type="text"
					bind:value={formData.name}
					required
					class="w-full rounded-lg border border-white/10 bg-slate-800 p-2.5 text-sm text-slate-100 outline-none focus:border-blue-500"
				/>
			</div>
			<div class="flex flex-col gap-1.5">
				<label for="cuisine" class="text-xs font-medium text-slate-400">Cuisine*</label>
				<input
					id="cuisine"
					type="text"
					bind:value={formData.cuisine}
					required
					class="w-full rounded-lg border border-white/10 bg-slate-800 p-2.5 text-sm text-slate-100 outline-none focus:border-blue-500"
				/>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
			<div class="flex flex-col gap-1.5">
				<label for="prepTimeMinutes" class="text-xs font-medium text-slate-400"
					>Prep Time (mins)</label
				>
				<input
					id="prepTimeMinutes"
					type="number"
					bind:value={formData.prepTimeMinutes}
					class="w-full rounded-lg border border-white/10 bg-slate-800 p-2.5 text-sm text-slate-100 outline-none focus:border-blue-500"
				/>
			</div>
			<div class="flex flex-col gap-1.5">
				<label for="cookTimeMinutes" class="text-xs font-medium text-slate-400"
					>Cook Time (mins)</label
				>
				<input
					id="cookTimeMinutes"
					type="number"
					bind:value={formData.cookTimeMinutes}
					class="w-full rounded-lg border border-white/10 bg-slate-800 p-2.5 text-sm text-slate-100 outline-none focus:border-blue-500"
				/>
			</div>
			<div class="flex flex-col gap-1.5">
				<label for="servings" class="text-xs font-medium text-slate-400">Servings</label>
				<input
					id="servings"
					type="number"
					bind:value={formData.servings}
					class="w-full rounded-lg border border-white/10 bg-slate-800 p-2.5 text-sm text-slate-100 outline-none focus:border-blue-500"
				/>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
			<div class="flex flex-col gap-1.5">
				<label for="difficulty-trigger" class="text-xs font-medium text-slate-400">Difficulty</label
				>
				<div class="relative w-full">
					<button
						id="difficulty-trigger"
						type="button"
						class="flex w-full items-center justify-between rounded-lg border border-white/10 bg-slate-800 p-2.5 text-sm text-slate-100 outline-none focus:border-blue-500"
						onclick={() => (isDropdownOpen = !isDropdownOpen)}
					>
						<span>{formData.difficulty}</span>
						<span class="text-xs text-slate-400">{isDropdownOpen ? '▲' : '▼'}</span>
					</button>

					{#if isDropdownOpen}
						<div
							class="absolute top-[calc(100%+6px)] left-0 z-10 flex w-full flex-col gap-1 rounded-xl border border-white/10 bg-slate-800 p-1 shadow-2xl"
						>
							<button
								type="button"
								class="rounded-lg p-2 text-left text-sm text-slate-100 transition hover:bg-white/10 {formData.difficulty ===
								'Easy'
									? 'bg-blue-600 text-white'
									: ''}"
								onclick={() => selectDifficulty('Easy')}
							>
								Easy
							</button>
							<button
								type="button"
								class="rounded-lg p-2 text-left text-sm text-slate-100 transition hover:bg-white/10 {formData.difficulty ===
								'Medium'
									? 'bg-blue-600 text-white'
									: ''}"
								onclick={() => selectDifficulty('Medium')}
							>
								Medium
							</button>
							<button
								type="button"
								class="rounded-lg p-2 text-left text-sm text-slate-100 transition hover:bg-white/10 {formData.difficulty ===
								'Hard'
									? 'bg-blue-600 text-white'
									: ''}"
								onclick={() => selectDifficulty('Hard')}
							>
								Hard
							</button>
						</div>
					{/if}
				</div>
			</div>

			<div class="flex flex-col gap-1.5">
				<label for="caloriesPerServing" class="text-xs font-medium text-slate-400"
					>Calories / Serving</label
				>
				<input
					id="caloriesPerServing"
					type="number"
					bind:value={formData.caloriesPerServing}
					class="w-full rounded-lg border border-white/10 bg-slate-800 p-2.5 text-sm text-slate-100 outline-none focus:border-blue-500"
				/>
			</div>
		</div>

		<div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
			<div class="flex flex-col gap-1.5">
				<label for="image" class="text-xs font-medium text-slate-400">Image URL</label>
				<input
					id="image"
					type="text"
					placeholder="https://..."
					bind:value={formData.image}
					class="w-full rounded-lg border border-white/10 bg-slate-800 p-2.5 text-sm text-slate-100 outline-none focus:border-blue-500"
				/>
			</div>
			<div class="flex flex-col gap-1.5">
				<label for="tags" class="text-xs font-medium text-slate-400"
					>Tags (comma or newline separated)</label
				>
				<input
					id="tags"
					type="text"
					placeholder="Pizza, Italian, Dinner"
					bind:value={formData.rawTags}
					class="w-full rounded-lg border border-white/10 bg-slate-800 p-2.5 text-sm text-slate-100 outline-none focus:border-blue-500"
				/>
			</div>
		</div>

		<div class="flex flex-col gap-1.5">
			<label for="ingredients" class="text-xs font-medium text-slate-400"
				>Ingredients* (One per line)</label
			>
			<textarea
				id="ingredients"
				rows="4"
				placeholder="1 Cup Flour&#10;2 Eggs&#10;1/2 Cup Milk"
				bind:value={formData.rawIngredients}
				required
				class="w-full rounded-lg border border-white/10 bg-slate-800 p-2.5 text-sm text-slate-100 outline-none focus:border-blue-500"
			></textarea>
		</div>

		<div class="flex flex-col gap-1.5">
			<label for="instructions" class="text-xs font-medium text-slate-400"
				>Instructions* (One step per line)</label
			>
			<textarea
				id="instructions"
				rows="4"
				placeholder="Mix dry ingredients&#10;Add milk and eggs&#10;Bake at 350°F"
				bind:value={formData.rawInstructions}
				required
				class="w-full rounded-lg border border-white/10 bg-slate-800 p-2.5 text-sm text-slate-100 outline-none focus:border-blue-500"
			></textarea>
		</div>

		<bw-container primary="true">
			<bw-btn name="Cancel" radius="8px" size="0.9rem" onpress={closeModal}></bw-btn>
			<bw-btn
				name={isEditing ? 'Update Recipe' : 'Create Recipe'}
				radius="8px"
				size="0.9rem"
				onpress={handleSave}
			></bw-btn>
		</bw-container>
	</div>
</bw-modal>

<style>
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
