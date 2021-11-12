<script>
	import { onMount } from 'svelte';
	import { slide, fly } from 'svelte/transition';
	import { supabase } from '../../../_global';

	$: isOperational = false;
	let user;
	let inventoryCount = 0;
	let userTable = [];
	let archiveItemCount = 0;

	onMount(async (e) => {
		getInventoryTable();
		getUserTable();

		setTimeout(() => {
			if (userTable.length > 0 && inventoryCount > 0) {
				isOperational = true;
			} else {
				isOperational = false;
			}
		}, 500);
	});

	const getInventoryTable = async (e) => {
		user = await supabase.auth.user();

		let { data, error } = await supabase.from('inventory').select('*', { count: 'exact' });
		if (!error) {
			data.forEach((item) => {
				if (item.isArchived === false) {
					inventoryCount++;
				} else {
					archiveItemCount++;
				}
			});
		}
	};

	const getUserTable = async (e) => {
		let { data, error } = await supabase.from('registered_users').select('*');
		if (!error) {
			userTable = data;
		}
	};
</script>

<embed in:fly={{ x: -40, duration: 500, delay: 100 }} src="./illustration-frosted/SVG/art(1).svg" />
{#if user}
	<main class="container p-5" in:fly={{ x: -20, duration: 500 }}>
		<div class="text-end">
			<h3>Hello</h3>
			<h1>{user.email.split('@')[0]}</h1>
			<p class="text-muted">Welcome Back!</p>
		</div>
		<div class="row mt-5">
			<div class="col-12">
				<div class="row">
					<div class="col-12 mb-5">
						<div class="p-2 rounded" style="background: #F9F8F3;">
							<div class="row">
								<div class="col">
									<div class="d-flex flex-column text-end">
										<i class="bi bi-activity" />
										<h2>{isOperational ? 'Online' : '---'}</h2>
										<p class="lead text-muted">Database Status</p>
									</div>
								</div>
								<div class="col">
									<div class="d-flex flex-column text-end">
										<i class="bi bi-box" />
										<h2>{inventoryCount}</h2>
										<p class="lead text-muted">Items in Inventory</p>
									</div>
								</div>
								<div class="col">
									<div class="d-flex flex-column text-end">
										<i class="bi bi-person" />
										<h2>{userTable.length}</h2>
										<p class="lead text-muted">Accounts registered</p>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="col-6 mb-5" />
					<div class="col-6 mb-5">
						<div class="rounded text-start p-2" style="background: #FFEEE2;">
							<i class="bi bi-archive" />
							<h2>{archiveItemCount}</h2>
							<p class="lead text-muted">Items Archived</p>
						</div>
					</div>
					<!-- <div class="col-6 mb-5">
						<div class="rounded text-start p-2" style="background: #FFEEE2;">
							<i class="bi bi-box" />
							<h2>31</h2>
							<p class="lead text-muted">Items in Inventory</p>
						</div>
					</div>
					<div class="col-6 mb-5">
						<div class="rounded text-start p-2" style="background: #FFEEE2;">
							<i class="bi bi-box" />
							<h2>31</h2>
							<p class="lead text-muted">Items in Inventory</p>
						</div>
					</div> -->
				</div>
			</div>
		</div>
	</main>
{/if}

<style lang="scss">
	.bi {
		font-size: 2rem;
	}
	embed {
		position: fixed;
		right: 50px;
		top: -10px;
		z-index: -1;
		height: 250px;
	}
</style>
