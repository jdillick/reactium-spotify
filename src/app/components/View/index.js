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

const extendHandle = handle => {
    handle.extend('setPageTitle', title => handle.set('title', title));
    handle.extend('setPlaylists', playlists => handle.set('playlists', playlists));
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
            if (track) handle.setTrack({
                ...track,
                status: status.paused ? 'paused' : 'playing',
            })

            else handle.setTrack({});
        }
    });
}

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
        search: '',
        playlists: op.get(mockPlaylists, 'body.playlists.items', []),
        playlist: {},
        track: {},
        zone: 'main',
    });
    extendHandle(handle);

    console.log({handle});

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

            <article className='view p-xs-20'>
                <div className='view-header'>
                    <Zone params={params} zone={'header'} />
                    {!isHome && (
                        <Link to='/' className={'home-link mr-xs-4'}>
                            <span className='sr-only'>{__('Back to Home')}</span>
                            <Feather.Home />
                        </Link>
                    )}
                    <h1>{handle.get('title', '')}</h1>
                </div>

                {transitionState === 'LOADING' && <Loading />}
                <Zone
                    params={params}
                    zone={zone}
                    transitionState={transitionState}
                />
            </article>
        </>
    );
};

export default View;
