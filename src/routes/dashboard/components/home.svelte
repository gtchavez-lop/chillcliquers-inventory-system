<script>
	import { onMount } from 'svelte';
	import { slide, fly } from 'svelte/transition';
	import { supabase } from '../../../_global';

	let user;
	let isDatabaseActive = true;

	let inventoryCount = 0;

	onMount(async (e) => {
		user = await supabase.auth.user();

		let { data, error } = await supabase.from('inventory').select('*', { count: 'exact' });
		if (!error) {
			inventoryCount = data.length;
		}
	});
</script>

{#if user}
	<main class="container p-5" in:fly={{ x: -20, duration: 500 }}>
		<div class="text-end">
			<h3>Hello</h3>
			<h1>{user.email.split('@')[0]}</h1>
			<p class="text-muted">Welcome Back!</p>
		</div>
		<div class="row mt-5">
			<div class="col-8">
				<div class="row">
					<div class="col-12 mb-5">
						<div class="p-2 rounded" style="background: #F9F8F3;">
							<div class="row">
								<div class="col">
									<div class="d-flex flex-column text-end">
										<i class="bi bi-activity" />
										<h2>{isDatabaseActive ? 'Online' : 'Offline'}</h2>
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
										<h2>5</h2>
										<p class="lead text-muted">Accounts registered</p>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="col-6 mb-5">
						<div class="rounded text-start p-2" style="background: #FFEEE2;">
							<i class="bi bi-box" />
							<h2>31</h2>
							<p class="lead text-muted">Items in Inventory</p>
						</div>
					</div>
					<div class="col-6 mb-5">
						<div class="rounded text-start p-2" style="background: #FFEEE2;">
							<i class="bi bi-box" />
							<h2>{inventoryCount}</h2>
							<p class="lead text-muted">Items in Inventory</p>
						</div>
					</div>
					<div class="col-6 mb-5">
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
					</div>
				</div>
			</div>
			<div class="col-4 ">
				<div class="bg-dark text-end text-white p-2 rounded">
					<h3>Summarization</h3>
				</div>
			</div>
		</div>
	</main>
{/if}

<style lang="scss">
	.bi {
		font-size: 2rem;
	}
</style>
