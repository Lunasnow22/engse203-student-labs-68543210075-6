import TaskCard from "./TaskCard";

function Tasklist({ tasks}){
    return (
        <div className="task-list">
            {tasks.map((task) => (
                <TaskCard key={task.id} task={task} />
            ))}
        </div>
    );
}

export default Tasklist;