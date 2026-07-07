import { createApp } from 'vue';
import { registerLicense } from '@syncfusion/ej2-base';

// App styles
import './styles/globals.css';

// Syncfusion styles
import '@syncfusion/ej2-base/styles/tailwind3.css';
import '@syncfusion/ej2-inputs/styles/tailwind3.css';
import '@syncfusion/ej2-buttons/styles/tailwind3.css';
import '@syncfusion/ej2-popups/styles/tailwind3.css';
import '@syncfusion/ej2-splitbuttons/styles/tailwind3.css';
import '@syncfusion/ej2-navigations/styles/tailwind3.css';
import '@syncfusion/ej2-dropdowns/styles/tailwind3.css';
import '@syncfusion/ej2-layouts/styles/tailwind3.css';
import '@syncfusion/ej2-lists/styles/tailwind3.css';
import '@syncfusion/ej2-blockeditor/styles/tailwind3.css';

import App from './App.vue';

// Register Syncfusion license - the syncfusion-helper.js script loaded in index.html
// will set window.ej2LicenseKey if available; otherwise register with empty string
// to use the trial/community version.
const licenseKey = (window as any).ej2LicenseKey || '';
registerLicense(licenseKey);

createApp(App).mount('#app');
