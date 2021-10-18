import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Reactium, {
    Zone,
    useSyncState,
    __,
    useHookComponent,
} from 'reactium-core/sdk';
import { Link } from 'react-router-dom';
import { Feather } from 'components/common-ui/Icon';
import op from 'object-path';
import mockPlaylists from '../Spotify/mock-playlists';
import _ from 'underscore';

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
    const activePath = op.get(props, 'active.match.route.path', '/');
    const isHome = activePath === '/';
    const params = op.get(props, 'active.params', {});

    useEffect(() => {
        const playerHandler = status => {
            if (state.get('track.id') && status.paused) {
                state.set('track.status', 'paused');
            }
        };

        setTimeout(() => {
            Reactium.Spotify.player &&
                Reactium.Spotify.player.addListener(
                    'player_state_changed',
                    playerHandler,
                );
        }, 250);
    }, []);

    const Loading = useHookComponent('Loading');
    const transitionState = op.get(props, 'transitionState', 'LOADING');

    return (
        <>
            <Helmet titleTemplate='%s - Reactium Spotify'>
                <title>{state.get('title', '')}</title>
            </Helmet>

            <article className='view m-xs-20'>
                <div className='view-header'>
                    {!isHome && (
                        <Link to='/' className={'home-link mr-xs-4'}>
                            <span className='sr-only'>Back to Home</span><Feather.Home />
                        </Link>
                    )}
                    <h1>{state.get('title', '')}</h1>
                </div>
                {transitionState === 'LOADING' && <Loading />}
                <Zone
                    state={state}
                    params={params}
                    zone={zone}
                    transitionState={transitionState}
                />
            </article>
        </>
    );
};

export default View;
