---
sidebar_position: 1
---

# MatchCard Component

The primary component for displaying individual match information.

## Location

```
mobile/src/components/MatchCard.tsx
```

## Purpose

MatchCard is a comprehensive component that displays all relevant match information in a card format. It's the most frequently used component in the app, appearing in every match list.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `match` | `Match` | Yes | Match data object |
| `testID` | `string` | No | Custom testID for automation |

## Match Type Definition

```typescript
interface Match {
  id: string;
  sport: Sport;
  tournament: string;
  homeTeam: Team;
  awayTeam: Team;
  venue: Venue;
  status: 'live' | 'upcoming' | 'completed';
  startTime: string; // ISO 8601 format
  format?: string; // e.g., "ODI", "T20", "Test"
}

interface Team {
  name: string;
  initials: string;
  score?: SportScore;
}

interface Venue {
  name: string;
  city: string;
  country: string;
}
```

## Component Structure

```
MatchCard
  ├── Header
  │   ├── Sport Icon + Tournament Name
  │   └── LiveIndicator (if status === 'live')
  ├──Body
  │   ├── Home Team Row
  │   │   ├── TeamDisplay (home)
  │   │   └── ScoreDisplay (home)
  │   └── Away Team Row
  │       ├── TeamDisplay (away)
  │       └── ScoreDisplay (away)
  └── Footer
      └── VenueInfo
```

## Implementation

```typescript
export const MatchCard: React.FC<MatchCardProps> = ({ match, testID }) => {
  const showHomeAway = SPORTS_CONFIG[match.sport].showHomeAway;
  const cardTestID = testID || `matchCard_${match.sport}_${match.status}_${match.id}`;

  return (
    <View style={styles.card} testID={cardTestID}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.tournamentRow}>
          <Text style={styles.sportIcon}>{SPORTS_CONFIG[match.sport].icon}</Text>
          <Text style={styles.tournament} numberOfLines={1}>
            {match.tournament}
          </Text>
        </View>
        {match.status === 'live' && (
          <LiveIndicator testID={`${cardTestID}_liveIndicator`} />
        )}
      </View>

      {/* Match Content */}
      <View style={styles.matchContent}>
        {/* Home Team */}
        <View style={styles.teamRow}>
          <TeamDisplay
            team={match.homeTeam}
            type="home"
            showHomeAway={showHomeAway}
            testID={`${cardTestID}_homeTeam`}
          />
          <ScoreDisplay
            score={match.homeTeam.score}
            sport={match.sport}
            testID={`${cardTestID}_homeScore`}
          />
        </View>

        {/* Away Team */}
        <View style={styles.teamRow}>
          <TeamDisplay
            team={match.awayTeam}
            type="away"
            showHomeAway={showHomeAway}
            testID={`${cardTestID}_awayTeam`}
          />
          <ScoreDisplay
            score={match.awayTeam.score}
            sport={match.sport}
            testID={`${cardTestID}_awayScore`}
          />
        </View>
      </View>

      {/* Venue Info */}
      <VenueInfo
        venue={match.venue}
        format={match.format}
        testID={`${cardTestID}_venue`}
      />
    </View>
  );
};
```

## Styling

```typescript
const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  tournamentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    flex: 1,
  },
  sportIcon: {
    fontSize: 20,
  },
  tournament: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  matchContent: {
    gap: theme.spacing.md,
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
});
```

## Visual States

### Live Match

```
┌─────────────────────────────────────┐
│ 🏏 ICC World Cup 2025    [● LIVE]  │
│                                     │
│ H  IND  India            285/6     │
│                          (48.3)    │
│ A  AUS  Australia        198/4     │
│                          (35.2)    │
│                                     │
│ Melbourne Cricket Ground             │
│ Melbourne, Australia                 │  
│ ODI                                  │
└─────────────────────────────────────┘
```

### Upcoming Match

```
┌─────────────────────────────────────┐
│ 🏈 NFL Regular Season               │
│                                     │
│ H  DAL  Dallas Cowboys      --      │
│                                     │
│ A  NE   New England Patriots --     │
│                                     │
│ AT&T Stadium                        │
│ Arlington, Texas                     │
│ Kickoff: 8:00 PM EST                │
└─────────────────────────────────────┘
```

### Completed Match

```
┌─────────────────────────────────────┐
│ ⚽ Premier League                    │
│                                     │
│ H  LIV  Liverpool FC         3      │
│                                     │
│ A  MCI  Manchester City      1      │
│                                     │
│ Anfield                             │
│ Liverpool, England                   │
│ Final                               │
└─────────────────────────────────────┘
```

## TestIDs

```typescript
// Card container
testID={`matchCard_${sport}_${status}_${id}`}

// Live indicator
testID={`matchCard_${sport}_${status}_${id}_liveIndicator`}

// Home team
testID={`matchCard_${sport}_${status}_${id}_homeTeam`}

// Home score
testID={`matchCard_${sport}_${status}_${id}_homeScore`}

// Away team
testID={`matchCard_${sport}_${status}_${id}_awayTeam`}

// Away score
testID={`matchCard_${sport}_${status}_${id}_awayScore`}

// Venue
testID={`matchCard_${sport}_${status}_${id}_venue`}
```

## Usage Example

```typescript
import { MatchCard } from '../components/MatchCard';

// In FlatList
<FlatList
  data={matches}
  renderItem={({ item, index }) => (
    <MatchCard
      match={item}
      testID={`matchCard_cricket_live_${index}`}
    />
  )}
  keyExtractor={(item) => item.id}
/>
```

## Sub-Components

### 1. LiveIndicator

Shows animated "LIVE" badge with pulsing dot.

```typescript
<LiveIndicator testID={`${cardTestID}_liveIndicator`} />
```

### 2. TeamDisplay

Shows team logo, initials, name, and H/A badge.

### 3. ScoreDisplay

Renders sport-specific score format.

### 4. VenueInfo

Shows stadium info and match format.

## Interactive Features

### Tap to View Details (Future)

```typescript
const handlePress = () => {
  navigation.navigate('MatchDetail', { matchId: match.id });
};

<TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
  {/* Card content */}
</TouchableOpacity>
```

## Accessibility

```typescript
<View
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel={`${match.homeTeam.name} vs ${match.awayTeam.name}, ${match.tournament}`}
  accessibilityHint="Tap to view match details"
>
```

## Performance Considerations

1. **Memoization:** Wrap in React.memo to prevent unnecessary re-renders
2. **Image Loading:** Use placeholder logos
3. **Score Updates:** Only re-render when score changes

```typescript
export const MatchCard = React.memo<MatchCardProps>(
  ({ match, testID }) => {
    // Component code
  },
  (prevProps, nextProps) => {
    return prevProps.match.id === nextProps.match.id &&
           JSON.stringify(prevProps.match.homeTeam.score) === JSON.stringify(nextProps.match.homeTeam.score) &&
           JSON.stringify(nextProps.match.awayTeam.score) === JSON.stringify(nextProps.match.awayTeam.score);
  }
);
```

## Testing

### Unit Tests

```typescript
describe('MatchCard', () => {
  const mockMatch = {
    id: 'test-1',
    sport: 'cricket',
    tournament: 'Test Tournament',
    homeTeam: { name: 'India', initials: 'IND' },
    awayTeam: { name: 'Australia', initials: 'AUS' },
    venue: { name: 'Test Ground', city: 'Test', country: 'TC' },
    status: 'live',
    startTime: '2024-01-01T10:00:00Z',
  };

  it('renders team names correctly', () => {
    const { getByText } = render(<MatchCard match={mockMatch} />);
    expect(getByText('India')).toBeTruthy();
    expect(getByText('Australia')).toBeTruthy();
  });

  it('shows live indicator for live matches', () => {
    const { getByTestId } = render(<MatchCard match={mockMatch} />);
    expect(getByTestId('matchCard_cricket_live_test-1_liveIndicator')).toBeTruthy();
  });

  it('hides live indicator for non-live matches', () => {
    const upcomingMatch = { ...mockMatch, status: 'upcoming' };
    const { queryByTestId } = render(<MatchCard match={upcomingMatch} />);
    expect(queryByTestId('matchCard_cricket_upcoming_test-1_liveIndicator')).toBeNull();
  });
});
```

### Snapshot Tests

```typescript
it('matches snapshot for live match', () => {
  const tree = renderer.create(<MatchCard match={mockMatch} />).toJSON();
  expect(tree).toMatchSnapshot();
});
```

## Common Issues

### Issue: Score not updating

**Cause:** Component not re-rendering when match data changes
**Solution:** Ensure proper memo comparison or remove memo

### Issue: Card overflow on small screens

**Cause:** Fixed widths or long team names
**Solution:** Use `numberOfLines={1}` and `flex: 1`

## Customization

### Border Highlighting for Live Matches

```typescript
const cardStyle = [
  styles.card,
  match.status === 'live' && { borderColor: theme.colors.primary }
];
```

### Sport-Specific Styling

```typescript
const sportColor = SPORTS_CONFIG[match.sport].color;
const headerStyle = [
  styles.header,
  { borderLeftWidth: 4, borderLeftColor: sportColor }
];
```

## Related Components

- [TeamDisplay](./TeamDisplay.md)
- [ScoreDisplay](./ScoreDisplay.md)
- [LiveIndicator](./LiveIndicator.md)
- [VenueInfo](./VenueInfo.md)

## Related Documentation

- [Match Type Definitions](../types/match-types.md)
- [Sports Configuration](../constants/sports-config.md)
