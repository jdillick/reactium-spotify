import React from 'react';
import QueueItem from './QueueItem';
import { useSelectHandle, cxFactory } from 'reactium-core/sdk';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

/**
 * -----------------------------------------------------------------------------
 * Functional Component: TrackQueue
 * -----------------------------------------------------------------------------
 */
const TrackQueue = ({ modal }) => {
    const { handle } = useSelectHandle('SpotifyDemo');
    const cn = cxFactory('queue');

    const onDragEnd = ({ source, destination }) => {
        handle.updateQueue(source, destination);
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId='track-queue'>
                {({ droppableProps, innerRef, placeholder }) => (
                    <ul className={cn()} ref={innerRef} {...droppableProps}>
                        {handle
                            .get('queue', Reactium.Prefs.get('queue', []))
                            .map((track, index) => (
                                <li key={track.id} className={cn('list-item')}>
                                    <QueueItem
                                        index={index}
                                        track={track}
                                        playing={
                                            track.id ===
                                                handle.get('track.id') &&
                                            handle.get(
                                                'status.paused',
                                                true,
                                            ) !== true
                                        }
                                        onRemove={() =>
                                            handle.dequeueTrack(track.id)
                                        }
                                    />
                                </li>
                            ))}
                        {placeholder}
                    </ul>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default TrackQueue;
