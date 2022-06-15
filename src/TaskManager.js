// JavaScript
// src/TaskManager.js
import "./taskManager.css";
import "./Dashboard.css";
import Task from "./Task";
import AddTask from "./AddTask";
import { useState, useEffect } from "react";
import {
  collection,
  orderBy,
  onSnapshot,
  getDocs,
  query,
  where,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db, logout } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";

function TaskManager() {
  const [user, loading] = useAuthState(auth);
  const [setName] = useState("");
  const [openAddModal, setOpenAddModal] = useState(false);
  const [tasks, setTasks] = useState([]);

  const navigate = useNavigate();

  /* function to get all tasks from firestore in realtime */
  useEffect(() => {
    const q = query(collection(db, "tasks"), orderBy("created", "desc"));
    onSnapshot(q, (querySnapshot) => {
      setTasks(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
  }, []);

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/login");
    fetchUserName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  const handleDeleteAll = async () => {
    const taskQuery = query(
      collection(db, "tasks"),
      where("completed", "==", true)
    );
    const querySnapshot = await getDocs(taskQuery);
    try {
      querySnapshot.forEach((aDoc) => {
        console.log(aDoc.id);
        deleteDoc(doc(db, "tasks", aDoc.id));
      });
    } catch (err) {
      alert(err);
      console.log(err.message);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="taskManager">
      <header>Task Manager</header>
      <div className="taskManager__container">
        <button onClick={() => setOpenAddModal(true)}>Add task +</button>
        <div className="taskManager__tasks">
          {tasks.map((task) => (
            <Task
              id={task.id}
              key={task.id}
              completed={task.data.completed}
              title={task.data.title}
              description={task.data.description}
            />
          ))}
        </div>
        <div className="taskManager__deleteAll">
          <button onClick={handleDeleteAll}>Delete All done</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {openAddModal && (
        <AddTask onClose={() => setOpenAddModal(false)} open={openAddModal} />
      )}
    </div>
  );
}

export default TaskManager;
