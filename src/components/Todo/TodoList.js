import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { createTodo, getTodos, updateTodo, deleteTodo } from "../../utils/api";
import { useSpring, animated } from "react-spring";
import Modal from "react-modal";
import moment from "moment";

Modal.setAppElement("#root");

function TodoList() {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateTodoData, setUpdateTodoData] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(true);
  const [editingTodoId, setEditingTodoId] = useState(null);
  const navigate = useNavigate();

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    try {
      if (user?.id) {
        const data = await getTodos(user.id);
        setTodos(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching todos:", error);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) fetchTodos();
  }, [user, fetchTodos]);

  const handleCreateTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.title) return;
    await createTodo({ ...newTodo }, user.id);
    setNewTodo({ title: "", description: "" });
    setIsAddModalOpen(false);
    fetchTodos();
  };

  const handleUpdateTodo = async (todoId, updates) => {
    await updateTodo(todoId, updates);
    fetchTodos();
    setIsUpdateModalOpen(false);
  };

  const handleDeleteTodo = async (todoId) => {
    await deleteTodo(todoId);
    fetchTodos();
  };

  const openUpdateModal = (todo) => {
    setUpdateTodoData({ title: todo.title, description: todo.description });
    setEditingTodoId(todo.id);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setUpdateTodoData({ title: "", description: "" });
    setEditingTodoId(null);
  };

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);

  const animation = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  });

  return (
    <animated.div style={animation}>
      <h2>Todo Lists</h2>
      <button onClick={openAddModal}>Add Todo</button>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {todos?.map((todo) => (
            <li key={todo.id}>
              <h3>{todo.title}</h3>
              <p><strong>Description: </strong>{todo.description}</p>
              <p> <strong>Created: </strong>{moment(todo.created_at).format("MMMM DD, YYYY HH:mm:ss")}</p>
              <button className="button-secondary" onClick={() => navigate(`/tasks/${todo.id}`)}>
                View Tasks
              </button>
              <button className="button-secondary" onClick={() => handleDeleteTodo(todo.id)}>
                Delete
              </button>
              <button className="button-secondary" onClick={() => openUpdateModal(todo)}>
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}
      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={closeAddModal}
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "300px",
            padding: "20px",
            backgroundColor: "var(--card-background)",
            borderRadius: "8px",
            border: "none",
          },
        }}
      >
        <h3>Add Todo</h3>
        <form onSubmit={handleCreateTodo}>
          <label htmlFor="new-title">Title</label>
          <input
            id="new-title"
            type="text"
            value={newTodo.title}
            onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
            placeholder="Todo Title"
            required
          />
          <label htmlFor="new-description">Description</label>
          <textarea
            id="new-description"
            value={newTodo.description}
            onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
            placeholder="Description"
          />
          <button type="submit">Add Todo</button>
          <button type="button" onClick={closeAddModal}>Cancel</button>
        </form>
      </Modal>
      <Modal
        isOpen={isUpdateModalOpen}
        onRequestClose={closeUpdateModal}
        style={{
          overlay: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            width: "300px",
            padding: "20px",
            backgroundColor: "var(--card-background)",
            borderRadius: "8px",
            border: "none",
          },
        }}
      >
        <h3>Update Todo</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateTodo(editingTodoId, updateTodoData);
          }}
        >
          <label htmlFor="update-title">Title</label>
          <input
            id="update-title"
            type="text"
            value={updateTodoData.title}
            onChange={(e) => setUpdateTodoData({ ...updateTodoData, title: e.target.value })}
            placeholder="Todo Title"
            required
          />
          <label htmlFor="update-description">Description</label>
          <textarea
            id="update-description"
            value={updateTodoData.description}
            onChange={(e) => setUpdateTodoData({ ...updateTodoData, description: e.target.value })}
            placeholder="Description"
          />
          <button type="submit">Update Todo</button>
          <button type="button" onClick={closeUpdateModal}>Cancel</button>
        </form>
      </Modal>
    </animated.div>
  );
}

export default TodoList;