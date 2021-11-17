<script>
	import { onMount } from 'svelte';

	import { fly } from 'svelte/transition';
	import { supabase } from '../../../_global';
	import Toastify from 'toastify-js';

	let supplier_list = [];
	let loaded = false;
	let supplier_name = '';
	let supplier_description = '';

	const getData = async (e) => {
		loaded = false;
		let { data, error } = await supabase.from('supplier_list').select('*');

		if (error) {
			console.log(error);
		} else {
			supplier_list = data;
			loaded = true;
		}
	};
	onMount(async (e) => {
		getData();
	});

	const addItem = async (e) => {
		if (supplier_name.length > 0 && supplier_description.length > 0) {
			loaded = false;
			let { data, error } = await supabase.from('supplier_list').insert([
				{
					supplier_name: supplier_name,
					supplier_description: supplier_description
				}
			]);

			if (error) {
				loaded = true;
			} else {
				console.log(data);
				supplier_list.push({
					supplier_name: supplier_name,
					supplier_description: supplier_description
				});

				Toastify({
					text: 'Supplier Added',
					gravity: 'bottom',
					position: 'right',
					style: {
						background: '#15C39A',
						width: '300px',
						color: '#000'
					}
				}).showToast();
				loaded = true;
				supplier_name = '';
				supplier_description = '';
			}
		} else {
			Toastify({
				text: 'Please fill all input fields',
				gravity: 'bottom',
				position: 'right',
				style: {
					background: '#F0675C',
					width: '300px',
					color: '#000'
				}
			}).showToast();
		}
	};

	const removeSupplier = async (targetID) => {
		loaded = false;
		let { data, error } = await supabase.from('supplier_list').delete().eq('id', targetID);

		if (error) {
			loaded = true;
		} else {
			Toastify({
				text: 'Supplier Removed',
				gravity: 'bottom',
				position: 'right',
				style: {
					background: '#F0675C',
					width: '300px',
					color: '#000'
				}
			}).showToast();
			supplier_list = supplier_list.filter((item) => item.id !== targetID);
			loaded = true;
		}
	};
</script>

<embed in:fly={{ x: -40, duration: 500, delay: 100 }} src="./illustration-frosted/SVG/art(12).svg" />
<main class="container p-5 text-end" in:fly={{ x: -20, duration: 500 }}>
	<h1 class="mb-5">Supplier List</h1>

	{#if loaded}
		<div class="input-group mb-3 w-100" in:fly|local={{ y: 20, duration: 500 }}>
			<input bind:value={supplier_name} type="text" class="form-control" placeholder="Supplier Name" aria-label="Supplier Name" aria-describedby="AddItem" />
			<input bind:value={supplier_description} type="text" class="form-control" placeholder="Supplier Description" aria-label="Supplier Description" aria-describedby="AddItem" />
			<button on:click={addItem} style="min-width: 150px;" class="btn btn-success" type="button" id="AddItem">Add Item</button>
		</div>
		<div class="scroller" in:fly|local={{ y: 20, duration: 500, delay: 200 }}>
			{#if supplier_list.length > 0}
				<table class="table table-hover">
					<thead>
						<tr>
							<th scope="col">Supplier Name</th>
							<th scope="col">Description</th>
							<th scope="col">Actions</th>
						</tr>
					</thead>
					<tbody>
						{#each supplier_list as supplier}
							<tr class="align-middle">
								<td>{supplier.supplier_name}</td>
								<td>{supplier.supplier_description}</td>
								<td>
									<div class="btn-group" role="group">
										<button on:click={removeSupplier(supplier.id)} class="btn btn-danger">Remove Item</button>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{:else}
				<p class="display-6">Seems like its empty</p>
			{/if}
		</div>
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

	.scroller {
		overflow: auto;
		overflow-x: hidden;
		max-height: 50vh;
		min-height: 40vh;
	}
</style>
