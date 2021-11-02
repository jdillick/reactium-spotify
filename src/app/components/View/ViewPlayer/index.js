import React from 'react';
import { useHookComponent, useSelectHandle } from 'reactium-core/sdk';

const ViewPlayer = () => {
    const { handle } = useSelectHandle('SpotifyDemo');
    const Player = useHookComponent('Player');

    // onForward = track => console.log('forward'),

    return (
        <>
            {handle.get('track.id') && (
                <Player
                    onPause={handle.pauseTrack}
                    onResume={handle.resumeTrack}
                    onVolumeChange={handle.setVolume}
                    onPositionChange={handle.seekPosition}
                    onBack={() => handle.seekPosition(0)}
                />
            )}
        </>
    );
};

export default ViewPlayer;
