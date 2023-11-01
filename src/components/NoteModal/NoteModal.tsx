import Modal from "react-modal";
import "./NoteModal.css";

export default function NoteModal({
  isOpen,
  isEditing,
  newNote,
  handleAddNote,
  closeModal,
  errorAlert,
  setNewNote,
}) {
  const resetNewNote = () => {
    setNewNote({
      title: "",
      description: "",
    });
  };

  const handleCloseModal = () => {
    resetNewNote();
    closeModal();
    
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      contentLabel={isEditing ? "Editar Nota" : "Adicionar Nota"}
      style={{
        content: {
          width: "40%",
          margin: "auto",
        },
      }}
    >
      <h2>{isEditing ? "Editar Nota" : "Adicionar Nota"}</h2>
      <div className="modal-content">
        {errorAlert && <p className="error-message">{errorAlert}</p>}
        <input
          type="text"
          placeholder="Título"
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Descrição"
          value={newNote.description}
          onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
        />
        <button onClick={handleAddNote}>
          {isEditing ? "Salvar Alteração" : "Adicionar Nota"}
        </button>
        <button onClick={handleCloseModal}>Fechar</button>
      </div>
    </Modal>
  );
}