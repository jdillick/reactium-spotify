import React from 'react';
import op from 'object-path';
import mockTracks from '../mock-tracks';
import { Feather } from 'components/common-ui/Icon';
import { __, useSyncState } from 'reactium-core/sdk';

console.log({ mockTracks });

const control = ({ cb, state }) => async track => {
    try {
        await cb(track);
        state.set('playing', !state.get('playing'));
    } catch (error) {
        state.set('playing', state.get('playing'));
    }
};

const Track = ({
    track = op.get(mockTracks, 'body.tracks.items.0', {}),
    onPlay = track => console.log('play', { track }),
    onPause = track => console.log('pause', { track }),
}) => {
    const state = useSyncState({ playing: false });
    
    const uri = op.get(track, 'uri');
    const album = op.get(track, 'album', {});
    const image = op.get(album, 'images.0');
    const artists = op.get(album, 'artists', []);

    console.log({ track, uri, album, image, artists });

    const controls = {
        play: {
            text: __('Play'),
            Icon: Feather.Play,
            onClick: onPlay,
        },
        pause: {
            text: __('Pause'),
            Icon: Feather.Pause,
            onClick: onPause,
        },
    };

    const Control = state.get('playing') ? controls.pause : controls.play;

    return (
        <section className='track'>
            <div className='track-bg'>
                {image && <img src={image.url} alt={op.get(track, 'name')} />}
            </div>
            <div className='track-body'>
                <div className='track-control'>
                    <div className='track-image'>
                        {image && (
                            <img src={image.url} alt={op.get(track, 'name')} />
                        )}
                    </div>

                    <div className='track-details'>
                        <h2>{op.get(track, 'name')}</h2>
                        <h3>{op.get(album, 'name')}</h3>
                        
                        <label className='sr-only' htmlFor='artists'>{__('Artists')}</label>
                        <ul id='artists' className='artists-list'>
                            {artists.map(artist => (
                                <li className={'artist'} key={artist.name}>
                                    {artist.name}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button
                        className='pause-play btn-icon'
                        onClick={() =>
                            control({
                                state,
                                cb: Control.onClick,
                            })(track)
                        }>
                        <Control.Icon />
                        <span className='sr-only'>{Control.text}</span>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Track;
