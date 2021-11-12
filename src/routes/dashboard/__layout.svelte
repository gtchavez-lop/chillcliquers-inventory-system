<script>
	import { onMount } from 'svelte';
	import Navbar from '../../components/Navbar.svelte';
	import 'toastify-js/src/toastify.css';
	import { supabase } from '../../_global';

	let hasAccess = false;

	onMount((e) => {
		if (supabase.auth.user()) {
			hasAccess = true;
		}
	});

	const goBack = () => {
		window.history.back();
	};
</script>

{#if hasAccess}
	<Navbar />
	<slot />
{/if}
{#if !hasAccess}
	<div class="d-flex flex-column justify-content-center align-items-center" style="min-height: 100vh; user-select: none;">
		<p class="lead">You dont have a persmission to access this page</p>
		<button class="btn btn-danger mt-3" on:click={goBack}>Go Back</button>
	</div>
{/if}
