import {useState} from 'react';
import {nanoid} from 'nanoid';

// Typing for prop values from App
interface Inherit {
    isOn: boolean,
    update: Function,
    theme: Object,
    border: Object,
}

const Input = (props: Inherit) => { 
    // Creates timestamp for new tasks  
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

    let d = new Date(),
    // Variable to store date in 'Day of Week  Month,Day,Year' format
    date = `${days[d.getDay()]} ${months[d.getMonth()]},${d.getDate()},${d.getFullYear()}`,
    hour = d.getHours(), min = d.getMinutes(),
    // Formats time into A.M./P.M. using % 12 and also checks if min is a single digit value and adds a 0 in front if so
    time = `${hour % 12 ? hour % 12 : 12}:${min > 9 ? min : '0' + min} ${hour >= 12 && hour != 24 ? 'P.M.' : 'A.M.'}`;

    const [newTask, setNewTask] = useState('');  
    // Updates state to hold latest input value from user 
    const trackInput = (e: React.ChangeEvent) => {
        let value = (e.target as HTMLInputElement).value;
        setNewTask(value);
    }
    // Updates taskList state in App to include newTask
    const addTask = (e: React.KeyboardEvent) => {
        if(newTask && e.key === 'Enter') {
            const id = nanoid(),
            todo = {
                id: id, 
                newTask: newTask, 
                time: time, 
                date: date, 
                checked: false,
            };
            props.update(todo);
            setNewTask('');
        }
    }

    return (
        <label htmlFor='todo' id='new-task'>
            <span style={props.border}></span>
            <input
                type='text'
                id='todo'
                name='todo'
                className={props.isOn ? 'dark' : 'light'}
                placeholder='Create a new todo...'
                value={newTask}
                onChange={trackInput}
                onKeyUp={addTask}
                style={props.theme}
            />
        </label>
    )
}

export default Input;