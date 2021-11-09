<script>
	import { onMount } from 'svelte';

	import { slide, fly } from 'svelte/transition';
	import { supabase, inventory_activeTab } from '../../../_global';

	import TabInventory from './inventory/tab_inventory.svelte';
	import TabAddItem from './inventory/tab_addItem.svelte';
	import TabArchive from './inventory/tab_archive.svelte';

	$: tab = $inventory_activeTab;
</script>

<main class="container p-5 text-end" in:fly={{ x: -20, duration: 500 }}>
	<h1 class="mb-5">Inventory</h1>
	<div class="row">
		<div class="btn-group" role="group" aria-label="Basic radio toggle button group">
			<input type="radio" class="btn-check" name="btnradio" id="btnradio1" autocomplete="off" checked={tab == 1 ? true : false} on:click={() => inventory_activeTab.set(1)} />
			<label class="btn btn-outline-dark" for="btnradio1">Inventory List</label>

			<input type="radio" class="btn-check" name="btnradio" id="btnradio2" autocomplete="off" checked={tab == 2 ? true : false} on:click={() => inventory_activeTab.set(2)} />
			<label class="btn btn-outline-dark" for="btnradio2">Scan Item</label>

			<input type="radio" class="btn-check" name="btnradio" id="btnradio3" autocomplete="off" checked={tab == 3 ? true : false} on:click={() => inventory_activeTab.set(3)} />
			<label class="btn btn-outline-warning" for="btnradio3">Archived Items</label>
		</div>
	</div>

	{#if tab == 1}
		<svelte:component this={TabInventory} />
	{/if}
	{#if tab == 2}
		<svelte:component this={TabAddItem} />
	{/if}
	{#if tab == 3}
		<svelte:component this={TabArchive} />
	{/if}
</main>
