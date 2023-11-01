import Modal from "react-modal";
import "./ContactModal.css";

export default function ContactModal({
  isOpen,
  isEditing,
  newContact,
  handleAddContact,
  closeModal,
  errorAlert,
  setNewContact,
}) {
  const resetNewContact = () => {
    setNewContact({
      name: "",
      phone: "",
      email: "",
    });
  };

  const handleCloseModal = () => {
    resetNewContact();
    closeModal();
    
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      contentLabel={isEditing ? "Editar Contato" : "Adicionar Contato"}
      style={{
        content: {
          width: "40%",
          margin: "auto",
        },
      }}
    >
      <h2>{isEditing ? "Editar Contato" : "Adicionar Contato"}</h2>
      <div className="modal-content">
        {errorAlert && <p className="error-message">{errorAlert}</p>}
        <input
          type="text"
          placeholder="Nome"
          value={newContact.name}
          onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Telefone"
          value={newContact.phone}
          onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
        />
        <input
          type="text"
          placeholder="Email"
          value={newContact.email}
          onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
        />
        <button onClick={handleAddContact}>
          {isEditing ? "Salvar Alteração" : "Adicionar Contato"}
        </button>
        <button onClick={handleCloseModal}>Fechar</button>
      </div>
    </Modal>
  );
}
