import { ref, shallowRef, onUnmounted } from 'vue';
import type { Ref } from 'vue';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import {
    initializeCollaboration,
    cleanupCollaboration,
    getConnectionStatus,
} from '../services/collaborationService';
import type { CollaborationAdapter } from '@syncfusion/ej2-vue-blockeditor';

/**
 * Composable for collaboration setup with Yjs
 */
export function useCollaboration(roomId: Ref<string>) {
    const provider = ref<WebsocketProvider | null>(null);
    // shallowRef: only the .value assignment is reactive; the adapter's
    // properties (yXmlFragment, yRuntime) are never deep-proxied by Vue.
    // This keeps the raw Y.XmlFragment intact so Yjs identity checks
    // (event.target ===) and transaction encoding work correctly.
    const adapter = shallowRef<CollaborationAdapter | null>(null);
    const ydoc = ref<Y.Doc | null>(null);
    const isConnected = ref(false);
    const isSynced = ref(false);
    const error = ref<Error | null>(null);

    let cleanup: (() => void) | null = null;
    let syncInterval: number | null = null;

    const setup = async () => {
        try {
            const result = await initializeCollaboration(roomId.value);

            provider.value = result.provider;
            adapter.value = result.adapter;
            ydoc.value = result.ydoc;
            isConnected.value = getConnectionStatus(result.provider);

            const handleStatus = (event: { status: string }) => {
                isConnected.value = event.status === 'connected';
            };

            result.provider.on('status', handleStatus);

            syncInterval = window.setInterval(() => {
                if (result.provider.synced) {
                    isSynced.value = true;
                    if (syncInterval !== null) clearInterval(syncInterval);
                }
            }, 100);

            // Check initial sync state
            if (result.provider.synced) {
                isSynced.value = true;
            }

            cleanup = () => {
                if (syncInterval !== null) clearInterval(syncInterval);
                result.provider.off('status', handleStatus);
                cleanupCollaboration(result.ydoc, result.provider);
            };
        } catch (err) {
            error.value = err instanceof Error ? err : new Error(String(err));
        }
    };

    setup();

    onUnmounted(() => {
        cleanup?.();
    });

    return { provider, adapter, ydoc, isConnected, isSynced, error };
}
