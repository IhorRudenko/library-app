# 📚 Library App – Testaufgabe

Dieses Projekt wurde im Rahmen der technischen Einstellungsaufgabe für die Stelle  
**Fachinformatiker für Anwendungsentwicklung** bei **Mittwald CM Service GmbH & Co. KG** erstellt.

---

## 🚀 Funktionen

- 📖 Liste aller Bücher anzeigen
- ➕ Neues Buch hinzufügen
- ❌ Buch löschen
- 💾 Speicherung der Bücher in einer lokalen Datei `books.json` (Backend)

---

## 🛠 Technologien

### 🔹 Backend
- Node.js
- Express
- TypeScript
- Datenspeicherung in JSON (`books.json`)

### 🔹 Frontend
- React
- TypeScript
- Axios (für HTTP-Anfragen)
- CSS (Standard-Styling)

---

## 📦 Lokale Ausführung

### 🔧 Backend starten
```bash
cd backend
npm install
npx ts-node server.ts
```
Server wird auf `http://localhost:3001` ausgeführt.

---

### 🌐 Frontend starten
```bash
cd frontend
npm install
npm start
```
App ist unter `http://localhost:3000` erreichbar.

---

## 🧭 Projektstruktur

```
my-library/
├── backend/
│   ├── books.json           # Lokale "Datenbank" für Bücher
│   ├── server.ts            # Express-Server
│   ├── package.json         # Abhängigkeiten
│   └── tsconfig.json        # TypeScript-Konfiguration
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── components/
│   │   │   ├── AddBook.tsx
│   │   │   └── BookList.tsx
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
├── README.md
```

---

## 📝 Zukünftige Verbesserungen

- ✏️ Bücher bearbeiten (nicht nur löschen)
- 🔐 Benutzer-Login-System
- 💽 Umstieg von `books.json` auf echte Datenbank (z. B. MongoDB, SQLite)
- 🌍 Deployment in der Cloud (Render, Vercel)

---

## 📧 Kontakt

**Autor:** Ihor Rudenko  
📬 E-Mail: i.rudenko108@gmail.com  
🌐 GitHub: [github.com/IhorRudenko](https://github.com/IhorRudenko)

---

> 🛠 Dieses Projekt befindet sich noch in der Entwicklung. Feedback ist willkommen!