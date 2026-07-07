<script setup lang="ts">
import { ref, computed } from 'vue';
import { TextBoxComponent } from '@syncfusion/ej2-vue-inputs';
import { ButtonComponent } from '@syncfusion/ej2-vue-buttons';
import { getCollaborationUrl, copyToClipboard } from '../../utils/urlHelpers';
import './CollaborationOption.css';

defineOptions({
    components: {
        'ejs-textbox': TextBoxComponent,
        'ejs-button': ButtonComponent
    }
});

const props = defineProps<{
    roomId: string;
    isConnected: boolean;
}>();

const copied = ref(false);

const collaborationUrl = computed(() => getCollaborationUrl(props.roomId));

const handleCopyLink = async () => {
    try {
        await copyToClipboard(collaborationUrl.value);
        copied.value = true;
        setTimeout(() => { copied.value = false; }, 2000);
    } catch (error) {
        console.error('Failed to copy link:', error);
    }
};
</script>

<template>
    <label for="collab-url" class="toolbar-label">⚡ Share Collaboration URL</label>
    <div class="room-url-container">
        <ejs-textbox
            id="collab-url"
            type="text"
            width="320px"
            :readOnly="true"
            cssClass="e-small"
            :value="collaborationUrl"
            aria-label="Collaboration room URL"
        />
        <ejs-button
            :cssClass="`copy-button e-small`"
            :iconCss="`e-icons ${copied ? 'e-check' : 'e-copy'}`"
            title="Copy collaboration link"
            aria-label="Copy collaboration link"
            @click="handleCopyLink"
        />
    </div>
</template>
