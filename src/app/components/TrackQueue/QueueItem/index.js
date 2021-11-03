import React from 'react';
import { useHookComponent, __ } from 'reactium-core/sdk';
import { Feather } from 'components/common-ui/Icon';
import { Draggable } from 'react-beautiful-dnd';
import op from 'object-path';

/**
 * -----------------------------------------------------------------------------
 * Functional Component: QueueItem
 * -----------------------------------------------------------------------------
 */
const QueueItem = ({ index, track, onRemove, playing = false }) => {
    const TrackThumb = useHookComponent('TrackThumb');

    return (
        <Draggable draggableId={track.id} index={index}>
            {({ draggableProps, dragHandleProps, innerRef }) => (
                <div className='queue-item' {...draggableProps} ref={innerRef}>
                    <div className='queue-item-grab' {...dragHandleProps}>
                        <Feather.Move />
                    </div>
                    <TrackThumb track={track} />
                    <button className='queue-item-remove' onClick={onRemove}>
                        <span className='sr-only'>
                            {__('Remove track %s').replace(
                                '%s',
                                op.get(track, 'name', ''),
                            )}
                        </span>
                        <Feather.X />
                    </button>
                    {playing && (
                        <div className='playing'>
                            <span className='sr-only'>
                                {__('Playing now...')}
                            </span>
                            <Feather.Volume2 />
                        </div>
                    )}
                </div>
            )}
        </Draggable>
    );
};

export default QueueItem;
