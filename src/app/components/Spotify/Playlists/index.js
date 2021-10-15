import React, { useEffect } from 'react';
import Reactium, { useEventEffect, __ } from 'reactium-core/sdk';
import Search from './Search';
import Playlist from './Playlist';
import _ from 'underscore';
import op from 'object-path';

const Playlists = ({ state }) => {
    useEffect(() => {
        state.set('title', __('Search Playlists'));
    }, []);

    const searchEventHandler = async e => {
        if (e.__path === 'search' && e.value.length > 3) {
            const results = await Reactium.Spotify.api.searchPlaylists(
                state.get('search'),
            );
            state.set('playlists', op.get(results, 'body.playlists.items', []));
        }
    };

    useEventEffect(
        state,
        {
            set: _.throttle(searchEventHandler, 1000),
        },
        [],
    );

    return (
        <>
            <Search state={state} />

            <ul className='playlists-list row'>
                {state.get('playlists', []).map(playlist => (
                    <li
                        key={playlist.id}
                        className='playlist-item col-sm-12 col-md-3'>
                        <Playlist playlist={playlist} />
                    </li>
                ))}
            </ul>
        </>
    );
};

export default Playlists;
