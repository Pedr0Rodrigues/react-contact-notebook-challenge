import { useState } from "react";
import AppError from "../../components/AppError/Error";
import Loading from "../../components/Loading/Loading";
import NoteCard from "../../components/NoteCard/NoteCard";
import NoteModal from "../../components/NoteModal/NoteModal";
import { Note } from "../../types/Note";
import "./Notebook.css";
import { useQuery, useMutation } from "react-query";

export default function Notebook() {
  const {
    data: notes,
    isFetching,
    isError,
    refetch,
  } = useQuery("notes", async () => {
    const response = await fetch("http://localhost:5000/notes");
    if (!response.ok) {
      throw new Error("Erro ao carregar os dados da lista de notas");
    }
    return response.json();
  });

  const [newNote, setNewNote] = useState({
    title: "",
    description: "",
  });

  const [editingNote, setEditingNote] = useState(null); 
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortOption, setSortOption] = useState("Alfabética");
  const [errorAlert, setErrorAlert] = useState("");

  const addNote = useMutation(
    (newNote) =>
      fetch("http://localhost:5000/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newNote),
      }),
    {
      onMutate: async (newNote) => {
        const previousNotes = [...notes];

        const updatedNotes = [...previousNotes, newNote];
        refetch(updatedNotes);

        return { previousNotes };
      },
      onSuccess: () => {
        refetch();
        setNewNote({
          title: "",
          description: "",
        });
        setErrorAlert("");
        closeModal();
      },
      onError: (error, variables, context) => {
        const previousNotes = context.previousNotes;
        refetch(previousNotes);

        setErrorAlert("Erro ao adicionar nota.");
      },
    }
  );

  const deleteNote = useMutation(
    (id) =>
      fetch(`http://localhost:5000/notes/${id}`, {
        method: "DELETE",
      }),
    {
      onMutate: async (id) => {
        const previousNotes = [...notes];

        const updatedNotes = previousNotes.filter(
          (note) => note.id !== id
        );
        refetch(updatedNotes);
        return { previousNotes };
      },
      onSuccess: () => {
        refetch();
      },
    }
  );

  const handleDeleteNote = (id) => {
    deleteNote.mutate(id);
  };

  const handleEditNote = (id) => {
    const noteToEdit = notes.find((note) => note.id === id);

    setNewNote({
      title: noteToEdit.title,
      description: noteToEdit.description,
    });

    setEditingNote(noteToEdit);
    setIsEditing(true);
    openModal(); 
  };

  const handleAddNote = async () => {
    if (isEditing) {
      if (newNote.title.trim() === "") {
        setErrorAlert("Por favor, preencha o título da Nota.");
        return;
      }

      if (newNote.description.trim() === "") {
        setErrorAlert("Por favor, descreve um pouco a respeito da Nota.");
        return;
      }

      try {
        await fetch(`http://localhost:5000/notes/${editingNote.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newNote),
        });
        setIsEditing(false);
        setEditingNote(null);
        refetch();
        setErrorAlert("");
        closeModal(); 
      } catch (error) {
        setErrorAlert("Erro ao editar nota.");
      }
    } else {
      if (newNote.title.trim() === "") {
        setErrorAlert("Por favor, preencha o título da Nota.");
        return;
      }

      if (newNote.description.trim() === "") {
        setErrorAlert("Por favor, descreve um pouco a respeito da Nota.");
        return;
      }

      try {
        const response = await addNote.mutateAsync(newNote);
        if (response.status === "success") {
          setErrorAlert("");
          closeModal(); 
        } else {
          setErrorAlert("");
        }
      } catch (error) {
        console.error("Erro ao adicionar nota:", error);
        setErrorAlert("Erro ao adicionar nota.");
      }
    }
    setNewNote({
      title: "",
      description: "",
    });
  };

  const toggleSortOption = () => {
    if (sortOption === "Alfabética") {
      setSortOption("em Pilha");
    } else if (sortOption === "em Pilha") {
      setSortOption("em Fila");
    } else {
      setSortOption("Alfabética");
    }
  };

  const sortedNotes = () => {
    let sortedList = [...notes];
    if (sortOption === "Alfabética") {
      sortedList = sortedList.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === "em Pilha") {
      sortedList = sortedList.reverse();
    }
    return sortedList;
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (isFetching) {
    return <Loading />;
  }

  if (isError) {
    return <AppError />;
  }

  return (
    <div>
      <h1>Bloco de Notas</h1>
      <div className="sort-buttons">
        <button onClick={toggleSortOption}>Ordenação {sortOption}</button>
        <br/>
        <button onClick={openModal}>Adicionar Nota</button>
      </div>
      <div className="notebook">
        {sortedNotes().map((note: Note) => (
          <NoteCard
            key={note.id}
            title={note.title}
            description={note.description}
            handleDelete={() => handleDeleteNote(note.id)}
            handleEdit={() => {
              handleEditNote(note.id);
              openModal();
            }}
          />
        ))}
      </div>

      <NoteModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        isEditing={isEditing}
        newNote={newNote}
        handleAddNote={handleAddNote}
        closeModal={closeModal}
        errorAlert={errorAlert}
        setNewNote={setNewNote}
      />

    </div>
  );
}
