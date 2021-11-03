import Reactium from 'reactium-core/sdk';
import _ from 'underscore';
import op from 'object-path';
import { __, HookComponent } from 'reactium-core/sdk';

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

    handle.extend(
        'seekPosition',
        _.throttle(async position => {
            handle.set('status.position', position);
            await Reactium.Spotify.seekPosition(position);
        }, 1000),
    );

    handle.extend('queueTrack', async track => {
        const queue = _.uniq(
            handle.get('queue', []).concat(track),
            false,
            ({ id }) => id,
        );
        handle.set('queue', queue);
        Reactium.Prefs.set('queue', queue);
        Reactium.toast(() => (
            <>
                <div className='mb-8'>{__('Queued:')}</div>
                <HookComponent hookName='TrackThumb' track={track} />
            </>
        ));
    });

    const copyMove = (arr = [], from, to) => {
        const newArray = [...arr];
        const item = op.get(arr, from);
        if (item) {
            newArray.splice(from, 1);
            newArray.splice(to, 0, item);
        }

        return newArray;
    };

    handle.extend('updateQueue', (source, destination) => {
        const newQueue = copyMove(
            handle.get('queue', Reactium.Prefs.get('queue', [])),
            op.get(source, 'index', 0),
            op.get(destination, 'index', 0),
        );
        handle.set('queue', newQueue);
        Reactium.Prefs.set('queue', newQueue);
    });

    handle.extend('dequeueTrack', trackId => {
        const newQueue = handle
            .get('queue', Reactium.Prefs.get('queue', []))
            .filter(({ id }) => id !== trackId);
        handle.set('queue', newQueue);
        Reactium.Prefs.set('queue', newQueue);
    });

    handle.extend('hasNextTrack', () => {
        const queue = handle.get('queue', Reactium.Prefs.get('queue', []));

        return queue.length > 0;
    });

    handle.extend('playNextTrack', () => {
        const queue = handle.get('queue', Reactium.Prefs.get('queue', []));

        if (queue.length > 0) {
            const index = queue.findIndex(
                track => track.id === handle.get('track.id'),
            );
            const track = op.get(
                queue,
                index < 0 ? 0 : (index + 1) % queue.length,
            );
            if (track) {
                handle.playTrack(track);
            }
        }
    });
};
