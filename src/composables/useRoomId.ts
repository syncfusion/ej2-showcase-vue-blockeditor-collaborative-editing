import { ref, onMounted, onUnmounted } from 'vue';
import { getOrCreateRoomId, getRoomIdFromHash } from '../utils/roomIdGenerator';

/**
 * Composable for room ID management
 */
export function useRoomId() {
    const roomId = ref<string>(getOrCreateRoomId());

    const handleHashChange = () => {
        const hashRoomId = getRoomIdFromHash();
        if (hashRoomId && hashRoomId !== roomId.value) {
            roomId.value = hashRoomId;
        }
    };

    onMounted(() => window.addEventListener('hashchange', handleHashChange));
    onUnmounted(() => window.removeEventListener('hashchange', handleHashChange));

    const setRoomId = (newRoomId: string) => {
        roomId.value = newRoomId;
        window.location.hash = newRoomId;
    };

    return { roomId, setRoomId };
}
