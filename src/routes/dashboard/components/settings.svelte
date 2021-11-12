<script>
	import { goto } from '$app/navigation';

	import { slide, fly } from 'svelte/transition';
	import { supabase } from '../../../_global';

	let isLoggingOut = false;

	const signout = async () => {
		if (isLoggingOut) {
			let { data, error } = await supabase.auth.signOut();

			if (!error) {
				goto('/');
			}
		}
	};
</script>

<embed in:fly={{ x: -40, duration: 500, delay: 100 }} src="./illustration-frosted/SVG/art(14).svg" />
<main class="container p-5 text-end" in:fly={{ x: -20, duration: 500 }}>
	<h1>Settings</h1>
	<div class="row mt-5 d-flex items-center">
		<div class="col mt-5">
			<div class="text-end mb-3">
				{#if !isLoggingOut}
					<p class="lead">Log out your account</p>
					<button
						on:click={() => {
							isLoggingOut = true;
						}}
						class="btn btn-danger"
						style="min-width: 200px;">Log out</button
					>
				{/if}
				{#if isLoggingOut}
					<p class="lead">Do you really want to log out?</p>
					<button on:click={signout} class="btn btn-danger" style="min-width: 200px;">Yes</button>
					<button
						on:click={() => {
							isLoggingOut = false;
						}}
						class="btn btn-outline-primary"
						style="min-width: 200px;">No</button
					>
				{/if}
			</div>
		</div>
	</div>
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
