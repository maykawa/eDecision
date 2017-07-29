<?php
	include 'dbConnect.php';

	$sql = $_REQUEST["q"]; //trap for the parameter(s) passed in the request

	$result = mysqli_query($conn, $sql);
	
	//process results
	if($result == FALSE){
		die("Database add/modification failed: " . mysqli_error($conn));
	}
	
	//close database connection
	mysqli_close($conn);
	
?>