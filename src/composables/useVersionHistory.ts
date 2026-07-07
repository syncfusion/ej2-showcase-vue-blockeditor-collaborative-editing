import { ref, watch, nextTick } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import type { IVersionHistory, VersionSnapshot } from '@syncfusion/ej2-vue-blockeditor';
import type { IndexedDBVersionStorage } from '../services/versionHistoryService';

/**
 * Composable for version history management
 */
export function useVersionHistory(
    versionHistory: Ref<IVersionHistory | null>,
    storage: Ref<IndexedDBVersionStorage> | ComputedRef<IndexedDBVersionStorage>
) {
    const snapshots = ref<VersionSnapshot[]>([]);
    const isLoading = ref(false);
    const error = ref<Error | null>(null);

    const refreshSnapshots = async () => {
        if (!versionHistory.value) return;
        try {
            isLoading.value = true;
            snapshots.value = versionHistory.value.getSnapshots();
            error.value = null;
        } catch (err) {
            error.value = err instanceof Error ? err : new Error(String(err));
        } finally {
            isLoading.value = false;
        }
    };

    // Auto-load existing snapshots from IndexedDB as soon as the
    // version plugin becomes available (e.g. after page refresh).
    watch(versionHistory, (plugin) => {
        if (plugin) {
            // First pass — may already have data when the sidebar is
            // opened after the initial load settles.
            refreshSnapshots();
            // Second pass — wait for the plugin's async IndexedDB hydration.
            setTimeout(() => refreshSnapshots(), 300);
        }
    });

    const createSnapshot = async (label: string, lastModifiedBy: string) => {
        if (!versionHistory.value) return;
        try {
            isLoading.value = true;
            await versionHistory.value.createSnapshot({ label, modifiedBy: lastModifiedBy });
            await refreshSnapshots();
        } catch (err) {
            error.value = err instanceof Error ? err : new Error(String(err));
        } finally {
            isLoading.value = false;
        }
    };

    const restoreSnapshot = async (id: string) => {
        if (!versionHistory.value) return;
        try {
            isLoading.value = true;
            await versionHistory.value.restoreSnapshot(id);
            // Wait for Vue + Yjs sync-plugin to flush the restored state into
            await nextTick();
            await refreshSnapshots();
        } catch (err) {
            error.value = err instanceof Error ? err : new Error(String(err));
        } finally {
            isLoading.value = false;
        }
    };

    const deleteSnapshot = async (id: string) => {
        if (!versionHistory.value) return;
        try {
            isLoading.value = true;
            await versionHistory.value.deleteSnapshot(id);
            await refreshSnapshots();
        } catch (err) {
            error.value = err instanceof Error ? err : new Error(String(err));
        } finally {
            isLoading.value = false;
        }
    };

    const renameSnapshot = async (id: string, newLabel: string) => {
        if (!versionHistory.value) return;
        try {
            isLoading.value = true;
            await versionHistory.value.renameSnapshot(id, newLabel);
            await refreshSnapshots();
        } catch (err) {
            error.value = err instanceof Error ? err : new Error(String(err));
        } finally {
            isLoading.value = false;
        }
    };

    const clearAllSnapshots = async () => {
        try {
            isLoading.value = true;
            for (const snapshot of snapshots.value) {
                try {
                    if (versionHistory.value) {
                        await versionHistory.value.deleteSnapshot(snapshot.id);
                    }
                } catch (err) {
                    console.warn(`Failed to delete snapshot ${snapshot.id}:`, err);
                }
            }
            await storage.value.clearAll();
            snapshots.value = [];
            error.value = null;
        } catch (err) {
            error.value = err instanceof Error ? err : new Error(String(err));
        } finally {
            isLoading.value = false;
        }
    };

    return {
        snapshots,
        isLoading,
        error,
        refreshSnapshots,
        createSnapshot,
        restoreSnapshot,
        deleteSnapshot,
        renameSnapshot,
        clearAllSnapshots,
    };
}
