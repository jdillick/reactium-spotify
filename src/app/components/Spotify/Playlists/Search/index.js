import React, { useRef } from 'react';
import { __ } from 'reactium-core/sdk';
import _ from 'underscore';

const Search = ({ state }) => {
    const label = __('Search playlists');
    const ref = useRef();

    const onChange = e => {
        state.set('search', e.target.value);
    };

    return (
        <>
            <form
                className='search-form'
                onSubmit={e => {
                    e.preventDefault();
                    ref.current && state.set('search', ref.current.value);
                }}>
                <label htmlFor='playlist-search' className='sr-only'>
                    {label}
                </label>
                <input
                    id='playlist-search'
                    ref={ref}
                    type='search'
                    autoComplete='off'
                    placeholder={label}
                    onChange={onChange}
                    onFocus={() => ref.current && ref.current.select()}
                    value={state.get('search')}
                />
            </form>
        </>
    );
};

export default Search;
