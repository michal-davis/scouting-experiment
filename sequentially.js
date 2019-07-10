// Given a database connection and a sequence of operations 
// apply each operation sequentially
// An operation is either
// * an Object with keys
//   query: (the SQL query)  Mandatory
//   args: (optional) the arguments to the query.  This is either an array of constant args
//    or a function (of no args) that returns an array of args.
//   h: (optional) a handler function called with the results of the query
// * A function.
// For the database query, we use a callback function that waits for the result, 
// then calls the result handler (h), (if any), then moves on to the next operation.
// Yes, this is hecka-complicated.  This is because node is designed to be asynchronous
// which is what makes it so insanely fast, but it's difficult when there are operations
// like db queries that you need results from.

function do_things(connection, operations) {
	function get_query_args(op) {
		if ((typeof op.args) == 'function') {
			return op.args();
		}
		return op.args || [];
	}
	if (operations.length > 0) {
		var op = operations[0];
		if ((typeof op) == 'function') {
			op();   // just apply the function.  no callback
			do_things(connection, operations.slice(1));
		} else {
			connection.query(op.query,
							 get_query_args(op),
							 (error, results, fields) => {
								 if (error) {
									 console.log(error);
									 throw error;
								 }
								 // if the user provided a handler function, call it
								 // with the results
								 if (op.h) {
									 op.h(results);
								 }
								 // now move on to the next one.
								 do_things(connection, operations.slice(1));
							 }
							);
		}
	}
}

module.exports.do_things = do_things;
