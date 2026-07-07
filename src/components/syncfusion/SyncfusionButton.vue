<script setup lang="ts">
import { ButtonComponent } from '@syncfusion/ej2-vue-buttons';

defineOptions({ components: { 'ejs-button': ButtonComponent } });

const props = defineProps<{
    id?: string;
    cssClass?: string;
    title?: string;
    disabled?: boolean;
    isPrimary?: boolean;
    iconCss?: string;
}>();

const emit = defineEmits<{
    (e: 'click', event: MouseEvent): void;
}>();
</script>

<template>
    <ejs-button
        :id="props.id"
        :cssClass="props.cssClass"
        :title="props.title"
        :disabled="props.disabled ?? false"
        :isPrimary="props.isPrimary ?? false"
        :iconCss="props.iconCss"
        @click="emit('click', $event)"
    >
        <slot />
    </ejs-button>
</template>
