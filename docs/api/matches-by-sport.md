---
sidebar_position: 2
---

# GET /api/matches/:sport

Retrieve matches for a specific sport, optionally filtered by status.

## Endpoint

```
GET /api/matches/:sport?status={live|upcoming|completed}
```

## Parameters

### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `sport` | string | Yes | Sport identifier (cricket, football, hockey, soccer, tennis, badminton) |

### Query Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `status` | string | No | all | Filter by match status: `live`, `upcoming`, or `completed` |

## Request Examples

### Get all cricket matches

```bash
curl http://localhost:3000/api/matches/cricket
```

### Get live cricket matches

```bash
curl http://localhost:3000/api/matches/cricket?status=live
```

### Get upcoming football matches

```bash
curl http://localhost:3000/api/matches/football?status=upcoming
```

## Response

### Success Response (200 OK)

```json
{
  "success": true,
  "data": [
    {
      "id": "cricket-1",
      "sport": "cricket",
      "tournament": "ICC World Cup 2025",
      "homeTeam": {
        "name": "India",
        "initials": "IND",
        "score": {
          "runs": 285,
          "wickets": 6,
          "overs": "48.3"
        }
      },
      "awayTeam": {
        "name": "Australia",
        "initials": "AUS",
        "score": {
          "runs": 198,
          "wickets": 4,
          "overs": "35.2"
        }
      },
      "venue": {
        "name": "Melbourne Cricket Ground",
        "city": "Melbourne",
        "country": "Australia"
      },
      "status": "live",
      "format": "ODI",
      "startTime": "2024-12-25T10:00:00Z"
    }
  ]
}
```

## Supported Sports

| Sport ID | Display Name |
|----------|--------------|
| `cricket` | Cricket |
| `football` | American Football |
| `hockey` | Hockey |
| `soccer` | Soccer |
| `tennis` | Tennis |
| `badminton` | Badminton |

## Sport-Specific Score Formats

### Cricket
```json
"score": {
  "runs": 285,
  "wickets": 6,
  "overs": "48.3"
}
```

### American Football
```json
"score": {
  "points": 24,
  "period": "3rd",
  "timeRemaining": "8:45"
}
```

### Hockey
```json
"score": {
  "goals": 3,
  "period": "2nd",
  "timeRemaining": "12:30"
}
```

### Soccer
```json
"score": {
  "goals": 2,
  "half": "2nd",
  "minute": "67"
}
```

### Tennis
```json
"score": {
  "sets": [6, 4, 3],
  "serving": false
}
```

### Badminton
```json
"score": {
  "games": [21, 18, 14],
  "serving": true
}
```

## Error Responses

### Invalid Sport (400 Bad Request)

```json
{
  "success": false,
  "error": "Invalid sport. Must be one of: cricket, football, hockey, soccer, tennis, badminton"
}
```

### Invalid Status (400 Bad Request)

```json
{
  "success": false,
  "error": "Invalid status. Must be one of: live, upcoming, completed"
}
```

## Implementation Notes

### Backend Code

Location: `backend/src/routes/matches.routes.ts`

```typescript
router.get('/:sport', async (req, res) => {
  const { sport } = req.params;
  const { status } = req.query;
  
  // Validate sport
  const validSports = ['cricket', 'football', 'hockey', 'soccer', 'tennis', 'badminton'];
  if (!validSports.includes(sport)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid sport'
    });
  }
  
  // Get matches from mock data service
  const matches = await mockDataService.getMatches(sport, status);
  
  res.json({
    success: true,
    data: matches
  });
});
```

## Frontend Usage

```typescript
import { matchService } from '../services/matchService';

// Get all cricket matches
const allMatches = await matchService.getMatches('cricket');

// Get live cricket matches
const liveMatches = await matchService.getMatches('cricket', 'live');
```

## Testing

### Unit Tests

Test cases to implement:
- ✅ Valid sport returns matches
- ✅ Invalid sport returns 400 error
- ✅ Status filter works correctly
- ✅ Invalid status returns 400 error
- ✅ Empty result set returns empty array

### Integration Tests

```javascript
describe('GET /api/matches/:sport', () => {
  it('should return cricket matches', async () => {
    const response = await request(app)
      .get('/api/matches/cricket')
      .expect(200);
      
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
  
  it('should filter by status', async () => {
    const response = await request(app)
      .get('/api/matches/cricket?status=live')
      .expect(200);
      
    const matches = response.body.data;
    matches.forEach(match => {
      expect(match.status).toBe('live');
    });
  });
});
```

## Performance Considerations

- Mock data is loaded from JSON files on server start
- No database queries needed
- Response time: < 10ms average
- Caching: Consider implementing Redis for production

## Future Enhancements

1. **Pagination:** Add `limit` and `offset` parameters
2. **Sorting:** Add `sortBy` parameter (date, score, etc.)
3. **Filtering:** Add more filters (tournament, date range)
4. **Real-time Updates:** WebSocket support for live scores

## Related Endpoints

- [GET /api/matches/live](./matches-live.md) - All live matches
- [GET /api/match/:id](./match-detail.md) - Single match details
- [GET /api/sports](./sports.md) - List all sports
