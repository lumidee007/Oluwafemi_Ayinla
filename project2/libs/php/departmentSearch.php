<?php

$executionStartTime = microtime(true);

include("config.php");

// header('Content-Type: application/json; charset=UTF-8');

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

// Department search
$departmentSearchTerm = "%" . $_REQUEST['search'] . "%";
$departmentQuery = $conn->prepare('SELECT d.id, d.name, d.locationID, l.name as location FROM department d LEFT JOIN location l ON (l.id = d.locationID) WHERE d.name LIKE ? ORDER BY d.name');
$departmentQuery->bind_param("s", $departmentSearchTerm);
$departmentQuery->execute();

if (false === $departmentQuery) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";  
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output); 

    exit;
}

$departmentResult = $departmentQuery->get_result();

$departments = [];

while ($row = mysqli_fetch_assoc($departmentResult)) {
    array_push($departments, $row);
}

// Prepare and send the final output
$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data']['departments'] = $departments;

mysqli_close($conn);

echo json_encode($output);

?>

