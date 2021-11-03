/**
 * -----------------------------------------------------------------------------
 * Reactium Plugin TrackQueue
 * -----------------------------------------------------------------------------
 */

import Component from './index';
import Reactium from 'reactium-core/sdk';

Reactium.Plugin.register('TrackQueue-plugin').then(() => {
    Reactium.Component.register('TrackQueue', Component);
});
