import { useState, useEffect, useRef } from 'react';
import { FiCalendar, FiChevronLeft, FiChevronRight, FiPlus, FiX } from 'react-icons/fi';
import Sidebar from '../workspace/Sidebar';
import './PlannerPage.css';

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAYS_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
const COLORS = ['#128C7E', '#25D366', '#4f46e5', '#f59e0b', '#ef4444', '#8b5cf6'];

// Doit rester identique à la hauteur de ligne définie dans le CSS (grid-auto-rows)
const ROW_HEIGHT = 60;
const HEADER_HEIGHT = 60;

const getDaysOfWeek = (date) => {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(date.setDate(diff));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
};

const formatDate = (date) => date.toISOString().split('T')[0];

export default function PlannerPage() {
  const [events, setEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week');
  const [showModal, setShowModal] = useState(false);
  const [slotData, setSlotData] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', color: COLORS[0] });
  const timeIndicatorRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('flowly_planner_events');
    if (saved) setEvents(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('flowly_planner_events', JSON.stringify(events));
  }, [events]);

  // ✅ Scroll automatique CENTRÉ : la ligne rouge reste au milieu de la page,
  // c'est la grille des heures qui défile en dessous pour l'aligner avec "maintenant".
  useEffect(() => {
    const setupTime = () => {
      if (gridRef.current) {
        const currentPosition = HEADER_HEIGHT + getCurrentTimeTop();
        const containerHeight = gridRef.current.clientHeight;

        let scrollTo = currentPosition - containerHeight / 2;
        const maxScroll = gridRef.current.scrollHeight - containerHeight;
        scrollTo = Math.max(0, Math.min(scrollTo, maxScroll));

        gridRef.current.scrollTop = scrollTo;
      }
    };

    const timer = setTimeout(setupTime, 150);
    const interval = setInterval(setupTime, 30000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [currentDate, view]);

  const getCurrentTimeTop = () => {
    const now = new Date();
    return now.getHours() * ROW_HEIGHT + (now.getMinutes() / 60) * ROW_HEIGHT;
  };

  const isToday = (date) => date.toDateString() === new Date().toDateString();

  const handleSlotClick = (date, hour) => {
    setSlotData({ date: formatDate(date), startHour: hour, endHour: hour + 1 });
    setFormData({ title: '', description: '', color: COLORS[0] });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.title) return;
    setEvents([...events, { id: Date.now().toString(), ...slotData, ...formData }]);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setEvents(events.filter(e => e.id !== id));
    setShowModal(false);
  };

  const navigate = (direction) => {
    const d = new Date(currentDate);
    if (view === 'week') d.setDate(d.getDate() + direction * 7);
    else d.setDate(d.getDate() + direction);
    setCurrentDate(d);
  };

  const getEventsForSlot = (dateStr, hour) => {
    return events.filter(e => e.date === dateStr && Math.floor(e.startHour) === hour);
  };

  const renderHeader = () => {
    const days = view === 'week' ? getDaysOfWeek(new Date(currentDate)) : [new Date(currentDate)];
    const monthYear = days[0].toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

    return (
      <div className="planner-header">
        <div className="planner-header-left">
          <h2 className="planner-title" style={{ textTransform: 'capitalize' }}>{monthYear}</h2>
          <div className="planner-nav">
            <button onClick={() => navigate(-1)}><FiChevronLeft size={18} /></button>
            <button onClick={() => setCurrentDate(new Date())}>Aujourd'hui</button>
            <button onClick={() => navigate(1)}><FiChevronRight size={18} /></button>
          </div>
        </div>
        <div className="planner-view-toggle">
          <button className={view === 'week' ? 'active' : ''} onClick={() => setView('week')}>Semaine</button>
          <button className={view === 'day' ? 'active' : ''} onClick={() => setView('day')}>Jour</button>
        </div>
      </div>
    );
  };

  const renderGrid = () => {
    const days = view === 'week' ? getDaysOfWeek(new Date(currentDate)) : [new Date(currentDate)];
    const todayIndex = days.findIndex(isToday);

    // Placement 100% explicite : chaque cellule reçoit sa position exacte dans la grille
    // (grid-column / grid-row). On ne laisse plus jamais le navigateur "deviner" via
    // l'auto-placement — c'est ce qui causait la dérive en escalier observée.
    return (
      <div
        className="planner-grid"
        ref={gridRef}
        style={{
          gridTemplateColumns: `90px repeat(${days.length}, minmax(100px, 1fr))`,
          gridTemplateRows: `60px repeat(${HOURS.length}, 60px)`
        }}
      >
        {/* Coin haut-gauche : colonne 1, ligne 1 */}
        <div className="planner-corner" style={{ gridColumn: 1, gridRow: 1 }} />

        {/* En-têtes des jours : colonnes 2..N, ligne 1 */}
        {days.map((day, idx) => {
          const today = isToday(day);
          return (
            <div
              key={`head-${idx}`}
              className={`planner-day-header ${today ? 'planner-today-header' : ''}`}
              style={{ gridColumn: idx + 2, gridRow: 1 }}
            >
              <span className="planner-day-name">{DAYS_NAMES[view === 'week' ? idx : day.getDay() === 0 ? 6 : day.getDay() - 1]}</span>
              <span className="planner-day-num">{day.getDate()}</span>
            </div>
          );
        })}

        {/* Labels d'heures : colonne 1, lignes 2..25 */}
        {HOURS.map(h => (
          <div
            key={`hour-${h}`}
            className="planner-hour-label"
            style={{ gridColumn: 1, gridRow: h + 2 }}
          >
            <span className="planner-hour-label-text">{h.toString().padStart(2, '0')}:00</span>
          </div>
        ))}

        {/* Créneaux : colonnes 2..N x lignes 2..25 */}
        {days.flatMap((day, idx) => {
          const dateStr = formatDate(day);
          const today = isToday(day);
          return HOURS.map(h => (
            <div
              key={`slot-${idx}-${h}`}
              className={`planner-slot ${h % 2 === 0 ? 'planner-slot-even' : 'planner-slot-odd'} ${today ? 'planner-today-slot' : ''}`}
              style={{ gridColumn: idx + 2, gridRow: h + 2 }}
              onClick={() => handleSlotClick(day, h)}
            >
              {getEventsForSlot(dateStr, h).map(ev => (
                <div
                  key={ev.id}
                  className="planner-event"
                  style={{
                    backgroundColor: ev.color + '20',
                    borderLeft: `4px solid ${ev.color}`,
                    color: ev.color,
                    height: `${(ev.endHour - ev.startHour) * ROW_HEIGHT - 4}px`,
                    top: '2px'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSlotData(ev);
                    setFormData({ title: ev.title, description: ev.description, color: ev.color });
                    setShowModal(true);
                  }}
                >
                  <span className="event-title">{ev.title}</span>
                  <span className="event-time">{ev.startHour}:00 - {ev.endHour}:00</span>
                </div>
              ))}
            </div>
          ));
        })}

        {/* Ligne rouge de l'heure actuelle : occupe toute la colonne "aujourd'hui"
            (lignes 2 à 25), positionnée dans le flux scrollable ; au chargement le
            scroll la centre dans la page (voir useEffect ci-dessus). */}
        {todayIndex !== -1 && (
          <div
            className="planner-today-line-wrapper"
            style={{ gridColumn: todayIndex + 2, gridRow: `2 / ${HOURS.length + 2}` }}
          >
            <div ref={timeIndicatorRef} className="planner-time-indicator" style={{ top: `${getCurrentTimeTop()}px` }}>
              <div className="time-dot" />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="planner-layout">
      <Sidebar />

      <main className="planner-main">
        <div className="planner-container">
          {renderHeader()}
          {renderGrid()}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="planner-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="planner-modal" onClick={e => e.stopPropagation()}>
            <div className="planner-modal-header">
              <h3>{slotData?.id ? "Modifier l'événement" : 'Nouvel événement'}</h3>
              <button onClick={() => setShowModal(false)}><FiX size={20} /></button>
            </div>

            <div className="planner-modal-body">
              <div className="form-group">
                <label>Titre</label>
                <input
                  type="text"
                  placeholder="Ex: Réunion d'équipe"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  autoFocus
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Début</label>
                  <input type="text" value={`${slotData?.startHour || ''}:00`} disabled />
                </div>
                <div className="form-group">
                  <label>Fin</label>
                  <input
                    type="number"
                    min={slotData?.startHour + 1}
                    max="24"
                    value={formData.endHour || (slotData?.startHour + 1)}
                    onChange={(e) => setFormData({ ...formData, endHour: parseInt(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description (optionnel)</label>
                <textarea
                  rows="3"
                  placeholder="Détails de l'événement..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Couleur</label>
                <div className="color-picker">
                  {COLORS.map(c => (
                    <div
                      key={c}
                      className={`color-dot ${formData.color === c ? 'active' : ''}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setFormData({ ...formData, color: c })}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="planner-modal-footer">
              {slotData?.id && (
                <button className="btn-delete" onClick={() => handleDelete(slotData.id)}>Supprimer</button>
              )}
              <div className="modal-actions-right">
                <button className="btn-cancel" onClick={() => setShowModal(false)}>Annuler</button>
                <button className="btn-save" onClick={handleSave}>Enregistrer</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

