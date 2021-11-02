import Reactium from 'reactium-core/sdk';
import _ from 'underscore';
import op from 'object-path';

export const extendHandle = handle => {
    handle.extend('setPageTitle', title => handle.set('title', title));
    handle.extend('setPlaylists', playlists =>
        handle.set('playlists', playlists),
    );
    handle.extend('setPlaylist', playlist => handle.set('playlist', playlist));
    handle.extend('setTrack', track => handle.set('track', track));
    handle.extend('playTrack', track => {
        Reactium.Spotify.play(track);
        handle.set('track', {
            ...track,
            status: 'playing',
        });
    });

    handle.extend('pauseTrack', track => {
        Reactium.Spotify.pause();
        handle.set('track.status', 'paused');
    });

    handle.extend('resumeTrack', track => {
        Reactium.Spotify.resume();
        handle.set('track.status', 'playing');
    });

    handle.extend('setTrackStatus', status => {
        handle.set('status', status);
    });

    handle.extend('playerStateChanged', async status => {
        handle.setTrackStatus(status);
        const track = handle.get('track', {});

        if (track.id !== op.get(status, 'track_window.current_track.id')) {
            const track = await Reactium.Spotify.getCurrentTrack();
            if (track)
                handle.setTrack({
                    ...track,
                    status: status.paused ? 'paused' : 'playing',
                });
            else handle.setTrack({});
        }
    });

    handle.extend('setVolume', async volume => {
        await Reactium.Spotify.setVolume(volume);
        Reactium.Prefs.set('volume', volume);
        handle.set('volume', volume);
    });

    handle.extend('seekPosition', _.throttle(async position => {
        handle.set('status.position', position);
        await Reactium.Spotify.seekPosition(position);
    }, 1000));
};
