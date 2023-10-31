import React, { useState } from "react";
import AppError from "../../components/AppError/Error";
import ContactCard from "../../components/ContactCard/ContactCard";
import Loading from "../../components/Loading/Loading";
import { Contact } from "../../types/Contact";
import "./Contacts.css";
import { useQuery, useMutation } from "react-query";

export default function Contacts() {
  const {
    data: contacts,
    isFetching,
    isError,
    refetch,
  } = useQuery("contacts", async () => {
    const response = await fetch("http://localhost:5000/contacts");
    if (!response.ok) {
      throw new Error("Erro ao carregar os dados da lista de contatos");
    }
    return response.json();
  });

  const [newContact, setNewContact] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [errorAlert, setErrorAlert] = useState("");

  const addContact = useMutation(
    (newContact) =>
      fetch("http://localhost:5000/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newContact),
      }),
    {
      onSuccess: () => {
        refetch(); // Atualiza a lista de contatos após adicionar um novo
        setNewContact({
          name: "",
          phone: "",
          email: "",
        });
      },
    }
  );

  const handleDeleteContact = (id) => {
    // Lógica para deleção aqui
  };

  const handleEditContact = (id) => {
    // Lógica para edição aqui
  };

  const handleAddContact = async () => {
    // Validação dos campos
    if (newContact.name.trim() === "") {
      setErrorAlert("Por favor, preencha o campo Nome.");
      return;
    }

    if (!newContact.phone.match(/^\+[0-9]{12,}$/)) {
      setErrorAlert("O campo Telefone deve começar com + e ter no mínimo 12 números.");
      return;
    }

    if (!newContact.email.match(/^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/)) {
      setErrorAlert("O campo Email não possui um formato válido.");
      return;
    }

    try {
      await addContact.mutateAsync(newContact);
      setErrorAlert(""); // Limpa a mensagem de erro após adicionar com sucesso
    } catch (error) {
      console.error("Erro ao adicionar contato:", error);
    }
  };

  if (isFetching) {
    return <Loading />;
  }

  if (isError) {
    return <AppError />;
  }

  return (
    <div>
      <h1>Contatos</h1>
      <div className="contacts">
        {contacts.map((contact: Contact) => (
          <ContactCard
            key={contact.id}
            name={contact.name}
            email={contact.email}
            phone={contact.phone}
            handleDelete={() => handleDeleteContact(contact.id)}
            handleEdit={() => handleEditContact(contact.id)}
          />
        ))}
      </div>

      <h2>Adicionar Contato</h2>
      <div className="add-contact">
        {errorAlert && <p className="error-message">{errorAlert}</p>}
        <input
          type="text"
          placeholder="Nome"
          value={newContact.name}
          onChange={(e) =>
            setNewContact({ ...newContact, name: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Telefone"
          value={newContact.phone}
          onChange={(e) =>
            setNewContact({ ...newContact, phone: e.target.value })
          }
        />
        <input
          type="text"
          placeholder="Email"
          value={newContact.email}
          onChange={(e) =>
            setNewContact({ ...newContact, email: e.target.value })
          }
        />
        <button onClick={handleAddContact}>Adicionar Contato</button>
      </div>
    </div>
  );
}
