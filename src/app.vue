<script setup lang="ts">
import { SmmPreloader } from 'ui';

import { PRELOADER_Z_INDEX } from '@/constants';

import FmsHeader from '@/layout/fms-header.vue';
import FmsNavigation from '@/layout/fms-navigation.vue';

import useSystemStore from '@/stores/system';

const systemStore = useSystemStore();
</script>

<template>
	<div class="fms">
		<fms-header class="fms__header" />
		<div class="fms__body">
			<fms-navigation class="fms__navigation" />
			<div class="fms__content">
				<router-view />
				<smm-preloader
					:loading="systemStore.isLoading"
					:z-index="PRELOADER_Z_INDEX"
				/>
			</div>
			<div class="tooltip-content" />
			<div class="menu-content" />
		</div>
	</div>
</template>

<style scoped lang="scss">
.fms {
	display: flex;
	flex-grow: 1;
	font-weight: $smm-font-weight-base;
	font-size: $smm-font-size-base;
	line-height: $smm-line-height-base;
	font-family: $smm-font-family-base;
	color: $smm-color-neutral-900;

	&__header {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 10001;
		box-sizing: border-box;
		width: 100%;
		min-width: 1280px;
		height: 60px;
	}

	&__body {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		width: 100%;
		max-width: 1740px;
		margin: 0 auto;
		padding: 60px 0 0 48px;
		transition: padding $smm-middle-duration $smm-effect;

		@media (min-width: 1600px) {
			padding: 60px 0 0 300px;
		}

		.micro-mui-layout.is-opened & {
			@media (min-width: 1440px) {
				padding: 60px 0 0 300px;
			}
		}
	}

	&__navigation {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 10000;
		box-sizing: border-box;
		width: 300px;
		height: 100%;
		transition: width $smm-middle-duration $smm-effect;

		@media (min-width: 1740px) {
			left: calc(50% - 870px);
		}

		@media (min-width: 1600px) {
			width: 300px;
		}

		.micro-mui-layout.is-opened & {
			@media (min-width: 1440px) {
				width: 300px;
			}
		}

		> * {
			&::after {
				@media (min-width: 1740px) {
					content: '';
					position: fixed;
					top: 0;
					left: 0;
					width: calc(50% - 870px);
					height: 100%;
					background: $smm-color-white;
				}
			}
		}
	}

	&__content {
		display: flex;
		flex-grow: 1;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		box-sizing: border-box;
		width: 100%;
		padding: 24px 32px;

		:deep(> *) {
			flex-grow: 1;
			width: 100%;
		}

		:deep(.smm-multiselect__main-panel) {
			z-index: 0;
		}

		:deep(*),
		:deep(*::before),
		:deep(*::after) {
			box-sizing: inherit;
		}

		:deep(b),
		:deep(strong) {
			font-weight: $smm-font-weight-semibold;
		}
	}
}

.tooltip-content {
	position: relative;
	z-index: 10002;
}

.menu-content {
	:deep(.menu-content__body) {
		display: flex;
		width: 210px;
		padding: 8px 0;
		background-color: $smm-color-white;
		box-shadow: 0 2px 8px 0 rgb(0 0 0 / 10%);

		.smm-tooltip__content-slot-wrapper {
			flex-grow: 1;
			margin: 0;
		}

		.smm-tooltip__arrow {
			display: none;
		}
	}
}
</style>

<style lang="scss">
html,
body {
	width: 100%;
	min-height: 100vh;
	margin: 0;
	text-size-adjust: 100%;
	-ms-overflow-style: scrollbar;
	-webkit-tap-highlight-color: rgb(0 0 0 / 0%);
}

body {
	position: relative;
	display: flex;
}

#app {
	display: flex;
	flex-grow: 1;
}
</style>
