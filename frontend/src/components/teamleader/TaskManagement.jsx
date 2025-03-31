import React, { useState } from 'react';
import styles from "./StaffDashboard.module.css";

const TaskManagement = () => {
  // State for new task input by the user
  const [newTask, setNewTask] = useState({
    category: 'High Priority',
    description: '',
    tooltip: ''
  });
  
  // State to store user-added tasks
  const [userTasks, setUserTasks] = useState([]);
  
  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask(prev => ({ ...prev, [name]: value }));
  };

  // Handle submission for manual task input form
  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if(newTask.description.trim() === "") return;
    setUserTasks(prev => [...prev, newTask]);
    // Reset form fields
    setNewTask({
      category: 'High Priority',
      description: '',
      tooltip: ''
    });
  };

  return (
    <div className={styles.sidebarSection}>
      <h3 class="groupTitle"><i class="fas fa-chart-bar"></i> Task Management </h3>
      
      {/* Manual Task Input Form */}
      <form onSubmit={handleTaskSubmit} className={styles.taskForm}>
        <select
          name="category"
          value={newTask.category}
          onChange={handleInputChange}
          className={styles.taskSelect}
        >
          <option value="High Priority">High Priority</option>
          <option value="Daily Tasks">Daily Tasks</option>
          <option value="Weekly Tasks">Weekly Tasks</option>
          <option value="Monthly Tasks">Monthly Tasks</option>
          <option value="Quarterly Tasks">Quarterly Tasks</option>
          <option value="Yearly Tasks">Yearly Tasks</option>
          <option value="Pending Tasks">Pending Tasks</option>
        </select>
        <input
          type="text"
          name="description"
          value={newTask.description}
          placeholder="Task description"
          onChange={handleInputChange}
          className={styles.taskInput}
        />
        <input
          type="text"
          name="tooltip"
          value={newTask.tooltip}
          placeholder="Details/Deadline"
          onChange={handleInputChange}
          className={styles.taskInput}
        />
        <button type="submit" className={styles.taskButton}>Add Task</button>
      </form>
      
      {/* Render User-Added Tasks */}
      {userTasks.length > 0 && (
        <div className={`${styles.taskCategory} ${styles.userAdded}`}>
          <h4>User Added Tasks</h4>
          {userTasks.map((task, idx) => (
            <div key={idx} className={styles.stickyNote} data-tooltip={task.tooltip}>
              {task.description} <span className={styles.taskCategoryLabel}>({task.category})</span>
            </div>
          ))}
        </div>
      )}

      {/* Static Tasks */}
      {/* High Priority Tasks */}
      <div className={`${styles.taskCategory} ${styles.highPriority}`}>
        <h4>High Priority</h4>
        <div className={`${styles.stickyNote} ${styles.urgent}`} data-tooltip="Due today">
          Review Q3 financial reports
        </div>
        <div className={`${styles.stickyNote} ${styles.urgent}`} data-tooltip="Overdue by 1 day">
          Submit budget proposal to finance
        </div>
        <div className={`${styles.stickyNote} ${styles.urgent}`} data-tooltip="Due tomorrow">
          Finalize contract with new vendor
        </div>
        <div className={`${styles.stickyNote} ${styles.urgent}`} data-tooltip="Due today">
          Address client complaints from last week
        </div>
      </div>
      
      {/* Daily Tasks */}
      <div className={styles.taskCategory}>
        <h4>Daily Tasks</h4>
        <div className={styles.stickyNote} data-tooltip="Recurring daily">
          Morning team check-in meeting
        </div>
        <div className={styles.stickyNote} data-tooltip="Today at 2:00 PM">
          Call IT vendor about system upgrade
        </div>
        <div className={styles.stickyNote} data-tooltip="End of day">
          Update project tracking dashboard
        </div>
        <div className={styles.stickyNote} data-tooltip="Before lunch">
          Review daily sales reports
        </div>
        <div className={styles.stickyNote} data-tooltip="Daily task">
          Check and respond to urgent emails
        </div>
      </div>
      
      {/* Weekly Tasks */}
      <div className={styles.taskCategory}>
        <h4>Weekly Tasks</h4>
        <div className={styles.stickyNote} data-tooltip="Every Monday">
          Team progress review meeting
        </div>
        <div className={styles.stickyNote} data-tooltip="Friday deadline">
          Prepare weekly performance report
        </div>
        <div className={styles.stickyNote} data-tooltip="Every Wednesday">
          Conduct team training session
        </div>
        <div className={styles.stickyNote} data-tooltip="Every Thursday">
          Update project timelines and milestones
        </div>
        <div className={styles.stickyNote} data-tooltip="Every Tuesday">
          Review and prioritize backlog items
        </div>
      </div>
      
      {/* Monthly Tasks */}
      <div className={styles.taskCategory}>
        <h4>Monthly Tasks</h4>
        <div className={styles.stickyNote} data-tooltip="Due on the 25th">
          Budget reconciliation
        </div>
        <div className={styles.stickyNote} data-tooltip="First Monday of month">
          Strategic planning session
        </div>
        <div className={styles.stickyNote} data-tooltip="Last Friday of month">
          Review and update marketing strategy
        </div>
        <div className={styles.stickyNote} data-tooltip="End of month">
          Conduct inventory check
        </div>
        <div className={styles.stickyNote} data-tooltip="Monthly">
          Review customer feedback and implement changes
        </div>
      </div>
      
      {/* Quarterly Tasks */}
      <div className={styles.taskCategory}>
        <h4>Quarterly Tasks</h4>
        <div className={styles.stickyNote} data-tooltip="Next quarter preparation">
          Prepare quarterly business review
        </div>
        <div className={styles.stickyNote} data-tooltip="End of quarter">
          Facility maintenance assessment
        </div>
        <div className={styles.stickyNote} data-tooltip="Quarterly">
          Conduct employee satisfaction survey
        </div>
        <div className={styles.stickyNote} data-tooltip="Quarterly">
          Review and adjust marketing budget
        </div>
        <div className={styles.stickyNote} data-tooltip="Quarterly">
          Assess and report on project outcomes
        </div>
      </div>
      
      {/* Yearly Tasks */}
      <div className={styles.taskCategory}>
        <h4>Yearly Tasks</h4>
        <div className={styles.stickyNote} data-tooltip="Annual planning">
          Annual budget planning
        </div>
        <div className={styles.stickyNote} data-tooltip="December">
          Year-end performance reviews
        </div>
        <div className={styles.stickyNote} data-tooltip="January">
          Update company policies and procedures
        </div>
        <div className={styles.stickyNote} data-tooltip="Yearly">
          Conduct a comprehensive risk assessment
        </div>
        <div className={styles.stickyNote} data-tooltip="Yearly">
          Plan and execute company-wide team-building event
        </div>
      </div>
      
      {/* Pending Tasks */}
      <div className={`${styles.taskCategory} ${styles.pending}`}>
        <h4>Pending Tasks</h4>
        <div className={styles.stickyNote} data-tooltip="Awaiting approval">
          IT Park expansion proposal
        </div>
        <div className={styles.stickyNote} data-tooltip="Waiting for resources">
          Update tenant onboarding process
        </div>
        <div className={styles.stickyNote} data-tooltip="On hold">
          Facility security assessment
        </div>
        <div className={styles.stickyNote} data-tooltip="Pending feedback">
          Finalize employee handbook revisions
        </div>
        <div className={styles.stickyNote} data-tooltip="Awaiting client response">
          Proposal for new client project
        </div>
      </div>
    </div>
  );
};

export default TaskManagement;