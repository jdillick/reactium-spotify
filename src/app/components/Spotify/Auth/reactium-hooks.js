import Reactium from 'reactium-core/sdk';
import dayjs from 'dayjs';
import op from 'object-path';

Reactium.Hook.register('sdk-init', async () => {
    Reactium.Spotify = {
        auth: () => {
            console.log('Checking spotify token.');
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
                'streaming user-read-email user-modify-playback-state user-read-private',
            );
            authParams.set('show_dialog', 'true');
            authURL.search = authParams;

            if (
                !token ||
                dayjs().isAfter(dayjs(op.get(token, 'expires', '1970-01-01')))
            )
                window.location.href = authURL.toString();

            return op.get(token, 'authToken');
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

    Reactium.Pulse.register('MyComponent', Reactium.Spotify.auth, {
        delay: 1000 * 10, // check auth every minute or so
    });
});
