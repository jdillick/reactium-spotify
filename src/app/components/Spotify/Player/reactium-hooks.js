/**
 * -----------------------------------------------------------------------------
 * Reactium Plugin Player
 * -----------------------------------------------------------------------------
 */

import Player from './index';
import Reactium from 'reactium-core/sdk';

Reactium.Plugin.register('Player-plugin').then(() => {
    Reactium.Component.register('Player', Player);
});
