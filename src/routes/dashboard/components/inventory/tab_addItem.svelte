<script>
	import Quagga from 'quagga';
	import { afterUpdate, onMount } from 'svelte';
	import { inventory_selectedItemToEdit, supabase, inventory_itemCategory, inventoryItems, inventory_category_type } from '../../../../_global';
	import { slide, fly, fade } from 'svelte/transition';
	import Toastify from 'toastify-js';
	import { get, readable, writable } from 'svelte/store';

	let scanner;
	$: scannerOpen = false;
	$: isRemoving = false;
	$: actionsDisabled = false;
	$: isArchived = false;
	$: itemCode = '';
	$: itemName = '';
	$: itemCategory = '';
	$: itemType = '';
	$: itemCount = 0;
	$: itemExistingInDatabase = true;
	$: typeSelectorEnabled = false;
	$: selectedCaterory_typeList = [];

	let openScanner = (e) => {
		itemCode = '';
		itemName = '';
		itemCount = 0;
		Quagga.init(
			{
				inputStream: {
					name: 'Live',
					type: 'LiveStream',
					target: scanner,

					constraints: {
						width: 500,
						height: 200
					}
				},
				decoder: {
					readers: ['code_128_reader', 'ean_reader', 'ean_8_reader', 'code_39_reader', 'code_39_vin_reader', 'codabar_reader', 'upc_reader', 'upc_e_reader', 'i2of5_reader', '2of5_reader', 'code_93_reader']
				}
			},
			(error) => {
				if (error) {
					console.log(error);
					scannerOpen = true;
					return;
				}
				scannerOpen = true;
				Quagga.start();
			}
		);
	};

	const closeScanner = (e) => {
		Quagga.stop();
		scannerOpen = false;
	};

	Quagga.onProcessed((result) => {
		const drawingCanvas = Quagga.canvas.dom.overlay;
		drawingCanvas.style.display = 'none';
	});

	Quagga.onDetected((result) => {
		itemCode = result.codeResult.code;

		let thisItem = $inventoryItems.find((item) => item.item_code == itemCode);
		if (thisItem) {
			if (thisItem.isArchived) {
				isArchived = true;
				actionsDisabled = true;
			} else {
				isArchived = false;
				actionsDisabled = false;
			}
			itemName = thisItem.item_name;
			itemCount = thisItem.item_count;
			itemCategory = thisItem.category;
			itemExistingInDatabase = true;
			closeScanner();
		} else {
			itemName = '';
			itemCount = '';
			itemExistingInDatabase = false;
			isArchived = false;
			actionsDisabled = false;
		}
	});

	const manualInput_code = (e) => {
		let thisItem = $inventoryItems.find((item) => item.item_code == itemCode);
		if (itemCode.length < 1) {
			itemExistingInDatabase = false;
			return;
		}

		if (thisItem) {
			isArchived = thisItem.isArchived;
			isArchived ? (actionsDisabled = true) : (actionsDisabled = false);

			itemCode = thisItem.item_code;
			itemName = thisItem.item_name;
			itemCount = thisItem.item_count;
			itemCategory = thisItem.category;
			itemType = thisItem.item_type;

			itemExistingInDatabase = true;
		} else {
			itemName = '';
			itemCategory = '';
			itemType = '';
			itemExistingInDatabase = false;
			isArchived = false;
			actionsDisabled = false;
		}
	};

	const addNewItem = async (e) => {
		if (!itemCode || !itemName || !itemCategory || !itemType) {
			Toastify({
				text: 'Please fill all fields',
				gravity: 'bottom',
				position: 'right',
				style: {
					background: '#F07178',
					width: '300px',
					color: '#000'
				}
			}).showToast();
			return;
		}

		actionsDisabled = true;
		if (itemCount < 1) {
			itemCount = 1;
		}
		let { data: inventory, error } = await supabase.from('inventory').insert({
			item_code: itemCode,
			item_name: itemName,
			item_count: itemCount,
			category: itemCategory,
			item_type: itemType,
			added_by: await supabase.auth.user().email
		});
		if (error) {
			alert(error.message);
			console.log(error);
		} else {
			Toastify({
				text: `${itemName} added`,
				gravity: 'bottom',
				position: 'right',
				style: {
					background: '#15C39A',
					minWidth: '300px',
					color: '#000'
				}
			}).showToast();
			itemCode = '';
			itemName = '';
			itemCount = '';

			if (scannerOpen) {
				closeScanner();
			}
			actionsDisabled = false;
		}
	};

	const addOneItem = async (e) => {
		actionsDisabled = true;
		let { data, error } = await supabase
			.from('inventory')
			.update({
				item_count: itemCount + 1
			})
			.eq('item_code', itemCode)
			.eq('isArchived', 'false');
		if (error) {
			console.log(error);
		} else {
			itemCode = '';
			itemName = '';
			itemCount = 0;
			Toastify({
				text: 'Item Updated',
				gravity: 'bottom',
				position: 'right',
				style: {
					background: '#15C39A',
					width: '300px',
					color: '#000'
				}
			}).showToast();

			if (scannerOpen) {
				closeScanner();
			}
			actionsDisabled = false;
		}
	};

	const updateOneItem = async (e) => {
		if (!itemCode || !itemName) {
			alert('Please fill out all fields');
			return;
		} else {
			actionsDisabled = true;
			let { data, error } = await supabase
				.from('inventory')
				.update({
					item_count: itemCount,
					item_name: itemName,
					category: itemCategory,
					item_type: itemType
				})
				.eq('item_code', itemCode)
				.eq('isArchived', 'false');
			if (error) {
				console.log(error);
			} else {
				itemCode = '';
				itemName = '';
				itemCount = '';
				itemCategory = '';
				itemType = '';
				actionsDisabled = false;
				if (scannerOpen) {
					closeScanner();
				}
				Toastify({
					text: 'Item Updated',
					gravity: 'bottom',
					position: 'right',
					style: {
						backgroundColor: '#15C39A',
						width: '300px',
						color: '#000'
					}
				}).showToast();
			}
		}
	};

	const archiveItem = async (e) => {
		actionsDisabled = true;
		let { data, error } = await supabase
			.from('inventory')
			.update({
				isArchived: true
			})
			.eq('item_code', itemCode);

		if (error) {
			console.log(error);
			return;
		}

		itemCode = '';
		itemName = '';
		itemCount = 0;
		itemCategory = '';
		Toastify({
			text: 'Item Archived',
			gravity: 'bottom',
			position: 'right',
			style: {
				backgroundColor: '#FFC107',
				width: '300px',
				color: '#FFFFFF'
			}
		}).showToast();
		if (scannerOpen) {
			closeScanner();
		}
		actionsDisabled = false;
		isRemoving = false;
	};

	onMount((e) => {
		$inventoryItems.forEach((element) => {
			if (element.item_code == $inventory_selectedItemToEdit) {
				itemCode = element.item_code;
				itemName = element.item_name;
				itemCategory = element.category;
				itemType = element.item_type;
				itemCount = element.item_count;
			}
		});

		inventory_selectedItemToEdit.set('');
	});
</script>

<main class="mt-5" in:fly={{ y: 40, duration: 500 }}>
	<h3>Scan Item</h3>

	<div class="row mt-5">
		<div class="col-12 col-md-6 ">
			<div bind:this={scanner} style="border-radius: 20px;" />
		</div>
		<div class="col-12 col-md-6">
			<div class="d-flex flex-column mb-4">
				{#if !scannerOpen}
					<button on:click={openScanner} type="button" class="btn btn-outline-dark ">Open Scanner</button>
				{/if}
				{#if scannerOpen}
					<button on:click={closeScanner} type="button" class="btn btn-outline-danger ">Close Scanner</button>
				{/if}
			</div>
			<div class="input-group mb-3">
				<span class="input-group-text">Item Code</span>
				<input bind:value={itemCode} on:input={manualInput_code} type="text" class="form-control text-end" aria-label="Item Name" />
			</div>

			{#if itemCode == ''}
				<div transition:slide|local={{ duration: 500 }}>
					<p class="lead">Type or scan the code</p>
				</div>
			{/if}
			{#if isArchived}
				<div transition:slide|local={{ duration: 500 }}>
					<p class="lead text-danger fw-bold m-0">This Item is archived. Restore to update</p>
				</div>
			{/if}

			{#if itemCode != '' && !isArchived}
				<div transition:slide|local={{ duration: 500 }}>
					<div class="input-group mb-3">
						<span class="input-group-text">Item Name</span>
						<input bind:value={itemName} type="text" class="form-control text-end" aria-label="Item Code" />
					</div>
					<div class="input-group mb-3">
						<span class="input-group-text">Item/s in inventory</span>
						<input bind:value={itemCount} min="0" type="number" class="form-control text-end" aria-label="Item Count" />
					</div>
					<div class="input-group mb-3">
						<input type="text" class="form-control" readonly bind:value={itemCategory} aria-label="Text input with dropdown button" />
						<button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Select Category</button>
						<ul class="dropdown-menu dropdown-menu-end">
							{#each $inventory_category_type as category}
								<li class="dropdown-item" on:click={() => (itemCategory = category.category_name)}>{category.category_name}</li>
							{/each}
						</ul>
					</div>
					<div class="input-group dropup dropstart">
						<input type="text" class="form-control" readonly bind:value={itemType} aria-label="Text input with dropdown button" />
						<button
							class="btn btn-outline-secondary dropdown-toggle dropup"
							type="button"
							on:click={(e) => {
								typeSelectorEnabled = !typeSelectorEnabled;
							}}>Select Type</button
						>
					</div>

					{#if typeSelectorEnabled}
						<div class="selector row px-3" transition:slide={{ duration: 500 }}>
							{#each $inventory_category_type as type}
								{#if type.category_name == itemCategory}
									{#each type.types as thisType}
										<span
											class="btn btn-outline-secondary col-6 rounded-none"
											on:click={() => {
												itemType = thisType;
												typeSelectorEnabled = false;
											}}>{thisType}</span
										>
									{/each}
								{/if}
							{/each}
						</div>
					{/if}
				</div>
			{/if}

			{#if !actionsDisabled}
				<div class="d-flex flex-column mt-5" transition:slide|local={{ duration: 500 }}>
					{#if itemCode != ''}
						<div class="btn-group" role="group" aria-label="Basic example">
							<button type="button" on:click={addNewItem} disabled={itemExistingInDatabase ? true : false} class="btn {itemExistingInDatabase ? 'btn-outline' : 'btn-success'} ">Add New</button>
							<button disabled={itemExistingInDatabase ? false : true} on:click={addOneItem} type="button" class="btn btn-outline-dark"> Add One </button>
							<button disabled={itemExistingInDatabase ? false : true} on:click={updateOneItem} type="button" class="btn btn-outline-dark"> Update Item </button>
						</div>
						<div class="btn-group mt-5" role="group">
							{#if !isRemoving}
								<button
									type="button"
									on:click={() => {
										isRemoving = true;
									}}
									disabled={itemExistingInDatabase && itemCode ? false : true}
									class="btn btn-outline-danger"
								>
									Archive Item
								</button>
							{:else}
								<button type="button" on:click={archiveItem} class="btn btn-outline-danger">Confirm Archival</button>
								<button
									type="button"
									on:click={() => {
										isRemoving = false;
									}}
									class="btn btn-outline-primary">Revert Changes</button
								>
							{/if}
						</div>
					{/if}
				</div>
			{/if}
		</div>
	</div>
</main>

<style>
	main {
		overflow: hidden;
		overflow-y: auto;
		max-height: 60vh;
	}
</style>
