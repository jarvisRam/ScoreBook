---
sidebar_position: 1
---

# API Overview

The ScoreBook backend provides a RESTful API for accessing sports match data.

## Base URL

```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

Currently, the API does not require authentication. This can be added in future versions.

## Response Format

All API responses follow a consistent JSON structure:

### Success Response

```json
{
  "success": true,
  "data": { /* response data */ }
}
```

### Error Response

```json
{
  "success": false,
  "error": "Error message description"
}
```

## Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| [`/health`](./health.md) | GET | Health check |
| [`/sports`](./sports.md) | GET | List all sports |
| [`/matches/live`](./matches-live.md) | GET | All live matches |
| [`/matches/:sport`](./matches-by-sport.md) | GET | Matches for specific sport |
| [`/match/:id`](./match-detail.md) | GET | Single match details |

## Rate Limiting

Currently not implemented. Recommended for production:
- 100 requests per minute per IP
- 1000 requests per hour per IP

## CORS

The API is configured to accept requests from all origins in development mode. For production, configure allowed origins in the `.env` file.

## Data Source

The API currently serves mock data from JSON files located in `backend/src/mock-data/`. Each sport has three files:
- `live.json` - Live matches
- `upcoming.json` - Scheduled matches
- `completed.json` - Finished matches

## Error Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | Success |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Internal Server Error |

## Next Steps

- [Health Check Endpoint](./health.md)
- [Sports List Endpoint](./sports.md)
- [Matches Endpoints](./matches-live.md)
