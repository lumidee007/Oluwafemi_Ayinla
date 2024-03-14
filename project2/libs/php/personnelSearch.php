<?php

$executionStartTime = microtime(true);

include("config.php");

$conn = new mysqli($cd_host, $cd_userName, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
    
    $output['status']['code'] = "300";
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output);

    exit;
}

// Correct the variable name for consistency
$searchTerm = isset($_REQUEST['search']) ? "%" . $_REQUEST['search'] . "%" : "%%";
$query = $conn->prepare('SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE p.firstName LIKE ? OR p.lastName LIKE ? OR p.jobTitle LIKE ? OR p.email LIKE ? ORDER BY p.firstName');
$query->bind_param("ssss", $searchTerm, $searchTerm, $searchTerm, $searchTerm);

$query->execute();

// Use the correct variable from preparation and execution for error check and result
if (false === $query) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";  
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output); 

    exit;
}

$result = $query->get_result();

$personnel = [];

while ($row = mysqli_fetch_assoc($result)) {
    array_push($personnel, $row);
}

// Prepare and send the final output
$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data']['personnel'] = $personnel;

mysqli_close($conn);

echo json_encode($output);

?>
