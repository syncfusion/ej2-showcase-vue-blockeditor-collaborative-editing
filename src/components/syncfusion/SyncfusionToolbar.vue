<script setup lang="ts">
import { ref } from 'vue';
import { ToolbarComponent, ItemDirective, ItemsDirective } from '@syncfusion/ej2-vue-navigations';
import type { ItemModel, ClickEventArgs } from '@syncfusion/ej2-navigations';

defineOptions({
    components: {
        'ejs-toolbar': ToolbarComponent,
        'e-items': ItemsDirective,
        'e-item': ItemDirective
    }
});

const props = defineProps<{
    id?: string;
    items?: ItemModel[];
    cssClass?: string;
}>();

const emit = defineEmits<{
    (e: 'clicked', args: ClickEventArgs): void;
}>();

const toolbarRef = ref<InstanceType<typeof ToolbarComponent> | null>(null);

defineExpose({ toolbarRef });
</script>

<template>
    <ejs-toolbar
        ref="toolbarRef"
        :id="props.id"
        :cssClass="props.cssClass"
        @clicked="emit('clicked', $event)"
    >
        <e-items>
            <e-item
                v-for="(item, index) in (props.items ?? [])"
                :key="index"
                :text="item.text"
                :prefixIcon="item.prefixIcon"
                :tooltipText="item.tooltipText"
                :align="item.align"
                :id="item.id"
                :type="item.type"
            />
        </e-items>
    </ejs-toolbar>
</template>
