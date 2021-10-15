import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Zone } from 'reactium-core/sdk';
import op from 'object-path';

/**
 * -----------------------------------------------------------------------------
 * Functional Component: View
 * -----------------------------------------------------------------------------
 */
const View = props => {
    
    console.log(op.get(props, 'active.match.route.zone', 'main'));
    return (
        <>
            <Helmet titleTemplate='%s - Reactium Spotify'>
                <title>Demo</title>
            </Helmet>

            <article className='col-12 m-xs-20'>
                <h1>Spotify Demo</h1>
                <Zone zone={op.get(props, 'active.match.route.zone', 'main')} />
            </article>
        </>
    );
};

export default View;
