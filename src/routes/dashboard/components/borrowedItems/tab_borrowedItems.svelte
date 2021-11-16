<script>
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { supabase } from '../../../../_global';
	import dayjs from 'dayjs';

	let borrowedItemsList = [];
	let loaded = false;
	let selectedTransactionItemList = [];

	const getData = async (e) => {
		loaded = false;
		let { data, error } = await supabase.from('borrowed_items').select('*');

		if (error) {
			console.log(error);
		} else {
			borrowedItemsList = data;
			setTimeout(() => {
				loaded = true;
			}, 200);
		}
	};
	onMount(async (e) => {
		getData();
	});

	const getItems = ({ itemlist, transactionID }) => {
		selectedTransactionItemList = JSON.parse(itemlist);
		console.log(selectedTransactionItemList);
	};

	const returnItem = async ({ transactionID }) => {
		const { data, error } = await supabase
			.from('borrowed_items')
			.update({ returned: dayjs(new Date()), isReturned: true })
			.match({ id: transactionID });
		if (!error) {
			getData();
		}
	};
</script>

<div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasExample" aria-labelledby="ItemList">
	<div class="offcanvas-header">
		<button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" />
		<h5 class="offcanvas-title" id="ItemList">Items in this query</h5>
	</div>
	<div class="offcanvas-body mt-5">
		<table class="table align-middle">
			<thead>
				<tr>
					<th scope="col">Item Code</th>
					<th scope="col">Item Name</th>
				</tr>
			</thead>
			<tbody>
				{#if selectedTransactionItemList.length > 0}
					{#each selectedTransactionItemList as itemlist}
						<tr>
							<td>{itemlist.item_code}</td>
							<td>{itemlist.item_name} - x{itemlist.item_borrowCount}</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div>

{#if loaded}
	<div class="scroller mt-5" in:fly={{ y: -20, duration: 500, delay: 200 }}>
		<table class="table align-middle">
			<thead style="position: sticky; top: 0; z-index: 2;">
				<tr>
					<th scope="col">Status</th>
					<th scope="col">TransactionID</th>
					<th scope="col">Borrower</th>
					<th scope="col">Borrowed at</th>
					<th scope="col">Returned at</th>
					<th scope="col" />
				</tr>
			</thead>
			<tbody>
				{#each borrowedItemsList as item}
					<tr>
						<td>
							{#if item.isReturned}
								<span class="text-success">Returned</span>
							{:else}
								<span class="text-danger">Unreturned</span>
							{/if}
						</td>
						<td class="text-truncate" style="max-width: 100px;">
							{item.id}
						</td>
						<td>
							{item.borrower.split('@')[0]}
						</td>
						<td>
							{dayjs(item.created_at).format('MMMM DD, YYYY @HH:MM:ss A')}
						</td>
						<td>
							{item.returned ? dayjs(item.returned).format('MMMM DD, YYYY @HH:MM:ss A') : 'Unmarked'}
						</td>
						<td>
							<div class="btn-group" role="group">
								<button
									on:click={getItems({ transactionID: item.id, itemlist: item.items })}
									class="btn btn-outline-dark"
									type="button"
									data-bs-toggle="offcanvas"
									data-bs-target="#offcanvasExample"
									aria-controls="offcanvasExample">Show Items</button
								>
								{#if !item.isReturned}
									<button on:click={returnItem({ transactionID: item.id })} class="btn btn-outline-dark" type="button">Return</button>
								{/if}
							</div>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else}
	<div class="spinner-border m-5" role="status">
		<span class="visually-hidden">Loading...</span>
	</div>
{/if}

<style>
	.scroller {
		overflow: auto;
		max-height: 50vh;
	}
</style>
