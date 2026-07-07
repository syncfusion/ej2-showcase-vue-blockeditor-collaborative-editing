<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import type { ImageBlockSettingsModel, InlineToolbarSettingsModel } from '@syncfusion/ej2-vue-blockeditor';
import { ToolbarComponent, ItemsDirective, ItemDirective } from '@syncfusion/ej2-vue-navigations';
import SyncfusionBlockEditor from '../syncfusion/SyncfusionBlockEditor.vue';
import SyncfusionButton from '../syncfusion/SyncfusionButton.vue';
import ExportOption from '../Toolbar/ExportOption.vue';
import ToggleOption from '../Toolbar/ToggleOption.vue';
import CollaborationOption from '../Toolbar/CollaborationOption.vue';
import ConnectionStatus from '../common/ConnectionStatus.vue';
import turndownService from '../../services/turndownService';
import './EditorContainer.css';

defineOptions({
    components: {
        'ejs-toolbar': ToolbarComponent,
        'e-items': ItemsDirective,
        'e-item': ItemDirective,
    }
});

const props = defineProps<{
    blocks?: any[];
    users?: any[];
    currentUserId?: string;
    collaborationSettings?: any;
    collaboratorCount?: number;
    activePanel?: 'collab' | 'versions' | null;
    roomId: string;
    isConnected: boolean;
    inlineToolbarSettings: InlineToolbarSettingsModel;
    imageBlockSettings: ImageBlockSettingsModel;
    onCreated: () => void;
}>();

const emit = defineEmits<{
    (e: 'panelToggle', panel: 'collab' | 'versions'): void;
}>();

const editorRef = ref<InstanceType<typeof SyncfusionBlockEditor> | null>(null);
defineExpose({ editorRef });

// Template content refs — rendered by Vue, then physically moved into toolbar slots
const leftContentRef  = ref<HTMLElement | null>(null);
const rightContentRef = ref<HTMLElement | null>(null);
const toolbarRef      = ref<InstanceType<typeof ToolbarComponent> | null>(null);

// After the EJ2 Toolbar creates its DOM, move Vue-rendered nodes into the
// left / right item placeholder elements that EJ2 inserts for type="Input" items.
const onToolbarCreated = async () => {
    await nextTick(); // let Vue finish rendering the content refs
    const toolbarEl = (toolbarRef.value as any)?.$el as HTMLElement | undefined;
    if (!toolbarEl || !leftContentRef.value || !rightContentRef.value) return;

    const leftSlot  = toolbarEl.querySelector<HTMLElement>('.e-toolbar-left  .e-toolbar-item .e-tbar-btn-text, .e-toolbar-left  .e-toolbar-item');
    const rightSlot = toolbarEl.querySelector<HTMLElement>('.e-toolbar-right .e-toolbar-item .e-tbar-btn-text, .e-toolbar-right .e-toolbar-item');

    if (leftSlot)  { leftSlot.innerHTML  = ''; leftSlot.appendChild(leftContentRef.value); }
    if (rightSlot) { rightSlot.innerHTML = ''; rightSlot.appendChild(rightContentRef.value); }

    leftContentRef.value.style.display  = '';
    rightContentRef.value.style.display = '';
};

const exportMenuItems = [
    { text: 'Export as JSON', id: 'export-json', iconCss: 'e-icons e-download' },
    { text: 'Export as HTML', id: 'export-html', iconCss: 'e-icons e-download' },
    { text: 'Export as Markdown', id: 'export-markdown', iconCss: 'e-icons e-download' },
];

const panelMenuItems = [
    { text: 'Active Collaborators', id: 'show-collaborators', iconCss: 'e-icons e-people' },
    { text: 'Version History', id: 'show-versions', iconCss: 'e-icons e-history' },
];

const collaboratorCount = computed(() => props.collaboratorCount ?? 0);

const handleExport = (args: any) => {
    const editorInst = editorRef.value?.editorRef?.ej2Instances;
    if (!editorInst) return;

    const selected = args.item.text.toLowerCase();
    const format = selected.includes('json') ? 'json' : selected.includes('markdown') ? 'markdown' : 'html';

    try {
        if (format === 'json') {
            const data = editorInst.getDataAsJson();
            downloadFile(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), `editor-${Date.now()}.json`);
        } else if (format === 'html') {
            const data = editorInst.getDataAsHtml();
            downloadFile(new Blob([data], { type: 'text/html' }), `editor-${Date.now()}.html`);
        } else {
            const html = editorInst.getDataAsHtml();
            const md = turndownService.turndown(html || '');
            downloadFile(new Blob([md], { type: 'text/markdown;charset=utf-8' }), `editor-${Date.now()}.md`);
        }
    } catch (error) {
        console.error('Export failed:', error);
    }
};

const handlePanelToggle = (args: any) => {
    const action = args.item.id;
    if (action === 'show-collaborators') emit('panelToggle', 'collab');
    else if (action === 'show-versions') emit('panelToggle', 'versions');
};

function downloadFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
</script>

<template>
    <div class="editor-container">
        <!-- Vue-rendered toolbar content — hidden until EJ2 toolbar is ready,
             then physically moved into the left/right toolbar item slots -->
        <div ref="leftContentRef" style="display:none">
            <div class="collaboration-toolbar-wrapper">
                <div class="toolbar-section-left">
                    <CollaborationOption
                        :roomId="props.roomId"
                        :isConnected="props.isConnected"
                    />
                </div>
                <div class="toolbar-section-right">
                    <ConnectionStatus :isConnected="props.isConnected" />
                </div>
            </div>
        </div>
        <div ref="rightContentRef" style="display:none">
            <div class="toolbar-right">
                <SyncfusionButton iconCss="e-icons e-people" cssClass="e-small e-info">
                    {{ collaboratorCount }} {{ collaboratorCount === 1 ? 'person' : 'people' }}
                </SyncfusionButton>
                <ExportOption
                    :exportMenuItems="exportMenuItems"
                    @export="handleExport"
                />
                <ToggleOption
                    :panelMenuItems="panelMenuItems"
                    @panelToggle="handlePanelToggle"
                />
            </div>
        </div>

        <div class="toolbar-area">
            <ejs-toolbar
                ref="toolbarRef"
                cssClass="editor-toolbar"
                @created="onToolbarCreated"
            >
                <e-items>
                    <e-item type="Input" align="Left" />
                    <e-item type="Input" align="Right" />
                </e-items>
            </ejs-toolbar>
        </div>

        <div class="editor-area">
            <SyncfusionBlockEditor
                ref="editorRef"
                id="block-editor"
                height="600px"
                width="auto"
                :blocks="props.blocks ?? []"
                :users="props.users"
                :currentUserId="props.currentUserId"
                :collaborationSettings="props.collaborationSettings"
                :created="props.onCreated"
                :inlineToolbarSettings="props.inlineToolbarSettings"
                :imageBlockSettings="props.imageBlockSettings"
            />
        </div>
    </div>
</template>
