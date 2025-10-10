import { useState } from 'react';
import styles from './CallTakerForm.module.css';
import type { Event, EventType } from '../../../model/event';
import type { Priority } from '../../../model/priority';
import { EventType as EventTypeEnum } from '../../../model/event';
import { Priority as PriorityEnum } from '../../../model/priority';

interface CallTakerFormProps {
    onEventCreated?: (event: Event) => void;
}

export default function CallTakerForm({ onEventCreated }: CallTakerFormProps) {
    const [eventType, setEventType] = useState<EventType>(EventTypeEnum.Medical);
    const [priority, setPriority] = useState<Priority>(PriorityEnum.Green);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const newEvent: Event = {
            id: Math.random().toString(36).substring(2, 15),
            type: eventType,
            priority: priority
        };

        if (onEventCreated) {
            onEventCreated(newEvent);
        }

        // Reset form
        setEventType(EventTypeEnum.Medical);
        setPriority(PriorityEnum.Green);
    };

    const getPriorityColor = (priorityValue: Priority): string => {
        switch (priorityValue) {
            case PriorityEnum.Red: return '#e74c3c';
            case PriorityEnum.Yellow: return '#f39c12';
            case PriorityEnum.Green: return '#27ae60';
            case PriorityEnum.White: return '#95a5a6';
            default: return '#95a5a6';
        }
    };

    const getPriorityLabel = (priorityValue: Priority): string => {
        switch (priorityValue) {
            case PriorityEnum.Red: return 'Red (Critical)';
            case PriorityEnum.Yellow: return 'Yellow (Urgent)';
            case PriorityEnum.Green: return 'Green (Non-urgent)';
            case PriorityEnum.White: return 'White (Lowest)';
            default: return 'Unknown';
        }
    };

    return (
        <div className={styles['form-container']}>
            <form onSubmit={handleSubmit} className={styles['event-form']}>
                <div className={styles['form-group']}>
                    <label htmlFor="event-type">Event Type:</label>
                    <select
                        id="event-type"
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value as EventType)}
                        className={styles['form-select']}
                    >
                        <option value={EventTypeEnum.Medical}>Medical</option>
                        <option value={EventTypeEnum.Trauma}>Trauma</option>
                    </select>
                </div>

                <div className={styles['form-group']}>
                    <label htmlFor="priority">Priority:</label>
                    <select
                        id="priority"
                        value={priority}
                        onChange={(e) => setPriority(Number(e.target.value) as Priority)}
                        className={styles['form-select']}
                        style={{ borderLeft: `4px solid ${getPriorityColor(priority)}` }}
                    >
                        <option value={PriorityEnum.Red}>{getPriorityLabel(PriorityEnum.Red)}</option>
                        <option value={PriorityEnum.Yellow}>{getPriorityLabel(PriorityEnum.Yellow)}</option>
                        <option value={PriorityEnum.Green}>{getPriorityLabel(PriorityEnum.Green)}</option>
                        <option value={PriorityEnum.White}>{getPriorityLabel(PriorityEnum.White)}</option>
                    </select>
                </div>

                <button type="submit" className={styles['submit-button']}>
                    Create Event
                </button>
            </form>
        </div>
    );
}