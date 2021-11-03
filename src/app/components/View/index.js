import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Reactium, {
    Zone,
    useRegisterSyncHandle,
    __,
    useHookComponent,
} from 'reactium-core/sdk';
import { Link } from 'react-router-dom';
import { Feather } from 'components/common-ui/Icon';
import op from 'object-path';
import mockPlaylists from '../Spotify/mock-playlists';
import _ from 'underscore';
import { extendHandle } from './handle';

/**
 * -----------------------------------------------------------------------------
 * Functional Component: View
 * -----------------------------------------------------------------------------
 */
const View = props => {
    const zone = op.get(props, 'active.match.route.zone', 'main');
    const activePath = op.get(props, 'active.match.route.path', '/');
    const isHome = activePath === '/';
    const params = op.get(props, 'active.params', {});
    const Loading = useHookComponent('Loading');
    const handle = useRegisterSyncHandle('SpotifyDemo', {
        title: __('Reactium Spotify Demo'),
        search: 'mood',
        playlists: op.get(mockPlaylists, 'body.playlists.items', []),
        playlist: {},
        track: {},
        zone: 'main',
        volume: Reactium.Prefs.get('volume', 0.5),
        status: { paused: true, position: 0 },
        queue: Reactium.Prefs.get('queue', []),
    });
    extendHandle(handle);

    useEffect(() => {
        if (Reactium.Spotify.player) {
            Reactium.Spotify.player.addListener(
                'player_state_changed',
                handle.playerStateChanged,
            );

            return () =>
                Reactium.Spotify.player.removeListener(
                    'player_state_changed',
                    handle.playerStateChanged,
                );
        }
    }, [Reactium.Spotify.player]);

    const transitionState = op.get(props, 'transitionState', 'LOADING');

    return (
        <>
            <Helmet titleTemplate='%s - Reactium Spotify'>
                <title>{handle.get('title', '')}</title>
            </Helmet>

            <main className='view p-xs-20'>
                <header className='view-header'>
                    <Zone params={params} zone={'view-header'} />
                    {!isHome && (
                        <Link to='/' className={'home-link mr-xs-4'}>
                            <span className='sr-only'>
                                {__('Back to Home')}
                            </span>
                            <Feather.Home />
                        </Link>
                    )}
                    <h1>{handle.get('title', '')}</h1>
                </header>

                {transitionState === 'LOADING' && <Loading />}
                <Zone
                    params={params}
                    zone={zone}
                    transitionState={transitionState}
                />
                <footer className='view-footer'>
                    <Zone zone={'view-footer'} />
                </footer>
            </main>
        </>
    );
};

export default View;
