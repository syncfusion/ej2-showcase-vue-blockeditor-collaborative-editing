<script setup lang="ts">
import { computed } from 'vue';
import type { UserModel } from '@syncfusion/ej2-vue-blockeditor';
import './CollabPanel.css';

interface CollaboratorItem {
    id: string;
    displayName: string;
    avatarText: string;
    avatarColor: string;
}

const props = defineProps<{
    collaborators: UserModel[];
    currentUser: UserModel;
}>();

const getInitials = (name: string | undefined): string => {
    if (!name) return '';
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
};

const collaboratorItems = computed((): CollaboratorItem[] => {
    const allUsers = [props.currentUser, ...props.collaborators];
    return allUsers.map((user) => ({
        id: user.id || '',
        displayName: user.id === props.currentUser.id
            ? `${user.user} (You)`
            : (user.user as string),
        avatarText: getInitials(user.user as string),
        avatarColor: (user.avatarBgColor as string) || '#185fa5',
    }));
});
</script>

<template>
    <div class="collab-panel">
        <div class="collaborators-list">
            <ul v-if="collaboratorItems.length" class="e-listview e-lib e-list-template">
                <li
                    v-for="item in collaboratorItems"
                    :key="item.id"
                    class="e-list-item collaborator-item"
                >
                    <span
                        class="e-avatar e-avatar-circle e-avatar-small"
                        :style="{
                            backgroundColor: item.avatarColor,
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: '500',
                        }"
                    >{{ item.avatarText }}</span>
                    <div class="collaborator-info">
                        <span class="e-list-item-header">{{ item.displayName }}</span>
                    </div>
                </li>
            </ul>
            <div v-else class="empty-state">No collaborators yet</div>
        </div>
    </div>
</template>
