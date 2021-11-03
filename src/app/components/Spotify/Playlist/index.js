import React, { useEffect } from 'react';
import Reactium, { __, useRefs, useSelectHandle } from 'reactium-core/sdk';
import op from 'object-path';
import Track from 'components/Spotify/Track';
import { gsap } from 'gsap';
import _ from 'underscore';

/**
 * -----------------------------------------------------------------------------
 * Functional Component: Playlist
 * -----------------------------------------------------------------------------
 */
const Playlist = ({ params, transitionState }) => {
    const { handle, selected: tracks } = useSelectHandle(
        'SpotifyDemo',
        'playlist.tracks.items',
        [],
    );

    const playlistId = op.get(params, 'playlistId');
    const refs = useRefs();

    useEffect(() => {
        const load = async () => {
            if (playlistId) {
                const playlist = await Reactium.Spotify.getPlaylist(playlistId);
                handle.setPageTitle(
                    __('Playlist: %s').replace(
                        '%s',
                        op.get(playlist, 'name', ''),
                    ),
                );
                handle.setPlaylist(playlist);
                _.defer(() => Reactium.Routing.nextState());
            }
        };

        load();
    }, [playlistId]);

    const exitingAnimation = (onComplete = () => {}) => {
        const objects = Object.values(refs.get());
        if (objects)
            gsap.fromTo(
                objects,
                { x: '0', rotationX: 0, rotationY: 0, scale: 1 },
                {
                    x: '100vw',
                    stagger: '.02',
                    rotationX: 180,
                    rotationY: 180,
                    scale: 0,
                    onComplete,
                },
            );
    };

    const enteringAnimation = async (onComplete = () => {}) => {
        const objects = Object.values(refs.get());
        if (objects)
            gsap.fromTo(
                objects,
                { x: '100vw', rotationX: 180, rotationY: 180, scale: 0 },
                {
                    x: '0',
                    stagger: '.02',
                    rotationX: 0,
                    rotationY: 0,
                    scale: 1,
                    onComplete,
                },
            );
    };

    useEffect(() => {
        if (transitionState === 'ENTERING') {
            enteringAnimation(() => {
                Reactium.Routing.nextState();
            });
        } else if (transitionState === 'EXITING') {
            exitingAnimation(() => {
                Reactium.Routing.nextState();
            });
        }
    }, [transitionState]);

    return (
        <ul className={'playlist row transitions'}>
            {transitionState !== 'LOADING' &&
                tracks.map(({ track }) => (
                    <li
                        key={track.uri}
                        className={
                            'col-sm-12 col-md-6 col-lg-4 p-md-20 pb-xs-20'
                        }>
                        <Track
                            ref={el => refs.set([track.id], el)}
                            track={track}
                            onPlay={handle.playTrack}
                            onPause={handle.pauseTrack}
                            onResume={handle.resumeTrack}
                            onQueue={handle.queueTrack}
                            status={
                                track.id === handle.get('track.id') &&
                                handle.get('track.status')
                                    ? handle.get('track.status')
                                    : 'stopped'
                            }
                        />
                    </li>
                ))}
        </ul>
    );
};

export default Playlist;
