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

    // Receive data loaded from +page.ts
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

<bw-container class="block max-w-325 mx-auto px-6 py-8 box-border min-h-screen bg-[#0b0f19] text-slate-100 font-sans">
    <header class="flex flex-wrap justify-between items-start mb-8 gap-4">
        <div>
            <h1 class="text-3xl md:text-4xl font-extrabold m-0 mb-1">
                Weekly <span class="text-blue-400">Meal Planner</span>
            </h1>
            <p class="text-slate-400 m-0 text-sm md:text-base">Organize your meals and prep schedule for the week ahead.</p>
        </div>
        <button
            class="bg-red-500/10 text-red-300 border border-red-500/25 px-4 py-2 rounded-lg font-semibold text-sm cursor-pointer transition-colors hover:bg-red-500/20"
            onclick={openResetModal}
        >
            Reset Week
        </button>
    </header>

    <div class="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
        {#each days as day}
            <bw-container primary={true} radius="16px" pd="1.25rem" border="1px solid rgba(255, 255, 255, 0.08)" class="flex flex-col">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="m-0 text-lg text-slate-50 font-bold">{day}</h3>
                    <button
                        class="bg-white/5 text-blue-400 border border-white/10 rounded-lg w-8 h-8 cursor-pointer text-lg flex items-center justify-center transition-colors hover:bg-blue-400/15"
                        onclick={() => openModal(day)}
                        aria-label="Add meal to {day}"
                    >
                        +
                    </button>
                </div>

                <div class="flex flex-col gap-3 flex-1">
                    {#each mealTypes as slotKey}
                        {@const meal = plannerState[day]?.[slotKey]}

                        <div
                            class="rounded-xl p-3 cursor-pointer transition-all select-none {meal
                                ? 'bg-[#0b0f19]/60 border border-white/10 shadow-sm'
                                : 'bg-white/2 border border-dashed border-white/10 hover:border-blue-400/40 hover:bg-white/4'}"
                            role="button"
                            tabindex="0"
                            onclick={() => openModal(day, slotKey)}
                            onkeydown={(e) => e.key === 'Enter' && openModal(day, slotKey)}
                        >
                            <div class="flex justify-between items-center mb-1">
                                <span class="text-[0.7rem] uppercase text-slate-500 font-bold tracking-wider">{slotKey}</span>
                                {#if meal}
                                    <button
                                        class="bg-transparent border-none text-slate-500 text-xs cursor-pointer px-1 py-0.5 rounded hover:text-red-400 hover:bg-red-500/10"
                                        onclick={(e) => removeMeal(day, slotKey, e)}
                                        title="Remove meal"
                                    >
                                        ✕
                                    </button>
                                {/if}
                            </div>

                            {#if meal}
                                <div class="flex gap-3 items-center mt-1">
                                    {#if meal.image}
                                        <img src={meal.image} alt={meal.title} class="w-10 h-10 rounded-lg object-cover shrink-0" />
                                    {/if}
                                    <div class="overflow-hidden">
                                        <p class="m-0 text-sm font-semibold text-slate-100 truncate">{meal.title}</p>
                                        {#if meal.prepTimeMinutes || meal.caloriesPerServing}
                                            <div class="flex gap-2 text-xs text-slate-400 mt-0.5">
                                                {#if meal.prepTimeMinutes}
                                                    <span>⏱️ {(meal.prepTimeMinutes ?? 0) + (meal.cookTimeMinutes ?? 0)}m</span>
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
    <div class="flex flex-col max-h-[calc(80vh-4rem)] box-border">
        <div class="flex flex-col gap-5 overflow-y-auto p-5 flex-1 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div class="flex flex-col gap-2">
                <label for="meal-type-select" class="text-xs font-bold uppercase text-slate-400 tracking-wider">Meal Slot</label>
                <div class="grid grid-cols-3 gap-2 bg-black/20 p-1 rounded-xl">
                    {#each mealTypes as type}
                        <button
                            type="button"
                            class="border-none py-2 rounded-lg text-xs capitalize cursor-pointer font-semibold transition-colors {selectedMealType === type
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
                <label for="sample-recipes" class="text-xs font-bold uppercase text-slate-400 tracking-wider">Select from Loaded Recipes</label>
                <div class="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {#each recipes as recipe}
                        <button
                            type="button"
                            class="flex items-center gap-3 bg-white/3 border p-2 rounded-xl cursor-pointer text-left transition-colors hover:bg-white/6 {selectedRecipeId === recipe.id
                                ? 'border-blue-400 bg-blue-400/15'
                                : 'border-white/6'}"
                            onclick={() => handleSelectPreset(recipe)}
                        >
                            <img src={recipe.image} alt={recipe.name} class="w-10 h-10 rounded-md object-cover" />
                            <div>
                                <p class="m-0 text-xs font-semibold text-slate-100">{recipe.name}</p>
                                <span class="text-[0.75rem] text-slate-500"
                                    >{recipe.prepTimeMinutes + recipe.cookTimeMinutes} mins • {recipe.caloriesPerServing} kcal</span
                                >
                            </div>
                        </button>
                    {/each}
                </div>
            </div>

            <div class="flex flex-col gap-2">
                <label for="custom-meal-title" class="text-xs font-bold uppercase text-slate-400 tracking-wider">Or Type Custom Meal Name</label>
                <input
                    id="custom-meal-title"
                    type="text"
                    placeholder="e.g., Avocado Toast, Protein Smoothie..."
                    bind:value={customRecipeTitle}
                    class="bg-white/4 border border-white/10 rounded-xl p-3 text-slate-100 text-sm outline-none focus:border-blue-400"
                />
            </div>
        </div>

        <div class="p-4 px-5 border-t border-white/10 flex justify-end gap-3 bg-[#131b2e] sticky bottom-0 z-10 shrink-0">
            <button
                type="button"
                class="bg-transparent border border-white/10 text-slate-400 px-5 py-2 rounded-lg cursor-pointer font-semibold text-sm hover:bg-white/5"
                onclick={closeModal}
            >
                Cancel
            </button>
            <button
                type="button"
                class="bg-blue-600 text-white border-none px-5 py-2 rounded-lg cursor-pointer font-semibold text-sm hover:bg-blue-700 transition-colors"
                onclick={assignMealToSlot}
            >
                Save to Plan
            </button>
        </div>
    </div>
</bw-modal>

<bw-modal is-open={isResetModalOpen} name="Reset Weekly Plan" onmodalClosed={closeResetModal}>
    <div class="flex flex-col max-h-[calc(80vh-4rem)] box-border">
        <div class="flex flex-col gap-5 overflow-y-auto p-5 flex-1 scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <p class="m-0 text-sm text-slate-300 leading-relaxed">Are you sure you want to clear your entire weekly meal plan? This action cannot be undone.</p>
        </div>
        <div class="p-4 px-5 border-t border-white/10 flex justify-end gap-3 bg-[#131b2e] sticky bottom-0 z-10 shrink-0">
            <button
                type="button"
                class="bg-transparent border border-white/10 text-slate-400 px-5 py-2 rounded-lg cursor-pointer font-semibold text-sm hover:bg-white/5"
                onclick={closeResetModal}
            >
                Cancel
            </button>
            <button
                type="button"
                class="bg-red-600 text-white border-none px-5 py-2 rounded-lg cursor-pointer font-semibold text-sm hover:bg-red-700 transition-colors"
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