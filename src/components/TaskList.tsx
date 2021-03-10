import { useState, useEffect } from 'react';
import { FiTrash, FiCheckSquare } from 'react-icons/fi';
import { useTransition, animated } from 'react-spring';

import '../styles/tasklist.scss';

interface Task {
  id: number;
  title: string;
  isComplete: boolean;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const localRepositories = localStorage.getItem('@toDo:tasks');

    if (localRepositories) {
      return JSON.parse(localRepositories);
    }

    return [];
  });
  const tasksWithTransitions = useTransition(tasks, (task) => task.id, {
    from: { left: '-50px', opacity: 0 },
    enter: { left: '0px', opacity: 1 },
    leave: { left: '-50px', opacity: 0 },
  });
  console.log(tasksWithTransitions);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    localStorage.setItem('@toDo:tasks', JSON.stringify(tasks));
  }, [tasks]);

  function handleCreateNewTask() {
    if (!newTaskTitle) return;

    const newTask = {
      id: Math.random() * 100,
      title: newTaskTitle,
      isComplete: false,
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  }

  function handleToggleTaskCompletion(id: number) {
    const newTasks = tasks.map((task) =>
      task.id === id ? { ...task, isComplete: !task.isComplete } : task,
    );
    // const filterTask = tasks.findIndex((task) => task.id === id);
    // tasks[filterTask].isComplete = true;
    setTasks(newTasks);
  }

  function handleRemoveTask(id: number) {
    const filterTasks = tasks.filter((task) => task.id !== id);
    setTasks(filterTasks);
  }

  return (
    <section className="task-list container">
      <header>
        <h2>Minhas tarefas</h2>

        <div className="input-group">
          <input
            type="text"
            placeholder="Adicionar novo todo"
            onChange={(e) => setNewTaskTitle(e.target.value)}
            value={newTaskTitle}
          />
          <button
            type="submit"
            data-testid="add-task-button"
            onClick={handleCreateNewTask}
          >
            <FiCheckSquare size={16} color="#fff" />
          </button>
        </div>
      </header>

      <main>
        <ul>
          {tasksWithTransitions.map(({ item, key, props }) => (
            <animated.div key={key} style={props}>
              <li>
                <div
                  className={item.isComplete ? 'completed' : ''}
                  data-testid="task"
                >
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      readOnly
                      checked={item.isComplete}
                      onClick={() => handleToggleTaskCompletion(item.id)}
                    />
                    <span className="checkmark"></span>
                  </label>
                  <p>{item.title}</p>
                </div>

                <button
                  type="button"
                  data-testid="remove-task-button"
                  onClick={() => handleRemoveTask(item.id)}
                >
                  <FiTrash size={16} />
                </button>
              </li>
            </animated.div>
          ))}

          {/* {tasks.map((task) => (
            <li key={task.id}>
              <div
                className={task.isComplete ? 'completed' : ''}
                data-testid="task"
              >
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    readOnly
                    checked={task.isComplete}
                    onClick={() => handleToggleTaskCompletion(task.id)}
                  />
                  <span className="checkmark"></span>
                </label>
                <p>{task.title}</p>
              </div>

              <button
                type="button"
                data-testid="remove-task-button"
                onClick={() => handleRemoveTask(task.id)}
              >
                <FiTrash size={16} />
              </button>
            </li>
          ))} */}
        </ul>
      </main>
    </section>
  );
}
