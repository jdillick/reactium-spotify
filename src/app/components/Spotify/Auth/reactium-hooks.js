import Reactium from 'reactium-core/sdk';
import dayjs from 'dayjs';
import op from 'object-path';
import SpotifyWebApi from 'spotify-web-api-node';

const playerName = 'Reactium';
const WAIT_FOR_PLAYER_CONNECTION = 250;
const CHECK_TOKEN_EXPIRATION = 1000 * 60;

Reactium.Hook.register('sdk-init', async () => {
    console.log('Initializing Reactium.Spotify');
    const getOAuthToken = cb => {
        // console.log('access_token', Reactium.Prefs.get('spotify_token.authToken'));
        cb(Reactium.Prefs.get('spotify_token.authToken'));
    };

    const sdk = {
        auth: () => {
            console.log('Checking Spotify token.');
            const token = Reactium.Prefs.get('spotify_token');
            const { protocol, host } = window.location;

            const authURL = new URL(
                'https://accounts.spotify.com/en/authorize',
            );
            const authParams = new URLSearchParams('');
            authParams.set('response_type', 'token');
            authParams.set('client_id', window.spotify_client_id);
            authParams.set('redirect_uri', `${protocol}//${host}/callback`);
            authParams.set(
                'scope',
                'streaming user-read-email user-modify-playback-state user-read-private user-read-playback-state',
            );
            authParams.set('show_dialog', 'true');
            authURL.search = authParams;

            if (
                !token ||
                dayjs().isAfter(dayjs(op.get(token, 'expires', '1970-01-01')))
            )
                window.location.href = authURL.toString();

            if (!window.onSpotifyWebPlaybackSDKReady) window.onSpotifyWebPlaybackSDKReady = async () => {
                const player = sdk.player = new Spotify.Player({
                    name: playerName,
                    getOAuthToken,
                    volume: 0.5
                });

                player.addListener('authentication_error', ({ message }) => {
                    console.error(message);
                    sdk.auth();
                });

                await sdk.player.connect();

                await new Promise(resolve => setTimeout(resolve, WAIT_FOR_PLAYER_CONNECTION));

                await sdk.setPlayerDevice();
            }

            getOAuthToken(token => sdk.api.setAccessToken(token));
        },

        api: new SpotifyWebApi({
            clientId: window.spotify_client_id,
        }),

        setPlayerDevice: async () => {
            const devices = await sdk.api.getMyDevices();

            const device = op.get(devices, 'body.devices', []).find(({ name }) => name === playerName);
            if (!device) {
                throw new Error(`Device "${playerName}" not found!`);
                return;
            }

            if (!device.is_active) {
                await sdk.api.transferMyPlayback([device.id]);
            }
        },

        callback: () => {
            if (Reactium.Prefs.get('spotify_token'))
                Reactium.Prefs.clear('spotify_token');

            const hash = window.location.hash.replace(/^#/, '');
            const authParams = new URLSearchParams(hash);
            const authToken = authParams.get('access_token');
            if (authToken) {
                Reactium.Prefs.set('spotify_token', {
                    authToken,
                    expires: dayjs().add(1, 'hour'),
                });
            }


            Reactium.Routing.historyObj.push('/');
        },
    };

    Reactium.Spotify = sdk;
    Reactium.Spotify.auth();

    Reactium.Pulse.register('MyComponent', Reactium.Spotify.auth, {
        delay: CHECK_TOKEN_EXPIRATION, // check auth every minute or so
    });
});
