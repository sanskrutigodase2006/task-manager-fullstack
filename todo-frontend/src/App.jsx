import { useState, useEffect } from 'react';
import { createTask, getAllTasks, deleteTask, updateTask } from "./services/taskService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function App() {

  const navigate = useNavigate();

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
    }

  }, [navigate]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("PENDING");
  const userName = localStorage.getItem("name");

  const filteredTasks = tasks.filter((task) => {

    const matchesStatus =
      filter === "ALL"
        ? true
        : task.status === filter;

    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesSearch;

  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("Please fill all fields");
      return;
    }

    const task = {
      title,
      description,
      status,
      priority,
      dueDate
    };

    try {

      if (editId) {

        await updateTask(editId, task);
        toast.success("Task Updated Successfully");

        setEditId(null);

      } else {
        await createTask(task);
        toast.success("Task Added Successfully");
      }

      setTitle("");
      setDescription("");

      setPriority("MEDIUM");
      setDueDate("");
      fetchTasks();

    } catch (error) {
      console.error(error);
    }
  };

  const fetchTasks = async () => {

    setLoading(true);

    try {

      const response = await getAllTasks();

      setTasks(response.data);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  const handleLogout = () => {

  const confirmLogout =
    window.confirm("Are you sure you want to logout?");

  if (!confirmLogout) return;

  localStorage.removeItem("token");
  localStorage.removeItem("email");
  localStorage.removeItem("name");

  navigate("/login");
};
  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      fetchTasks();
      toast.success("Task Deleted Successfully");
    } catch (error) {
      console.error(error);
    }
  };

  const handleComplete = async (task) => {

    const updatedTask = {
      ...task,
      status: "COMPLETED"
    };

    try {
      await updateTask(task.id, updatedTask);

      fetchTasks();
      toast.success("Task Completed");
    } catch (error) {
      console.error(error);
    }

  };

  const handleEdit = (task) => {

    setEditId(task.id);

    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setPriority(task.priority || "MEDIUM");
    setDueDate(task.dueDate || "");
  };
  useEffect(() => {
    fetchTasks();
  }, []);

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    task => task.status === "COMPLETED"
  ).length;

  const pendingTasks = tasks.filter(
    task => task.status === "PENDING"
  ).length;

  return (
    <div className="dashboard-page">

      <div className="text-center mb-5">

      </div>

      <div className="dashboard-header">

        <div>
          <h1>Task Manager</h1>
          <p>Welcome, {userName || "User"} 👋</p>
        </div>

        <div>
          <button
            className="btn btn-primary me-2"
            onClick={() => navigate("/profile")}
          >
            Profile
          </button>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

      </div>
      <div className="glass-card mb-4">

        <h4 className="mb-3 text-center">

          {editId ? "Update Task" : "Create New Task"}

        </h4>

        <form onSubmit={handleSubmit}>

          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <textarea
              className="form-control"
              rows="3"
              placeholder="Task Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <select
            className="form-select mb-3"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="HIGH">High Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="LOW">Low Priority</option>
          </select>

          <input
            type="date"
            className="form-control mb-3"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-primary w-100"
          >
            {editId ? "Update Task" : "Add Task"}
          </button>

        </form>

      </div>
      <hr />

      <div className="row mb-4">

        <div className="col-md-4">
          <div className="card stats-card text-center shadow">
            <div className="card-body">
              <h3>{totalTasks}</h3>
              <p>Total Tasks</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h3>{pendingTasks}</h3>
              <p>Pending</p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card text-center shadow-sm">
            <div className="card-body">
              <h3>{completedTasks}</h3>
              <p>Completed</p>
            </div>
          </div>
        </div>

      </div>

      <div className="search-card mb-4">

        <input
          type="text"
          className="form-control search-box"
          placeholder="🔍 Search Tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

      </div>
      <div className="text-center mb-4">

        <button
          className="btn btn-outline-dark me-2"
          onClick={() => setFilter("ALL")}
        >
          All
        </button>

        <button
          className="btn btn-outline-warning me-2"
          onClick={() => setFilter("PENDING")}
        >
          Pending
        </button>

        <button
          className="btn btn-outline-success"
          onClick={() => setFilter("COMPLETED")}
        >
          Completed
        </button>

      </div>
      <h3>Task List</h3>

      {loading && (

        <div className="filter-section text-center">

          <div
            className="spinner-border text-primary"
            role="status"
          >
          </div>

        </div>

      )}

      <div className="row mt-4">
        {filteredTasks.length === 0 && (

          <div className="text-center mt-4">

            <h5 className="text-muted">
              No Tasks Found
            </h5>

          </div>

        )}

        {filteredTasks.map((task) => (

          <div className="col-md-6 mb-3" key={task.id}>

            <div
              className={`card task-card
  ${task.priority === "HIGH"
                  ? "priority-high"
                  : task.priority === "MEDIUM"
                    ? "priority-medium"
                    : "priority-low"
                }`}
            >

              <div className="card-body">

                <h5>{task.title}</h5>

                <p>{task.description}</p>
                <p>
                  <strong>Priority:</strong> {task.priority}
                </p>

                <p>
                  <strong>Due Date:</strong> {task.dueDate}
                </p>

                <span
                  className={
                    task.status === "COMPLETED"
                      ? "badge bg-success"
                      : "badge bg-warning text-dark"
                  }
                >
                  {task.status}
                </span>

                <div className="mt-3">

                  {task.status !== "COMPLETED" && (
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleComplete(task)}
                    >
                      Complete
                    </button>
                  )}

                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => handleEdit(task)}
                  >
                    Edit
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>



                </div>

              </div>

            </div>

          </div>

        ))}

      </div>
      <ToastContainer />
    </div>
  );
}

export default App;