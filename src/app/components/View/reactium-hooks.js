/**
 * -----------------------------------------------------------------------------
 * Reactium Plugin View
 * -----------------------------------------------------------------------------
 */

import View from './index';
import Reactium from 'reactium-core/sdk';

Reactium.Plugin.register('View-plugin').then(() => {
    Reactium.Component.register('View', View);
});
