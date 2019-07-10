//# Load all event matches into the scouting db
//this is expected to run only once per event

const tba = require('./tba.js');
const db = require('./scouting.js');

//# Using connection to database, add get the match object
function add_matches(connection, match) {
    console.log(match.match_number + " "  + match.event_key);
    //basic match schedule information is stored in several tables: matches, alliance, and alliance_member
    connection.query('INSERT INTO matches (match_number, event_code) VALUES(?, ?) ON DUPLICATE KEY UPDATE event_code = event_code',
		     [match.match_number, match.event_key],
		     function (error, results, fields) {
			 if (error) {
			     console.log(error);
			     throw error;
			 }
		     });
    
    var alliance_ids = {"red": null, "blue": null};
    //adds info into alliance (red, then blue)
    connection.query("INSERT INTO alliance (match_number, event_code, practice, alliance_colour) VALUES (?, ?, FALSE, 'red') ON DUPLICATE KEY UPDATE event_code = event_code",
		     [match.match_number, match.event_key],
		     function (error, results, fields) {
			 if (error) {
			     throw error;
			 }
		     });
    
    connection.query('SELECT LAST_INSERT_ID() AS id',
		     (error, results, fields) => {
			 console.log("results" + results[0].id);
			 alliance_ids["red"] = results[0].id;
			 console.log("in red" + alliance_ids);
		     });
    console.log("after red" + alliance_ids);
    
    connection.query("INSERT INTO alliance (match_number, event_code, practice, alliance_colour) VALUES (?, ?, FALSE, 'blue') ON DUPLICATE KEY UPDATE event_code = event_code",
		      [match.match_number, match.event_key],
		     function (error, results, fields) {
			 if (error) {
			     throw error;
			 }
		     });

    connection.query('SELECT LAST_INSERT_ID() AS id', (error, results, fields) => console.log(results[0].id));
    
    //console.log(alliance_ids["red"] + " " + alliance_ids["blue"]);
    //adds info into alliance_member (3 red, then 3 blue)
    connection.query("INSERT INTO alliance_member (alliance_id, team_number) VALUES (?, ?) ON DUPLICATE KEY UPDATE team_number = team_number;",
		     [alliance_ids["red"], parseInt(match.alliances["red"].team_keys[0].substring(3), 10)],
		     function (error, results, fields) {
			 if (error) {
			     throw error;
			 }
		     });
}

function is_qualifying(x){
    return true; // x.comp_level == 'qm';
}

if (require.main === module) {
    db.with_connection(connection =>  
		       tba.matches_at_event(process.argv[2],
					    x => is_qualifying(x) && add_matches(connection, x),
					    () => {connection.end()}
					   ));
}
