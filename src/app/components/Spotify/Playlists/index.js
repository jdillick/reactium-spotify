import React from 'react';
import Reactium, { useEventEffect, useSyncState } from 'reactium-core/sdk';
import Search from './Search';
import Playlist from './Playlist';
import _ from 'underscore';
import op from 'object-path';
import mockPlaylists from '../mock-playlists';

const Playlists = () => {
    const state = useSyncState({ search: '', playlists: op.get(mockPlaylists, 'body.playlists.items', []) });
    const searchEventHandler = async e => {
        if (e.__path === 'search' && e.value.length > 3) {
            console.log('_set', e);
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

    console.log(state);

    return (
        <>
            <Search state={state} />

            <ul className='playlists-list row'>
                {state.get('playlists', []).map(playlist => (
                    <li key={playlist.id} className='playlist-item col-sm-12 col-md-3'>
                        <Playlist playlist={playlist} />
                    </li>
                ))}
            </ul>
        </>
    );
};

export default Playlists;
