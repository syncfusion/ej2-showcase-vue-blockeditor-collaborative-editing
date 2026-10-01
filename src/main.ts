import { createApp } from 'vue';
import { registerLicense } from '@syncfusion/ej2-base';

// App styles
import './styles/globals.css';

// Syncfusion styles
import '@syncfusion/ej2-tailwind3-theme/styles/sidebar/index.css';
import '@syncfusion/ej2-tailwind3-theme/styles/list-view/index.css';
import '@syncfusion/ej2-tailwind3-theme/styles/blockeditor/index.css';

import App from './App.vue';

// Register Syncfusion license - the syncfusion-helper.js script loaded in index.html
// will set window.ej2LicenseKey if available; otherwise register with empty string
// to use the trial/community version.
const licenseKey = (window as any).ej2LicenseKey || '';
registerLicense(licenseKey);

createApp(App).mount('#app');
