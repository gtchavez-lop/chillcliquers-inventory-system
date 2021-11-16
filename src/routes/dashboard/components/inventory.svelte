<script>
	import { onMount } from 'svelte';

	import { slide, fly } from 'svelte/transition';
	import { supabase, inventory_activeTab } from '../../../_global';
	import Toastify from 'toastify-js';

	import TabInventory from './inventory/tab_inventory.svelte';
	import TabAddItem from './inventory/tab_addItem.svelte';
	import TabArchive from './inventory/tab_archive.svelte';
	import TabBorrowItem from './inventory/tab_borrowedItems.svelte';

	$: tab = $inventory_activeTab;
</script>

<embed in:fly={{ x: -40, duration: 500, delay: 100 }} src="./illustration-frosted/SVG/art(17).svg" />
<main class="container p-5 text-end" in:fly={{ x: -20, duration: 500 }}>
	<h1 class="mb-5">Inventory</h1>
	<div class="row row-cols-12">
		<div class="col-4" />
		<div class="col-12">
			<div class="btn-group w-100" role="group" aria-label="Basic radio toggle button group">
				<input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off" checked={tab == 1 ? true : false} on:click={() => inventory_activeTab.set(1)} />
				<label class="btn btn-outline-dark" for="btnradio1">Inventory List</label>

				<input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off" checked={tab == 2 ? true : false} on:click={() => inventory_activeTab.set(2)} />
				<label class="btn btn-outline-dark" for="btnradio2">Scan Item</label>

				<input type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off" checked={tab == 3 ? true : false} on:click={() => inventory_activeTab.set(3)} />
				<label class="btn btn-outline-dark" for="btnradio3">Borrow Items</label>

				<input type="radio" class="btn-check" name="btnradio" id="btnradio4" autocomplete="off" checked={tab == 4 ? true : false} on:click={() => inventory_activeTab.set(4)} />
				<label class="btn btn-outline-warning" for="btnradio4">Archived Items</label>
			</div>
		</div>
	</div>

	{#if tab == 1}
		<svelte:component this={TabInventory} />
	{/if}
	{#if tab == 2}
		<svelte:component this={TabAddItem} />
	{/if}
	{#if tab == 3}
		<svelte:component this={TabBorrowItem} />
	{/if}
	{#if tab == 4}
		<svelte:component this={TabArchive} />
	{/if}
</main>

<style>
	embed {
		position: fixed;
		right: 50px;
		top: -10px;
		z-index: -1;
		height: 250px;
	}
</style>
