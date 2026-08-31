<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	interface MealSlot {
		id: string;
		title: string;
		image?: string;
		prepTimeMinutes?: number;
		cookTimeMinutes?: number;
		caloriesPerServing?: number;
	}

	interface DayPlan {
		breakfast: MealSlot | null;
		lunch: MealSlot | null;
		dinner: MealSlot | null;
	}

	type WeekPlannerState = Record<string, DayPlan>;

	let { data }: { data: PageData } = $props();
	let recipes = $derived(data.recipes);

	const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
	const mealTypes = ['breakfast', 'lunch', 'dinner'] as const;

	let plannerState = $state<WeekPlannerState>({
		Monday: { breakfast: null, lunch: null, dinner: null },
		Tuesday: { breakfast: null, lunch: null, dinner: null },
		Wednesday: { breakfast: null, lunch: null, dinner: null },
		Thursday: { breakfast: null, lunch: null, dinner: null },
		Friday: { breakfast: null, lunch: null, dinner: null },
		Saturday: { breakfast: null, lunch: null, dinner: null },
		Sunday: { breakfast: null, lunch: null, dinner: null }
	});

	let isModalOpen = $state(false);
	let selectedDay = $state<string>('Monday');
	let selectedMealType = $state<'breakfast' | 'lunch' | 'dinner'>('breakfast');
	let customRecipeTitle = $state('');
	let selectedRecipeId = $state<number | string>('');

	let isResetModalOpen = $state(false);

	let modalTitle = $derived(`Add Meal for ${selectedDay}`);

	onMount(() => {
		const saved = localStorage.getItem('recipe_app_planner');
		if (saved) {
			try {
				plannerState = JSON.parse(saved);
			} catch (e) {
				console.error('Failed to parse saved planner data', e);
			}
		}
	});

	function saveState() {
		if (typeof window !== 'undefined') {
			localStorage.setItem('recipe_app_planner', JSON.stringify(plannerState));
		}
	}

	function openModal(day: string, slot?: 'breakfast' | 'lunch' | 'dinner') {
		selectedDay = day;
		selectedMealType = slot ?? 'breakfast';
		selectedRecipeId = '';
		customRecipeTitle = '';
		isModalOpen = true;
	}

	function closeModal() {
		isModalOpen = false;
	}

	function openResetModal() {
		isResetModalOpen = true;
	}

	function closeResetModal() {
		isResetModalOpen = false;
	}

	function handleSelectPreset(recipe: (typeof recipes)[0]) {
		selectedRecipeId = recipe.id;
		customRecipeTitle = recipe.name;
	}

	function assignMealToSlot() {
		if (!customRecipeTitle.trim() && !selectedRecipeId) return;

		const chosenPreset = recipes.find((r: any) => r.id === selectedRecipeId);

		const newMeal: MealSlot = {
			id: String(selectedRecipeId) || String(Date.now()),
			title: customRecipeTitle.trim() || chosenPreset?.name || 'Custom Meal',
			image: chosenPreset?.image,
			prepTimeMinutes: chosenPreset?.prepTimeMinutes,
			cookTimeMinutes: chosenPreset?.cookTimeMinutes,
			caloriesPerServing: chosenPreset?.caloriesPerServing
		};

		plannerState[selectedDay][selectedMealType] = newMeal;
		saveState();
		closeModal();
	}

	function removeMeal(day: string, slot: 'breakfast' | 'lunch' | 'dinner', event: MouseEvent) {
		event.stopPropagation();
		plannerState[day][slot] = null;
		saveState();
	}

	function confirmClearWholeWeek() {
		days.forEach((day) => {
			plannerState[day] = { breakfast: null, lunch: null, dinner: null };
		});
		saveState();
		closeResetModal();
	}
</script>

<svelte:head>
	<title>Weekly Meal Planner - Recipe App</title>
</svelte:head>

<bw-container
	pd="10px"
>
	<header class="mb-8 flex flex-wrap items-start justify-between gap-4">
		<div>
			<h1 class="m-0 mb-1 text-3xl font-extrabold md:text-4xl">
				Weekly <span class="text-blue-400">Meal Planner</span>
			</h1>
			<p class="m-0 text-sm text-slate-400 md:text-base">
				Organize your meals and prep schedule for the week ahead.
			</p>
		</div>
		<button
			class="cursor-pointer rounded-lg border border-red-500/25 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-300 transition-colors hover:bg-red-500/20"
			onclick={openResetModal}
		>
			Reset Week
		</button>
	</header>

	<div class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
		{#each days as day}
			<bw-container
				primary={true}
				radius="16px"
				pd="1.25rem"
				border="1px solid rgba(255, 255, 255, 0.08)"
				class="flex flex-col"
			>
				<div class="mb-4 flex items-center justify-between">
					<h3 class="m-0 text-lg font-bold text-slate-50">{day}</h3>
					<button
						class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-white/10 bg-white/5 text-lg text-blue-400 transition-colors hover:bg-blue-400/15"
						onclick={() => openModal(day)}
						aria-label="Add meal to {day}"
					>
						+
					</button>
				</div>

				<div class="flex flex-1 flex-col gap-3">
					{#each mealTypes as slotKey}
						{@const meal = plannerState[day]?.[slotKey]}

						<div
							class="cursor-pointer rounded-xl p-3 transition-all select-none {meal
								? 'border border-white/10 bg-[#0b0f19]/60 shadow-sm'
								: 'border border-dashed border-white/10 bg-white/2 hover:border-blue-400/40 hover:bg-white/4'}"
							role="button"
							tabindex="0"
							onclick={() => openModal(day, slotKey)}
							onkeydown={(e) => e.key === 'Enter' && openModal(day, slotKey)}
						>
							<div class="mb-1 flex items-center justify-between">
								<span class="text-[0.7rem] font-bold tracking-wider text-slate-500 uppercase"
									>{slotKey}</span
								>
								{#if meal}
									<button
										class="cursor-pointer rounded border-none bg-transparent px-1 py-0.5 text-xs text-slate-500 hover:bg-red-500/10 hover:text-red-400"
										onclick={(e) => removeMeal(day, slotKey, e)}
										title="Remove meal"
									>
										✕
									</button>
								{/if}
							</div>

							{#if meal}
								<div class="mt-1 flex items-center gap-3">
									{#if meal.image}
										<img
											src={meal.image}
											alt={meal.title}
											class="h-10 w-10 shrink-0 rounded-lg object-cover"
										/>
									{/if}
									<div class="overflow-hidden">
										<p class="m-0 truncate text-sm font-semibold text-slate-100">{meal.title}</p>
										{#if meal.prepTimeMinutes || meal.caloriesPerServing}
											<div class="mt-0.5 flex gap-2 text-xs text-slate-400">
												{#if meal.prepTimeMinutes}
													<span
														>⏱️ {(meal.prepTimeMinutes ?? 0) + (meal.cookTimeMinutes ?? 0)}m</span
													>
												{/if}
												{#if meal.caloriesPerServing}
													<span>🔥 {meal.caloriesPerServing} kcal</span>
												{/if}
											</div>
										{/if}
									</div>
								</div>
							{:else}
								<p class="my-1 text-xs text-slate-500">+ Tap to add recipe</p>
							{/if}
						</div>
					{/each}
				</div>
			</bw-container>
		{/each}
	</div>
</bw-container>

<bw-modal is-open={isModalOpen} name={modalTitle} onmodalClosed={closeModal}>
	<div class="box-border flex max-h-[calc(80vh-4rem)] flex-col">
		<div
			class="flex flex-1 scrollbar-none flex-col gap-5 overflow-y-auto p-5 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
		>
			<div class="flex flex-col gap-2">
				<label
					for="meal-type-select"
					class="text-xs font-bold tracking-wider text-slate-400 uppercase">Meal Slot</label
				>
				<div class="grid grid-cols-3 gap-2 rounded-xl bg-black/20 p-1">
					{#each mealTypes as type}
						<button
							type="button"
							class="cursor-pointer rounded-lg border-none py-2 text-xs font-semibold capitalize transition-colors {selectedMealType ===
							type
								? 'bg-blue-600 text-white'
								: 'bg-transparent text-slate-400'}"
							onclick={() => (selectedMealType = type)}
						>
							{type}
						</button>
					{/each}
				</div>
			</div>

			<div class="flex flex-col gap-2">
				<label
					for="sample-recipes"
					class="text-xs font-bold tracking-wider text-slate-400 uppercase"
					>Select from Loaded Recipes</label
				>
				<div
					class="flex max-h-60 scrollbar-none flex-col gap-2 overflow-y-auto pr-1 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
				>
					{#each recipes as recipe}
						<button
							type="button"
							class="flex cursor-pointer items-center gap-3 rounded-xl border bg-white/3 p-2 text-left transition-colors hover:bg-white/6 {selectedRecipeId ===
							recipe.id
								? 'border-blue-400 bg-blue-400/15'
								: 'border-white/6'}"
							onclick={() => handleSelectPreset(recipe)}
						>
							<img src={recipe.image} alt={recipe.name} class="h-10 w-10 rounded-md object-cover" />
							<div>
								<p class="m-0 text-xs font-semibold text-slate-100">{recipe.name}</p>
								<span class="text-[0.75rem] text-slate-500"
									>{recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins • {recipe.caloriesPerServing}
									kcal</span
								>
							</div>
						</button>
					{/each}
				</div>
			</div>

			<div class="flex flex-col gap-2">
				<label
					for="custom-meal-title"
					class="text-xs font-bold tracking-wider text-slate-400 uppercase"
					>Or Type Custom Meal Name</label
				>
				<input
					id="custom-meal-title"
					type="text"
					placeholder="e.g., Avocado Toast, Protein Smoothie..."
					bind:value={customRecipeTitle}
					class="rounded-xl border border-white/10 bg-white/4 p-3 text-sm text-slate-100 outline-none focus:border-blue-400"
				/>
			</div>
		</div>

		<div
			class="sticky bottom-0 z-10 flex shrink-0 justify-end gap-3 border-t border-white/10 bg-[#131b2e] p-4 px-5"
		>
			<button
				type="button"
				class="cursor-pointer rounded-lg border border-white/10 bg-transparent px-5 py-2 text-sm font-semibold text-slate-400 hover:bg-white/5"
				onclick={closeModal}
			>
				Cancel
			</button>
			<button
				type="button"
				class="cursor-pointer rounded-lg border-none bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
				onclick={assignMealToSlot}
			>
				Save to Plan
			</button>
		</div>
	</div>
</bw-modal>

<bw-modal is-open={isResetModalOpen} name="Reset Weekly Plan" onmodalClosed={closeResetModal}>
	<div class="box-border flex max-h-[calc(80vh-4rem)] flex-col">
		<div
			class="flex flex-1 scrollbar-none flex-col gap-5 overflow-y-auto p-5 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
		>
			<p class="m-0 text-sm leading-relaxed text-slate-300">
				Are you sure you want to clear your entire weekly meal plan? This action cannot be undone.
			</p>
		</div>
		<div
			class="sticky bottom-0 z-10 flex shrink-0 justify-end gap-3 border-t border-white/10 bg-[#131b2e] p-4 px-5"
		>
			<button
				type="button"
				class="cursor-pointer rounded-lg border border-white/10 bg-transparent px-5 py-2 text-sm font-semibold text-slate-400 hover:bg-white/5"
				onclick={closeResetModal}
			>
				Cancel
			</button>
			<button
				type="button"
				class="cursor-pointer rounded-lg border-none bg-red-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
				onclick={confirmClearWholeWeek}
			>
				Clear Week
			</button>
		</div>
	</div>
</bw-modal>

<style>
	bw-modal::part(modal-body),
	bw-modal :global(.modal-body) {
		max-height: 80vh;
		display: flex;
		flex-direction: column;
		overflow: hidden;
		padding: 0;
	}
</style>
