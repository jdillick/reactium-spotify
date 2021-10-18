import Reactium from 'reactium-core/sdk';
import { sdk } from './sdk';
import op from 'object-path';

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
                console.log('Checking oauth...', op.get(updates, 'active.match.route.path'));
                Reactium.Spotify.oauth();

                const { transitionState, previous, current } = updates;
                if (op.get(current, 'match.route.zone') === 'main' && transitionState === 'LOADING') {
                    Reactium.Routing.nextState();
                }
            }
        },
        order: Reactium.Enums.priority.low,
    });

});
