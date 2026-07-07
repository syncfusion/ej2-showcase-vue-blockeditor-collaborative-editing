<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';

const props = defineProps<{
    text?: string;
}>();

const spinnerRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
    if (!spinnerRef.value) return;
    createSpinner({ target: spinnerRef.value });
    showSpinner(spinnerRef.value);
});

onUnmounted(() => {
    if (spinnerRef.value) {
        hideSpinner(spinnerRef.value);
    }
});
</script>

<template>
    <div class="loading-container">
        <div ref="spinnerRef" class="spinner-host" />
        <p class="loading-text">{{ props.text ?? 'Initializing collaboration...' }}</p>
    </div>
</template>
