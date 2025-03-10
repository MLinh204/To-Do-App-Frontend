import { useSpring, animated } from "react-spring";
import moment from "moment";

function TodoTask({ tasks, onUpdateTask, onDeleteTask, onChangeStatus }) {
  const animation = useSpring({
    from: { opacity: 0, transform: "translateY(20px)" },
    to: { opacity: 1, transform: "translateY(0)" },
  });

  return (
    <animated.div style={animation}>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <h4>{task.title}</h4>
            <p><strong>Description: </strong>{task.description}</p>
            <p><strong>Due: </strong>{moment(task.due_date).format("MMMM Do, YYYY")}</p>
            <p style={{textTransform: "uppercase"}}><strong>Status: </strong>{task.status}</p>

            <button className="button-secondary" onClick={() => onDeleteTask(task.id)}>Delete</button>
            <button className="button-secondary" onClick={() => onUpdateTask(task)}>Edit</button>

            {/* Change Status Dropdown */}
            <select 
              value={task.status} 
              onChange={(e) => onChangeStatus(task.id, e.target.value)}
              className="button-secondary"
            >
              <option value="pending">Pending</option>
              <option value="in progress">In Progress</option>
              <option value="cancelled">Cancelled</option>
              <option value="blocked">Blocked</option>
              <option value="completed">Completed</option>
            </select>
          </li>
        ))}
      </ul>
    </animated.div>
  );
}

export default TodoTask;
