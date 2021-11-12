<script>
	import { onMount } from 'svelte';
	import dayjs from 'dayjs';
	import { slide, fly } from 'svelte/transition';
	import { supabase, masterKey } from '../../../_global';
	import { goto } from '$app/navigation';

	$: loaded = false;
	let thisUser;
	$: user_email = '';
	$: user_password = '';
	$: user_givenName = '';
	$: user_familyName = '';
	$: masterKey_input = '';

	let isRegistering = false;
	let isAbleToRegister = false;

	onMount(async (e) => {
		thisUser = await supabase.auth.user();
	});

	const login = async (e) => {
		// check if user_email and user_password are not empty
		isRegistering = true;
		if (user_email && user_password) {
			isAbleToRegister = false;
			let { data, error } = await supabase.auth.signUp({
				email: user_email,
				password: user_password
			});
			if (!error) {
				createUserToTable();
			}
		} else {
			alert('Please fill in all fields');
		}

		user_email = '';
		user_password = '';
		user_givenName = '';
		user_familyName = '';
	};

	const validateMasterKey = (e) => {
		isAbleToRegister = false;
		if (masterKey_input == $masterKey) {
			isAbleToRegister = true;
		}
	};

	const createUserToTable = async (e) => {
		let { data, error } = await supabase.from('registered_users').insert([{ email: user_email, given_name: user_givenName, family_name: user_familyName }]);
		if (!error) {
			alert('User created successfully');
			isRegistering = false;
			goto('/');
		} else {
			alert(error.message);
		}
	};
</script>

<embed in:fly={{ x: -40, duration: 500, delay: 100 }} src="./illustration-frosted/SVG/art(6).svg" />
<main class="container p-5 text-end" in:fly={{ x: -20, duration: 500 }}>
	<h1 class="mb-5">Accounts</h1>

	<div class="mt-5">
		<h3 class="mb-5">This Account</h3>
		{#if thisUser}
			<div class="row">
				<div class="col-6">
					<div class="card mb-4">
						<div class="card-body">
							<p class="display-6 card-title">Currently Active</p>
							<h5 class="card-text">{thisUser.email}</h5>
						</div>
					</div>
				</div>
				<div class="col-6">
					<div class="card mb-4" style="background: #F9F8F3;">
						<div class="card-body">
							<p class="display-6 card-title">Created At</p>
							<h5 class="card-text">{dayjs(thisUser.created_at).format('MMMM D, YYYY @h:mm:ss A')}</h5>
						</div>
					</div>
				</div>
				<div class="col-6 offset-6">
					<div class="card mb-4" style="background: #F9F8F3;">
						<div class="card-body">
							<p class="display-6 card-title">Last Sign in</p>
							<h5 class="card-text">{dayjs(thisUser.updated_at).format('MMMM D, YYYY @h:mm:ss A')}</h5>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>

	<h3 class="my-5">Create Account</h3>
	{#if !isRegistering}
		{#if isAbleToRegister}
			<div transition:slide|local={{ duration: 500 }}>
				<div class="row">
					<div class="col-3">
						<div class="input-group flex-nowrap">
							<span class="input-group-text" id="addon-wrapping">@</span>
							<input bind:value={user_email} type="email" class="form-control" placeholder="Email Address" aria-label="Email Address" aria-describedby="addon-wrapping" />
						</div>
					</div>
					<div class="col-3">
						<div class="input-group flex-nowrap">
							<span class="input-group-text" id="addon-wrapping"><i class="bi bi-three-dots" /></span>
							<input bind:value={user_password} type="password" class="form-control" placeholder="Password" aria-label="Password" aria-describedby="addon-wrapping" />
						</div>
					</div>
					<div class="col-3">
						<div class="input-group flex-nowrap">
							<span class="input-group-text" id="addon-wrapping"><i class="bi bi-person" /></span>
							<input bind:value={user_givenName} type="text" class="form-control" placeholder="Given Name" aria-label="Given Name" aria-describedby="addon-wrapping" />
						</div>
					</div>
					<div class="col-3">
						<div class="input-group flex-nowrap">
							<span class="input-group-text" id="addon-wrapping"><i class="bi bi-person" /></span>
							<input bind:value={user_familyName} type="text" class="form-control" placeholder="Family Name" aria-label="Family Name" aria-describedby="addon-wrapping" />
						</div>
					</div>

					<div class="col-12 mt-3">
						<div class="btn-group" role="group" aria-label="Basic example">
							<button on:click={login} type="button" class="btn btn-outline-success">Register Account</button>
							<button
								on:click={(e) => {
									isAbleToRegister = false;
									masterKey_input = '';
								}}
								type="button"
								class="btn btn-outline-danger">Cancel</button
							>
						</div>
					</div>
				</div>
			</div>
		{:else}
			<div transition:slide|local={{ duration: 500 }}>
				<div class="row row-cols-2">
					<div class="col" />
					<div class="col">
						<div class="input-group flex-nowrap">
							<span class="input-group-text" id="addon-wrapping">Master Key</span>
							<input on:keyup={validateMasterKey} bind:value={masterKey_input} type="password" class="form-control" placeholder="Master Key" aria-label="Master Key" aria-describedby="addon-wrapping" />
						</div>
					</div>
				</div>
			</div>
		{/if}
	{:else}
		<p>Loading</p>
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
</style>
