-- ScoreBook Simulation Database Schema
-- No status or score columns - both are computed at query time

CREATE TABLE IF NOT EXISTS teams (
    id TEXT PRIMARY KEY,
    sport TEXT NOT NULL,
    name TEXT NOT NULL,
    initials TEXT NOT NULL,
    logo TEXT
);

CREATE TABLE IF NOT EXISTS venues (
    id TEXT PRIMARY KEY,
    sport TEXT NOT NULL,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    state TEXT
);

CREATE TABLE IF NOT EXISTS tournaments (
    id TEXT PRIMARY KEY,
    sport TEXT NOT NULL,
    name TEXT NOT NULL,
    format TEXT
);

CREATE TABLE IF NOT EXISTS matches (
    id TEXT PRIMARY KEY,
    sport TEXT NOT NULL,
    home_team_id TEXT NOT NULL REFERENCES teams(id),
    away_team_id TEXT NOT NULL REFERENCES teams(id),
    venue_id TEXT NOT NULL REFERENCES venues(id),
    tournament_id TEXT NOT NULL REFERENCES tournaments(id),
    start_time TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER NOT NULL,
    format TEXT,
    seed INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_matches_sport ON matches(sport);
CREATE INDEX IF NOT EXISTS idx_matches_start_time ON matches(start_time);
CREATE INDEX IF NOT EXISTS idx_teams_sport ON teams(sport);
CREATE INDEX IF NOT EXISTS idx_venues_sport ON venues(sport);
