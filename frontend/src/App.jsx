import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export default function App() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchTodos() }, [])

  const fetchTodos = async () => {
    const res = await axios.get(`${API}/todos`)
    setTodos(res.data)
    setLoading(false)
  }

  const addTodo = async () => {
    if (!input.trim()) return
    const res = await axios.post(`${API}/todos`, { text: input })
    setTodos([res.data, ...todos])
    setInput('')
  }

  const toggleTodo = async (id) => {
    const res = await axios.patch(`${API}/todos/${id}`)
    setTodos(todos.map(t => t._id === id ? res.data : t))
  }

  const deleteTodo = async (id) => {
    await axios.delete(`${API}/todos/${id}`)
    setTodos(todos.filter(t => t._id !== id))
  }

  const done = todos.filter(t => t.completed).length

  return (
    <div className="app">
      <div className="header">
        <h1>my <span>todos</span></h1>
        <p>keep it clean, keep it done.</p>
      </div>

      <div className="input-row">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="add a new task..."
        />
        <button onClick={addTodo}>+ add</button>
      </div>

      <div className="stats">
        <div className="stat"><div className="num">{todos.length}</div><div className="lbl">total</div></div>
        <div className="stat"><div className="num">{done}</div><div className="lbl">done</div></div>
        <div className="stat"><div className="num">{todos.length - done}</div><div className="lbl">remaining</div></div>
      </div>

      <div className="divider" />

      {loading ? <p className="empty">loading...</p> : (
        <div className="todo-list">
          {todos.length === 0 && <p className="empty">no tasks yet — add one above</p>}
          {todos.map(todo => (
            <div key={todo._id} className={`todo-item ${todo.completed ? 'done' : ''}`}>
              <div className={`check ${todo.completed ? 'checked' : ''}`} onClick={() => toggleTodo(todo._id)} />
              <span className="todo-text">{todo.text}</span>
              <button className="del-btn" onClick={() => deleteTodo(todo._id)}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}