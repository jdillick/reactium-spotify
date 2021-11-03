/**
 * -----------------------------------------------------------------------------
 * Reactium Plugin Modal
 * -----------------------------------------------------------------------------
 */

import component from './index';
import Reactium from 'reactium-core/sdk';

Reactium.Plugin.register('Modal-plugin').then(() => {
    Reactium.Component.register('Modal', component);
    Reactium.Zone.addComponent({
        zone: 'view-footer',
        component,
        order: Reactium.Enums.priority.lowest,
    });
});
