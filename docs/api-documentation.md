# ScoreBook API Documentation

## Base URL

```
Development: http://localhost:3000/api
Production: https://scorebook-api.your-domain.com/api
```

## Authentication

Currently, the API does not require authentication. This may be added in future versions.

## API Modes

The backend supports two modes controlled by the `USE_MOCK_DATA` environment variable:

- **Mock Mode** (`USE_MOCK_DATA=true`): Returns predictable mock data from JSON fixtures
- **Real Mode** (`USE_MOCK_DATA=false`): Fetches data from external sports APIs

## Common Response Format

All successful responses follow this format:

```json
{
  "data": [...],
  "timestamp": 1234567890,
  "mode": "mock" | "real"
}
```

Error responses:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "details": {}
  }
}
```

## Endpoints

### Health Check

Check backend status and current mode.

**GET** `/api/health`

**Response:**
```json
{
  "status": "ok",
  "mode": "mock",
  "timestamp": 1702500000000
}
```

---

### Get Sports

Retrieve list of supported sports.

**GET** `/api/sports`

**Response:**
```json
{
  "data": [
    {
      "id": "cricket",
      "name": "Cricket",
      "icon": "cricket-ball",
      "hasHomeAway": true
    },
    {
      "id": "football",
      "name": "American Football",
      "icon": "football",
      "hasHomeAway": true
    },
    {
      "id": "tennis",
      "name": "Tennis",
      "icon": "tennis-racket",
      "hasHomeAway": false
    }
  ]
}
```

---

### Get All Live Matches

Retrieve all live matches across all sports.

**GET** `/api/matches/live`

**Response:**
```json
{
  "data": [
    {
      "id": "match_123",
      "sport": "cricket",
      "status": "live",
      "homeTeam": {
        "id": "team_1",
        "name": "India",
        "logo": "https://example.com/india.png",
        "score": {
          "runs": 250,
          "wickets": 5,
          "overs": "45.3"
        }
      },
      "awayTeam": {
        "id": "team_2",
        "name": "Australia",
        "logo": "https://example.com/australia.png",
        "score": {
          "runs": 180,
          "wickets": 3,
          "overs": "32.0"
        }
      },
      "venue": {
        "name": "Melbourne Cricket Ground",
        "city": "Melbourne",
        "country": "Australia"
      },
      "startTime": "2025-12-13T10:00:00Z",
      "tournament": "ICC World Cup 2025",
      "format": "ODI"
    }
  ]
}
```

---

### Get Matches by Sport

Retrieve matches for a specific sport, filtered by status.

**GET** `/api/matches/:sport`

**Parameters:**
- `sport` (path): Sport ID (`cricket`, `football`, `hockey`, `soccer`, `tennis`, `badminton`)
- `status` (query): Match status - `live`, `upcoming`, or `completed` (optional, defaults to all)

**Examples:**
```
GET /api/matches/cricket?status=live
GET /api/matches/football?status=upcoming
GET /api/matches/tennis
```

**Response:**
```json
{
  "data": [
    {
      "id": "match_456",
      "sport": "football",
      "status": "upcoming",
      "homeTeam": {
        "id": "team_3",
        "name": "Dallas Cowboys",
        "logo": "https://example.com/cowboys.png"
      },
      "awayTeam": {
        "id": "team_4",
        "name": "New England Patriots",
        "logo": "https://example.com/patriots.png"
      },
      "venue": {
        "name": "AT&T Stadium",
        "city": "Arlington",
        "state": "Texas",
        "country": "USA"
      },
      "startTime": "2025-12-14T18:00:00Z",
      "tournament": "NFL Regular Season"
    }
  ]
}
```

---

### Get Match Details

Retrieve detailed information for a specific match.

**GET** `/api/match/:id`

**Parameters:**
- `id` (path): Match ID

**Response:**
```json
{
  "data": {
    "id": "match_123",
    "sport": "cricket",
    "status": "live",
    "homeTeam": {
      "id": "team_1",
      "name": "India",
      "logo": "https://example.com/india.png",
      "score": {
        "runs": 250,
        "wickets": 5,
        "overs": "45.3"
      },
      "players": [
        {
          "id": "player_1",
          "name": "Virat Kohli",
          "role": "Batsman"
        }
      ]
    },
    "awayTeam": {
      "id": "team_2",
      "name": "Australia",
      "logo": "https://example.com/australia.png",
      "score": {
        "runs": 180,
        "wickets": 3,
        "overs": "32.0"
      }
    },
    "venue": {
      "name": "Melbourne Cricket Ground",
      "city": "Melbourne",
      "country": "Australia",
      "capacity": 100024
    },
    "startTime": "2025-12-13T10:00:00Z",
    "tournament": "ICC World Cup 2025",
    "format": "ODI",
    "tossWinner": "India",
    "tossDecision": "bat",
    "umpires": ["Umpire 1", "Umpire 2"],
    "referee": "Match Referee",
    "commentary": [
      {
        "over": "45.3",
        "text": "Kohli drives for four!"
      }
    ]
  }
}
```

---

## Sport-Specific Score Formats

### Cricket
```json
{
  "runs": 250,
  "wickets": 5,
  "overs": "45.3"
}
```

### American Football
```json
{
  "points": 28,
  "quarter": "3rd",
  "timeRemaining": "8:45"
}
```

### Hockey
```json
{
  "goals": 3,
  "period": "2nd",
  "timeLeft": "12:30"
}
```

### Soccer
```json
{
  "goals": 2,
  "half": "2nd",
  "minute": "78'"
}
```

### Tennis
```json
{
  "sets": [6, 4, 3],
  "games": 6,
  "currentSet": 3,
  "serving": true
}
```

### Badminton
```json
{
  "sets": [21, 19],
  "games": 12,
  "currentSet": 2
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `SPORT_NOT_FOUND` | Invalid sport ID provided |
| `MATCH_NOT_FOUND` | Match ID does not exist |
| `INVALID_STATUS` | Invalid status parameter |
| `API_ERROR` | External API request failed (real mode only) |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_ERROR` | Server error |

---

## Rate Limiting

- **Mock Mode**: No rate limiting
- **Real Mode**: 100 requests per minute per IP

---

## Caching

Responses are cached with the following TTLs:

- Live matches: 30 seconds
- Upcoming matches: 5 minutes
- Completed matches: 1 hour
- Sports list: 24 hours

---

## WebSocket Support (Future)

Real-time score updates via WebSockets will be added in a future version:

```
ws://localhost:3000/ws/match/:id
```
