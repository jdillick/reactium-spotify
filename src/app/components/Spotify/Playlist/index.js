import React, { useEffect } from 'react';
import Reactium, { __, useRefs } from 'reactium-core/sdk';
import op from 'object-path';
import Track from 'components/Spotify/Track';
import { gsap } from 'gsap';
import _ from 'underscore';

/**
 * -----------------------------------------------------------------------------
 * Functional Component: Playlist
 * -----------------------------------------------------------------------------
 */
const Playlist = ({ state, params, transitionState }) => {
    const playlistId = op.get(params, 'playlistId');
    const refs = useRefs();

    useEffect(() => {
        const load = async () => {
            if (playlistId) {
                const result = await Reactium.Spotify.api.getPlaylist(
                    playlistId,
                );
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
                state.get('playlist.tracks.items', []).map(({ track }) => (
                    <li key={track.uri} className={'col-sm-12 col-md-4 p-20'}>
                        <Track
                            ref={el => refs.set([track.id], el)}
                            track={track}
                            onPlay={track => {
                                state.set(
                                    'track',
                                    { ...track, status: 'stopped' },
                                    false,
                                );
                                Reactium.Spotify.play(track);
                                state.set('track.status', 'playing');
                            }}
                            onPause={track => {
                                Reactium.Spotify.pause();
                                state.set('track.status', 'paused');
                            }}
                            onResume={track => {
                                Reactium.Spotify.resume();
                                state.set('track.status', 'playing');
                            }}
                            status={
                                track.id === state.get('track.id') &&
                                state.get('track.status')
                                    ? state.get('track.status')
                                    : 'stopped'
                            }
                        />
                    </li>
                ))}
        </ul>
    );
};

export default Playlist;
