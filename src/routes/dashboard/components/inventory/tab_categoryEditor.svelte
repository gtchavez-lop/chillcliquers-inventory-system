<script>
	import { fly } from 'svelte/transition';
	import { inventory_category_type, supabase } from '../../../../_global';

	let activeCategory = 'Service Cleaning';
	let itemType;

	const addType = async (e) => {
		let oldData = $inventory_category_type;
		let oldTypes = [];

		oldData.forEach((category) => {
			if (category.category_name == activeCategory) {
				category.types.push(itemType);
				oldTypes = [...oldTypes, ...category.types];
			}
		});

		let { data, error } = await supabase.from('inventory_category_type').update({ types: oldTypes }).eq('category_name', activeCategory);

		activeCategory = 'Select Category';
	};

	const removeType = async (targetType) => {
		let oldData = $inventory_category_type;
		let oldTypes = [];

		oldData.forEach((category) => {
			if (category.category_name == activeCategory) {
				category.types.forEach((type, index) => {
					if (type == targetType) {
						category.types.splice(index, 1);
					}
				});
				oldTypes = [...oldTypes, ...category.types];
			}
		});
		let { data, error } = await supabase.from('inventory_category_type').update({ types: oldTypes }).eq('category_name', activeCategory);

		activeCategory = 'Select Category';
	};
</script>

<main class="mt-5" in:fly={{ y: 40, duration: 500 }}>
	<h3>Type Editor</h3>

	<div class="input-group mb-3">
		<button style="min-width: 200px;" class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">{activeCategory}</button>
		<ul class="dropdown-menu dropdown-menu-end">
			<li>
				<button on:click={() => (activeCategory = 'Service Cleaning')} class="dropdown-item btn btn-secondary w-100">Service Cleaning</button>
			</li>
			<li>
				<button on:click={() => (activeCategory = 'Repairs')} class="dropdown-item btn btn-secondary w-100">Repairs</button>
			</li>
			<li>
				<button on:click={() => (activeCategory = 'Installation')} class="dropdown-item btn btn-secondary w-100">Installation</button>
			</li>
		</ul>

		<input bind:value={itemType} type="text" class="form-control" placeholder="Enter new Type" aria-label="Enter new Type" aria-describedby="addType" />
		<button class="btn btn-success" on:click={addType} type="button" id="addType">Add Type</button>
	</div>

	<div class="scroller mt-5 px-3 align-center">
		<div class="row">
			{#if $inventory_category_type}
				{#each $inventory_category_type as item}
					{#if item.category_name == activeCategory}
						{#each item.types.sort() as thisType}
							<div class="col-4 border">
								<div class="row m-3 align-middle">
									<div class="col-10">
										<p class="m-0">{thisType}</p>
									</div>
									<div class="col-2 text-end">
										<button on:click={removeType(thisType)} class="btn btn-danger btn-close" />
									</div>
								</div>
							</div>
						{/each}
					{/if}
				{/each}
			{:else}
				<p>Loading</p>
			{/if}
		</div>
	</div>
</main>

<style>
	.scroller {
		overflow: auto;
		overflow-x: hidden;
		max-height: 50vh;
		min-height: 40vh;
	}
</style>
