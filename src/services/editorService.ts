import type { BlockModel } from '@syncfusion/ej2-vue-blockeditor';
import type { CollaborationAdapter } from '@syncfusion/ej2-vue-blockeditor';
import type { InlineToolbarSettingsModel, ImageBlockSettingsModel } from '@syncfusion/ej2-vue-blockeditor';
import { DEFAULT_EDITOR_BLOCKS } from '../utils/mockData';

/**
 * Get default editor blocks
 */
export function getDefaultBlocks(): BlockModel[] {
    return JSON.parse(JSON.stringify(DEFAULT_EDITOR_BLOCKS));
}

/**
 * Get Blockeditor collaboration settings
 */
export function getCollaborationSettings(
    provider: any,
    adapter: CollaborationAdapter
): any {
    return {
        provider,
        adapter,
        enableAwareness: true,
        snapshotInterval: 3000,
    };
}

/**
 * Get inline toolbar settings for the block editor
 */
export function getInlineToolbarSettings(): InlineToolbarSettingsModel {
    const customToolbarItems: string[] = [
        'Transform', 'Bold', 'Italic', 'Underline', 'Strikethrough',
        'Uppercase', 'Lowercase', 'Subscript', 'Superscript',
        'InlineCode', 'Link', 'Color', 'Backgroundcolor'
    ];
    return { items: customToolbarItems };
}

/**
 * Get image block settings for the block editor
 */
export function getImageBlockSettings(): ImageBlockSettingsModel {
    return {
        saveUrl: 'https://services.syncfusion.com/react/production/api/RichTextEditor/SaveFile',
        path: 'https://services.syncfusion.com/react/production/RichTextEditor/'
    };
}

/**
 * Get Blockeditor configuration
 */
export function getBlockEditorConfig() {
    return {
        blocks: getDefaultBlocks(),
        toolbar: {
            items: ['undo', 'redo', 'formatTools', 'insertTools'],
        },
    };
}
