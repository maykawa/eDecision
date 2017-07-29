<?php

include 'dbConnect.php';

//print_r($_POST);


$companyName = $_POST['companyName'];
$sql = "INSERT INTO companies (name, balance) VALUES('$companyName', 0)";
$result = mysqli_query($conn, $sql);

echo $result;

//close database connection
mysqli_close($conn);
	
?>