import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { getTasks, updateTask, deleteTask, createTask, getTodo } from "../utils/api";
import { useSpring, animated } from "react-spring";
import Modal from "react-modal";
import TodoTask from "../components/Todo/TodoTask";

function TaskListPage() {
  const { todoId } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [todoTitle, setTodoTitle] = useState("");
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "", status: "pending" });
  const [editTask, setEditTask] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getTasks(todoId);
      setTodoTitle(await getTodoTitle(todoId));
      setTasks(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  }, [todoId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const getTodoTitle = async(todoId) =>{
    try{
      const response = await getTodo(todoId);
      return response.data.title;
    } catch(error){
      console.error("Error fetching todo title:", error);
    }
  }

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    await createTask({ ...newTask, todoId });
    setNewTask({ title: "", description: "", dueDate: "", status: "pending" });
    setIsAddModalOpen(false);
    fetchTasks();
    alert("Task created successfully!");

  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    const updatedTask = {
      ...editTask,
      due_date: editTask.dueDate ? editTask.dueDate.split("T")[0] : editTask.due_date.split("T")[0] 
  };
    await updateTask(editTask.id, updatedTask);
    setIsEditModalOpen(false);
    fetchTasks();
    alert("Task updated successfully!");
  };

  const handleDeleteTask = async (taskId) => {
    await deleteTask(taskId);
    alert("Task deleted successfully!");
    fetchTasks();
  };
  const handleChangeStatus = async (taskId, newStatus) => {
    try {
      const updatedTask = tasks.find((task) => task.id === taskId);
      const formattedDueDate = updatedTask.due_date
      ? updatedTask.due_date.split("T")[0]
      : null;
      await updateTask(taskId, { ...updatedTask, status: newStatus, due_date: formattedDueDate });
      fetchTasks(); 
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const openAddModal = () => setIsAddModalOpen(true);
  const closeAddModal = () => setIsAddModalOpen(false);
  const openEditModal = (taskId, task) => {
    setEditTask(taskId);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => setIsEditModalOpen(false);

  const animation = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  });

  return (
    <animated.div style={animation}>
      <h2>Tasks for Todo: {todoTitle}</h2>
      <div className="btn-container">
        <button onClick={() => navigate("/todo")}>Back to Todo List</button>
        <button onClick={openAddModal}>Add Task</button>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : tasks.length > 0 ? (
        <TodoTask
          todo={{ id: Number(todoId) }}
          tasks={tasks}
          onUpdateTask={openEditModal}
          onDeleteTask={handleDeleteTask}
          onClose={() => navigate("/todo")}
          onChangeStatus={handleChangeStatus}
        />
      ) : (
        <p>No tasks found for this Todo ID.</p>
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
        <h3>Add Task</h3>
        <form onSubmit={handleCreateTask}>
          <label htmlFor="task-title">Title</label>
          <input
            id="task-title"
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Task Title"
            required
          />
          <label htmlFor="task-description">Description</label>
          <textarea
            id="task-description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            placeholder="Description"
          />
          <label htmlFor="task-dueDate">Due Date</label>
          <input
            id="task-dueDate"
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
          />
          <label htmlFor="task-status">Status</label>
          <select
            id="task-status"
            value={newTask.status}
            onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          >
            <option value="pending">Pending</option>
          </select>
          <button type="submit">Add Task</button>
          <button type="button" onClick={closeAddModal}>Cancel</button>
        </form>
      </Modal>
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
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
        <h3>Edit Task</h3>
        <form onSubmit={handleUpdateTask}>
          <label htmlFor="edit-task-title">Title</label>
          <input
            id="edit-task-title"
            type="text"
            value={editTask?.title || ""}
            onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
            required
          />
          <label htmlFor="edit-task-description">Description</label>
          <textarea
            id="edit-task-description"
            value={editTask?.description || ""}
            onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
          />
          <label htmlFor="edit-task-dueDate">Due Date</label>
          <input
            id="edit-task-dueDate"
            type="date"
            value={editTask?.dueDate || ""}
            onChange={(e) => setEditTask({ ...editTask, dueDate: e.target.value })}
          />
          <label htmlFor="edit-task-status">Status</label>
          <select
            id="edit-task-status"
            value={editTask?.status || "pending"}
            onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="cancelled">Cancelled</option>
            <option value="blocked">Blocked</option>
            <option value="completed">Completed</option>
          </select>
          <button type="submit">Update Task</button>
          <button type="button" onClick={closeEditModal}>Cancel</button>
        </form>
      </Modal>
    </animated.div>
  );
}

export default TaskListPage;