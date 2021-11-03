/**
 * -----------------------------------------------------------------------------
 * Reactium Plugin TrackThumb
 * -----------------------------------------------------------------------------
 */

import Component from './index';
import Reactium from 'reactium-core/sdk';

Reactium.Plugin.register('TrackThumb-plugin').then(() => {
    Reactium.Component.register('TrackThumb', Component);
});
