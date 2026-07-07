<script setup lang="ts">
const props = defineProps<{
    isConnected: boolean;
}>();
</script>

<template>
    <div class="connection-status">
        <span :class="`status-indicator ${props.isConnected ? 'connected' : 'disconnected'}`" />
        <span class="status-text">
            {{ props.isConnected ? 'Connected' : 'Connecting...' }}
        </span>
    </div>
</template>

<style scoped src="./ConnectionStatus.css"></style>
