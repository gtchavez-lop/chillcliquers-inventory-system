<script>
	import { supabase } from '../_global';
	import { slide } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let email = '';
	let password = '';
	let isLoading = false;
	let isError = false;
	let errorMessage = '';
	let isProceeding = false;

	onMount(async (e) => {
		let user = await supabase.auth.user();

		if (user) {
			isProceeding = true;
			setTimeout(() => {
				goto('/dashboard');
			}, 2000);
		} else {
			isProceeding = false;
		}
	});

	const logInWithEmailPassword = async (e) => {
		if (email != '' && password != '') {
			isLoading = true;
			isError = false;
			let { data, error } = await supabase.auth.signIn({
				email: email,
				password: password
			});
			if (data) {
				setTimeout(() => {
					isLoading = false;
					isProceeding = true;
					setTimeout(() => {
						goto('/dashboard');
					}, 2000);
				}, 1000);
			} else {
				setTimeout(() => {
					isError = true;
					errorMessage = error.message;
					isLoading = false;
				}, 1000);
			}
		}
	};
</script>

<!-- Login Screen -->
<main class="d-flex flex-column justify-content-center align-items-center ">
	{#if !isProceeding}
		<div class="d-flex flex-column align-items-center" transition:slide={{ duration: 200 }}>
			<img class="" src="./logo_main.jpg" width="100" alt="" />
			<h2 class="mt-3 mb-5">Chillcliquers Inventory System</h2>
		</div>
		{#if isLoading}
			<div transition:slide={{ duration: 200 }}>
				<div class="spinner-border text-secondary" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
			</div>
		{/if}
		{#if !isLoading}
			<div transition:slide={{ duration: 200 }}>
				<div class="card p-2" style="width: 25rem;">
					<div class="card-body">
						<h5 class="card-title mb-3">Log In</h5>
						<div class="input-group flex-nowrap mb-2">
							<span class="input-group-text" id="addon-wrapping">
								<i class="bi bi-person" />
							</span>
							<input
								type="email"
								class="form-control"
								placeholder="Email"
								aria-label="Email"
								aria-describedby="addon-wrapping"
								bind:value={email}
							/>
						</div>
						<div class="input-group flex-nowrap">
							<span class="input-group-text" id="addon-wrapping"><i class="bi bi-lock" /></span>
							<input
								type="password"
								class="form-control"
								placeholder="Password"
								aria-label="Password"
								aria-describedby="addon-wrapping"
								bind:value={password}
							/>
						</div>
					</div>
					<button on:click={logInWithEmailPassword} class="btn btn-primary mt-5">
						Log In with Email and Password
					</button>
				</div>
			</div>
		{/if}
		{#if isError}
			<div transition:slide={{ duration: 200 }}>
				<p class="text-danger mt-2">{errorMessage}</p>
			</div>
		{/if}
	{/if}

	{#if isProceeding}
		<div transition:slide={{ duration: 200 }} class="d-flex flex-column align-items-center">
			<div class="spinner-border text-secondary" role="status">
				<span class="visually-hidden">Loading...</span>
			</div>
			<p class="mt-3">Redirecting to Dashboard</p>
		</div>
	{/if}
</main>

<style>
	main {
		min-height: 100vh;
		user-select: none;
	}
</style>
