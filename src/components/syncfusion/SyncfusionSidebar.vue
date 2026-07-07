<script setup lang="ts">
import { ref, watch } from 'vue';
import { SidebarComponent } from '@syncfusion/ej2-vue-navigations';

defineOptions({ components: { 'ejs-sidebar': SidebarComponent } });

const props = defineProps<{
    id?: string;
    width?: string;
    type?: string;
    target?: string | HTMLElement;
    showBackdrop?: boolean;
    isOpen?: boolean;
    position?: string;
    cssClass?: string;
}>();

const emit = defineEmits<{
    (e: 'sidebarClose'): void;
}>();

const sidebarRef = ref<InstanceType<typeof SidebarComponent> | null>(null);

watch(
    () => props.isOpen,
    (open) => {
        if (!sidebarRef.value) return;
        if (open) {
            sidebarRef.value.show();
        } else {
            sidebarRef.value.hide();
        }
    }
);

const handleClose = () => {
    emit('sidebarClose');
};

const handleCreated = () => {
    if (sidebarRef.value) {
        (sidebarRef.value.ej2Instances.element as HTMLElement).style.visibility = '';
    }
};

defineExpose({ sidebarRef });
</script>

<template>
    <ejs-sidebar
        ref="sidebarRef"
        :id="props.id ?? 'sidebar'"
        :width="props.width ?? '300px'"
        :type="props.type ?? 'Push'"
        :target="props.target"
        :position="props.position"
        :showBackdrop="props.showBackdrop ?? true"
        :class="`syncfusion-sidebar ${props.cssClass ?? ''}`"
        @close="handleClose"
        @created="handleCreated"
    >
        <slot />
    </ejs-sidebar>
</template>
