# 🎭 Mafia — Godfather Control Panel

A single-device web app for running the Mafia party game. The Godfather (game manager) controls everything from this panel while other players are physically present.

---

## 📁 Project Structure

```
mafia-game/
├── docker-compose.yml
├── README.md
│
├── server/                     # Node.js + Express backend
│   ├── app.js                  # Entry point
│   ├── Dockerfile
│   ├── package.json
│   ├── models/
│   │   ├── player.js           # Player factory
│   │   └── state.js            # In-memory game state
│   ├── services/
│   │   ├── gameService.js      # Core game logic
│   │   ├── playerService.js    # Player CRUD
│   │   ├── votingService.js    # Day voting logic
│   │   └── nightService.js     # Night action logic
│   ├── controllers/
│   │   ├── gameController.js
│   │   ├── playerController.js
│   │   ├── voteController.js
│   │   └── nightController.js
│   └── routes/
│       ├── gameRoutes.js
│       ├── playerRoutes.js
│       ├── voteRoutes.js
│       └── nightRoutes.js
│
└── client/                     # React frontend
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    └── src/
        ├── App.js              # Root + page router
        ├── index.js
        ├── index.css           # Global styles
        ├── context/
        │   └── GameContext.js  # Global state via React Context
        ├── services/
        │   └── api.js          # All API calls
        ├── components/
        │   ├── PhaseIndicator.js
        │   ├── PlayerList.js
        │   ├── VotingPanel.js
        │   └── NightActionPanel.js
        └── pages/
            ├── LobbyPage.js
            ├── RoleRevealPage.js
            ├── GameDashboard.js
            └── WinScreen.js
```

---

## 🚀 Running with Docker (recommended)

### Prerequisites
- Docker Desktop installed and running (Windows with Linux containers)

### Steps

```bash
# 1. Clone / unzip the project
cd mafia-game

# 2. Build and start both services
docker-compose up --build

# 3. Open in browser
#    Frontend: http://localhost:3000
#    Backend:  http://localhost:3001
```

To stop:
```bash
docker-compose down
```

---

## 🛠 Running Locally (without Docker)

### Backend
```bash
cd server
npm install
npm start        # runs on port 3001
# or for dev with auto-reload:
npm run dev
```

### Frontend
```bash
cd client
npm install
npm start        # runs on port 3000, proxies API to :3001
```

---

## 🎮 How to Play

### 1. Lobby
- Enter each player's name and click **Add**
- Once you have 3+ players, click **Assign Roles Randomly**
- Review the role list (Godfather only), then click **Start Game**

### 2. Role Reveal
- Pass the device to each player **privately**
- Each player taps **Show My Role**, reads it, then taps **Done — Hide**
- Repeat until all players have seen their role
- Tap **Begin Night Phase**

### 3. Night Phase (Godfather runs this privately)
- Ask the Mafia (eyes open) who to kill → record in **Mafia Target**
- Ask the Doctor (if present) who to save → record in **Doctor Saves**
- Check the Detective's investigation result (visible only to you)
- Click **Resolve Night** → announces result
- Click **Go to Day →**

### 4. Day Phase
- Players discuss (Godfather facilitates)
- Use **Start Voting**, tap **+1 Vote** for each hand raised
- Click **Tally & Eliminate** → eliminates the top-voted player
- Click **Go to Night →**

### 5. Win Condition
- **Citizens win** when all Mafia are eliminated
- **Mafia wins** when Mafia count ≥ remaining Citizens
- The Win Screen shows all roles automatically

---

## 🧩 Role Distribution

| Players | Mafia | Detective | Doctor | Citizens |
|---------|-------|-----------|--------|----------|
| 3–4     | 1     | —         | —      | rest     |
| 5–6     | 1     | 1         | —      | rest     |
| 7–9     | 2     | 1         | 1      | rest     |
| 10+     | 3     | 1         | 1      | rest     |

---

## 🔌 API Reference

| Method | Path                  | Description              |
|--------|-----------------------|--------------------------|
| GET    | /players              | List all players         |
| POST   | /players              | Add player `{ name }`    |
| DELETE | /players/:id          | Remove player            |
| GET    | /game/state           | Full game state          |
| POST   | /game/assign-roles    | Randomly assign roles    |
| POST   | /game/start           | Begin role reveal phase  |
| POST   | /game/reset           | Reset everything         |
| POST   | /game/next-phase      | Advance phase            |
| POST   | /game/reveal-next     | Reveal next player role  |
| POST   | /vote/start           | Open voting round        |
| POST   | /vote                 | Cast vote `{ playerId }` |
| POST   | /vote/tally           | Tally and eliminate      |
| GET    | /vote/result          | Current vote state       |
| POST   | /night/mafia          | Set mafia target         |
| POST   | /night/doctor         | Set doctor save          |
| POST   | /night/detective      | Set detective check      |
| POST   | /night/resolve        | Resolve night actions    |

---

## 🔧 Extending the Project

- **Add a database**: Replace `server/models/state.js` with MongoDB/SQLite calls
- **Multiplayer**: Add WebSockets (socket.io) so each player's phone connects
- **More roles**: Add new roles in `gameService.js` `buildRolePool()` and handle them in `nightService.js`
- **Custom role counts**: Expose a `/game/config` endpoint to set mafia/special counts manually
