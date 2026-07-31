import { Sport } from '../types/api.types';

export interface TeamData {
    id: string;
    sport: Sport;
    name: string;
    initials: string;
}

export interface VenueData {
    id: string;
    sport: Sport;
    name: string;
    city: string;
    country: string;
    state?: string;
}

export interface TournamentData {
    id: string;
    sport: Sport;
    name: string;
    format?: string;
}

export const teams: TeamData[] = [
    // Cricket
    { id: 'team_csk', sport: 'cricket', name: 'Chennai Super Kings', initials: 'CSK' },
    { id: 'team_mi', sport: 'cricket', name: 'Mumbai Indians', initials: 'MI' },
    { id: 'team_rcb', sport: 'cricket', name: 'Royal Challengers Bengaluru', initials: 'RCB' },
    { id: 'team_kkr', sport: 'cricket', name: 'Kolkata Knight Riders', initials: 'KKR' },
    { id: 'team_dc', sport: 'cricket', name: 'Delhi Capitals', initials: 'DC' },
    { id: 'team_srh', sport: 'cricket', name: 'Sunrisers Hyderabad', initials: 'SRH' },
    { id: 'team_gt', sport: 'cricket', name: 'Gujarat Titans', initials: 'GT' },
    { id: 'team_lsg', sport: 'cricket', name: 'Lucknow Super Giants', initials: 'LSG' },
    { id: 'team_rr', sport: 'cricket', name: 'Rajasthan Royals', initials: 'RR' },
    { id: 'team_pbks', sport: 'cricket', name: 'Punjab Kings', initials: 'PBKS' },
    { id: 'team_ind', sport: 'cricket', name: 'India', initials: 'IND' },
    { id: 'team_aus', sport: 'cricket', name: 'Australia', initials: 'AUS' },

    // Football (NFL)
    { id: 'team_kc', sport: 'football', name: 'Kansas City Chiefs', initials: 'KC' },
    { id: 'team_buf', sport: 'football', name: 'Buffalo Bills', initials: 'BUF' },
    { id: 'team_sf', sport: 'football', name: 'San Francisco 49ers', initials: 'SF' },
    { id: 'team_dal', sport: 'football', name: 'Dallas Cowboys', initials: 'DAL' },
    { id: 'team_phi', sport: 'football', name: 'Philadelphia Eagles', initials: 'PHI' },
    { id: 'team_mia', sport: 'football', name: 'Miami Dolphins', initials: 'MIA' },
    { id: 'team_det', sport: 'football', name: 'Detroit Lions', initials: 'DET' },
    { id: 'team_bal', sport: 'football', name: 'Baltimore Ravens', initials: 'BAL' },
    { id: 'team_cin', sport: 'football', name: 'Cincinnati Bengals', initials: 'CIN' },
    { id: 'team_gb', sport: 'football', name: 'Green Bay Packers', initials: 'GB' },

    // Soccer
    { id: 'team_liverpool', sport: 'soccer', name: 'Liverpool FC', initials: 'LIV' },
    { id: 'team_man_city', sport: 'soccer', name: 'Manchester City', initials: 'MCI' },
    { id: 'team_barcelona', sport: 'soccer', name: 'FC Barcelona', initials: 'BAR' },
    { id: 'team_real_madrid', sport: 'soccer', name: 'Real Madrid', initials: 'RMA' },
    { id: 'team_arsenal', sport: 'soccer', name: 'Arsenal FC', initials: 'ARS' },
    { id: 'team_chelsea', sport: 'soccer', name: 'Chelsea FC', initials: 'CHE' },
    { id: 'team_bayern', sport: 'soccer', name: 'Bayern Munich', initials: 'BAY' },
    { id: 'team_psg', sport: 'soccer', name: 'Paris Saint-Germain', initials: 'PSG' },
    { id: 'team_inter', sport: 'soccer', name: 'Inter Milan', initials: 'INT' },
    { id: 'team_ac_milan', sport: 'soccer', name: 'AC Milan', initials: 'ACM' },

    // Hockey (NHL)
    { id: 'team_tor', sport: 'hockey', name: 'Toronto Maple Leafs', initials: 'TOR' },
    { id: 'team_bos', sport: 'hockey', name: 'Boston Bruins', initials: 'BOS' },
    { id: 'team_nyr', sport: 'hockey', name: 'New York Rangers', initials: 'NYR' },
    { id: 'team_edm', sport: 'hockey', name: 'Edmonton Oilers', initials: 'EDM' },
    { id: 'team_col_nhl', sport: 'hockey', name: 'Colorado Avalanche', initials: 'COL' },
    { id: 'team_fla', sport: 'hockey', name: 'Florida Panthers', initials: 'FLA' },
    { id: 'team_car', sport: 'hockey', name: 'Carolina Hurricanes', initials: 'CAR' },
    { id: 'team_vgk', sport: 'hockey', name: 'Vegas Golden Knights', initials: 'VGK' },
    { id: 'team_tbl', sport: 'hockey', name: 'Tampa Bay Lightning', initials: 'TBL' },
    { id: 'team_dal_nhl', sport: 'hockey', name: 'Dallas Stars', initials: 'DAL' },

    // Tennis
    { id: 'player_djokovic', sport: 'tennis', name: 'Novak Djokovic', initials: 'DJO' },
    { id: 'player_alcaraz', sport: 'tennis', name: 'Carlos Alcaraz', initials: 'ALC' },
    { id: 'player_sinner', sport: 'tennis', name: 'Jannik Sinner', initials: 'SIN' },
    { id: 'player_medvedev', sport: 'tennis', name: 'Daniil Medvedev', initials: 'MED' },
    { id: 'player_zverev', sport: 'tennis', name: 'Alexander Zverev', initials: 'ZVE' },
    { id: 'player_rublev', sport: 'tennis', name: 'Andrey Rublev', initials: 'RUB' },
    { id: 'player_tsitsipas', sport: 'tennis', name: 'Stefanos Tsitsipas', initials: 'TSI' },
    { id: 'player_ruud', sport: 'tennis', name: 'Casper Ruud', initials: 'RUU' },
    { id: 'player_fritz', sport: 'tennis', name: 'Taylor Fritz', initials: 'FRI' },
    { id: 'player_hurkacz', sport: 'tennis', name: 'Hubert Hurkacz', initials: 'HUR' },

    // Badminton
    { id: 'player_axelsen', sport: 'badminton', name: 'Viktor Axelsen', initials: 'AXE' },
    { id: 'player_momota', sport: 'badminton', name: 'Kento Momota', initials: 'MOM' },
    { id: 'player_an_seyoung', sport: 'badminton', name: 'An Se-young', initials: 'AN' },
    { id: 'player_yamaguchi', sport: 'badminton', name: 'Akane Yamaguchi', initials: 'YAM' },
    { id: 'player_vitidsarn', sport: 'badminton', name: 'Kunlavut Vitidsarn', initials: 'VIT' },
    { id: 'player_ginting', sport: 'badminton', name: 'Anthony Ginting', initials: 'GIN' },
    { id: 'player_sindhu', sport: 'badminton', name: 'PV Sindhu', initials: 'SIN' },
    { id: 'player_chen_yufei', sport: 'badminton', name: 'Chen Yufei', initials: 'CHE' },
    { id: 'player_lee_zj', sport: 'badminton', name: 'Lee Zii Jia', initials: 'LEE' },
    { id: 'player_sen', sport: 'badminton', name: 'Lakshya Sen', initials: 'SEN' },
];

export const venues: VenueData[] = [
    // Cricket
    { id: 'venue_chepauk', sport: 'cricket', name: 'M. A. Chidambaram Stadium', city: 'Chennai', country: 'India' },
    { id: 'venue_wankhede', sport: 'cricket', name: 'Wankhede Stadium', city: 'Mumbai', country: 'India' },
    { id: 'venue_eden', sport: 'cricket', name: 'Eden Gardens', city: 'Kolkata', country: 'India' },
    { id: 'venue_chinnaswamy', sport: 'cricket', name: 'M. Chinnaswamy Stadium', city: 'Bengaluru', country: 'India' },
    { id: 'venue_narendra', sport: 'cricket', name: 'Narendra Modi Stadium', city: 'Ahmedabad', country: 'India' },
    { id: 'venue_scg', sport: 'cricket', name: 'Sydney Cricket Ground', city: 'Sydney', country: 'Australia' },

    // Football (NFL)
    { id: 'venue_arrowhead', sport: 'football', name: 'GEHA Field at Arrowhead Stadium', city: 'Kansas City', country: 'USA', state: 'Missouri' },
    { id: 'venue_highmark', sport: 'football', name: 'Highmark Stadium', city: 'Orchard Park', country: 'USA', state: 'New York' },
    { id: 'venue_levis', sport: 'football', name: "Levi's Stadium", city: 'Santa Clara', country: 'USA', state: 'California' },
    { id: 'venue_att', sport: 'football', name: 'AT&T Stadium', city: 'Arlington', country: 'USA', state: 'Texas' },
    { id: 'venue_lincoln', sport: 'football', name: 'Lincoln Financial Field', city: 'Philadelphia', country: 'USA', state: 'Pennsylvania' },
    { id: 'venue_hardrock', sport: 'football', name: 'Hard Rock Stadium', city: 'Miami Gardens', country: 'USA', state: 'Florida' },

    // Soccer
    { id: 'venue_anfield', sport: 'soccer', name: 'Anfield', city: 'Liverpool', country: 'England' },
    { id: 'venue_campnou', sport: 'soccer', name: 'Spotify Camp Nou', city: 'Barcelona', country: 'Spain' },
    { id: 'venue_emirates', sport: 'soccer', name: 'Emirates Stadium', city: 'London', country: 'England' },
    { id: 'venue_allianz', sport: 'soccer', name: 'Allianz Arena', city: 'Munich', country: 'Germany' },
    { id: 'venue_sansiro', sport: 'soccer', name: 'San Siro', city: 'Milan', country: 'Italy' },
    { id: 'venue_parc', sport: 'soccer', name: 'Parc des Princes', city: 'Paris', country: 'France' },

    // Hockey (NHL)
    { id: 'venue_scotiabank', sport: 'hockey', name: 'Scotiabank Arena', city: 'Toronto', country: 'Canada', state: 'Ontario' },
    { id: 'venue_msg', sport: 'hockey', name: 'Madison Square Garden', city: 'New York', country: 'USA', state: 'New York' },
    { id: 'venue_rogers', sport: 'hockey', name: 'Rogers Place', city: 'Edmonton', country: 'Canada', state: 'Alberta' },
    { id: 'venue_ball', sport: 'hockey', name: 'Ball Arena', city: 'Denver', country: 'USA', state: 'Colorado' },
    { id: 'venue_amerant', sport: 'hockey', name: 'Amerant Bank Arena', city: 'Sunrise', country: 'USA', state: 'Florida' },
    { id: 'venue_tmobile', sport: 'hockey', name: 'T-Mobile Arena', city: 'Las Vegas', country: 'USA', state: 'Nevada' },

    // Tennis
    { id: 'venue_chatrier', sport: 'tennis', name: 'Court Philippe-Chatrier', city: 'Paris', country: 'France' },
    { id: 'venue_centre', sport: 'tennis', name: 'Centre Court', city: 'London', country: 'England' },
    { id: 'venue_ashe', sport: 'tennis', name: 'Arthur Ashe Stadium', city: 'New York', country: 'USA' },
    { id: 'venue_laver', sport: 'tennis', name: 'Rod Laver Arena', city: 'Melbourne', country: 'Australia' },
    { id: 'venue_manolo', sport: 'tennis', name: 'Manolo Santana Stadium', city: 'Madrid', country: 'Spain' },
    { id: 'venue_foro', sport: 'tennis', name: 'Foro Italico', city: 'Rome', country: 'Italy' },

    // Badminton
    { id: 'venue_istora', sport: 'badminton', name: 'Istora Senayan', city: 'Jakarta', country: 'Indonesia' },
    { id: 'venue_axiata', sport: 'badminton', name: 'Axiata Arena', city: 'Kuala Lumpur', country: 'Malaysia' },
    { id: 'venue_musashino', sport: 'badminton', name: 'Musashino Forest Sport Plaza', city: 'Tokyo', country: 'Japan' },
    { id: 'venue_tianhe', sport: 'badminton', name: 'Tianhe Gymnasium', city: 'Guangzhou', country: 'China' },
    { id: 'venue_birmingham', sport: 'badminton', name: 'Arena Birmingham', city: 'Birmingham', country: 'England' },
    { id: 'venue_odense', sport: 'badminton', name: 'Odense Sports Park', city: 'Odense', country: 'Denmark' },
];

export const tournaments: TournamentData[] = [
    // Cricket
    { id: 'tourney_ipl', sport: 'cricket', name: 'IPL 2026', format: 'T20' },
    { id: 'tourney_ct', sport: 'cricket', name: 'ICC Champions Trophy 2026', format: 'ODI' },
    { id: 'tourney_asia', sport: 'cricket', name: 'Asia Cup 2026', format: 'ODI' },

    // Football
    { id: 'tourney_nfl_reg', sport: 'football', name: 'NFL Regular Season - Week 14', format: 'NFL' },
    { id: 'tourney_nfl_playoff', sport: 'football', name: 'NFL Playoffs', format: 'NFL' },
    { id: 'tourney_sb', sport: 'football', name: 'Super Bowl LXI', format: 'NFL' },

    // Soccer
    { id: 'tourney_epl', sport: 'soccer', name: 'Premier League' },
    { id: 'tourney_laliga', sport: 'soccer', name: 'La Liga' },
    { id: 'tourney_bundesliga', sport: 'soccer', name: 'Bundesliga' },
    { id: 'tourney_seriea', sport: 'soccer', name: 'Serie A' },

    // Hockey
    { id: 'tourney_nhl_reg', sport: 'hockey', name: 'NHL Regular Season', format: 'NHL' },
    { id: 'tourney_nhl_playoff', sport: 'hockey', name: 'NHL Stanley Cup Playoffs', format: 'NHL' },

    // Tennis
    { id: 'tourney_fo', sport: 'tennis', name: 'French Open' },
    { id: 'tourney_wimbledon', sport: 'tennis', name: 'Wimbledon' },
    { id: 'tourney_uso', sport: 'tennis', name: 'US Open' },

    // Badminton
    { id: 'tourney_indo_open', sport: 'badminton', name: 'Indonesia Open' },
    { id: 'tourney_malay_open', sport: 'badminton', name: 'Malaysia Open' },
    { id: 'tourney_all_england', sport: 'badminton', name: 'All England Open' },
];

// Duration in minutes per sport/format
export const sportDurations: Record<string, number> = {
    cricket_T20: 180,
    cricket_ODI: 480,
    football_NFL: 180,
    soccer: 105,
    hockey_NHL: 150,
    tennis: 120,
    badminton: 60,
};

// Round/format options for tennis and badminton
export const matchFormats: Record<Sport, string[]> = {
    cricket: ['T20', 'ODI'],
    football: ['NFL'],
    soccer: ['League'],
    hockey: ['NHL'],
    tennis: ['Final', 'Semi-Final', 'Quarter-Final', 'Round of 16'],
    badminton: ['Final', 'Semi-Final', 'Quarter-Final', 'Round of 16'],
};

export function getTeamsBySport(sport: Sport): TeamData[] {
    return teams.filter(t => t.sport === sport);
}

export function getVenuesBySport(sport: Sport): VenueData[] {
    return venues.filter(v => v.sport === sport);
}

export function getTournamentsBySport(sport: Sport): TournamentData[] {
    return tournaments.filter(t => t.sport === sport);
}

export function getDuration(sport: Sport, format?: string): number {
    const key = format ? `${sport}_${format}` : sport;
    return sportDurations[key] || sportDurations[sport] || 120;
}
