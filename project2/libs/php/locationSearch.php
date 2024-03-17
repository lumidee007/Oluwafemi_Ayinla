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

$searchTerm = "%" . $_REQUEST['search'] . "%";
$locationQuery = $conn->prepare('SELECT id, name FROM location WHERE name LIKE ? ORDER BY name');
$locationQuery->bind_param("s", $searchTerm);
$locationQuery->execute();

if (false === $locationQuery) {
    $output['status']['code'] = "400";
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";  
    $output['data'] = [];

    mysqli_close($conn);

    echo json_encode($output); 

    exit;
}

$locationResult = $locationQuery->get_result();

$locations = [];

while ($row = mysqli_fetch_assoc($locationResult)) {
    array_push($locations, $row);
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data']['locations'] = $locations;

mysqli_close($conn);

echo json_encode($output);

?>
