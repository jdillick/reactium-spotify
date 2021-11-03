import React from 'react';
import { __, useHookComponent, useRegisterSyncHandle } from 'reactium-core/sdk';
import mockTracks from 'components/Spotify/mock-tracks';
import op from 'object-path';

export default () => {
    const { Element } = useHookComponent('RTK');
    const Player = useHookComponent('Player');
    const state = useRegisterSyncHandle('SpotifyDemo', {
        track: { ...op.get(mockTracks, 'body.tracks.items.1', {}) },
        status: {
            timestamp: 1635874612046,
            position: 6340,
            duration: 206155,
            paused: true,
            shuffle: false,
            repeat_mode: 0,
        },
    });

    return (
        <Element title={__('Player')}>
            <div className='m-20'>
                <Player />
            </div>
        </Element>
    );
};
