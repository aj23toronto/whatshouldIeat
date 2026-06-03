# 🍳 WhatShouldIEat

> Tell us what's in your fridge. Get 3 real recipes you can make right now — no grocery run needed.

**Live demo:** [whatshouldyoueat.netlify.app](https://whatshouldyoueat.netlify.app)

---

## What it does

WhatShouldIEat is an AI-powered recipe suggester. You type in whatever ingredients you have at home (or upload a photo of your fridge), and the app returns 3 real recipes you can make immediately — using only what you already have.

Each recipe includes:
- Cook time and difficulty level
- List of ingredients used
- Step-by-step instructions

---

## Screenshots

### Input screen
![Input screen showing ingredient text box and photo upload](https://github.com/aj23toronto/whatshouldIeat/raw/main/front_end/public/screenshot-input.png)

### Results screen
![Results screen showing 3 recipe cards with steps](https://github.com/aj23toronto/whatshouldIeat/raw/main/front_end/public/screenshot-results.png)

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) |
| Backend | Node.js + Express |
| AI | Groq API (Llama 3.3 70B) |
| File uploads | Multer |
| Frontend hosting | Netlify |
| Backend hosting | Render |

---

## Project structure

```
whatshouldIeat/
├── front_end/          # Vite + React app
│   ├── src/
│   │   ├── App.jsx     # Main component + recipe cards
│   │   ├── App.css     # All styles
│   │   └── main.jsx
│   ├── .env            # VITE_API_URL
│   └── vite.config.js
│
├── back_end/           # Express API
│   ├── server.js       # API route + Groq integration
│   ├── .env            # GROQ_API_KEY
│   └── package.json
│
├── netlify.toml        # Netlify build config
├── render.yaml         # Render deployment config
└── README.md
```

---

## Running locally

### Prerequisites
- Node.js 18+
- A free [Groq API key](https://console.groq.com) (no credit card needed)

### 1. Clone the repo

```bash
git clone https://github.com/aj23toronto/whatshouldIeat.git
cd whatshouldIeat
```

### 2. Set up the backend

```bash
cd back_end
npm install
```

Create a `.env` file:

```
GROQ_API_KEY=your_groq_key_here
PORT=4000
```

Start the backend:

```bash
node server.js
```

### 3. Set up the frontend

```bash
cd front_end
npm install
```

Create a `.env` file:

```
VITE_API_URL=http://localhost:4000
```

Start the frontend:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## How it works

1. User enters ingredients (e.g. `eggs, cheese, bread`) into the text field
2. The frontend sends a `POST` request to `/api/recipes` with the ingredients as form data
3. The Express backend builds a prompt and calls the Groq API (Llama 3.3 70B)
4. The AI returns a structured JSON response with 3 recipes
5. The frontend renders the recipe cards with expandable step-by-step instructions

---

## Deployment

### Frontend — Netlify

The `netlify.toml` at the repo root configures the build automatically:

```toml
[build]
  publish = "front_end/dist"
  command = "cd front_end && npm install && npm run build"
```

Set the environment variable in Netlify:
- `VITE_API_URL` → your Render backend URL

### Backend — Render

The `render.yaml` configures the service automatically:

```yaml
services:
  - type: web
    name: whatshouldIeat-backend
    runtime: node
    rootDir: back_end
    buildCommand: npm install
    startCommand: node server.js
```

Set the environment variable in Render:
- `GROQ_API_KEY` → your Groq API key

> **Note:** Render's free tier spins down after 15 minutes of inactivity. The first request after idle will take 30–60 seconds to wake up.

---

## API reference

### `POST /api/recipes`

Accepts `multipart/form-data`.

| Field | Type | Required | Description |
|---|---|---|---|
| `ingredients` | `string` | Yes* | Comma-separated list of ingredients |
| `image` | `file` | No | Photo of fridge (JPG/PNG/WEBP, max 10MB) |

*Required if no image is provided.

**Response:**

```json
{
  "recipes": [
    {
      "title": "Grilled Cheese Sandwich",
      "description": "A classic comfort food made with melted cheese between two slices of bread",
      "time": "5 mins",
      "difficulty": "Easy",
      "ingredientsUsed": ["cheese", "bread", "butter"],
      "steps": [
        "Butter two slices of bread on the outside",
        "Place one slice butter-side down in a pan over medium heat",
        "Add cheese and top with the second slice butter-side up",
        "Cook until golden, flip and repeat"
      ]
    }
  ]
}
```

---

## Built by

**Jasmol Arora**

---

## License

MIT
