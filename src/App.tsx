import React, { useState, useEffect } from 'react';
// Components
import Input from './components/Input';
import Todo from './components/Todo';
import Filter from './components/Filter';
// Assets
import Sun from './images/icons/icon-sun.svg';
import Moon from './images/icons/icon-moon.svg';

const App = () => {
  // Saves width of the browser window as a state
  const [media, setMedia] = useState(window.innerWidth);

  // Updates media when window is resized
  useEffect(() => {
    const updateWindowDimensions = () => {
      const newWidth = window.innerWidth;
      setMedia(newWidth);
    };

    window.addEventListener('resize', updateWindowDimensions)
    // Cleanup function to remove event listener
    return () => window.removeEventListener('resize', updateWindowDimensions)
  
  }, [])
  

  // Tracks on/off state of darkmode
  const [darkMode, setDarkMode] = useState(false);
  const changeTheme = () => {
    setDarkMode(prevMode => !prevMode);
  }

  // Darkmode settings
  // Sets banner image based on darkMode and screen width
  const banner = window.matchMedia('(max-width: 450px)') && darkMode ? require('./images/banner_imgs/bg-mobile-dark.jpg')
    : window.matchMedia('(min-width: 451px)') && darkMode ? require('./images/banner_imgs/bg-desktop-dark.jpg')
      : window.matchMedia('(min-width: 451px)') && !darkMode ? require('./images/banner_imgs/bg-desktop-light.jpg')
        : require('./images/banner_imgs/bg-mobile-light.jpg'),

    bgTheme = darkMode ? { backgroundColor: 'hsl(235, 21%, 11%)', color: 'hsl(233, 14%, 35%)' }
      : { backgroundColor: 'hsl(0, 0%, 96%)', color: 'hsl(236, 9%, 61%)' },
    listTheme = darkMode ? { backgroundColor: 'hsl(235, 24%, 19%)', color: 'hsl(234, 39%, 85%)' }
      : { backgroundColor: 'hsl(0, 0%, 98%)', color: 'hsl(235, 19%, 35%)' },
    border = darkMode ? { borderColor: 'hsl(234, 11%, 52%)' } : { borderColor: 'hsl(236, 9%, 61%)' };

  const [taskList, setNewTaskList] = useState<Object[]>(() => {
    // Default value of taskList is retrieved from localStorage when page is loaded
    const todos = JSON.parse(localStorage.getItem('todos') as string);
    return todos ? todos : undefined;
  })
  // Passed as a prop to Input to update taskList
  const addTask = (task: Object) => {
    setNewTaskList(prevTaskList => prevTaskList ? [task, ...prevTaskList] : [task]);
  }

  // Updates localStorage to reflect the value of taskList
  useEffect(() => {
    if (taskList) localStorage.setItem('todos', JSON.stringify(taskList));
  }, [taskList])

  // setFilter is passed to Filter component
  const [filter, setFilter] = useState('all');

  return (
    <main style={bgTheme}>
      <header style={{ background: `url(${banner}) no-repeat center center/ cover` }}>
        <h2>TODO</h2>
        <div id='toggle'>
          <img src={darkMode ? Moon : Sun} alt={darkMode ? 'Moon-icon' : 'Sun-icon'} className='banner' />
          <label className='switch'>
            <input type='checkbox' onChange={changeTheme} />
            <span className='slider round'></span>
          </label>
        </div>
      </header>
      <div>
        <Input isOn={darkMode} update={addTask} theme={listTheme} border={border} />
        <Todo isOn={darkMode} todos={taskList} theme={listTheme} border={border} setter={setNewTaskList} show={media} filter={setFilter} filterType={filter} />
        {media <= 760 &&
          <Filter isOn={darkMode} todos={taskList} theme={listTheme} border={border} setter={setFilter} />
        }
      </div>
      <div id='coolTip'>
        Drag and drop to reorder list
      </div>
    </main>
  )
}

export default App;

const task = (task: any): string[] => {
  throw new Error('Function not implemented.');
}