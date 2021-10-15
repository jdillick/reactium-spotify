import React from 'react';
import { __ } from 'reactium-core/sdk';
import _ from 'underscore';

const Search = ({state}) => {
    const label = __('Search playlists');

    const onChange = e => {
        state.set('search', e.target.value);
    };

    return (
        <>
            <form className='search-form'>
                <label htmlFor='playlist-search' className='sr-only'>{label}</label>
                <input
                    id='playlist-search'
                    type='search'
                    autoComplete='off'
                    placeholder={label}
                    onChange={onChange}
                    value={state.get('search')}
                />
            </form>
        </>
    );
};

export default Search;
