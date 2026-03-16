import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle, 
  Calendar as CalendarIcon, 
  Clock, 
  Bell, 
  Pin, 
  ListTodo, 
  TrendingUp,
  Target,
  Building2,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { 
  format, 
  isSameDay, 
  parseISO, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isToday, 
  addMonths, 
  subMonths 
} from 'date-fns';
import { Task, Goal } from '../types';
import { v4 as uuidv4 } from 'uuid';

const AestheticCalendar: React.FC<{
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}> = ({ selectedDate, onDateChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-display font-bold text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </h4>
        <div className="flex gap-2">
          <button 
            onClick={prevMonth}
            className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors border border-white/5"
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            onClick={nextMonth}
            className="p-2 hover:bg-white/5 rounded-lg text-white/40 hover:text-white transition-colors border border-white/5"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map(day => (
          <div key={day} className="text-center text-[10px] font-bold text-white/20 uppercase tracking-widest py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, i) => {
          const isSelected = isSameDay(day, selectedDate);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isTodayDate = isToday(day);

          return (
            <motion.button
              key={day.toString()}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDateChange(day)}
              className={`
                relative aspect-square flex items-center justify-center rounded-xl text-sm font-medium transition-all
                ${!isCurrentMonth ? 'text-white/10' : 'text-white/70'}
                ${isSelected ? 'bg-violet-glow text-white shadow-lg shadow-violet-glow/40 z-10' : 'hover:bg-white/5'}
                ${isTodayDate && !isSelected ? 'border border-violet-glow/30 text-violet-glow' : ''}
              `}
            >
              {format(day, 'd')}
              {isSelected && (
                <motion.div
                  layoutId="activeDay"
                  className="absolute inset-0 bg-violet-glow rounded-xl -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export const TodoList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [newTask, setNewTask] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'tasks' | 'goals'>('tasks');

  useEffect(() => {
    const fetchData = async () => {
      const [tasksRes, goalsRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/goals')
      ]);
      if (tasksRes.ok) setTasks(await tasksRes.json());
      if (goalsRes.ok) setGoals(await goalsRes.json());
    };
    fetchData();
  }, []);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const task: Task = {
      id: uuidv4(),
      title: newTask,
      completed: false,
      category: 'personal',
      date: selectedDate.toISOString()
    };

    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task)
      });
      if (res.ok) {
        setTasks([task, ...tasks]);
        setNewTask('');
      }
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const addGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.trim()) return;

    const goal: Goal = {
      id: uuidv4(),
      title: newGoal,
      progress: 0,
      deadline: format(selectedDate, 'yyyy-MM-dd'),
      building_type: 'skyscraper'
    };

    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goal)
      });
      if (res.ok) {
        setGoals([goal, ...goals]);
        setNewGoal('');
      }
    } catch (err) {
      console.error('Failed to add goal:', err);
    }
  };

  const toggleTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updatedTask = { ...task, completed: !task.completed };
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTask)
      });
      if (res.ok) {
        setTasks(tasks.map(t => t.id === id ? updatedTask : t));
      }
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const updateGoalProgress = async (id: string, progress: number) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    const updatedGoal = { ...goal, progress: Math.min(100, Math.max(0, progress)) };
    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedGoal)
      });
      if (res.ok) {
        setGoals(goals.map(g => g.id === id ? updatedGoal : g));
      }
    } catch (err) {
      console.error('Failed to update goal:', err);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTasks(tasks.filter(t => t.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const filteredTasks = tasks.filter(t => isSameDay(parseISO(t.date), selectedDate));

  return (
    <div className="max-w-7xl mx-auto px-6 py-32">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Calendar & Stats (4 cols) */}
        <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:col-span-4 space-y-8"
    >
          <div className="glass-card p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-display font-bold text-white flex items-center gap-3">
                <CalendarIcon className="text-violet-glow" /> Timeline
              </h3>
            </div>
            <div className="calendar-container">
              <AestheticCalendar 
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
              />
            </div>
          </div>

          <div className="glass-card p-8 bg-gradient-to-br from-violet-glow/10 to-transparent">
            <p className="label-mono mb-4">Productivity Matrix</p>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 28 }).map((_, i) => (
                <div 
                  key={i}
                  className={`aspect-square rounded-sm ${
                    i % 7 === 0 ? 'bg-violet-glow' : 
                    i % 5 === 0 ? 'bg-violet-glow/60' : 
                    i % 3 === 0 ? 'bg-violet-glow/30' : 'bg-white/5'
                  }`}
                />
              ))}
            </div>
            <p className="mt-6 text-xs text-white/40 italic">Consistency builds empires.</p>
          </div>
        </motion.div>

        {/* Right: Tasks/Goals (8 cols) */}
        <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="lg:col-span-8 space-y-8"
    >
          {/* Tabs */}
          <div className="flex p-1 bg-white/5 rounded-2xl border border-white/10 w-fit">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                activeTab === 'tasks' ? 'bg-violet-glow text-white shadow-lg' : 'text-white/40 hover:text-white'
              }`}
            >
              <ListTodo size={18} /> Tasks
            </button>
            <button
              onClick={() => setActiveTab('goals')}
              className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                activeTab === 'goals' ? 'bg-violet-glow text-white shadow-lg' : 'text-white/40 hover:text-white'
              }`}
            >
              <Target size={18} /> Goals
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'tasks' ? (
              <motion.div
                key="tasks"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="glass-card p-6">
                  <form onSubmit={addTask} className="flex gap-4">
                    <input
                      type="text"
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      placeholder={`Add a task for ${format(selectedDate, 'MMM dd')}...`}
                      className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-glow/50 transition-all"
                    />
                    <button type="submit" className="btn-primary px-6">
                      <Plus size={24} />
                    </button>
                  </form>
                </div>

                <div className="space-y-4">
                  <h4 className="label-mono flex items-center gap-2">
                    <ListTodo size={14} /> {format(selectedDate, 'MMMM dd')} Tasks
                  </h4>
                  {filteredTasks.length > 0 ? (
                    filteredTasks.map(task => (
                      <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
                    ))
                  ) : (
                    <div className="text-center py-20 bg-white/[0.02] rounded-[32px] border border-dashed border-white/10">
                      <p className="text-white/20 font-medium">No tasks for this day.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="goals"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="glass-card p-6">
                  <form onSubmit={addGoal} className="flex gap-4">
                    <input
                      type="text"
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      placeholder="Define a new goal (e.g. Learn Python)..."
                      className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-glow/50 transition-all"
                    />
                    <button type="submit" className="btn-primary px-6">
                      <Plus size={24} />
                    </button>
                  </form>
                </div>

                <div className="space-y-4">
                  <h4 className="label-mono flex items-center gap-2">
                    <Building2 size={14} /> Active Projects
                  </h4>
                  {goals.map(goal => (
                    <GoalItem key={goal.id} goal={goal} onUpdateProgress={updateGoalProgress} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

const TaskItem: React.FC<{ 
  task: Task; 
  onToggle: (id: string) => void; 
  onDelete: (id: string) => void;
}> = ({ task, onToggle, onDelete }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    whileHover={{ scale: 1.01 }}
    className={`group flex items-center justify-between p-6 rounded-3xl border transition-all ${
      task.completed ? 'bg-white/[0.02] border-white/5 opacity-50' : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.06] shadow-lg hover:shadow-violet-glow/5'
    }`}
  >
    <div className="flex items-center gap-4 flex-1">
      <button onClick={() => onToggle(task.id)} className={task.completed ? 'text-emerald-500' : 'text-white/20 hover:text-white'}>
        {task.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
      </button>
      <p className={`font-medium ${task.completed ? 'text-white/30 line-through' : 'text-white'}`}>{task.title}</p>
    </div>
    <button onClick={() => onDelete(task.id)} className="p-2 text-white/20 hover:text-red-500 transition-colors">
      <Trash2 size={18} />
    </button>
  </motion.div>
);

const GoalItem: React.FC<{
  goal: Goal;
  onUpdateProgress: (id: string, progress: number) => void;
}> = ({ goal, onUpdateProgress }) => (
  <div className="glass-card p-8 space-y-6">
    <div className="flex justify-between items-start">
      <div className="space-y-1">
        <h3 className="text-xl font-bold text-white">{goal.title}</h3>
        <p className="text-xs text-white/40 uppercase tracking-widest">Deadline: {goal.deadline}</p>
      </div>
      <div className="text-right">
        <p className="text-2xl font-display text-violet-glow">{goal.progress}%</p>
        <p className="text-[10px] text-white/40 uppercase">Completion</p>
      </div>
    </div>

    <div className="space-y-4">
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${goal.progress}%` }}
          className="h-full bg-gradient-to-r from-electric-blue to-violet-glow"
        />
      </div>
      <div className="flex gap-2">
        {[0, 25, 50, 75, 100].map(p => (
          <button
            key={p}
            onClick={() => onUpdateProgress(goal.id, p)}
            className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all ${
              goal.progress === p ? 'bg-violet-glow text-white' : 'bg-white/5 text-white/40 hover:bg-white/10'
            }`}
          >
            {p}%
          </button>
        ))}
      </div>
    </div>
  </div>
);
