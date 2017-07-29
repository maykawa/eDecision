<?php
	include 'dbConnect.php';

	//shape and run query
	$sql = $_REQUEST["q"]; //trap for the parameter(s) passed in the request

	$result = mysqli_query($conn, $sql);
	
	//process results
	if($result === FALSE){
		die("Database lookup failed: " . mysqli_error($conn));
	} else {
		$emparray = array();
		foreach($result as $row){
			$emparray[] = $row;	
		}
		//return the found data set as an array of json objects
		echo json_encode($emparray);
	}

	//close database connection
	mysqli_close($conn);
	
?>