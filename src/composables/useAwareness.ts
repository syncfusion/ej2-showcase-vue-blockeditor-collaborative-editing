import { ref, watch, onUnmounted } from 'vue';
import type { Ref } from 'vue';
import { WebsocketProvider } from 'y-websocket';
import type { UserModel } from '@syncfusion/ej2-vue-blockeditor';

export interface AwarenessState {
    user?: UserModel;
    cursor?: any;
}

/**
 * Composable for awareness tracking (active collaborators)
 */
export function useAwareness(
    provider: Ref<WebsocketProvider | null>,
    currentUser: Ref<UserModel>
) {
    const collaborators = ref<UserModel[]>([]);
    let cleanupAwareness: (() => void) | null = null;

    watch(
        provider,
        (p) => {
            cleanupAwareness?.();
            if (!p) return;

            const awareness = p.awareness;

            awareness.setLocalState({
                user: {
                    id: currentUser.value.id,
                    user: currentUser.value.user,
                    avatarBgColor: currentUser.value.avatarBgColor,
                }
            });

            const handleChange = () => {
                const states = awareness.getStates() as Map<number, AwarenessState>;
                const list: UserModel[] = [];
                states.forEach((state) => {
                    if (state?.user && state.user.id !== currentUser.value.id) {
                        list.push(state.user);
                    }
                });
                collaborators.value = list;
            };

            awareness.on('change', handleChange);
            handleChange();

            cleanupAwareness = () => awareness.off('change', handleChange);
        },
        { immediate: true }
    );

    onUnmounted(() => cleanupAwareness?.());

    return { collaborators };
}
