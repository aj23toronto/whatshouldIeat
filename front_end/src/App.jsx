import { useState, useRef } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

function RecipeCard({ recipe, index }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="recipe-card">
      <div className="recipe-header">
        <div className="recipe-num">{index + 1}</div>
        <div className="recipe-title-wrap">
          <h3>{recipe.title}</h3>
          <p>{recipe.description}</p>
        </div>
      </div>
      <div className="recipe-meta">
        <span className="badge time">⏱ {recipe.time}</span>
        <span className="badge">{recipe.difficulty}</span>
      </div>
      {recipe.ingredientsUsed?.length > 0 && (
        <div className="ingredients-used">
          <p className="ing-title">Ingredients used</p>
          <div className="ing-tags">
            {recipe.ingredientsUsed.map((ing, i) => (
              <span key={i} className="ing-tag">{ing}</span>
            ))}
          </div>
        </div>
      )}
      <button className="steps-toggle" onClick={() => setOpen(o => !o)}>
        <span>{open ? 'Hide' : 'Show'} step-by-step instructions</span>
        <span className={`toggle-arrow ${open ? 'open' : ''}`}>▼</span>
      </button>
      {open && (
        <ol className="steps-list">
          {recipe.steps.map((step, i) => (
            <li key={i}>
              <span className="step-num">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  )
}

export default function App() {
  const [ingredients, setIngredients] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [recipes, setRecipes] = useState(null)
  const [error, setError] = useState('')
  const [dragover, setDragover] = useState(false)
  const fileRef = useRef()

  function handleImage(file) {
    if (!file || !file.type.startsWith('image/')) return
    setImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  function removeImage() {
    setImage(null)
    setImagePreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!ingredients.trim() && !image) {
      setError('Please type some ingredients or upload a fridge photo.')
      return
    }
    setError('')
    setLoading(true)
    setRecipes(null)

    try {
      const formData = new FormData()
      if (ingredients.trim()) formData.append('ingredients', ingredients.trim())
      if (image) formData.append('image', image)

      const res = await fetch(`${API_URL}/api/recipes`, { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Server error')
      setRecipes(data.recipes)
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function reset() {
    setRecipes(null)
    setIngredients('')
    removeImage()
    setError('')
  }

  return (
    <div className="app">
      <header className="hero">
        <span className="hero-emoji">🍳</span>
        <h1>What Should I <span>Eat?</span></h1>
        <p>Tell us what's in your fridge. We'll find 3 real recipes you can make right now — no grocery run needed.</p>
      </header>

      {!recipes && !loading && (
        <section className="input-section">
          <form className="card" onSubmit={handleSubmit}>
            <p className="card-label">Step 1</p>
            <h2>What do you have?</h2>
            <textarea
              placeholder="e.g. eggs, cheddar, spinach, garlic, leftover rice..."
              value={ingredients}
              onChange={e => setIngredients(e.target.value)}
            />

            <div className="divider">or upload a fridge photo</div>

            {!imagePreview ? (
              <div
                className={`upload-zone ${dragover ? 'dragover' : ''}`}
                onDragOver={e => { e.preventDefault(); setDragover(true) }}
                onDragLeave={() => setDragover(false)}
                onDrop={e => { e.preventDefault(); setDragover(false); handleImage(e.dataTransfer.files[0]) }}
              >
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={e => handleImage(e.target.files[0])}
                />
                <div className="upload-icon">📷</div>
                <p><span>Click to upload</span> or drag & drop</p>
                <p>JPG, PNG, WEBP up to 10MB</p>
              </div>
            ) : (
              <div className="preview-wrap">
                <img src={imagePreview} alt="Fridge preview" />
                <button type="button" className="remove-img" onClick={removeImage}>✕</button>
              </div>
            )}

            {error && <div className="error-msg">{error}</div>}

            <button type="submit" className="submit-btn">
              Find My Recipes →
            </button>
          </form>
        </section>
      )}

      {loading && (
        <div className="loading">
          <div className="spinner-wrap">
            <div className="spinner" />
          </div>
          <strong>Finding your recipes...</strong>
          <p>Checking what you can make right now</p>
        </div>
      )}

      {recipes && (
        <section className="results-section">
          <div className="results-header">
            <h2>3 recipes you can make right now</h2>
            <p>Based on what you have — no extra shopping needed</p>
          </div>
          {recipes.map((recipe, i) => (
            <RecipeCard key={i} recipe={recipe} index={i} />
          ))}
          <button className="reset-btn" onClick={reset}>
            ← Try different ingredients
          </button>
        </section>
      )}

      <div className="made-by">
        <div className="made-by-inner">
          <span className="made-by-emoji">👨‍💻</span>
          <div>
            <p className="made-by-label">Built by</p>
            <p className="made-by-name">Jasmol Arora</p>
          </div>
        </div>
      </div>

      <footer>WhatShouldIEat · Powered by AI</footer>
    </div>
  )
}
