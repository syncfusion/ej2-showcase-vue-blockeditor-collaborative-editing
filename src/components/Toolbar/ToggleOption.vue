<script setup lang="ts">
import { ref } from 'vue';
import { DropDownButtonComponent } from '@syncfusion/ej2-vue-splitbuttons';

defineOptions({ components: { 'ejs-dropdownbutton': DropDownButtonComponent } });

const props = defineProps<{
    panelMenuItems: any[];
}>();

const emit = defineEmits<{
    (e: 'panelToggle', args: any): void;
}>();

const panelDropdownRef = ref<InstanceType<typeof DropDownButtonComponent> | null>(null);

defineExpose({ panelDropdownRef });
</script>

<template>
    <ejs-dropdownbutton
        ref="panelDropdownRef"
        :items="props.panelMenuItems"
        cssClass="panel-toggle-dropdown e-caret-hide e-small"
        iconCss="e-icons e-more-vertical-2"
        title="Toggle panels"
        aria-label="Toggle panels"
        @select="emit('panelToggle', $event)"
    />
</template>
