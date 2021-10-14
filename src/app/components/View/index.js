import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Reactium from 'reactium-core/sdk';

/**
 * -----------------------------------------------------------------------------
 * Functional Component: View
 * -----------------------------------------------------------------------------
 */
const View = props => {
    useEffect(() => {
        Reactium.Spotify.auth();
    }, []);

    return (
        <>
            <Helmet titleTemplate='%s - Reactium Spotify'>
                <title>Demo</title>
                <script src='https://sdk.scdn.co/spotify-player.js'></script>
            </Helmet>

            <article className='col-12 m-xs-20'>
                <h1>Spotify Demo</h1>
            </article>
        </>
    );
};

export default View;
