import { useState, useEffect } from 'react';
import axios from '../../api/axiosInstance'; // CHEMIN CORRIGÉ ICI
import { FiUser, FiCheckCircle, FiBarChart2 } from 'react-icons/fi';
import './ProjectDashboard.css';

export default function ProjectDashboard({ projectId }) {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`/projects/${projectId}/dashboard-stats`);
        setStats(res.data);
      } catch (error) {
        console.error("Erreur lors du chargement du dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [projectId]);

  if (loading) return <div className="dashboard-loading">Chargement des statistiques...</div>;

  // Calcul de la progression globale du projet
  const totalTasksAll = stats.reduce((acc, curr) => acc + curr.totalTasks, 0);
  const totalCompletedAll = stats.reduce((acc, curr) => acc + curr.completedTasks, 0);
  const globalProgress = totalTasksAll > 0 ? Math.round((totalCompletedAll / totalTasksAll) * 100) : 0;

  return (
    <div className="dashboard-container">
      
      {/* Carte Résumé Global */}
      <div className="dashboard-global-card">
        <div className="global-stats-icon">
          <FiBarChart2 size={24} />
        </div>
        <div className="global-stats-text">
          <h3>Progression globale du projet</h3>
          <div className="global-progress-bar-bg">
            <div 
              className="global-progress-bar-fill" 
              style={{ width: `${globalProgress}%` }}
            ></div>
          </div>
          <p className="global-percentage">{globalProgress}% complété</p>
        </div>
      </div>

      {/* Liste des membres */}
      <h3 className="dashboard-members-title">Performance par membre</h3>
      <div className="dashboard-members-list">
        {stats.length === 0 ? (
          <p>Aucune tâche assignée pour le moment.</p>
        ) : (
          stats.map((member) => (
            <div key={member.userId} className="member-stat-card">
              <div className="member-info">
                <div className="member-avatar">
                  {member.avatarUrl ? (
                    <img src={member.avatarUrl} alt={member.username} />
                  ) : (
                    <FiUser size={18} />
                  )}
                </div>
                <div>
                  <p className="member-name">{member.username}</p>
                  <p className="member-tasks-count">{member.completedTasks} / {member.totalTasks} tâches</p>
                </div>
              </div>
              
              <div className="member-progress-section">
                <div className="member-progress-bar-bg">
                  <div 
                    className="member-progress-bar-fill" 
                    style={{ width: `${member.progressPercentage}%` }}
                  ></div>
                </div>
                <span className="member-percentage" style={{ color: member.progressPercentage === 100 ? '#128C7E' : 'inherit' }}>
                  {member.progressPercentage}%
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
