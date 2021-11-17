<script>
	import dayjs from 'dayjs';

	import { onMount, afterUpdate } from 'svelte';
	import { each } from 'svelte/internal';
	import { get } from 'svelte/store';
	import { slide, fly } from 'svelte/transition';
	import { supabase, borrowedItems } from '../../../_global';
	import TabBorrowedItems from './borrowedItems/tab_borrowedItems.svelte';
</script>

<embed in:fly={{ x: -40, duration: 500, delay: 100 }} src="./illustration-frosted/SVG/art(15).svg" />
<main class="container p-5 text-end" in:fly={{ x: -20, duration: 500 }}>
	<h1 class="mb-5">Borrowed Items</h1>
	<h2>Item List</h2>
	<TabBorrowedItems />
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
