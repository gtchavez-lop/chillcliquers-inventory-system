<script>
	import { onMount, setContext } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { inventory_activeTab, supabase, inventory_selectedItemToEdit } from '../../../../_global';
	import Toastify from 'toastify-js';
	import { get, readable } from 'svelte/store';

	let items = [];
	let loaded = false;
	let selectedItem;

	onMount(async (e) => {
		getData();
	});

	const inventoryItems = readable(null, (set) => {
		supabase
			.from('inventory')
			.select('*')
			.then(({ data, error }) => set(data));

		const thisSubscription = supabase
			.from('inventory')
			.on('*', (payload) => {
				if (payload.eventType === 'INSERT') {
					set([...get(inventoryItems), payload]);
				}
				if (payload.eventType === 'UPDATE') {
					let index = $inventoryItems.findIndex((thisitem) => thisitem.id === payload.new.id);
					let oldData = $inventoryItems;
					oldData[index] = payload.new;
					set(oldData);
					console.log($inventoryItems);
				}
			})
			.subscribe();

		return () => {
			supabase.removeSubscription(thisSubscription);
		};
	});

	const archiveItem = async (e) => {
		let { data, error } = await supabase
			.from('inventory')
			.update({
				isArchived: true
			})
			.eq('item_code', selectedItem);
		if (!error) {
			getData();
			Toastify({
				text: 'Item Archived',
				gravity: 'bottom',
				position: 'right',
				backgroundColor: '#FFC107',
				style: {
					width: '300px',
					color: '#FFFFFF'
				}
			}).showToast();
		}
	};
</script>

<main class="mt-5" in:fly={{ y: 40, duration: 500 }}>
	<h3>Inventory List</h3>
	<div class="scroller mt-5">
		{#if $inventoryItems}
			{#if $inventoryItems.length > 0}
				<table class="text-start table" style="user-select: text;" in:fly|local={{ y: 40, duration: 500, delay: 200 }}>
					<thead style="position: sticky; top: 0; z-index-2" class="bg-light">
						<tr>
							<th scope="col">Item Code</th>
							<th scope="col">Item Name</th>
							<th scope="col">Added By</th>
							<th scope="col">Item stored</th>
							<th scope="col">Item Category</th>
							<th scope="col">Item Type</th>
							<th scope="col" style="z-index-2">Actions</th>
						</tr>
					</thead>
					<tbody style="z-index: -1;">
						{#each $inventoryItems as { item_code, item_name, added_by, item_count, category, item_type, isArchived }, index}
							{#if !isArchived}
								<tr class="align-middle" in:fly={{ y: -20, duration: 200, delay: 50 + index * 20 }}>
									<td>{item_code}</td>
									<td>{item_name}</td>
									<td>{added_by ? added_by.split('@')[0] : ''}</td>
									<td>{item_count}</td>
									<td>{category}</td>
									<td>{item_type}</td>
									<td style="z-index: 1;">
										<div class="btn-group" role="group">
											<button
												data-bs-toggle="tooltip"
												data-bs-placement="left"
												title="Archive Item"
												class="btn btn-outline-warning"
												on:click={(e) => {
													selectedItem = item_code;
													archiveItem();
												}}><i class="bi bi-archive" /></button
											>
											<button data-bs-toggle="tooltip" data-bs-placement="left" title="Edit Item" class="btn btn-outline-primary"
												><i
													class="bi bi-pen"
													on:click={(e) => {
														inventory_selectedItemToEdit.set(item_code);
														inventory_activeTab.set(2);
													}}
												/></button
											>
											<button data-bs-toggle="tooltip" data-bs-placement="left" title="Borrow Item" class="btn btn-outline-primary"><i class="bi bi-arrow-return-right" /></button>
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
		{#if !$inventoryItems}
			<div class="lds-ellipsis" in:fly={{ y: 40, duration: 500 }}>
				<div />
				<div />
				<div />
				<div />
			</div>
		{/if}
	</div>
</main>

<style>
	.scroller {
		overflow-y: scroll;
		height: 65vh;
	}
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
