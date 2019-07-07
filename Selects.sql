USE scouting;

-- data spits 6135
SELECT m.match_number, ao.score, amo.*, ao.RP1_rocket, ao.RP2_climbed
FROM matches m
	INNER JOIN alliance a 
			ON a.match_number = m.match_number 
		   AND a.event_code = m.event_code
           AND a.practice = m.practice
	INNER JOIN alliance_outcome ao
			ON ao.alliance_id = a.id
    INNER JOIN alliance_member_outcome amo
			ON amo.alliance_id = a.id
WHERE amo.team_number = 6135 AND m.practice = FALSE; -- find all of 6135s non-practice matches
-- match_number (matches), score (alliance_outcome), everything in alliance_member_outcome, rp1 (alliance_outcome), rp2 (alliance_outcome)

-- scouting output of 6135
SELECT avg(ao.score), avg(ao.RP1_rocket), avg(ao.RP2_climbed)
FROM matches m
	INNER JOIN alliance a 
			ON a.match_number = m.match_number 
		   AND a.event_code = m.event_code
           AND a.practice = m.practice
	INNER JOIN alliance_outcome ao
			ON ao.alliance_id = a.id
    INNER JOIN alliance_member_outcome amo
			ON amo.alliance_id = a.id
WHERE amo.team_number = 6135 AND m.practice = FALSE; -- find all of 6135s non-practice matches
-- match_number (matches), score (alliance_outcome), everything in alliance_member_outcome, rp1 (alliance_outcome), rp2 (alliance_outcome)


-- gets both alliances for a match
SELECT m.match_number, m.event_code, m.practice, a.alliance_colour 
FROM matches m
INNER JOIN alliance a
	ON a.match_number = m.match_number
   AND a.event_code = m.event_code
   AND a.practice = m.practice
WHERE m.match_number = 1
  AND m.event_code = 'ONOSH'
  AND NOT m.practice;
  
-- gets both alliance's outcomes for a match in two rows
SELECT *
FROM matches m
INNER JOIN alliance a
	ON a.match_number = m.match_number
   AND a.event_code = m.event_code
   AND a.practice = m.practice
INNER JOIN alliance_outcome ao
	ON ao.alliance_id = a.id
WHERE m.match_number = 1
  AND m.event_code = 'ONOSH'
  AND NOT m.practice;
      
-- gets both alliance's outcomes for a match in one row
SELECT  m.match_number, 
		CASE WHEN ao_red.score > ao_blue.score THEN r.alliance_colour 
			 WHEN ao_red.score < ao_blue.score THEN b.alliance_colour
             ELSE 'tie' 
             END
             AS winner,
		ao_red.score AS red_score,
        ao_blue.score AS blue_score
FROM matches m
INNER JOIN alliance r
	ON r.match_number = m.match_number
   AND r.event_code = m.event_code
   AND r.practice = m.practice
   AND r.alliance_colour = 'red'
INNER JOIN alliance b
	ON b.match_number = m.match_number
   AND b.event_code = m.event_code
   AND b.practice = m.practice
   AND b.alliance_colour = 'blue'
INNER JOIN alliance_outcome ao_red
	ON ao_red.alliance_id = r.id
INNER JOIN alliance_outcome ao_blue
	ON ao_blue.alliance_id = b.id
WHERE m.match_number = 1
  AND m.event_code = 'ONOSH'
  AND NOT m.practice;    
  
SELECT ao.* FROM alliance a
INNER JOIN alliance_outcome ao
	ON a.id = ao.alliance_id
WHERE a.match_number = 5 AND a.event_code = 'ONOSH' AND NOT a.practice AND a.alliance_colour = 'red';

UPDATE alliance_outcome ao
INNER JOIN alliance a
	ON a.id = ao.alliance_id
SET ao.RP1_rocket = TRUE
WHERE a.match_number = 5 AND a.event_code = 'ONOSH' AND NOT a.practice AND a.alliance_colour = 'red';

