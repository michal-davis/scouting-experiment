//# Load all event matches into the scouting db
//this is expected to run only once per event

const tba = require('./tba.js');
const db = require('./scouting.js');
const async = require("async")

// Using connection to database, add the match object
//basic match schedule information is stored in several tables: frc_match, alliance, and alliance_member

var matches = [];

// collect all the matches into a list.
function add_match(connection, match) {
    matches.push(match);
}

// this is called after TBA has found all the matches.
function after_all_matches_are_collected_load_them(connection) {
    console.log("Loading " + matches.length + " matches");
    load_match_list(connection, matches, () => 	connection.end());
}

// Load the list of matches, one at a time.
// When all are loaded, call the done function.
function load_match_list(connection, matches, done) {
    if (matches.length == 0) {
	done();
	return;
    }
    
    var match = matches.pop();
    console.log(match.event_key + " " + match.match_number);
    var alliance_ids = {"red": null, "blue": null};
    var match_id = null;
    
    // Node runs each database query asynchronously, but we want to wait
    // for (some of the) queries to finish before doing the next one so we
    // can use results from previous queries.  To do this we need to use
    // the aync library, which allows us to run a series of calls
    // in strict order.  Each call is expressed as function (of one argument,
    // cb) and it calls that cb when it is done.  The cb function then
    // calls the next operation (unless there is an error)

    async.series(
	[
	    
	    // insert match
	    (cb) => connection.query(
		"INSERT INTO frc_match (match_number, event_code, practice)" +
                    " VALUES(?, ?, FALSE)" +
                    " ON DUPLICATE KEY UPDATE event_code = event_code",
		[match.match_number, match.event_key],
		(error, results) => cb(error)
	    ),

	    (cb) => connection.query(
		"SELECT match_id FROM frc_match" +
		    " WHERE match_number = ?"+
		    "   AND event_code = ?" +
		    "   AND practice = ?",
		[match.match_number, match.event_key, false],
		(error, results) => {
		    match_id = results[0].match_id;
		    cb(error);
		}
	    ),
	    
	    // insert red alliance
	    (cb) => connection.query(
		"INSERT INTO alliance (match_id, alliance_colour)" +
                    " VALUES (?, ?)" + 
                    "ON DUPLICATE KEY UPDATE match_id = match_id",
		[match_id, 'red'],
		(error, results) => cb(error)
	    ),
	    
	    // get id of red alliance
	    (cb) => connection.query(
		"SELECT alliance_id FROM alliance " +
		    " WHERE match_id = ?" +
		    "   AND alliance_colour = ?",
		[match_id, 'red'],
		(error, results) => {
		    alliance_ids["red"] = results[0].alliance_id;
		    cb(error);
		}
	    ),
	    
	    // insert the red members 0,1,2
	    (cb) => connection.query(
		"INSERT INTO alliance_member (alliance_id, team_number)" +
		    " VALUES (?, ?) " +
		    " ON DUPLICATE KEY UPDATE team_number = team_number;",
		[alliance_ids["red"],
		 parseInt(match.alliances["red"].team_keys[0].substring(3), 10)],
		(error, results) => cb(error)
	    ),
	    (cb) => connection.query(
		"INSERT INTO alliance_member (alliance_id, team_number)" +
		    " VALUES (?, ?) " +
		    " ON DUPLICATE KEY UPDATE team_number = team_number;",
		[alliance_ids["red"],
		 parseInt(match.alliances["red"].team_keys[1].substring(3), 10)],
		(error, results) => cb(error)
	    ),
	    
	    (cb) => connection.query(
		"INSERT INTO alliance_member (alliance_id, team_number)" +
		    " VALUES (?, ?) " +
		    " ON DUPLICATE KEY UPDATE team_number = team_number;",
		[alliance_ids["red"],
		 parseInt(match.alliances["red"].team_keys[2].substring(3), 10)],
		(error, results) => cb(error)
	    ),
	    
	    // insert the blue alliance 
	    (cb) => connection.query(
		"INSERT INTO alliance (match_id, alliance_colour)" +
                    " VALUES (?, ?)" + 
		    " ON DUPLICATE KEY UPDATE match_id = match_id",
		[match_id, 'blue'],
		(error, results) => cb(error)
	    ),
	    
	    //  get the alliance id
	    (cb) => connection.query(
		"SELECT alliance_id FROM alliance" +
		    " WHERE match_id = ?" +
		    "   AND alliance_colour = ?",
		[match_id, 'blue'],
		(error, results) => {
		    alliance_ids["blue"] = results[0].alliance_id;
		    cb(error);
		}
	    ),
	    
	    // insert teams 
	    (cb) => connection.query(
		"INSERT INTO alliance_member (alliance_id, team_number)" +
		    " VALUES (?, ?) " +
		    " ON DUPLICATE KEY UPDATE team_number = team_number;",
		[alliance_ids["blue"],
		 parseInt(match.alliances["blue"].team_keys[0].substring(3), 10)],
		(error, results) => cb(error)
	    ),
	    
	    (cb) => connection.query(
		"INSERT INTO alliance_member (alliance_id, team_number)" +
		    " VALUES (?, ?) " +
		    " ON DUPLICATE KEY UPDATE team_number = team_number;",
		[alliance_ids["blue"],
		 parseInt(match.alliances["blue"].team_keys[1].substring(3), 10)],
		(error, results) => cb(error)
	    ),
	    
	    (cb) => connection.query(
		"INSERT INTO alliance_member (alliance_id, team_number)" +
		    " VALUES (?, ?) " +
		    " ON DUPLICATE KEY UPDATE team_number = team_number;",
		[alliance_ids["blue"],
		 parseInt(match.alliances["blue"].team_keys[2].substring(3), 10)],
		(error, results) => cb(error)
	    )
	],
	
	// This is called when all are finished
	(err, results) => {
	    load_match_list(connection, matches, done)
	}
    );
    
}

function is_qualifying(x){
    return  x.comp_level == 'qm';
}

if (require.main === module) {
    if (process.argv.length < 3) {
	throw "Missing argument: event_code";
    }
    var event_code = process.argv[2];
    db.with_connection(connection =>  
		       tba.matches_at_event(event_code,
					    x => is_qualifying(x) && add_match(connection, x),
					    () => after_all_matches_are_collected_load_them(connection)
					   ));
}
