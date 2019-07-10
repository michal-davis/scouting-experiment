//# Load all event matches into the scouting db
//this is expected to run only once per event

const tba = require('./tba.js');
const db = require('./scouting.js');
const sequentially = require('./sequentially.js');

// Using connection to database, add the match object
//basic match schedule information is stored in several tables: matches, alliance, and alliance_member

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

// load the list matches, one at a time.
// when all are loaded, call the done function.
function load_match_list(connection, matches, done) {
	if (matches.length == 0) {
		done();
		return;
	}

	var match = matches.pop();
	console.log(match.event_key + " " + match.match_number);
	var alliance_ids = {"red": null, "blue": null};

	// Node runs each database query asynchronously, but we want to wait for each
	// query's callback to return before doing the next one so we can use results
	// from previous queries

	sequentially.do_things(connection, [
		{
			query: "INSERT INTO matches (match_number, event_code)" +
                " VALUES(?, ?)" +
                " ON DUPLICATE KEY UPDATE event_code = event_code",
			args: [match.match_number, match.event_key]
		},

		// create red alliance
		{
			query: "INSERT INTO alliance (match_number, event_code, practice, alliance_colour)" +
                " VALUES (?, ?, FALSE, ?)" + 
                "ON DUPLICATE KEY UPDATE event_code = event_code",
			args: [match.match_number, match.event_key, 'red']
		},

		// get the id of that alliance
		{
			query: "SELECT id FROM alliance" +
				" WHERE match_number = ?" +
				"   AND event_code = ?" +
				"   AND practice = ?" +
				"   AND alliance_colour = ?",
			args: [match.match_number, match.event_key, false, 'red'],
			h: results => alliance_ids["red"] = results[0].id
		},

		// insert the red members 0,1,2
		// note that we need to use a function to get the args for the query
		// because we do not know the alliance id until after the previous query
		{
			query: "INSERT INTO alliance_member (alliance_id, team_number)" +
				" VALUES (?, ?) " +
				" ON DUPLICATE KEY UPDATE team_number = team_number;",
			args: () => [alliance_ids["red"],
						 parseInt(match.alliances["red"].team_keys[0].substring(3), 10)]
		},

		{
			query: "INSERT INTO alliance_member (alliance_id, team_number)" +
				" VALUES (?, ?) " +
				" ON DUPLICATE KEY UPDATE team_number = team_number;",
			args: () => [alliance_ids["red"],
						 parseInt(match.alliances["red"].team_keys[1].substring(3), 10)]
		},

		{
			query: "INSERT INTO alliance_member (alliance_id, team_number)" +
				" VALUES (?, ?) " +
				" ON DUPLICATE KEY UPDATE team_number = team_number;",
			args: () => [alliance_ids["red"],
						 parseInt(match.alliances["red"].team_keys[2].substring(3), 10)]
		},

		// insert the blue alliance and its member teams

		{
			query: "INSERT INTO alliance (match_number, event_code, practice, alliance_colour)" +
                " VALUES (?, ?, FALSE, ?)" + 
				" ON DUPLICATE KEY UPDATE event_code = event_code",
			args: [match.match_number, match.event_key, 'blue']
		},

		{
			query: "SELECT id FROM alliance" +
				" WHERE match_number = ?" +
				"   AND event_code = ?" +
				"   AND practice = ?" +
				"   AND alliance_colour = ?",
			args: [match.match_number, match.event_key, false, "blue"],
			h: results => alliance_ids["blue"] = results[0].id
		},

		{
			query: "INSERT INTO alliance_member (alliance_id, team_number)" +
				" VALUES (?, ?) " +
				" ON DUPLICATE KEY UPDATE team_number = team_number;",
			args: () => [alliance_ids["blue"],
						 parseInt(match.alliances["blue"].team_keys[0].substring(3), 10)]
		},

		{
			query: "INSERT INTO alliance_member (alliance_id, team_number)" +
				" VALUES (?, ?) " +
				" ON DUPLICATE KEY UPDATE team_number = team_number;",
			args: () => [alliance_ids["blue"],
						 parseInt(match.alliances["blue"].team_keys[1].substring(3), 10)]
		},

		{
			query: "INSERT INTO alliance_member (alliance_id, team_number)" +
				" VALUES (?, ?) " +
				" ON DUPLICATE KEY UPDATE team_number = team_number;",
			args: () => [alliance_ids["blue"],
						 parseInt(match.alliances["blue"].team_keys[2].substring(3), 10)]
		},

		// done with this match, go on to the next one
		() => load_match_list(connection, matches, done)

	]);
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
