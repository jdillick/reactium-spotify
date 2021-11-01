import Reactium from 'reactium-core/sdk';
import dayjs from 'dayjs';
import op from 'object-path';
import SpotifyWebApi from 'spotify-web-api-node';

const playerName = 'Reactium';
const WAIT_FOR_PLAYER_CONNECTION = 1000;
const WAIT_FOR_PLAYER_RETRIES = 10;

const getOAuthToken = cb => {
    // console.log('access_token', Reactium.Prefs.get('spotify_token.authToken'));
    cb(Reactium.Prefs.get('spotify_token.authToken'));
};

const appendPlayer = () => {
    if (!document.querySelector('#spotify-player')) {
        const el = document.createElement('script');
        el.id = 'spotify-player';
        el.src = 'https://sdk.scdn.co/spotify-player.js';
        document.getElementsByTagName('body')[0].appendChild(el);
    }
};

const onSpotifyWebPlaybackSDKReady = sdk => async () => {
    const player = (sdk.player = new Spotify.Player({
        name: playerName,
        getOAuthToken,
        volume: 0.5,
    }));

    player.addListener('authentication_error', ({ message }) => {
        console.error(message);
        sdk.oauth();
    });

    await sdk.player.connect();

    let device, error;
    for (let retry = 0; retry < WAIT_FOR_PLAYER_RETRIES; retry++) {
        try {
            // Give the player time to setup, even though there is promise resolution
            await new Promise(resolve =>
                setTimeout(resolve, WAIT_FOR_PLAYER_CONNECTION),
            );
            let device = await sdk.setupPlayerDevice();
            if (device) {
                break;
            }
        } catch (err) {
            error = err;
        }
        console.log({device, error});
    }

    if (!device || error) {
        throw error;
    }
}

export const sdk = {
    oauth: () => {
        console.log('Checking Spotify token.');
        const token = Reactium.Prefs.get('spotify_token');
        const { protocol, host } = window.location;

        const authURL = new URL('https://accounts.spotify.com/en/authorize');
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

        if (!window.onSpotifyWebPlaybackSDKReady)
            window.onSpotifyWebPlaybackSDKReady = onSpotifyWebPlaybackSDKReady(sdk);

        getOAuthToken(token => sdk.api.setAccessToken(token));
        appendPlayer();
    },

    oauthCallback: () => {
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

    api: new SpotifyWebApi({
        clientId: window.spotify_client_id,
    }),

    setupPlayerDevice: async () => {
        const devices = await sdk.api.getMyDevices();

        const device = op
            .get(devices, 'body.devices', [])
            .find(({ name }) => name === playerName);
        if (!device) {
            throw new Error(`Device "${playerName}" not found!`);
            return;
        }

        if (!device.is_active) {
            await sdk.api.transferMyPlayback([device.id]);
        }

        return device;
    },

    play: async track => {
        if (track) {
            sdk.api.play({ uris: [op.get(track, 'uri')] });
        } else {
            sdk.player.resume();
        }
    },

    resume: async () => sdk.player.resume(),

    pause: async () => sdk.player.pause(),
};
