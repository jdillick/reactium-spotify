import React from 'react';
import { Helmet } from 'react-helmet';
import { Zone, useSyncState, __ } from 'reactium-core/sdk';
import { Link } from 'react-router-dom';
import op from 'object-path';
import mockPlaylists from '../Spotify/mock-playlists';

/**
 * -----------------------------------------------------------------------------
 * Functional Component: View
 * -----------------------------------------------------------------------------
 */
const View = props => {
    const state = useSyncState({
        title: __('Reactium Spotify Demo'),
        search: '',
        playlists: op.get(mockPlaylists, 'body.playlists.items', []),
        playlist: {},
        track: {},
        zone: 'main',
    });
    const zone = op.get(props, 'active.match.route.zone', 'main');
    const params = op.get(props, 'active.params', {});

    return (
        <>
            <Helmet titleTemplate='%s - Reactium Spotify'>
                <title>{state.get('title', '')}</title>
            </Helmet>

            <article className='m-xs-20'>
                <Link to='/'>
                    <h1>{state.get('title', '')}</h1>
                </Link>
                <Zone state={state} params={params} zone={zone} />
            </article>
        </>
    );
};

export default View;
