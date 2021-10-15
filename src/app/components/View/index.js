import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';

/**
 * -----------------------------------------------------------------------------
 * Functional Component: View
 * -----------------------------------------------------------------------------
 */
const View = props => {
    return (
        <>
            <Helmet titleTemplate='%s - Reactium Spotify'>
                <title>Demo</title>
            </Helmet>

            <article className='col-12 m-xs-20'>
                <h1>Spotify Demo</h1>
            </article>
        </>
    );
};

export default View;
