<script setup lang="ts">
import { ref, provide } from 'vue';
import {
    BlockEditorComponent,
    Collaboration,
    VersionHistory
} from '@syncfusion/ej2-vue-blockeditor';
import type {
    BlockEditorModel,
    ImageBlockSettingsModel,
    InlineToolbarSettingsModel
} from '@syncfusion/ej2-vue-blockeditor';

defineOptions({
    components: { 'ejs-blockeditor': BlockEditorComponent }
});

const props = defineProps<{
    id?: string;
    cssClass?: string;
    blocks?: any[];
    users?: any[];
    currentUserId?: string;
    collaborationSettings?: any;
    blockChanged?: BlockEditorModel['blockChanged'];
    height?: string | number;
    width?: string | number;
    created?: BlockEditorModel['created'];
    inlineToolbarSettings?: InlineToolbarSettingsModel;
    imageBlockSettings?: ImageBlockSettingsModel;
}>();

const editorRef = ref<InstanceType<typeof BlockEditorComponent> | null>(null);

defineExpose({ editorRef });

// Provide required modules to EJ2 BlockEditor via Vue's provide/inject system
provide('blockeditor', [Collaboration, VersionHistory]);
</script>

<template>
    <ejs-blockeditor
        ref="editorRef"
        :id="props.id ?? 'block-editor'"
        :height="props.height"
        :width="props.width"
        :blocks="props.blocks ?? []"
        :users="props.users"
        :currentUserId="props.currentUserId"
        :collaborationSettings="props.collaborationSettings"
        :blockChanged="props.blockChanged"
        :cssClass="props.cssClass"
        :created="props.created"
        :inlineToolbarSettings="props.inlineToolbarSettings"
        :imageBlockSettings="props.imageBlockSettings"
    />
</template>
