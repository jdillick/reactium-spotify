import React, { useEffect } from 'react';
import Reactium, {
    useEventEffect,
    __,
    useRefs,
    useSelectHandle,
} from 'reactium-core/sdk';
import Search from './Search';
import Playlist from './Playlist';
import _ from 'underscore';
import op from 'object-path';
import { gsap } from 'gsap';

const Playlists = ({ transitionState }) => {
    const { handle, selected: playlists } = useSelectHandle(
        'SpotifyDemo',
        'playlists',
        [],
    );

    const refs = useRefs();

    useEffect(() => {
        handle.setPageTitle(__('Search Playlists'));
    }, []);

    const searchEventHandler = async e => {
        if (e.__path === 'search' && e.value.length > 3) {
            const results = await Reactium.Spotify.api.searchPlaylists(
                handle.get('search', 'mood'),
            );
            await new Promise(exitingAnimation);
            handle.setPlaylists(op.get(results, 'body.playlists.items', []));
            enteringAnimation();
        }
    };

    useEventEffect(
        handle,
        {
            set: _.throttle(searchEventHandler, 1500),
        },
        [],
    );

    const exitingAnimation = (onComplete = () => {}) => {
        gsap.fromTo(
            Object.values(refs.get()),
            { x: '0', rotationX: 0, rotationY: 0, scale: 1 },
            {
                x: '100vw',
                stagger: '.05',
                rotationX: 180,
                rotationY: 180,
                scale: 0,
                onComplete,
            },
        );
    };

    const enteringAnimation = (onComplete = () => {}) => {
        gsap.fromTo(
            Object.values(refs.get()),
            { x: '100vw', rotationX: 180, rotationY: 180, scale: 0 },
            {
                x: '0',
                stagger: '.05',
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
        <>
            {transitionState === 'READY' && <Search state={handle} />}
            {transitionState !== 'READY' && (
                <span className='search-spacer'></span>
            )}

            <ul className='playlists-list row'>
                {playlists.map((playlist, index) => (
                    <li
                        key={playlist.id}
                        className='playlist-item col-xs-12 col-sm-6 col-md-3'>
                        <Playlist
                            playlist={playlist}
                            ref={el => refs.set(index, el)}
                        />
                    </li>
                ))}
            </ul>
        </>
    );
};

export default Playlists;
