import React, { useEffect } from 'react';
import Reactium from 'reactium-core/sdk';

const Auth = () => {
    useEffect(() => {
        Reactium.Spotify.callback();
    }, []);

    return null;
};

export default Auth;
