<script setup lang="ts">
import { computed } from 'vue';
import { ListViewComponent } from '@syncfusion/ej2-vue-lists';
import type { FieldSettingsModel, SelectEventArgs } from '@syncfusion/ej2-lists';

defineOptions({ components: { 'ejs-listview': ListViewComponent } });

const props = defineProps<{
    id: string;
    dataSource?: any[];
    fields?: FieldSettingsModel;
    template?: ((data: any) => string) | string;
    headerTemplate?: ((data: any) => string) | string;
    groupTemplate?: ((data: any) => string) | string;
    cssClass?: string;
    showHeader?: boolean;
    headerTitle?: string;
    isLoading?: boolean;
    emptyMessage?: string;
    [key: string]: any;
}>();

const emit = defineEmits<{
    (e: 'select', args: SelectEventArgs): void;
}>();

const safeDataSource = computed(() => props.dataSource ?? []);

const handleSelect = (args: SelectEventArgs) => {
    if (args.data) {
        emit('select', args);
    }
};

const handleActionFailure = () => {
    console.warn(`ListView ${props.id}: Action failed`);
};
</script>

<template>
    <div v-if="props.isLoading" :class="`e-listview-loader ${props.cssClass ?? ''}`">
        <div class="e-spinner">
            <div class="e-spin-material"></div>
        </div>
    </div>
    <div v-else-if="safeDataSource.length === 0" :class="`e-listview-empty ${props.cssClass ?? ''}`">
        <p class="empty-message">{{ props.emptyMessage }}</p>
    </div>
    <ejs-listview
        v-else
        :id="props.id"
        :dataSource="safeDataSource"
        :fields="props.fields"
        :template="props.template"
        :headerTemplate="props.headerTemplate"
        :groupTemplate="props.groupTemplate"
        :showHeader="props.showHeader ?? true"
        :headerTitle="props.headerTitle"
        :cssClass="props.cssClass ?? ''"
        @select="handleSelect"
        @actionFailure="handleActionFailure"
    />
</template>
