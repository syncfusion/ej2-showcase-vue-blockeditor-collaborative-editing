<script setup lang="ts">
import { ref, computed, nextTick, markRaw } from 'vue';
import type {
    CollaborationSettingsModel,
    IVersionHistory,
    ImageBlockSettingsModel,
    InlineToolbarSettingsModel,
} from '@syncfusion/ej2-vue-blockeditor';
import { IndexedDBVersionStorage } from './services/versionHistoryService';
import { getCurrentUser } from './services/userService';
import { getDefaultBlocks } from './services/editorService';
import { useRoomId } from './composables/useRoomId';
import { useCollaboration } from './composables/useCollaboration';
import { useAwareness } from './composables/useAwareness';
import { useVersionHistory } from './composables/useVersionHistory';
import Header from './components/Header/Header.vue';
import Hero from './components/Hero/Hero.vue';
import EditorWorkspace from './components/EditorWorkspace/EditorWorkspace.vue';
import LoadingSpinner from './components/common/LoadingSpinner.vue';
import './styles/globals.css';

// Room & current user
const { roomId } = useRoomId();
const { provider, adapter, isConnected, isSynced } = useCollaboration(roomId);
const currentUser = ref(getCurrentUser());

// Collaborators awareness
const { collaborators } = useAwareness(provider, currentUser);

// Version plugin reference
const versionPlugin = ref<IVersionHistory | null>(null);

// Version storage (reactive on roomId)
const storage = computed(() => new IndexedDBVersionStorage(`blockeditor-versions-${roomId.value}`));

// Version history operations
const {
    snapshots,
    isLoading: snapshotsLoading,
    refreshSnapshots,
    restoreSnapshot,
    deleteSnapshot,
    renameSnapshot,
    clearAllSnapshots,
} = useVersionHistory(versionPlugin, storage);

// Default blocks
const defaultBlocks = getDefaultBlocks();

// Inline toolbar settings
const inlineToolbarSettings: InlineToolbarSettingsModel = {
    items: [
        'Transform', 'Bold', 'Italic', 'Underline', 'Strikethrough',
        'Uppercase', 'Lowercase', 'Subscript', 'Superscript',
        'InlineCode', 'Link', 'Color', 'Backgroundcolor'
    ],
};

// Image block settings
const imageBlockSettings: ImageBlockSettingsModel = {
    saveUrl: 'https://services.syncfusion.com/react/production/api/RichTextEditor/SaveFile',
    path: 'https://services.syncfusion.com/react/production/RichTextEditor/',
};

// Collaboration settings (built once provider & adapter are ready)
const collaborationSettings = computed((): CollaborationSettingsModel | null => {
    if (!provider.value || !adapter.value || !storage.value) return null;

    return {
        provider: provider.value,
        // markRaw prevents Vue from wrapping yRuntime and yXmlFragment in a
        // Proxy at any component-prop boundary. 
        // With markRaw the two sides are always the identical raw object.
        adapter: markRaw({
            yRuntime: markRaw(adapter.value.yRuntime),
            yXmlFragment: markRaw(adapter.value.yXmlFragment),
        }),
        enableAwareness: true,
        versionHistory: {
            storage: storage.value,
            snapshotInterval: 3000,
            snapshotCreated: () => { refreshSnapshots(); },
            snapshotRestored: () => { nextTick(() => refreshSnapshots()); },
        },
    } as CollaborationSettingsModel;
});

// Guard: show workspace only when collaboration is ready
const isReady = computed(() =>
    provider.value && adapter.value && collaborationSettings.value && isSynced.value
);

// Editor workspace ref to access the underlying block editor
const editorWorkspaceRef = ref<InstanceType<typeof EditorWorkspace> | null>(null);

const handleCreated = () => {
    // Navigate: EditorWorkspace -> EditorContainer -> SyncfusionBlockEditor -> ej2Instances
    const editorContainerRef = (editorWorkspaceRef.value as any)?.$refs?.editorContainerRef;
    const editorRef = editorContainerRef?.editorRef;
    const ej2 = editorRef?.editorRef?.ej2Instances;
    const plugin = ej2?.getVersionHistory?.();
    if (plugin) {
        versionPlugin.value = plugin;
    }
};
</script>

<template>
    <div class="app">
        <Header />
        <Hero />
        <EditorWorkspace
            v-if="isReady"
            ref="editorWorkspaceRef"
            :roomId="roomId"
            :isConnected="isConnected"
            :currentUser="currentUser"
            :collaborators="collaborators"
            :blocks="defaultBlocks"
            :collaborationSettings="collaborationSettings!"
            :snapshots="snapshots"
            :snapshotsLoading="snapshotsLoading"
            :onRestoreSnapshot="restoreSnapshot"
            :onDeleteSnapshot="deleteSnapshot"
            :onRenameSnapshot="renameSnapshot"
            :onClearAllSnapshots="clearAllSnapshots"
            :inlineToolbarSettings="inlineToolbarSettings"
            :imageBlockSettings="imageBlockSettings"
            :onCreated="handleCreated"
        />
        <div v-else class="loading-container">
            <LoadingSpinner text="Initializing collaboration..." />
        </div>
    </div>
</template>

<style>
.app {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: var(--bg-secondary);
    color: var(--text-primary);
    transition: background-color var(--transition-normal), color var(--transition-normal);
}

.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1;
    padding: var(--sp-2xl);
    text-align: center;
}

.loading-container p {
    font-size: var(--fs-body);
    color: var(--text-secondary);
}

.app > :nth-child(1) { order: 1; }
.app > :nth-child(2) { order: 2; }
.app > :nth-child(3) { order: 3; flex: 1; }
.app > :last-child   { order: 4; margin-top: auto; }

@media (max-width: 768px) {
    .app { min-height: 100vh; }
}
</style>
