import React, { useEffect } from 'react';
import Reactium, { __ } from 'reactium-core/sdk';
import op from 'object-path';
import Track from 'components/Spotify/Track';

/**
 * -----------------------------------------------------------------------------
 * Functional Component: Playlist
 * -----------------------------------------------------------------------------
 */
const Playlist = ({ state, params }) => {
    const playlistId = op.get(params, 'playlistId');

    useEffect(() => {
        if (playlistId) {
            Reactium.Spotify.api.getPlaylist(playlistId).then(result => {
                const playlist = op.get(result, 'body', {});
                state.set(
                    'title',
                    __('Playlist: %s').replace(
                        '%s',
                        op.get(playlist, 'name', ''),
                    ),
                    false,
                );
                state.set('playlist', playlist);
            });
        }
    }, [playlistId]);

    return (
        <ul className='playlist row'>
            {state.get('playlist.tracks.items', []).map(({ track }) => (
                <li key={track.uri} className={'col-sm-12 col-md-4 p-20'}>
                    <Track 
                        track={track}
                        onPlay={track => {
                            state.set('track', {...track, status: 'stopped'}, false);
                            Reactium.Spotify.play(track)
                            state.set('track.status', 'playing');
                        }}
                        onPause={track => {
                            Reactium.Spotify.pause()
                            state.set('track.status', 'paused');
                        }}
                        onResume={track => {
                            Reactium.Spotify.resume()
                            state.set('track.status', 'playing');
                        }}
                        status={track.id === state.get('track.id') && state.get('track.status') ? state.get('track.status') : 'stopped'}
                     />
                </li>
            ))}
        </ul>
    );
};

export default Playlist;
