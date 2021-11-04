import Reactium from 'reactium-core/sdk';
import { sdk } from './sdk';
import op from 'object-path';
import _ from 'underscore';
import { gsap } from 'gsap';

const CHECK_TOKEN_EXPIRATION = 1000 * 60;

// check auth everywhere except toolkit or auth callback path
const shouldAuth = path => !(path === '/callback' || /^\/toolkit/.test(path));

Reactium.Hook.register('sdk-init', async () => {
    console.log('Initializing Reactium.Spotify');

    Reactium.Spotify = sdk;
    Reactium.Pulse.register(
        'SpotifyAuthCheck',
        () => {
            if (
                authPaths(op.get(Routing, 'currentRoute.location.pathname', ''))
            ) {
                Reactium.Spotify.oauth();
            }
        },
        {
            delay: CHECK_TOKEN_EXPIRATION, // check authentication every minute or so
        },
    );

    // How to register a callback that listens for route changes
    Reactium.Routing.routeListeners.register('spotify-route-observer', {
        handler: async updates => {
            const urlPath = op.get(updates, 'active.match.route.path');
            if (shouldAuth(urlPath)) {
                Reactium.Spotify.oauth();

                const { transitionState, previous, current } = updates;
                if (
                    op.get(current, 'match.route.zone') === 'main' &&
                    transitionState === 'LOADING'
                ) {
                    Reactium.Routing.nextState();
                }

                if (transitionState === 'ENTERING') {
                    setTimeout(
                        () =>
                            gsap.to([document.body, document.documentElement], {
                                scrollTop: 0,
                                duration: 1,
                            }),
                        10,
                    );
                }
            }
        },
        order: Reactium.Enums.priority.low,
    });
});
