/**
 * -----------------------------------------------------------------------------
 * Reactium Plugin QueueItem
 * -----------------------------------------------------------------------------
 */

import Component from './index';
import Reactium from 'reactium-core/sdk';

Reactium.Plugin.register('QueueItem-plugin').then(() => {
    Reactium.Component.register('QueueItem', Component);
});
