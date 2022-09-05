import React, { useState, useEffect, useRef } from 'react';
// Components
import Filter from './Filter';
// Assets
import Check from '../images/icons/icon-check.svg';
import Cross from '../images/icons/icon-cross.svg';

// Typing for props values from App 
interface Inherit {
    isOn: boolean,
    theme: Object,
    border: Object,
    todos: Object[],
    setter: Function,
    filter: Function,
    show: number,
    filterType: string,
}

// Typing for objects passed in todos array prop
interface Task {
    id: string,
    newTask: string,
    date: string,
    time: string,
    checked: Boolean,
}

const Todo = (props: Inherit) => {
    // Darkmode settings
    const background = props.isOn ? { backgroundColor: 'hsl(235, 24%, 19%)', color: 'hsl(234, 11%, 52%)' }
        : { backgroundColor: 'hsl(0, 0%, 98%)', color: 'hsl(236, 9%, 61%)' },
        theme = { ...props.theme } as React.CSSProperties,
        border = { ...props.border } as React.CSSProperties,
        fill = { ...border, backgroundImage: 'linear-gradient(135deg, hsl(192, 100%, 67%), hsl(280, 87%, 65%))' };

    // State that holds filtered and sorted list of tasks
    const [orderedTodos, setOrderedTodos] = useState<Object[] | undefined>(props.todos);

    useEffect(() => {
        setOrderedTodos(() => {
            // Sets state as full list of tasks
            if (props.todos && props.filterType === 'all') {
                // Creates a new array that will not affect state in App
                return (props.todos as Object[]).map(todo => todo);
                // Sets state to only contain tasks that have not been completed
            } else if (props.todos && props.filterType === 'active') {
                const active = (props.todos as Task[]).filter(todo => todo.checked === false);
                return active;
            } else if (props.todos && props.filterType === 'completed') {
                const completed = (props.todos as Task[]).filter(todo => todo.checked === true);
                return completed;
            } else {
                return undefined;
            }
        })
    }, [props.todos, props.filterType])

    // Creates a new variable for taskList that does not reference state  
    let stillTodo = (props.todos as Task[])?.filter(task => task.checked === false);

    // Stores original index position of item being dragged
    const dragItem = useRef<number>();
    // Tracks position of the item as it is dragged
    const dragOverItem = useRef<number>();

    const dragStart = (position: number) => {
        dragItem.current = position;
    };
    const dragEnter = (position: number) => {
        dragOverItem.current = position;
    };
    const drop = () => {
        const copyListItems = [...(orderedTodos as Object[])];
        const dragItemContent = copyListItems[(dragItem.current as number)];
        // Removes dragged item from list and inserts it at new index position
        copyListItems.splice((dragItem.current as number), 1);
        copyListItems.splice((dragOverItem.current as number), 0, dragItemContent);
        // Reset useRef values after drag has ended
        dragItem.current = undefined;
        dragOverItem.current = undefined;
        props.filterType === 'all' ? props.setter([...copyListItems]) : setOrderedTodos([...copyListItems]);
    };

    return (
        <ul id="task-list">
            <div id='tasks'>
                {orderedTodos && (orderedTodos as Task[]).map((task: Task) => {
                    return (
                        <li
                            key={task.id}
                            className='to-do'
                            // Strikethrough task when marked as completed 
                            style={task.checked ? {
                                ...theme,
                                ...border,
                                textDecoration: 'line-through',
                                color: props.isOn ? 'hsl(234, 11%, 52%)' : 'hsl(236, 9%, 61%)',
                            }
                                : { ...theme, ...border }
                            }
                            draggable
                            onDragStart={() => dragStart(orderedTodos.indexOf(task))}
                            onDragEnter={() => dragEnter(orderedTodos.indexOf(task))}
                            onDragEnd={drop}
                            onDragOver={(e) => e.preventDefault()}
                        >
                            <div className='task'>
                                <span
                                    className='check'
                                    // Inserts background gradient when a task is marked as completed
                                    style={task.checked ? fill : border}
                                    // Maps through todo list and toggles the target's checked value 
                                    onClick={() => {
                                        props.setter((prevTaskList: Task[]) => prevTaskList.map((prevTask: Task) => {
                                            if (prevTask.id === task.id) {
                                                return { ...prevTask, checked: !prevTask.checked };
                                            }
                                            return prevTask;
                                        }))
                                    }}
                                >
                                    {task.checked && <img src={Check} alt="check-icon" />}
                                </span>
                                {task.newTask}
                            </div>
                            <span className='time-stamp'>{task.date} {task.time}</span>
                            <img
                                src={Cross}
                                alt="X-icon"
                                className='cross'
                                // Removes entry from todo list when X is clicked
                                onClick={() => {
                                    props.setter((prevTaskList: Task[]) => {
                                        const newList = prevTaskList.filter(prevTask => prevTask.id !== task.id);
                                        if (props.todos.length > 1) {
                                            return newList
                                        } else {
                                            localStorage.clear()
                                            return undefined;
                                        }
                                    })
                                }}
                            />
                        </li>
                    )
                })}
            </div>
            {orderedTodos &&
                <li className='reset' style={background}>
                    <span>{stillTodo ? stillTodo.length : 0} items left</span>
                    {props.show > 760 &&
                        <Filter isOn={props.isOn} todos={props.todos} theme={props.theme} border={props.border} setter={props.filter}/>
                    }
                    <label htmlFor="clear" className='clear-all'>
                        Clear Completed
                        <input
                            type="button"
                            id='clear'
                            name='clear'
                            // Clears todo list of completed tasks
                            onClick={() => {
                                props.setter((prevTaskList: Task[]) => {
                                    let completed: Task[] = [];
                                    prevTaskList.map((prevTask: Task) => {
                                        if (prevTask.checked === true) completed = [...completed, prevTask]
                                    })
                                    const newList = prevTaskList.filter(prevTask => !completed.includes(prevTask));
                                    if (props.todos.length > 1) {
                                        return newList
                                    } else {
                                        localStorage.clear()
                                        return undefined;
                                    }
                                });
                            }}
                        />
                    </label>
                </li>
            }
        </ul>
    )
}

export default Todo;