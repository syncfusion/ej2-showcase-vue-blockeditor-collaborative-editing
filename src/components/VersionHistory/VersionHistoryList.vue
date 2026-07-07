<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue';
import type { VersionSnapshot, UserModel } from '@syncfusion/ej2-vue-blockeditor';
import { DropDownButton } from '@syncfusion/ej2-splitbuttons';
import LabelRenameModal from './LabelRenameModal.vue';
import './VersionHistoryList.css';

interface VersionHistoryItem {
    id: string;
    headerText: string;
    label: string;
    isAutoLabel: boolean;
    timestamp: string;
    userName: string;
    lastModifiedBy: string;
    lastModifiedAt: number;
    dateGroup: string;
}

const props = defineProps<{
    editorRef: any;
    snapshots: VersionSnapshot[];
    isLoading: boolean;
    onRestore: (snapshotId: string) => Promise<void>;
    onDelete: (snapshotId: string) => Promise<void>;
    onRename: (snapshotId: string, newLabel: string) => Promise<void>;
}>();

const renamingId = ref<string | null>(null);
const newLabel = ref('');
const showRenameDialog = ref(false);

const getDateGroup = (timestamp: number): string => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateString = date.toDateString();
    if (dateString === today.toDateString()) return 'Today';
    if (dateString === yesterday.toDateString()) return 'Yesterday';

    const diffDays = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) return 'This Week';
    if (diffDays < 30) return 'This Month';

    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
};

const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

const getUserName = (userId: string): string => {
    // editorRef → SyncfusionBlockEditor instance (auto-unwrapped by Vue)
    // editorRef.editorRef → BlockEditorComponent instance (auto-unwrapped)
    const editorInst = (props.editorRef as any)?.editorRef?.ej2Instances;
    if (!editorInst?.users) return 'Unknown';
    const found = editorInst.users.find((u: UserModel) => u.id === userId);
    return found ? (found.user as string) : 'Unknown';
};

const listViewData = computed((): VersionHistoryItem[] => {
    return props.snapshots.map((snapshot) => ({
        id: snapshot.id,
        headerText: snapshot.label || formatTimestamp(snapshot.lastModifiedAt),
        label: snapshot.label || '',
        isAutoLabel: !snapshot.label,
        timestamp: formatTimestamp(snapshot.lastModifiedAt),
        userName: getUserName(snapshot.lastModifiedBy),
        lastModifiedBy: snapshot.lastModifiedBy,
        lastModifiedAt: snapshot.lastModifiedAt,
        dateGroup: getDateGroup(snapshot.lastModifiedAt),
    }));
});

// Group items by dateGroup, preserving order
const groupedItems = computed((): { group: string; items: VersionHistoryItem[] }[] => {
    const map = new Map<string, VersionHistoryItem[]>();
    for (const item of listViewData.value) {
        const bucket = map.get(item.dateGroup) ?? [];
        bucket.push(item);
        map.set(item.dateGroup, bucket);
    }
    return Array.from(map.entries()).map(([group, items]) => ({ group, items }));
});

const handleMenuAction = async (snapshotId: string, action: string) => {
    switch (action) {
        case 'restore':
            await props.onRestore(snapshotId);
            break;
        case 'rename':
            renamingId.value = snapshotId;
            newLabel.value = '';
            showRenameDialog.value = true;
            break;
        case 'delete':
            if (window.confirm('Are you sure you want to delete this version? This action cannot be undone.')) {
                await props.onDelete(snapshotId);
            }
            break;
    }
};

watch(listViewData, async () => {
    await nextTick();
    mountActionButtons();
}, { immediate: true });

const mountActionButtons = () => {
    listViewData.value.forEach((item) => {
        const host = document.getElementById(`vha-${item.id}`);
        if (!host) return;

        // Destroy any previously mounted DropDownButton on this host
        // so that the new instance always has a fresh reference to the
        // current props.onRestore / onDelete / onRename callbacks.
        const existingBtn = (host as any).__ej2DropDownBtn as InstanceType<typeof DropDownButton> | undefined;
        if (existingBtn) {
            existingBtn.destroy();
            host.innerHTML = '';
        }

        // Generation token: incremented each time a new button is mounted on
        // this host. The 'select' handler closes over the token value at
        // creation time. EJ2 DropDownButton fires a spurious 'select' event
        // asynchronously during destroy() (via the popup-close path), which
        // happens AFTER mountActionButtons returns and therefore AFTER any
        // synchronous flag would already be reset. By comparing the captured
        // token against the host's current token we reliably discard those
        // stale events no matter when they arrive.
        const prevToken: number = (host as any).__ej2BtnToken ?? 0;
        const myToken: number = prevToken + 1;
        (host as any).__ej2BtnToken = myToken;

        const menuItems = [
            { text: 'Restore', id: 'restore', iconCss: 'e-icons e-redo' },
            { text: 'Rename', id: 'rename', iconCss: 'e-icons e-edit' },
            { separator: true },
            { text: 'Delete', id: 'delete', iconCss: 'e-icons e-trash', cssClass: 'e-danger' },
        ];

        const btn = new DropDownButton({
            items: menuItems,
            cssClass: 'e-caret-hide e-small e-flat',
            iconCss: 'e-icons e-more-vertical-2',
            select: (args: any) => {
                // Only handle events that belong to this exact button instance.
                // A stale 'select' fired by the previous button after its
                // destroy() call will carry an outdated token and be ignored.
                if ((host as any).__ej2BtnToken !== myToken) return;
                handleMenuAction(item.id, args.item.id as string);
            },
        });
        btn.appendTo(host);
        // Store reference so we can destroy it on next refresh
        (host as any).__ej2DropDownBtn = btn;
    });
};

const handleRenameSave = async () => {
    if (renamingId.value && newLabel.value.trim() !== '') {
        await props.onRename(renamingId.value, newLabel.value);
    }
    showRenameDialog.value = false;
    renamingId.value = null;
    newLabel.value = '';
};

const handleRenameCancel = () => {
    showRenameDialog.value = false;
    renamingId.value = null;
    newLabel.value = '';
};
</script>

<template>
    <div v-if="props.isLoading" class="e-listview-loader e-list-template">
        <div class="e-spinner"><div class="e-spin-material"></div></div>
    </div>

    <div v-else-if="listViewData.length === 0" class="e-listview-empty e-list-template">
        <p class="empty-message">No versions yet. Create a snapshot to save your work.</p>
    </div>

    <ul v-else class="e-listview e-lib e-list-template version-history-list">
        <template v-for="group in groupedItems" :key="group.group">
            <!-- Group header -->
            <li class="e-list-group-item">
                <div class="e-list-group-header">
                    <span class="group-title">{{ group.group }}</span>
                </div>
            </li>
            <!-- Group items -->
            <li
                v-for="item in group.items"
                :key="item.id"
                class="e-list-item"
            >
                <div class="e-list-wrapper version-item-wrapper">
                    <div class="version-content">
                        <div class="version-label">
                            <h4 class="version-title">{{ item.headerText }}</h4>
                            <span v-if="item.isAutoLabel" class="auto-badge">[auto]</span>
                        </div>
                        <p class="version-meta">
                            {{ item.userName }}{{ item.label ? ` · ${item.timestamp}` : '' }}
                        </p>
                    </div>
                    <div class="version-actions">
                        <div :id="`vha-${item.id}`" class="version-action-host"></div>
                    </div>
                </div>
            </li>
        </template>
    </ul>

    <LabelRenameModal
        :visible="showRenameDialog"
        v-model:value="newLabel"
        @save="handleRenameSave"
        @cancel="handleRenameCancel"
    />
</template>
