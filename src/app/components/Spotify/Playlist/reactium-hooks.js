/**
 * -----------------------------------------------------------------------------
 * Reactium Plugin Playlist
 * -----------------------------------------------------------------------------
 */

import Playlist from './index';
import Reactium from 'reactium-core/sdk';

Reactium.Zone.addComponent({
    zone: ['playlist'],
    component: Playlist,
});