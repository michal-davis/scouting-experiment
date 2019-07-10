USE strategy;

SELECT * FROM team;
SELECT * from frc_event;
SELECT * FROM matches order by match_number ASC;
SELECT * from alliance ORDER BY match_number ASC;

SET SQL_SAFE_UPDATES = 0;
DELETE FROM matches;

-- find red/blue alliance_ids for each match
SELECT m.event_code, m.match_number, red.id as red_id, blue.id as blue_id
FROM matches m
INNER JOIN alliance red
   ON red.match_number = m.match_number
  AND red.event_code = m.event_code
  AND red.practice = m.practice
  AND red.alliance_colour = 'red'
INNER JOIN alliance blue
 ON blue.match_number = m.match_number
  AND blue.event_code = m.event_code
  AND blue.practice = m.practice
  AND blue.alliance_colour = 'blue';
 
 -- find alliance sizes for all matches
SELECT
   m.event_code
 , m.match_number
 , red.id as red_id
 , blue.id as blue_id
 , COUNT(DISTINCT red_team.team_number) as nRed
 , COUNT(DISTINCT blue_team.team_number) as nBlue
FROM matches m
INNER JOIN alliance red
   ON red.match_number = m.match_number
  AND red.event_code = m.event_code
  AND red.practice = m.practice
  AND red.alliance_colour = 'red'
INNER JOIN alliance blue
 ON blue.match_number = m.match_number
  AND blue.event_code = m.event_code
  AND blue.practice = m.practice
  AND blue.alliance_colour = 'blue'
INNER JOIN alliance_member red_team
 ON red_team.alliance_id = red.id
INNER JOIN alliance_member blue_team
 ON blue_team.alliance_id = blue.id
GROUP BY m.event_code, m.match_number, red.id, blue.id
ORDER BY m.event_code, m.match_number;
 
 -- select all matches of 6135
SELECT
   m.event_code
 , m.match_number
 , a.alliance_colour
FROM matches m
INNER JOIN alliance a
   ON a.match_number = m.match_number
  AND a.event_code = m.event_code
  AND a.practice = m.practice
INNER JOIN alliance_member team
 ON team.alliance_id = a.id
WHERE team.team_number = 6135
ORDER BY event_code, match_number;

