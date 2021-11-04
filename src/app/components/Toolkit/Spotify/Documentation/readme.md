# Spotify Demo

[Go to the demo!](/)

This is a demo of the Spotify API used to do something creative in the [Reactium Application Framework](https://docs.reactium.io)

## Code Highlights

Here are some selected bits of code from this application to help illustrate the simple power of the framework.

### Toolkit/Spotify/Documentation/readme.md

The file you are reading right now, rendered along with a couple components by the **@atomic-reactor/reactium-toolkit** plugin, which is kinda like Reactium "Storybook".

This plugin is installed using `arcli` and new elements can be created.

**bash**

```
# from reactium root directory

# installs plugin
arcli install @atomic-reactor/toolkit

# see help
arcli toolkit -h
```

### **Spotify/Auth/reactium-boot.js**

Here is an example how you would setup a environmental variable that can be used in both the front-end and backend of your Reactium app. (Registers a callback on the **Server.AppGlobals** sync hook.)

```
ReactiumBoot.Hook.registerSync(
    'Server.AppGlobals',
    (req, AppGlobals) => {
        AppGlobals.register('spotify_client_id', {
            name: 'spotify_client_id',
            value: process.env.SPOTIFY_CLIENT_ID,
        });
    });
```

> **reactium-boot.js** files are automatically found and executed on Server startup, allowing you to setup parameters, install/change Expressjs middleware, and configure the HTML, and more.

Now you can start the app like so:

**bash**

```
SPOTIFY_CLIENT_ID=<your-spotify-client-id> npm run local
```

### **View/route.js**

Here we are adding our SPA routes to the Reactium router. We are also enabling route trasitions

```
import View from './index';

// the default transitionStates
const transitionStates = [
    { state: 'EXITING', active: 'previous' },
    { state: 'LOADING', active: 'current' },
    { state: 'ENTERING', active: 'current' },
    { state: 'READY', active: 'current' },
];

export default [
    {
        path: ['/'],
        component: View,
        zone: 'main',
    },
    {
        path: ['/playlist/:playlistId'],
        component: View,
        zone: 'playlist',
    },
].map(r => ({ ...r, exact: true, transitions: true, transitionStates }));
```

### **Spotify/Auth/reactium-hooks.js**

Lots going on in this file... We are:

-   Registering an extension to the Reactium SDK object (on the **sdk-init** hook)
-   Setting up a "Pulse" (think cron) to check the Spotify auth token.
-   Registering a "route listener", which will be called anytime the state of the Router changes.
    -   Checking Spotify auth on route changes
    -   Handling router animation step for the loading of the main page
    -   Scrolling to the top of the page on route changes

```
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
            if (authPaths(op.get(Routing, 'currentRoute.location.pathname', ''))) {
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
```

> **reactium-hook.js** files are automatically found and executed and executed in the front-end, and are the first bindpoint for creating plugable React applications.

### common-ui/reactium-gulp.js

Here we are registering any **\_reactium-style.scss** SASS partials to get sorted with other "Atom" styles.

```
/**
 * For the purpose of organizing style partial DDD artifacts,
 * the following enums are defined (default ORGANISMS).
 *
 * ReactiumGulp.Enums.style.MIXINS = -1000
 * ReactiumGulp.Enums.style.VARIABLES = -900
 * ReactiumGulp.Enums.style.BASE = -800
 * ReactiumGulp.Enums.style.ATOMS = 0
 * ReactiumGulp.Enums.style.MOLECULES = 800
 * ReactiumGulp.Enums.style.ORGANISMS = 900
 * ReactiumGulp.Enums.style.OVERRIDES = 1000
 *
 * Set exclude to true to disable a partial by pattern.
 */
ReactiumGulp.Hook.registerSync('ddd-styles-partial', SassPartial => {
    SassPartial.register('common-ui', {
        pattern: /common-ui/,
        exclude: false,
        priority: ReactiumGulp.Enums.style.ATOMS,
    });
});
```

> **reactium-gulp.js** files are automatically found in your project while Gulp tasks are running, and allow you to change change gulp configuration, add/remove/replace Gulp tasks, and register any hooks left along the way.
