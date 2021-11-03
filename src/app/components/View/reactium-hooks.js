/**
 * -----------------------------------------------------------------------------
 * Reactium Plugin View
 * -----------------------------------------------------------------------------
 */

import View from './index';
import Reactium from 'reactium-core/sdk';
import { ToastContainer, toast } from 'react-toastify';

Reactium.Plugin.register('View-plugin').then(() => {
    Reactium.Component.register('View', View);
    Reactium.Zone.addComponent({
        zone: 'view-header',
        component: ToastContainer,
    });
    Reactium.toast = toast;
});
