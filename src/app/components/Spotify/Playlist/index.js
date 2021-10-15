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
    console.log({ playlistId });
    useEffect(() => {
        console.log('useEffect', { playlistId });

        if (playlistId) {
            Reactium.Spotify.api.getPlaylist(playlistId).then(result => {
                console.log({ result });
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

    console.log(state.get('playlist.tracks.items', []));
    return (
        <ul className='playlist row'>
            {state.get('playlist.tracks.items', []).map(({ track }) => (
                <li key={track.uri} className={'col-sm-12 col-md-4 p-10'}>
                    <Track track={track} />
                </li>
            ))}
        </ul>
    );
};

export default Playlist;
