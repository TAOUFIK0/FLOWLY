import { useState, useEffect } from 'react';
import { FiInbox, FiPlus, FiTrash2, FiEdit2, FiCheck } from 'react-icons/fi';
import Sidebar from '../workspace/Sidebar';
import './InboxPage.css';

const LONG_NOTE_THRESHOLD = 220;

export default function InboxPage() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [expandedIds, setExpandedIds] = useState(new Set());
  const [nextSeq, setNextSeq] = useState(1);

  useEffect(() => {
    const savedNotes = localStorage.getItem('flowly_inbox_notes');
    if (savedNotes) {
      const parsed = JSON.parse(savedNotes);
      // Migration : les notes créées avant l'ajout de la numérotation reçoivent un ticket rétroactif.
      let counter = 1;
      const withSeq = parsed
        .slice()
        .reverse()
        .map((n) => (n.seq ? n : { ...n, seq: counter++ }))
        .reverse();
      const merged = parsed.map((n, i) => (n.seq ? n : withSeq[i]));
      setNotes(merged);
      const maxSeq = merged.reduce((max, n) => Math.max(max, n.seq || 0), 0);
      setNextSeq(maxSeq + 1);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('flowly_inbox_notes', JSON.stringify(notes));
  }, [notes]);

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const note = {
      id: Date.now().toString(),
      seq: nextSeq,
      text: newNote,
      createdAt: new Date().toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
      })
    };
    setNotes([note, ...notes]);
    setNextSeq(nextSeq + 1);
    setNewNote('');
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  const handleStartEdit = (note) => {
    setEditingId(note.id);
    setEditText(note.text);
  };

  const handleSaveEdit = (id) => {
    setNotes(notes.map(n => n.id === id ? { ...n, text: editText } : n));
    setEditingId(null);
    setEditText('');
  };

  const toggleExpand = (id) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="inbox-layout">
      <Sidebar />

      <main className="inbox-main">
        <div className="inbox-container">
          {/* En-tête */}
          <div className="inbox-header-bar">
            <div className="inbox-header-icon">
              <FiInbox size={18} />
            </div>
            <div className="inbox-header-text">
              <div className="inbox-title-row">
                <h1 className="inbox-title">Inbox</h1>
                {notes.length > 0 && (
                  <span className="inbox-count">
                    {notes.length} note{notes.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <p className="inbox-subtitle">Capturez vos idées et notes rapides</p>
            </div>
          </div>

          {/* Zone de saisie */}
          <div className="inbox-input-wrap">
            <div className="inbox-input-area">
              <input
                type="text"
                className="inbox-input"
                placeholder="Taper une note rapide..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddNote();
                  }
                }}
              />
              <button
                className="btn-inbox-add"
                onClick={handleAddNote}
                disabled={!newNote.trim()}
              >
                <FiPlus size={16} />
                Ajouter
              </button>
            </div>
            <p className="inbox-input-hint">
              Appuyez sur <kbd>Entrée</kbd> pour ajouter
            </p>
          </div>

          {/* Registre des notes */}
          {notes.length === 0 ? (
            <div className="inbox-empty">
              <div className="inbox-empty-icon">
                <FiInbox size={24} />
              </div>
              <h3>Votre inbox est vide</h3>
              <p>Tapez une note ci-dessus pour commencer à capturer vos idées.</p>
            </div>
          ) : (
            <div className="inbox-ledger">
              {notes.map((note) => {
                const isLong = note.text.length > LONG_NOTE_THRESHOLD;
                const isExpanded = expandedIds.has(note.id);
                return (
                  <div key={note.id} className="note-row">
                    <span className="note-seq">#{String(note.seq).padStart(3, '0')}</span>
                    {editingId === note.id ? (
                      <div className="inbox-edit-area">
                        <textarea
                          className="inbox-edit-textarea"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          autoFocus
                          rows={3}
                        />
                        <div className="inbox-edit-actions">
                          <button className="btn btn-primary btn-sm" onClick={() => handleSaveEdit(note.id)}>
                            <FiCheck size={14} /> OK
                          </button>
                          <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)}>
                            Annuler
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="note-content">
                          <p className={isLong && !isExpanded ? 'clamped' : ''}>{note.text}</p>
                          {isLong && (
                            <button className="note-expand-btn" onClick={() => toggleExpand(note.id)}>
                              {isExpanded ? 'Voir moins' : 'Voir plus'}
                            </button>
                          )}
                          <span className="note-date">{note.createdAt}</span>
                        </div>
                        <div className="note-actions">
                          <button className="note-action-btn" onClick={() => handleStartEdit(note)} title="Modifier">
                            <FiEdit2 size={14} />
                          </button>
                          <button className="note-action-btn delete" onClick={() => handleDeleteNote(note.id)} title="Supprimer">
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
