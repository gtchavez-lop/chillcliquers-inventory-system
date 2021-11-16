<script>
	import { onMount, setContext } from 'svelte';
	import { fly, fade } from 'svelte/transition';
	import { inventory_activeTab, supabase, inventory_selectedItemToEdit, inventoryItems } from '../../../../_global';
	import Toastify from 'toastify-js';
	import { byString, byNumber, byValue } from 'sort-es';

	let selectedItem;
	let searchInput = '';
	let searchMode = false;
	let searchedItems = [];
	let sorted = [];

	let sortBy = 'Name';
	let sortOrder = 'asc';

	const archiveItem = async (e) => {
		let { data, error } = await supabase
			.from('inventory')
			.update({
				isArchived: true
			})
			.eq('item_code', selectedItem);
		if (error) return;

		Toastify({
			text: 'Item Archived',
			gravity: 'bottom',
			position: 'right',
			style: {
				background: '#FFC107',
				width: '300px',
				color: '#FFFFFF'
			}
		}).showToast();
		searchedItems = [];
		$inventoryItems.forEach((item) => {
			if (
				item.item_code.toLowerCase().includes(searchInput) ||
				item.item_code.includes(searchInput) ||
				item.item_name.toLowerCase().includes(searchInput) ||
				item.item_name.includes(searchInput) ||
				item.added_by.toLowerCase().includes(searchInput) ||
				item.added_by.includes(searchInput) ||
				item.category.toLowerCase().includes(searchInput) ||
				item.category.includes(searchInput) ||
				item.item_type.toLowerCase().includes(searchInput) ||
				item.item_type.includes(searchInput)
			) {
				searchedItems = [...searchedItems, item];
			}
		});
	};

	const searchItem = async (e) => {
		if (searchInput) {
			searchMode = true;
			searchedItems = [];
			$inventoryItems.forEach((item) => {
				if (
					item.item_code.toLowerCase().includes(searchInput) ||
					item.item_code.includes(searchInput) ||
					item.item_name.toLowerCase().includes(searchInput) ||
					item.item_name.includes(searchInput) ||
					item.added_by.toLowerCase().includes(searchInput) ||
					item.added_by.includes(searchInput) ||
					item.category.toLowerCase().includes(searchInput) ||
					item.category.includes(searchInput) ||
					item.item_type.toLowerCase().includes(searchInput) ||
					item.item_type.includes(searchInput)
				) {
					searchedItems = [...searchedItems, item];
				}
			});
		} else {
			searchedItems = $inventoryItems;
		}
	};

	onMount(async (e) => {
		if ($inventoryItems) {
			loaded = true;
		} else return;
	});
</script>

<main class="mt-5" in:fly={{ y: 40, duration: 500 }}>
	<h3>Inventory List</h3>

	<div class="input-group mt-5 w-75">
		<span class="input-group-text" id="inputGroup-sizing-sm">Search</span>
		<input
			on:keypress={(e) => {
				if (e.key === 'Enter') {
					searchItem();
				}
			}}
			bind:value={searchInput}
			on:input={searchItem}
			type="text"
			class="form-control"
			placeholder="By code, name, category, type, or added by"
			aria-label="Recipient's username"
			aria-describedby="button-addon2"
		/>
		<!-- <button class="btn btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown" type="button" id="button-addon2">{sortBy}</button>
		<ul class="dropdown-menu dropdown-menu-end">
			<li><button class="btn w-100 text-end" on:click={() => (sortBy = 'Code')}>Code</button></li>
			<li><button class="btn w-100 text-end" on:click={() => (sortBy = 'Name')}>Name</button></li>
			<li><button class="btn w-100 text-end" on:click={() => (sortBy = 'Added By')}>Added By</button></li>
			<li><button class="btn w-100 text-end" on:click={() => (sortBy = 'Category')}>Item Category</button></li>
			<li><button class="btn w-100 text-end" on:click={() => (sortBy = 'Type')}>Item Type</button></li>
		</ul> -->
		<!-- <button class="btn btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown" type="button" id="button-addon2">
			{#if sortOrder === 'asc'}
				Ascending
			{/if}
			{#if sortOrder === 'dsc'}
				Descending
			{/if}
		</button>
		<ul class="dropdown-menu dropdown-menu-end">
			<li><button class="btn w-100 text-end" on:click={() => (sortOrder = 'asc')}>Ascending</button></li>
			<li><button class="btn w-100 text-end" on:click={() => (sortOrder = 'dsc')}>Descending</button></li>
		</ul> -->
	</div>
	<div class="scroller mt-3">
		{#if searchMode}
			{#if searchedItems}
				{#if searchedItems.length > 0}
					<table class="text-start table" style="user-select: text;" in:fly|local={{ y: 40, duration: 500, delay: 200 }}>
						<thead style="position: sticky; top: 0; z-index: 2;" class="bg-light">
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
							{#each searchedItems as { item_code, item_name, added_by, item_count, category, item_type, isArchived, item_borrowCount }, index}
								<tr class="align-middle" in:fly={{ y: -20, duration: 200, delay: 50 + index * 20 }}>
									<td>{item_code}</td>
									<td>{item_name}</td>
									<td>{added_by ? added_by.split('@')[0] : ''}</td>
									<td>{item_count - item_borrowCount}</td>
									<td>{category}</td>
									<td>{item_type}</td>

									{#if !isArchived}
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
												<button
													on:click={(e) => {
														inventory_selectedItemToEdit.set(item_code);
														inventory_activeTab.set(2);
													}}
													data-bs-toggle="tooltip"
													data-bs-placement="left"
													title="Edit Item"
													class="btn btn-outline-primary"><i class="bi bi-pen" /></button
												>
												<button
													on:click={(e) => {
														inventory_selectedItemToEdit.set(item_code);
														inventory_activeTab.set(3);
													}}
													data-bs-toggle="tooltip"
													data-bs-placement="left"
													title="Borrow Item"
													class="btn btn-outline-primary"><i class="bi bi-arrow-return-right" /></button
												>
											</div>
										</td>
									{:else}
										<td><span class="text-danger">Please Restore this Item to edit</span></td>
									{/if}
								</tr>
							{/each}
						</tbody>
					</table>
				{:else}
					<div in:fly|local={{ y: 40, duration: 500, delay: 200 }}>
						<p class="lead mt-5">Seems like its empty</p>
					</div>
				{/if}
			{/if}
		{:else}
			{#if $inventoryItems}
				{#if $inventoryItems.length > 0}
					<table class="text-start table" style="user-select: text;" in:fly|local={{ y: 40, duration: 500, delay: 200 }}>
						<thead style="position: sticky; top: 0; z-index-2" class="bg-light text-start">
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
							{#each $inventoryItems as { item_code, item_name, added_by, item_count, category, item_type, isArchived, item_borrowCount }, index}
								{#if !isArchived}
									<tr class="align-middle" in:fly={{ y: -20, duration: 200, delay: 50 + index * 20 }}>
										<td>{item_code}</td>
										<td>{item_name}</td>
										<td>{added_by ? added_by.split('@')[0] : ''}</td>
										<td>{item_count - item_borrowCount}</td>
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
												<button
													on:click={(e) => {
														inventory_selectedItemToEdit.set(item_code);
														inventory_activeTab.set(2);
													}}
													data-bs-toggle="tooltip"
													data-bs-placement="left"
													title="Edit Item"
													class="btn btn-outline-primary"><i class="bi bi-pen" /></button
												>
												<button
													on:click={(e) => {
														inventory_selectedItemToEdit.set(item_code);
														inventory_activeTab.set(3);
													}}
													data-bs-toggle="tooltip"
													data-bs-placement="left"
													title="Borrow Item"
													class="btn btn-outline-primary"><i class="bi bi-arrow-return-right" /></button
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
			{#if !$inventoryItems}
				<div class="lds-ellipsis" in:fly={{ y: 40, duration: 500 }}>
					<div />
					<div />
					<div />
					<div />
				</div>
			{/if}
		{/if}
	</div>
</main>

<style>
	.scroller {
		overflow: auto;
		max-height: 50vh;
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
