---
sidebar_position: 1
---

# SportScreen Component

The main screen component that displays matches for a specific sport, organized by status (Live, Upcoming, Completed).

## Location

```
mobile/src/screens/SportScreen.tsx
```

## Purpose

SportScreen serves as the primary view for displaying matches. It:
- Shows matches for a single sport
- Organizes matches into status tabs (Live/Upcoming/Completed)
- Handles loading states, errors, and empty states
- Implements pull-to-refresh functionality
- Auto-polls for live and upcoming matches

## Component Structure

```
SportScreen
  └── Material Top Tab Navigator
      ├── Live Tab → MatchList (status='live')
      ├── Upcoming Tab → MatchList (status='upcoming')
      └── Completed Tab → MatchList (status='completed')
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `sport` | `Sport` | Yes | The sport to display matches for |

## Type Definitions

```typescript
type Sport = 'cricket' | 'football' | 'hockey' | 'soccer' | 'tennis' | 'badminton';

type MatchStatus = 'live' | 'upcoming' | 'completed';
```

## Implementation

### Component Code

```typescript
interface SportScreenProps {
  sport: Sport;
}

export const SportScreen: React.FC<SportScreenProps> = ({ sport }) => {
  return (
    <View style={styles.container} testID={`sportScreen_${sport}`}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: theme.colors.text,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          tabBarIndicatorStyle: styles.tabIndicator,
          tabBarLabelStyle: styles.tabLabel,
        }}
      >
        <Tab.Screen
          name="Live"
          children={() => <MatchList sport={sport} status="live" />}
        />
        <Tab.Screen
          name="Upcoming"
          children={() => <MatchList sport={sport} status="upcoming" />}
        />
        <Tab.Screen
          name="Completed"
          children={() => <MatchList sport={sport} status="completed" />}
        />
      </Tab.Navigator>
    </View>
  );
};
```

## MatchList Sub-Component

Internal component that handles data fetching and rendering.

### Features

1. **Data Fetching:** Uses React Query hook `useMatches(sport, status)`
2. **Loading State:** Shows spinner while fetching
3. **Error State:** Shows error message with retry button
4. **Empty State:** Shows empty message when no matches
5. **Pull-to-Refresh:** Allows manual data refresh

### Implementation

```typescript
const MatchList: React.FC<MatchListProps> = ({ sport, status }) => {
  const { data, isLoading, error, refetch, isRefetching } = useMatches(sport, status);
  
  if (isLoading && !data) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState onRetry={() => refetch()} />;
  }

  const matches = data?.data || [];

  if (matches.length === 0) {
    return <EmptyState message={emptyMessages[status]} />;
  }

  return (
    <FlatList
      data={matches}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <MatchCard match={item} />}
      refreshControl={
        <RefreshControl
          refreshing={isRefetching}
          onRefresh={refetch}
        />
      }
    />
  );
};
```

## State Management

### React Query Integration

```typescript
const { data, isLoading, error, refetch, isRefetching } = useMatches(sport, status);
```

**Polling Configuration:**
- Live matches: Polls every 30 seconds
- Upcoming matches: Polls every 60 seconds  
- Completed matches: No polling

### Cache Strategy

```typescript
{
  staleTime: 30000, // 30 seconds
  gcTime: 5 * 60 * 1000, // 5 minutes
  refetchInterval: status === 'live' ? 30000 : status === 'upcoming' ? 60000 : false
}
```

## Empty State Messages

```typescript
const emptyMessages = {
  live: 'No live matches at the moment',
  upcoming: 'No upcoming matches scheduled',
  completed: 'No recently completed matches',
};
```

## Styling

### Styles

```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  tabBar: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tabIndicator: {
    backgroundColor: theme.colors.primary,
    height: 3,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
```

## TestIDs

All interactive elements have testIDs for automation:

```typescript
// Screen container
testID={`sportScreen_${sport}`}

// Match list
testID={`matchList_${sport}_${status}`}

// Status tabs
testID={`statusTab_${sport}_live`}
testID={`statusTab_${sport}_upcoming`}
testID={`statusTab_${sport}_completed`}

// Refresh control
testID={`refreshControl_${sport}_${status}`}
```

## Usage Example

```typescript
import { SportScreen } from './screens/SportScreen';

// Used by SportTabNavigator
<Tab.Screen
  name="Cricket"
  children={() => <SportScreen sport="cricket" />}
/>
```

## Error Handling

### Network Error

```typescript
if (error) {
  return (
    <ErrorState
      message="Failed to load matches. Please try again."
      onRetry={() => refetch()}
    />
  );
}
```

### Empty Data

```typescript
if (matches.length === 0) {
  return <EmptyState message="No live matches at the moment" />;
}
```

## Performance Optimizations

1. **Memoization:** MatchList memoized to prevent unnecessary re-renders
2. **FlatList:** Uses FlatList for efficient list rendering
3. **Caching:** React Query caches responses
4. **Polling:** Smart polling only for live/upcoming matches

## Testing

### Unit Tests

```typescript
describe('SportScreen', () => {
  it('renders three status tabs', () => {
    const { getByTestId } = render(<SportScreen sport="cricket" />);
    expect(getByTestId('statusTab_cricket_live')).toBeTruthy();
    expect(getByTestId('statusTab_cricket_upcoming')).toBeTruthy();
    expect(getByTestId('statusTab_cricket_completed')).toBeTruthy();
  });
  
  it('displays loading state initially', () => {
    const { getByTestId } = render(<SportScreen sport="cricket" />);
    expect(getByTestId('loadingState')).toBeTruthy();
  });
});
```

### Integration Tests

```typescript
describe('SportScreen Integration', () => {
  it('loads and displays matches', async () => {
    const { findByTestId } = render(<SportScreen sport="cricket" />);
    const matchCard = await findByTestId('matchCard_cricket_live_0');
    expect(matchCard).toBeTruthy();
  });
  
  it('pull-to-refresh reloads data', async () => {
    const { getByTestId } = render(<SportScreen sport="cricket" />);
    const flatList = getByTestId('matchList_cricket_live');
    
    // Trigger refresh
    fireEvent(flatList, 'refresh');
    
    // Verify refreshing state
    expect(getByTestId('refreshControl_cricket_live')).toHaveProp('refreshing', true);
  });
});
```

## Common Issues & Solutions

### Issue: Matches not loading

**Solution:** Check backend is running at correct URL
```bash
# iOS/Web: http://localhost:3000
# Android: http://10.0.2.2:3000
```

### Issue: Polling not working

**Solution:** Verify React Query configuration
```typescript
enabled: status === 'live' || status === 'upcoming'
refetchInterval: status === 'live' ? 30000 : 60000
```

## Future Enhancements

1. **Match Detail Navigation:** Tap match to view details
2. **Filters:** Filter by tournament, date
3. **Search:** Search matches by team name
4. **Favorites:** Star favorite teams
5. **Notifications:** Alert on score changes

## Related Components

- [MatchCard](../components/MatchCard.md) - Individual match display
- [LoadingState](../components/LoadingState.md) - Loading indicator
- [ErrorState](../components/ErrorState.md) - Error display
- [EmptyState](../components/EmptyState.md) - No data display

## Related Hooks

- [useMatches](../hooks/useMatches.md) - Data fetching hook
