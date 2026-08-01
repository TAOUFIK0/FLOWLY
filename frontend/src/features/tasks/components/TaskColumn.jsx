/* ========================================
   TaskColumn — Colonne Kanban
   ======================================== */

import { useRef } from 'react';
import { FiPlus } from 'react-icons/fi';
import TaskCard from './TaskCard';
import './TaskColumn.css';

export default function TaskColumn({
  column,
  tasks,
  onTaskClick,
  onUpdate, 
  onDragStart,
  onDragOver,
  onDrop,
  onAddTask,
  canAddTask = true,
}) {
  const columnRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    columnRef.current?.classList.add('tk-col-dragover');
    onDragOver?.(e, column.id);
  };

  const handleDragLeave = () => {
    columnRef.current?.classList.remove('tk-col-dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    columnRef.current?.classList.remove('tk-col-dragover');
    onDrop?.(e, column.id);
  };

  return (
    <div
      ref={columnRef}
      className="tk-col"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* En-tête de colonne */}
      <div className="tk-col-header">
        <div className="tk-col-header-left">
          <div
            className="tk-col-dot"
            style={{ background: column.color }}
          />
          <h3 className="tk-col-title">{column.title}</h3>
          <span className="tk-col-count">{tasks.length}</span>
        </div>
        {canAddTask && (
          <button
            className="tk-col-add"
            onClick={() => onAddTask?.(column.id)}
            title={`Ajouter une tâche dans ${column.title}`}
          >
            <FiPlus size={16} />
          </button>
        )}
      </div>

      {/* Liste des tâches */}
      <div className="tk-col-tasks">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={onTaskClick}
             onUpdate={onUpdate}
            onDragStart={onDragStart}
          />
        ))}

        {/* Placeholder quand vide */}
        {tasks.length === 0 && (
          <div className="tk-col-empty">
            <span>Glissez une tâche ici</span>
          </div>
        )}
      </div>
    </div>
  );
}