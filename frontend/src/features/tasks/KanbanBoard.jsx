import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProjectDashboard from '../projects/ProjectDashboard';
import {
  FiArrowLeft,
  FiSettings,
  FiUsers,
} from 'react-icons/fi';
import TaskColumn from './components/TaskColumn';
import TaskDetailModal from './components/TaskDetailModal';
import MembersPanel from '../projects/components/MembersPanel';
import InviteMemberModal from '../projects/components/InviteMemberModal';
import ProjectSettingsModal from '../projects/components/ProjectSettingsModal';
import {
  setTasksLoading,
  setTasks,
  addTask,
  updateTask,
  moveTask,
  removeTask,
  addComment,
  setTasksError,
  clearTasks,
} from './tasksSlice';
import { setCurrentProject, clearCurrentProject } from '../../app/uiSlice';
import { projectsApi } from '../projects/api';
import { tasksApi } from './api';
import './KanbanBoard.css';

/* ── Colonnes par défaut ── */
const DEFAULT_COLUMNS = [
  { id: 'todo',       title: 'À faire',       color: 'var(--text-muted)',  position: 0 },
  { id: 'in-progress', title: 'En cours',     color: 'var(--info)',        position: 1 },
  { id: 'review',     title: 'En revue',      color: 'var(--warning)',     position: 2 },
  { id: 'done',       title: 'Terminé',       color: 'var(--success)',     position: 3 },
];

export default function KanbanBoard() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.tasks);
  const { user } = useSelector((state) => state.auth);
  const { currentProjectName, currentProjectRole } = useSelector((state) => state.ui);

  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const selectedTask = selectedTaskId ? items.find((t) => t.id === selectedTaskId) : null;
  
  const [showMembers, setShowMembers] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [projectMembers, setProjectMembers] = useState([]);

  // State pour basculer entre Kanban et Tableau de bord
  const [view, setView] = useState('kanban');

  const isOwner = currentProjectRole === 'OWNER';
  const isManager = currentProjectRole === 'MANAGER';
  const canManageProject = isOwner || isManager;
  const canDeleteTask = isOwner || isManager;
  const canAddTask = true;

  /* ── Charger le rôle, les tâches et les membres ── */
  useEffect(() => {
    projectsApi
      .getById(projectId)
      .then((res) => {
        const project = res.data;
        let userRole = 'MEMBER';
        if (project.memberRoles && user?.id) {
          userRole = project.memberRoles[user.id] || 'MEMBER';
        }
        dispatch(setCurrentProject({
          id: project.id,
          name: project.name,
          role: userRole,
        }));
      })
      .catch(() => {
        dispatch(setCurrentProject({
          id: projectId,
          name: `Projet ${projectId}`,
          role: 'MEMBER',
        }));
      });

    dispatch(setTasksLoading(true));
    tasksApi
      .getByBoard(projectId)
      .then((res) => dispatch(setTasks(res.data)))
      .catch((err) => dispatch(setTasksError(err.response?.data?.message || 'Erreur de chargement')));

    projectsApi
      .getMembers(projectId)
      .then((res) => setProjectMembers(res.data))
      .catch(() => {});

    return () => {
      dispatch(clearTasks());
      dispatch(clearCurrentProject());
    };
  }, [projectId, dispatch, user?.id]);

  /* ── Grouper par "status" ── */
  const getTasksByColumn = useCallback(
    (columnId) => {
      const backendStatus = columnId.toUpperCase().replace('-', '_');
      return items.filter((t) => t.status === backendStatus);
    },
    [items]
  );

  /* ── Drag & Drop ── */
  const handleDragStart = (e, taskId) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = async (e, targetColumnId) => {
    e.preventDefault();
    if (!draggedTaskId) return;

    const task = items.find((t) => t.id === draggedTaskId);
    const newStatus = targetColumnId.toUpperCase().replace('-', '_');
    
    if (task?.status === newStatus) return;

    const oldStatus = task.status;
    dispatch(moveTask({ taskId: draggedTaskId, newStatus }));
    setDraggedTaskId(null);

    try {
      await tasksApi.update(draggedTaskId, { status: newStatus });
    } catch {
      dispatch(moveTask({ taskId: draggedTaskId, newStatus: oldStatus }));
    }
  };

  /* ── Ajouter une tâche ── */
  const handleAddTask = async (columnId) => {
    const backendStatus = columnId.toUpperCase().replace('-', '_');
    const newTaskData = {
      title: 'Nouvelle tâche',
      description: '',
      projectId: projectId,
      status: backendStatus,
      priority: 'MEDIUM',
    };

    const tempTask = {
      ...newTaskData,
      id: `temp-${Date.now()}`,
      labels: [],
      comments: [],
      commentCount: 0,
    };

    dispatch(addTask(tempTask));

    try {
      const res = await tasksApi.create(newTaskData);
      dispatch(removeTask(tempTask.id));
      dispatch(addTask(res.data));
    } catch {
      dispatch(removeTask(tempTask.id));
    }
  };

  /* ── Modifier une tâche ── */
  const handleUpdateTask = async (taskId, data) => {
    const oldTask = items.find((t) => t.id === taskId);
    try {
      const res = await tasksApi.update(taskId, data);
      dispatch(updateTask(res.data));
    } catch (err) {
      alert("Erreur Backend : " + (err.response?.data?.message || err.message));
      if (oldTask) dispatch(updateTask(oldTask));
    }
  };

  /* ── Supprimer une tâche ── */
  const handleDeleteTask = async (taskId) => {
    const oldTask = items.find((t) => t.id === taskId);
    dispatch(removeTask(taskId));
    try {
      await tasksApi.delete(taskId);
    } catch {
      if (oldTask) dispatch(addTask(oldTask));
    }
  };

  /* ── Supprimer le projet ── */
  const handleDeleteProject = async () => {
    try {
      await projectsApi.delete(projectId);
      dispatch(clearCurrentProject());
      navigate('/projects');
    } catch {
      alert("Erreur lors de la suppression du projet");
    }
  };

  /* ── Ajouter un commentaire ── */
  const handleAddComment = async (taskId, text) => {
    const tempComment = {
      id: `temp-c-${Date.now()}`,
      text,
      author: { name: user?.username || user?.name },
      createdAt: "à l'instant",
    };

    dispatch(addComment({ taskId, comment: tempComment }));

    try {
      const res = await tasksApi.addComment(taskId, text);
      const task = items.find((t) => t.id === taskId);
      if (task?.comments) {
        task.comments = task.comments.filter((c) => c.id !== tempComment.id);
        task.commentCount = Math.max(0, (task.commentCount || 1) - 1);
        dispatch(addComment({ taskId, comment: res.data }));
      }
    } catch {
      /* Garder le commentaire en local */
    }
  };

  const roleLabels = {
    OWNER: { label: 'Owner', className: 'kb-role-owner' },
    MANAGER: { label: 'Manager', className: 'kb-role-manager' },
    MEMBER: { label: 'Membre', className: 'kb-role-member' },
  };

  const roleInfo = roleLabels[currentProjectRole] || roleLabels.MEMBER;

  return (
    <div className="kb-layout">
      {/* ── Top bar ── */}
      <div className="kb-topbar">
        <div className="kb-topbar-left">
          <button className="kb-back" onClick={() => navigate('/projects')}>
            <FiArrowLeft size={18} />
          </button>
          <div>
            <h1 className="kb-board-title">
              {loading ? 'Chargement…' : (currentProjectName || `Projet ${projectId}`)}
            </h1>
            <div className="kb-board-meta">
              <span className={`kb-role-badge ${roleInfo.className}`}>
                {roleInfo.label}
              </span>
              <span className="kb-board-count">
                {items.length} tâche{items.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        <div className="kb-topbar-right">
          {canManageProject && (
            <button
              className={`kb-topbar-btn ${showMembers ? 'kb-topbar-btn-active' : ''}`}
              onClick={() => { setShowMembers(!showMembers); setShowInvite(false); }}
              title="Membres"
            >
              <FiUsers size={18} />
            </button>
          )}

          {canManageProject && (
            <button
              className="kb-topbar-btn"
              onClick={() => { setShowInvite(true); setShowMembers(false); }}
              title="Inviter un membre"
            >
              <FiUsers size={18} />
              <span className="kb-topbar-btn-plus">+</span>
            </button>
          )}

          {isOwner && (
            <button 
              className="kb-topbar-btn" 
              title="Paramètres du projet"
              onClick={() => setShowSettings(true)}
            >
              <FiSettings size={18} />
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="kb-error">
          <span>{error}</span>
          <button onClick={() => window.location.reload()}>Réessayer</button>
        </div>
      )}

      {/* ── BOUTONS POUR CHANGER DE VUE ── */}
      <div style={{ padding: '0 24px 20px', display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => setView('kanban')}
          style={{ 
            padding: '8px 16px', 
            cursor: 'pointer', 
            background: view === 'kanban' ? '#128C7E' : '#e2e8f0', 
            color: view === 'kanban' ? 'white' : 'black', 
            border: 'none', 
            borderRadius: '6px', 
            fontWeight: '500' 
          }}
        >
          Tableau Kanban
        </button>
        <button 
          onClick={() => setView('dashboard')}
          style={{ 
            padding: '8px 16px', 
            cursor: 'pointer', 
            background: view === 'dashboard' ? '#128C7E' : '#e2e8f0', 
            color: view === 'dashboard' ? 'white' : 'black', 
            border: 'none', 
            borderRadius: '6px', 
            fontWeight: '500' 
          }}
        >
          Tableau de bord
        </button>
      </div>

      <div className="kb-content">
        {loading && items.length === 0 ? (
          <div className="kb-loader">
            <div className="spinner spinner-lg" />
            <span>Chargement du tableau…</span>
          </div>
        ) : view === 'dashboard' ? (
          /* ==========================================
             AFFICHAGE DU TABLEAU DE BORD ICI
             ========================================== */
          <ProjectDashboard projectId={projectId} />
        ) : (
          /* ==========================================
             AFFICHAGE DU KANBAN NORMAL ICI
             ========================================== */
          <div className="kb-board">
            {DEFAULT_COLUMNS.map((col) => (
              <TaskColumn
                key={col.id}
                column={col}
                tasks={getTasksByColumn(col.id)}
                onTaskClick={(task) => setSelectedTaskId(task.id)}
                onUpdate={handleUpdateTask}
                onDragStart={handleDragStart}
                onDrop={handleDrop}
                onAddTask={canAddTask ? handleAddTask : undefined}
                canAddTask={canAddTask}
              />
            ))}
          </div>
        )}

        {showMembers && view === 'kanban' && (
          <div className="kb-sidebar-panel">
            <MembersPanel
              projectId={projectId}
              currentUserRole={currentProjectRole}
            />
          </div>
        )}
      </div>

      {/* ── Modal Détail Tâche ── */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTaskId(null)}
          onUpdate={handleUpdateTask}
          onAddComment={handleAddComment}
          onDelete={canDeleteTask ? handleDeleteTask : undefined}
          canDelete={canDeleteTask}
          members={projectMembers}
        />
      )}

      {/* ── Modal Invitation ── */}
      {showInvite && (
        <InviteMemberModal
          projectId={projectId}
          onClose={() => setShowInvite(false)}
          onInvited={() => setShowInvite(false)}
        />
      )}

      {/* ── Modal Paramètres ── */}
      {showSettings && (
        <ProjectSettingsModal
          project={{ 
            id: projectId, 
            name: currentProjectName, 
            description: '', 
            status: 'ACTIF' 
          }}
          onClose={() => setShowSettings(false)}
          onUpdated={() => {
            projectsApi.getById(projectId).then((res) => {
              dispatch(setCurrentProject({ 
                id: projectId, 
                name: res.data.name, 
                role: currentProjectRole 
              }));
            });
          }}
          onDelete={handleDeleteProject}
        />
      )}
    </div>
  );
}

