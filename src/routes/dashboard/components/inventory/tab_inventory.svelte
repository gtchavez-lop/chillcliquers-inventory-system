<script>
	import { onMount, setContext } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { inventory_activeTab, supabase, inventory_selectedItemToEdit } from '../../../../_global';

	let items = [];
	let loaded = false;
	let selectedItem;

	onMount(async (e) => {
		getData();
	});

	const getData = async () => {
		loaded = false;
		let { data: inventory, error } = await supabase.from('inventory').select('*').eq('isArchived', 'false').order('item_name', { ascending: true });
		if (!error) {
			items = [...inventory];
			loaded = true;
		}
	};

	const archiveItem = async (e) => {
		let { data, error } = await supabase
			.from('inventory')
			.update({
				isArchived: true
			})
			.eq('item_code', selectedItem);
		if (!error) {
			getData();
		}
	};
</script>

<main class="mt-5" in:fly={{ y: 40, duration: 500 }}>
	<h3>Inventory List</h3>
	{#if loaded}
		{#if items.length > 0}
			<table class="mt-5 text-start table" style="user-select: text;" in:fly|local={{ y: 40, duration: 500, delay: 200 }}>
				<thead>
					<tr>
						<th scope="col">Item Code</th>
						<th scope="col">Item Name</th>
						<th scope="col">Added By</th>
						<th scope="col">Item stored</th>
						<th scope="col">Item Category</th>
						<th scope="col">Item Type</th>
						<th scope="col" />
					</tr>
				</thead>
				<tbody>
					{#each items as item, index}
						{#if !item.isArchived}
							<tr class="align-middle" in:fly={{ y: 20, duration: 500, delay: 100 + index * 50 }}>
								<td>{item.item_code}</td>
								<td>{item.item_name}</td>
								<td>{item.added_by.split('@')[0]}</td>
								<td>{item.item_count}</td>
								<td>{item.category}</td>
								<td>{item.item_type}</td>
								<td>
									<div class="btn-group" role="group">
										<button
											class="btn btn-outline-warning"
											on:click={(e) => {
												selectedItem = item.item_code;
												archiveItem();
											}}><i class="bi bi-archive" /></button
										>
										<button class="btn btn-outline-primary"
											><i
												class="bi bi-pen"
												on:click={(e) => {
													inventory_selectedItemToEdit.set(item.item_code);
													inventory_activeTab.set(2);
												}}
											/></button
										>
									</div>
								</td>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
		{:else}
			<div in:fly|local={{ y: 40, duration: 500, delay: 200 }}>
				<p class="lead mt-5">Seems like its empty</p>
			</div>
		{/if}
	{/if}
	{#if !loaded}
		<div class="lds-ellipsis" in:fly={{ y: 40, duration: 500 }}>
			<div />
			<div />
			<div />
			<div />
		</div>
	{/if}
</main>

<style>
	.lds-ellipsis {
		display: inline-block;
		position: relative;
		width: 80px;
		height: 80px;
	}
	.lds-ellipsis div {
		position: absolute;
		top: 33px;
		width: 13px;
		height: 13px;
		border-radius: 50%;
		background: black;
		animation-timing-function: cubic-bezier(0, 1, 1, 0);
	}
	.lds-ellipsis div:nth-child(1) {
		left: 8px;
		animation: lds-ellipsis1 400ms infinite;
	}
	.lds-ellipsis div:nth-child(2) {
		left: 8px;
		animation: lds-ellipsis2 400ms infinite;
	}
	.lds-ellipsis div:nth-child(3) {
		left: 32px;
		animation: lds-ellipsis2 400ms infinite;
	}
	.lds-ellipsis div:nth-child(4) {
		left: 56px;
		animation: lds-ellipsis3 400ms infinite;
	}
	@keyframes lds-ellipsis1 {
		0% {
			transform: scale(0);
		}
		100% {
			transform: scale(1);
		}
	}
	@keyframes lds-ellipsis3 {
		0% {
			transform: scale(1);
		}
		100% {
			transform: scale(0);
		}
	}
	@keyframes lds-ellipsis2 {
		0% {
			transform: translate(0, 0);
		}
		100% {
			transform: translate(24px, 0);
		}
	}
</style>
