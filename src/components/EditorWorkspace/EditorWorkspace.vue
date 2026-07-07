<script setup lang="ts">
import { ref, computed } from 'vue';
import type {
    UserModel,
    VersionSnapshot,
    BlockModel,
    CollaborationSettingsModel,
    ImageBlockSettingsModel,
    InlineToolbarSettingsModel,
} from '@syncfusion/ej2-vue-blockeditor';
import EditorContainer from './EditorContainer.vue';
import SidebarContent from './SidebarContent.vue';
import SyncfusionSidebar from '../syncfusion/SyncfusionSidebar.vue';
import './EditorWorkspace.css';

const props = defineProps<{
    roomId: string;
    isConnected: boolean;
    currentUser: UserModel;
    collaborators: UserModel[];
    blocks: BlockModel[];
    collaborationSettings: CollaborationSettingsModel;
    snapshots: VersionSnapshot[];
    snapshotsLoading: boolean;
    onRestoreSnapshot: (snapshotId: string) => Promise<void>;
    onDeleteSnapshot: (snapshotId: string) => Promise<void>;
    onRenameSnapshot: (snapshotId: string, newLabel: string) => Promise<void>;
    onClearAllSnapshots: () => Promise<void>;
    inlineToolbarSettings: InlineToolbarSettingsModel;
    imageBlockSettings: ImageBlockSettingsModel;
    onCreated: () => void;
}>();

const activePanel = ref<'collab' | 'versions' | null>(null);
const editorContainerRef = ref<InstanceType<typeof EditorContainer> | null>(null);
defineExpose({ editorContainerRef });

const handleTogglePanel = (panel: 'collab' | 'versions') => {
    activePanel.value = activePanel.value === panel ? null : panel;
};

const handleClosePanel = () => {
    activePanel.value = null;
};

const collaboratorCount = computed(() => props.collaborators.length + 1);

const sidebarTarget = computed(() => {
    const editorInst = editorContainerRef.value?.editorRef?.editorRef?.ej2Instances;
    return (editorInst?.element as HTMLElement)?.parentElement ?? undefined;
});
</script>

<template>
    <section class="editor-workspace">
        <div>
            <EditorContainer
                ref="editorContainerRef"
                :blocks="props.blocks"
                :users="[props.currentUser, ...props.collaborators]"
                :currentUserId="props.currentUser.id"
                :collaborationSettings="props.collaborationSettings"
                :collaboratorCount="collaboratorCount"
                :activePanel="activePanel"
                :roomId="props.roomId"
                :isConnected="props.isConnected"
                :inlineToolbarSettings="props.inlineToolbarSettings"
                :imageBlockSettings="props.imageBlockSettings"
                :onCreated="props.onCreated"
                @panelToggle="handleTogglePanel"
            />

            <SyncfusionSidebar
                :target="sidebarTarget"
                :showBackdrop="false"
                :isOpen="activePanel !== null"
                position="Right"
                @sidebarClose="handleClosePanel"
            >
                <SidebarContent
                    v-if="activePanel"
                    :mode="activePanel === 'collab' ? 'collaborators' : 'versions'"
                    :collaborators="props.collaborators"
                    :currentUser="props.currentUser"
                    :editorRef="editorContainerRef?.editorRef"
                    :snapshots="props.snapshots"
                    :isLoading="props.snapshotsLoading"
                    :onRestore="props.onRestoreSnapshot"
                    :onDelete="props.onDeleteSnapshot"
                    :onRename="props.onRenameSnapshot"
                    :onClearAll="props.onClearAllSnapshots"
                    @close="handleClosePanel"
                />
            </SyncfusionSidebar>
        </div>
    </section>
</template>
