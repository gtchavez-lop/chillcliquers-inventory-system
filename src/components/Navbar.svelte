<script>
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { supabase, activeTab } from '../_global';

	let useremail = '';

	let setActiveTab = (tab) => {
		activeTab.set(tab);
	};

	onMount(async (e) => {
		useremail = await supabase.auth.user().email;
	});
</script>

<main in:fly={{ x: -40, duration: 500 }}>
	<img src="./logo_main.jpg" width="45" alt="" />
	<ul>
		<li
			class={$activeTab == 1 ? 'active' : ''}
			on:click={() => {
				setActiveTab(1);
			}}
		>
			<i class="bi bi-shop" />
		</li>
		<li
			class={$activeTab == 2 ? 'active' : ''}
			on:click={() => {
				setActiveTab(2);
			}}
		>
			<i class="bi bi-box-seam" />
		</li>
		<li
			class={$activeTab == 4 ? 'active' : ''}
			on:click={() => {
				setActiveTab(4);
			}}
		>
			<i class="bi bi-arrow-return-right" />
		</li>
		<li
			class={$activeTab == 3 ? 'active' : ''}
			on:click={() => {
				setActiveTab(3);
			}}
		>
			<i class="bi bi-person-circle" />
		</li>
		<li
			class={$activeTab == 5 ? 'active' : ''}
			on:click={() => {
				setActiveTab(5);
			}}
		>
			<i class="bi bi-basket" />
		</li>
	</ul>

	<div class="account">
		<div class="detail">
			<i class="bi bi-person" />
			<h6>{useremail.split('@')[0]}</h6>
		</div>
	</div>
</main>

<style lang="scss">
	main {
		position: fixed;
		top: 0;
		left: 0;
		width: 75px;
		height: 100%;
		background: white;
		transition: 200ms ease all;
		z-index: 999;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
		border-right: solid rgb(151, 151, 151) 2px;
		user-select: none;
		padding: 2em 0;

		img {
			transition: 200ms ease all;
		}

		&:hover {
			width: 250px;
			li {
				min-width: 200px;
			}
		}

		ul {
			list-style: none;
			padding: 0;
			position: relative;

			li {
				margin-top: 1em;
				margin-bottom: 1em;
				transition: 200ms ease all;
				border-radius: 10px;
				// padding: 0 4em;
				min-width: 75px;
				display: flex;
				justify-content: center;
				cursor: pointer;
				position: relative;

				&::after {
					content: '';
					position: absolute;
					bottom: 0;
					right: 0px;
					width: 7px;
					height: 100%;
					background: rgb(43, 95, 192);
					transition: 200ms ease all;
					border-radius: 100px;
					opacity: 0;
				}
				.bi {
					color: black;
					transition: 200ms ease all;
					font-size: 2em;
				}

				&:hover {
					background: rgb(92, 92, 92);
					min-width: 150px;
					&::after {
						right: -15px;
					}
					.bi {
						color: white;
					}
				}

				&:active {
					transition: none;
					transform: scale(0.9);
				}
			}
		}

		.bi {
			color: black;
			transition: 200ms ease all;
			font-size: 2em;
		}
		.account {
			display: flex;
			flex-direction: column;
			justify-content: center;

			.detail {
				display: flex;
				justify-content: center;
				align-items: center;

				h6 {
					transition: 200ms ease all;
					position: absolute;
					opacity: 0;
				}
			}
		}

		&:hover {
			.account {
				.detail {
					.bi {
						opacity: 0;
					}
					h6 {
						opacity: 1;
					}
				}
			}
		}
	}

	.active {
		&::after {
			content: '';
			position: absolute;
			bottom: 0;
			right: 0;
			width: 7px;
			height: 100%;
			background: rgb(43, 95, 192);
			border-radius: 100px;
			opacity: 1;
		}
	}

	@media screen and (max-width: 768px) {
		main {
			left: -55px;
			&:hover {
				left: 0;
			}
		}
	}
</style>
