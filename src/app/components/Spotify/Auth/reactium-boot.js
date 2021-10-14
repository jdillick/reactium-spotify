ReactiumBoot.Hook.registerSync(
    'Server.AppGlobals',
    (req, AppGlobals) => {
        AppGlobals.register('spotify_client_id', {
            name: 'spotify_client_id',
            value: process.env.SPOTIFY_CLIENT_ID || '0a1df329379a4fae8c4bebe3462f38c6',
        });
    });
