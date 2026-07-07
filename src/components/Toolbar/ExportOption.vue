<script setup lang="ts">
import { ref } from 'vue';
import { DropDownButtonComponent } from '@syncfusion/ej2-vue-splitbuttons';

defineOptions({ components: { 'ejs-dropdownbutton': DropDownButtonComponent } });

const props = defineProps<{
    exportMenuItems: any[];
}>();

const emit = defineEmits<{
    (e: 'export', args: any): void;
}>();

const exportDropdownRef = ref<InstanceType<typeof DropDownButtonComponent> | null>(null);

defineExpose({ exportDropdownRef });
</script>

<template>
    <div class="toolbar-left">
        <ejs-dropdownbutton
            ref="exportDropdownRef"
            :items="props.exportMenuItems"
            cssClass="export-button e-small"
            iconCss="e-icons e-download"
            @select="emit('export', $event)"
        >
            Export
        </ejs-dropdownbutton>
    </div>
</template>
