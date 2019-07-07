CREATE DATABASE scouting;
USE scouting;
DROP TABLE IF EXISTS team;
CREATE TABLE team (
	team_number INT PRIMARY KEY, 
    name VARCHAR(128)
);
DROP TABLE IF EXISTS frc_event;
CREATE TABLE frc_event (
	event_code VARCHAR (12) PRIMARY KEY
);
DROP TABLE IF EXISTS matches;
CREATE TABLE matches (
	match_number NUMERIC, -- assigned by event scheduler (ex. quals 4)
    event_code VARCHAR (12),
    practice BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (match_number, event_code, practice),
    CONSTRAINT FOREIGN KEY (event_code) REFERENCES frc_event (event_code) ON DELETE CASCADE
);
DROP TABLE IF EXISTS alliance;
CREATE TABLE alliance (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	match_number NUMERIC, 
    event_code VARCHAR (12),
    practice BOOLEAN DEFAULT FALSE,
	alliance_colour ENUM ('red', 'blue'), 
    CONSTRAINT FOREIGN KEY (match_number, event_code, practice) REFERENCES matches (match_number, event_code, practice) ON DELETE CASCADE,
    UNIQUE(match_number, event_code, practice, alliance_colour)
);
DROP TABLE IF EXISTS alliance_member; 
CREATE TABLE alliance_member (
	alliance_id INT,
    team_number INT,
    CONSTRAINT FOREIGN KEY (team_number) REFERENCES team (team_number) ON DELETE CASCADE, 
	CONSTRAINT FOREIGN KEY (alliance_id) REFERENCES alliance (id) ON DELETE CASCADE
);
DROP TABLE IF EXISTS alliance_outcome;
CREATE TABLE alliance_outcome (
	alliance_id INT NOT NULL,
    score NUMERIC,
    RP1_rocket BOOLEAN,
    RP2_climbed BOOLEAN,
    CONSTRAINT FOREIGN KEY (alliance_id) REFERENCES alliance (id) ON DELETE CASCADE
);
CREATE TABLE alliance_member_outcome (
	alliance_id INT NOT NULL,
    team_number INT, 
    start_level TINYINT,
    sand_hatches INT,
    sand_cargo INT,
    teleop_hatches INT,
    teleop_cargo INT,
    end_level TINYINT,
    penalties INT,
    defense_time NUMERIC,
    CONSTRAINT FOREIGN KEY (alliance_id) REFERENCES alliance (id) ON DELETE CASCADE,
    CONSTRAINT FOREIGN KEY (team_number) REFERENCES alliance_member (team_number) ON DELETE CASCADE
    
)