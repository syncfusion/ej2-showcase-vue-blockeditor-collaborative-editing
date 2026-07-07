<script setup lang="ts">
import { ref } from 'vue';
import type { UserModel, VersionSnapshot } from '@syncfusion/ej2-vue-blockeditor';
import { ButtonComponent } from '@syncfusion/ej2-vue-buttons';
import CollabPanel from '../ActiveCollabPanel/CollabPanel.vue';
import VersionHistoryList from '../VersionHistory/VersionHistoryList.vue';
import './SidebarContent.css';

defineOptions({ components: { 'ejs-button': ButtonComponent } });

type SidebarMode = 'collaborators' | 'versions';

const props = defineProps<{
    mode: SidebarMode;
    editorRef: any;
    collaborators: UserModel[];
    currentUser: UserModel;
    snapshots: VersionSnapshot[];
    isLoading: boolean;
    onRestore: (snapshotId: string) => Promise<void>;
    onDelete: (snapshotId: string) => Promise<void>;
    onRename: (snapshotId: string, newLabel: string) => Promise<void>;
    onClearAll: () => Promise<void>;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
}>();

const isClearing = ref(false);

const getHeaderTitle = () =>
    props.mode === 'collaborators' ? 'Active Collaborators' : 'Version History';

const handleClearAll = async () => {
    if (props.snapshots.length === 0) return;
    const confirmed = window.confirm(
        `Are you sure you want to delete all ${props.snapshots.length} snapshot(s)? This action cannot be undone.`
    );
    if (confirmed) {
        try {
            isClearing.value = true;
            await props.onClearAll();
        } catch (err) {
            console.error('Failed to clear all snapshots:', err);
        } finally {
            isClearing.value = false;
        }
    }
};
</script>

<template>
    <div class="sidebar-content-wrapper">
        <!-- Unified Header -->
        <div class="sidebar-header">
            <h3 class="sidebar-title">{{ getHeaderTitle() }}</h3>
            <div class="sidebar-header-actions">
                <ejs-button
                    v-if="props.mode === 'versions' && props.snapshots.length > 0"
                    cssClass="e-small"
                    :disabled="isClearing || props.isLoading"
                    title="Delete all snapshots"
                    aria-label="Clear all snapshots"
                    @click="handleClearAll"
                >
                    Delete All
                </ejs-button>
                <ejs-button
                    cssClass="e-small"
                    aria-label="Close sidebar"
                    title="Close"
                    @click="emit('close')"
                >
                    ×
                </ejs-button>
            </div>
        </div>

        <!-- Mode-specific Content -->
        <div class="sidebar-content">
            <CollabPanel
                v-if="props.mode === 'collaborators'"
                :collaborators="props.collaborators"
                :currentUser="props.currentUser"
            />
            <VersionHistoryList
                v-else
                :editorRef="props.editorRef"
                :snapshots="props.snapshots"
                :isLoading="props.isLoading"
                :onRestore="props.onRestore"
                :onDelete="props.onDelete"
                :onRename="props.onRename"
            />
        </div>
    </div>
</template>
