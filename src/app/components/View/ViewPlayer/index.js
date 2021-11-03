import React from 'react';
import { useHookComponent, useSelectHandle } from 'reactium-core/sdk';

const ViewPlayer = () => {
    const { handle } = useSelectHandle('SpotifyDemo');
    const { handle: modal } = useSelectHandle('Modal');
    const Player = useHookComponent('Player');
    const TrackQueue = useHookComponent('TrackQueue');

    return (
        <>
            {handle.get('track.id') && (
                <Player
                    onPause={handle.pauseTrack}
                    onResume={handle.resumeTrack}
                    onVolumeChange={handle.setVolume}
                    onPositionChange={handle.seekPosition}
                    onBack={() => handle.seekPosition(0)}
                    onForward={() => handle.playNextTrack()}
                    hasNextTrack={handle.hasNextTrack()}
                    onViewQueue={() => modal.open(TrackQueue)}
                />
            )}
        </>
    );
};

export default ViewPlayer;
