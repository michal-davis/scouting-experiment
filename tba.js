//API for The Blue Alliance
// See https://www.thebluealliance.com/apidocs/v3

const https = require('https');

const endpoint = "https://www.thebluealliance.com/api/v3";

// This is my API key.
const api_key = "sX6YAEFTW4k2ovNN9IQKRhwFe5XArlokFHUU899aK6Vr4ZlbiA4tq36R4gKEmh6h";

function api_options() {
	return {"headers": 
			{"X-TBA-Auth-Key": api_key}};
}

// call the TBA API that gets basic team info.
// This function takes three inputs.
// team_handler is a function that is called once for each team that the API returns
// no_more_teams is a function (of no args) called after all teams have been read
// page is an optional input used with the TBA API
function all_teams(team_handler, no_more_teams, page=0) {
    //console.log("getting page " + page);
    var url =  endpoint + "/" + "teams/" + page + "/simple";
    //console.log(url);
    https.get(url,
	      api_options(),   // TBA needs your account key
	      (resp) => {
		  // collect all the response data until there is no more
		  let reply = "";
		  resp.on('data', (chunk) => {
		      // got more data from TBA, add it to the string
		      reply += chunk;
		  });
		  
		  resp.on('end', () => {
		      // TBA got to the end of this page
		      //console.log("page " + page + " len " + reply.length);
		      if (reply.length <= 2) {
			  // we hit the last page so we are done
			  no_more_teams();
		      } else {
			  // the reply is a JSON object we need to parse it
			  //the result is an array of team objects, call team_handler for each one
			  JSON.parse(reply)
			      .forEach(team => team_handler(team));
			  all_teams(team_handler, no_more_teams, page+1);
		      }
		  });
		  
	      }).on('error', (e) => {
		  console.error(e);
	      });
}


module.exports.all_teams = all_teams;

//if run at top level, just show the teams
if (require.main === module) {
    function foo(team){
	console.log(team);
    }
    function noTeams(){
	console.log("done");
    }
    all_teams(foo, noTeams);
}
