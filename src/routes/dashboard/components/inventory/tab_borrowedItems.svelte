<script>
	import dayjs from 'dayjs';

	import { onMount } from 'svelte';
	import { now } from 'svelte/internal';
	import { fly, slide } from 'svelte/transition';
	import Toastify from 'toastify-js';
	import { inventoryItems, inventory_selectedItemToEdit, inventory_pendingBorrowList, active_user, supabase } from '../../../../_global';

	let itemCode = '';
	let itemPendingBorrowCount = 1;
	let itemSelected = {};
	let thisUser = active_user;
	let isBorowing = false;

	onMount(async (e) => {
		if (!$inventory_selectedItemToEdit) return;

		itemCode = $inventory_selectedItemToEdit;
		findCode();
		inventory_selectedItemToEdit.set('');
		itemPendingForBorrow = $inventory_pendingBorrowList;
		oldData = [];
	});

	const findCode = (e) => {
		let selected = $inventoryItems.find((item) => item.item_code == itemCode);
		if (selected && !selected.isArchived) {
			itemSelected = selected;
		} else {
			itemSelected = {};
		}
	};

	const addToPendingBorrow = (e) => {
		if (itemSelected.item_code) {
			if (itemSelected.item_count - itemSelected.item_borrowCount >= itemPendingBorrowCount) {
				let oldData = $inventoryItems;
				let newData = $inventory_pendingBorrowList;
				itemSelected = oldData.find((item) => item.item_code == itemCode);

				let newDataIndex = newData.findIndex((item) => item.item_code == itemSelected.item_code);

				if (newDataIndex > -1) {
					newData[newDataIndex].item_borrowCount = itemPendingBorrowCount;
				} else {
					newData.push({ ...itemSelected, item_borrowCount: itemPendingBorrowCount });
				}
				console.log(newData);
				inventory_pendingBorrowList.set(newData);

				itemCode = '';
				itemPendingBorrowCount = 1;
				itemSelected = {};
			} else {
				Toastify({
					text: 'You should not borrow this item in more than what was stored',
					gravity: 'bottom',
					position: 'right',
					duration: 3000,
					style: {
						background: '#FFC107',
						width: '300px',
						color: '#FFFFFF'
					}
				}).showToast();
			}
		}
	};

	const removeFromPendingBorrow = (code) => {
		let newData = $inventory_pendingBorrowList;
		let newDataIndex = newData.findIndex((item) => item.item_code == code);

		if (newDataIndex > -1) {
			newData.splice(newDataIndex, 1);
		}
		inventory_pendingBorrowList.set(newData);
	};

	const clearList = (e) => {
		inventory_pendingBorrowList.set([]);
	};

	const borrowItem = async (e) => {
		if ($inventory_pendingBorrowList.length > 0) {
			let { data, error } = await supabase.from('borrowed_items').insert([
				{
					borrower: thisUser.email,
					items: JSON.stringify($inventory_pendingBorrowList)
				}
			]);

			if (!error) {
				Toastify({
					text: 'Transaction added to Database',
					gravity: 'bottom',
					position: 'right',
					duration: 3000,
					style: {
						background: '#C3DB61',
						width: '300px',
						color: '#FFFFFF'
					}
				}).showToast();
			} else {
				Toastify({
					text: `Something went wrong. ${error.message}`,
					gravity: 'bottom',
					position: 'right',
					duration: 3000,
					style: {
						background: '#D54921',
						width: '300px',
						color: '#FFFFFF'
					}
				}).showToast();
			}

			inventory_pendingBorrowList.set([]);
		}
	};
</script>

<main class="mt-5" in:fly={{ y: 40, duration: 500 }}>
	<h3>Borrow Item</h3>

	<div class="scroller mt-5">
		<div class="row ">
			<div class="col-12">
				<div class="input-group mb-2">
					<span class="input-group-text" id="basic-addon1">Item Code</span>
					<input bind:value={itemCode} on:input={findCode} type="text" class="form-control text-end" placeholder="Type the item code here" aria-label="Type the item code here" aria-describedby="basic-addon1" />
				</div>
				<div class="input-group mb-5">
					<span class="input-group-text" id="basic-addon1">Borrow Count</span>
					<input bind:value={itemPendingBorrowCount} type="number" min="1" class="form-control text-end" placeholder="Type the item code here" aria-label="Type the item code here" aria-describedby="basic-addon1" />
				</div>
				{#if itemSelected.hasOwnProperty('item_code')}
					<div transition:slide|local={{ duration: 500 }} class="row">
						<div class="col-6">
							<div class="input-group mb-3">
								<span class="input-group-text bg-white">Item Name</span>
								<input bind:value={itemSelected.item_name} readonly type="text" class="form-control text-end " placeholder="Type the item code here" />
							</div>
							<div class="input-group mb-3">
								<span class="input-group-text bg-white">Added by</span>
								<input bind:value={itemSelected.added_by} readonly type="text" class="form-control text-end " placeholder="Type the item code here" />
							</div>
							<div class="input-group mb-3">
								<span class="input-group-text bg-white">Item Category</span>
								<input bind:value={itemSelected.category} readonly type="text" class="form-control text-end " placeholder="Type the item code here" />
							</div>
						</div>
						<div class="col-6">
							<div class="input-group mb-3">
								<span class="input-group-text bg-white">Item Type</span>
								<input bind:value={itemSelected.item_type} readonly type="text" class="form-control text-end " placeholder="Type the item code here" />
							</div>
							<div class="input-group mb-3">
								<span class="input-group-text bg-white">Count in Inventory</span>
								<input bind:value={itemSelected.item_count} readonly type="text" class="form-control text-end " placeholder="Type the item code here" />
							</div>

							<button class="btn btn-outline-success w-100" on:click={addToPendingBorrow}>Add to List</button>
						</div>
					</div>
				{/if}
			</div>
		</div>
		<table class="table mb-5 ">
			<thead>
				<tr>
					<th scope="col">Item Code</th>
					<th scope="col">Item Name</th>
					<th scope="col">Item Category | Item Type</th>
					<th scope="col">Borrow Count</th>
					<th scope="col" /></tr
				>
			</thead>
			<tbody>
				{#if $inventory_pendingBorrowList.length > 0}
					{#each $inventory_pendingBorrowList as item}
						<tr class="align-middle">
							<td>{item.item_code}</td>
							<td>{item.item_name}</td>
							<td>{item.category} | {item.item_type}</td>
							<td>{item.item_borrowCount}</td>
							<td>
								<button class="btn btn-outline-danger" on:click={removeFromPendingBorrow(item.item_code)}>Remove</button>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
		<div class="row">
			<div class="col">
				<p class="lead text-start">Borrow Date: <span class="fw-bold">{dayjs(Date.now()).format('MMMM D, YYYY - hh:mm:ssa')}</span></p>
			</div>
			<div class="col">
				<p class="lead text-end">Borrower: <span class="fw-bold">{thisUser.email.split('@')[0]}</span></p>
			</div>
		</div>

		<div class="row mt-5">
			<div class="col-12">
				{#if $inventory_pendingBorrowList.length > 0}
					<div class="btn-group w-100" role="group">
						<button class="btn btn-outline-dark" on:click={clearList}>Clear List</button>
						<button class="btn btn-warning" on:click={borrowItem}>Borrow Item</button>
					</div>
				{:else}
					<p class="text-center">Please add something to borrow</p>
				{/if}
			</div>
		</div>
	</div>
</main>

<style>
	.scroller {
		overflow: auto;
		overflow-x: hidden;
		max-height: 60vh;
	}
</style>
