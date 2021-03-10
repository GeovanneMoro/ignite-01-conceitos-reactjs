import { useState, useEffect, FormEvent } from 'react';
import { FiTrash, FiCheckSquare } from 'react-icons/fi';
import { useTransition, animated } from 'react-spring';
import { v4 } from 'uuid';

import '../styles/tasklist.scss';

interface Task {
  id: string;
  title: string;
  isComplete: boolean;
}

export function TaskList() {
  const [isLoading, setIsLoading] = useState(false);
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
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    localStorage.setItem('@toDo:tasks', JSON.stringify(tasks));
  }, [tasks]);

  function handleCreateNewTask(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!newTaskTitle) return;

    const newTask = {
      id: v4(),
      title: newTaskTitle,
      isComplete: false,
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  }

  function handleToggleTaskCompletion(id: string) {
    const newTasks = tasks.map((task) =>
      task.id === id ? { ...task, isComplete: !task.isComplete } : task,
    );

    setTasks(newTasks);
  }

  function handleRemoveTask(id: string) {
    const filterTasks = tasks.filter((task) => task.id !== id);
    setTasks(filterTasks);
  }

  return (
    <section className="task-list container">
      <header>
        <h2>Minhas tarefas</h2>

        <form className="input-group" onSubmit={handleCreateNewTask}>
          <input
            type="text"
            placeholder="Adicionar novo todo"
            onChange={(e) => setNewTaskTitle(e.target.value)}
            value={newTaskTitle}
          />
          <button type="submit" data-testid="add-task-button">
            <FiCheckSquare size={16} color="#fff" />
          </button>
        </form>
      </header>
      <main>
        <ul>
          {tasks.length === 0 && <span>Sem tarefas no momento :(</span>}
          {tasks.length !== 0 &&
            tasksWithTransitions.map(({ item, key, props }) => (
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
        </ul>
      </main>
    </section>
  );
}
