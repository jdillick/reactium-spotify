import Reactium from 'reactium-core/sdk';
import { sdk } from './sdk';
import op from 'object-path';
import _ from 'underscore';
import { gsap } from 'gsap';

const CHECK_TOKEN_EXPIRATION = 1000 * 60;

Reactium.Hook.register('sdk-init', async () => {
    console.log('Initializing Reactium.Spotify');

    Reactium.Spotify = sdk;
    Reactium.Pulse.register('MyComponent', Reactium.Spotify.oauth, {
        delay: CHECK_TOKEN_EXPIRATION, // check authentication every minute or so
    });

    Reactium.Routing.routeListeners.register('spotify-route-observer', {
        handler: async updates => {
            if (op.get(updates, 'active.match.route.path') !== '/callback') {
                Reactium.Spotify.oauth();

                const { transitionState, previous, current } = updates;
                if (op.get(current, 'match.route.zone') === 'main' && transitionState === 'LOADING') {
                    Reactium.Routing.nextState();
                }

                if ( transitionState === 'ENTERING') {
                    setTimeout(() => gsap.to([document.body, document.documentElement], { scrollTop: 0, duration: 1 }), 10);
                }
            }
        },
        order: Reactium.Enums.priority.low,
    });

});
