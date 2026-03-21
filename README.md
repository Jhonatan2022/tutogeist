# TutorGeist

Interfaz de chat con IA estilo TutorGeist, construida con React y CSS puro.

## 🚀 Inicio rápido

```bash
npm install
npm start
```

## 📁 Estructura del proyecto

```
tutorgeist/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── ChatArea.jsx
│   │   ├── LogoIcon.jsx
│   │   └── NetworkDecoration.jsx
│   ├── styles/
│   │   ├── global.css
│   │   └── App.css
│   ├── App.jsx
│   └── index.js
├── .gitignore
├── package.json
└── README.md
```

## 🎨 Paleta de colores

| Color | Hex |
|-------|-----|
| Teal primario | `#2dabb9` |
| Teal claro | `#87c7d1` |
| Morado | `#4c4eb3` |
| Teal oscuro | `#377e80` |

## 🌐 Deploy en GitHub Pages

### Paso 1: Crear repositorio en GitHub
1. Ve a https://github.com/new
2. Crea un repositorio llamado `tutorgeist`
3. NO inicialices con README

### Paso 2: Configurar package.json
Agrega tu usuario de GitHub en `package.json`:
```json
"homepage": "https://TU_USUARIO.github.io/tutorgeist"
```

### Paso 3: Conectar y subir

```bash
# Inicializar git
git init
git add .
git commit -m "first commit"

# Conectar con GitHub (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/tutorgeist.git
git branch -M main
git push -u origin main

# Deploy
npm run deploy
```

### Paso 4: Activar GitHub Pages
1. Ve a tu repo en GitHub
2. Settings → Pages
3. Source: selecciona rama `gh-pages`
4. Tu app estará en: `https://TU_USUARIO.github.io/tutorgeist`

## ✨ Características
- 💬 Chat interactivo con respuestas simuladas
- 🌙 Modo claro / oscuro
- 📱 Responsive
- 🎨 Paleta de colores de la marca TutorGeist
- ⌨️ Enter para enviar mensajes
