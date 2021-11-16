<script>
	import { onMount } from 'svelte';

	import { slide } from 'svelte/transition';
	import { supabase, activeTab } from '../../_global';

	import Home from './components/home.svelte';
	import Inventory from './components/inventory.svelte';
	import Accounts from './components/accounts.svelte';
	import Settings from './components/settings.svelte';
	import BorrowedItems from './components/borrowedItems.svelte';
</script>

<main transition:slide={{ duration: 200 }}>
	{#if $activeTab == 1}
		<Home />
	{/if}
	{#if $activeTab == 2}
		<Inventory />
	{/if}
	{#if $activeTab == 3}
		<Accounts />
	{/if}
	{#if $activeTab == 4}
		<BorrowedItems />
	{/if}
	{#if $activeTab == 5}
		<Settings />
	{/if}
</main>

<style>
	main {
		user-select: none;
	}
</style>
