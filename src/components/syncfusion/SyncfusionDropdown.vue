<script setup lang="ts">
import { ref } from 'vue';
import { DropDownButtonComponent } from '@syncfusion/ej2-vue-splitbuttons';
import type { ItemModel } from '@syncfusion/ej2-splitbuttons';

defineOptions({ components: { 'ejs-dropdownbutton': DropDownButtonComponent } });

const props = defineProps<{
    id?: string;
    items?: ItemModel[];
    iconCss?: string;
    cssClass?: string;
}>();

const emit = defineEmits<{
    (e: 'select', args: any): void;
}>();

const dropdownRef = ref<InstanceType<typeof DropDownButtonComponent> | null>(null);

defineExpose({ dropdownRef });
</script>

<template>
    <ejs-dropdownbutton
        ref="dropdownRef"
        :id="props.id"
        :iconCss="props.iconCss"
        :items="props.items ?? []"
        :cssClass="props.cssClass"
        @select="emit('select', $event)"
    />
</template>
