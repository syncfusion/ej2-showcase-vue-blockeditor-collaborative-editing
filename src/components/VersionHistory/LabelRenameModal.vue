<script setup lang="ts">
import { ButtonComponent } from '@syncfusion/ej2-vue-buttons';
import { TextBoxComponent } from '@syncfusion/ej2-vue-inputs';
import type { ChangedEventArgs } from '@syncfusion/ej2-inputs';

defineOptions({
    components: {
        'ejs-button': ButtonComponent,
        'ejs-textbox': TextBoxComponent
    }
});

const props = defineProps<{
    visible: boolean;
    value: string;
    title?: string;
}>();

const emit = defineEmits<{
    (e: 'update:value', val: string): void;
    (e: 'save'): void;
    (e: 'cancel'): void;
}>();

const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter' && props.value.trim()) {
        emit('save');
    }
    if (e.key === 'Escape') {
        emit('cancel');
    }
};

const handleChange = (e: ChangedEventArgs) => {
    emit('update:value', e.value || '');
};
</script>

<template>
    <div v-if="props.visible" class="rename-dialog-overlay">
        <div class="rename-dialog" role="dialog" aria-modal="true">
            <div class="rename-dialog-header">
                <span>{{ props.title ?? 'Rename Snapshot' }}</span>
                <ejs-button cssClass="e-small" aria-label="Close" @click="emit('cancel')">×</ejs-button>
            </div>
            <div class="rename-dialog-body">
                <ejs-textbox
                    type="text"
                    :value="props.value"
                    placeholder="Enter snapshot label"
                    cssClass="rename-input-field"
                    @change="handleChange"
                    @keydown="handleKeyDown"
                />
            </div>
            <div class="rename-dialog-footer">
                <ejs-button cssClass="e-small" @click="emit('cancel')">Cancel</ejs-button>
                <ejs-button cssClass="e-small" :isPrimary="true" @click="emit('save')">Save</ejs-button>
            </div>
        </div>
    </div>
</template>

<style scoped src="./LabelRenameModal.css"></style>
