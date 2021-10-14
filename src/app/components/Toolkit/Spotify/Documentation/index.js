import React from 'react';
import readme from './readme.md';
import { __, useHookComponent } from 'reactium-core/sdk';

export default () => {
    const { Element, Markdown } = useHookComponent('RTK');

    return (
        <Element title={__('Spotify Components')} className='pt-xs-64 px-xs-40'>
            <Markdown value={readme} />
        </Element>
    );
};
