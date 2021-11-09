<script>
	import { slide, fly } from 'svelte/transition';
</script>

<main class="container p-5" in:fly={{ x: -20, duration: 500 }}>
	<h2>Inventory Page</h2>
</main>

<style>
</style>
