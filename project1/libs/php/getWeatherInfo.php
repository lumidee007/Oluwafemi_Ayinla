<?php

// Remove for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);


$url = 'https://api.openweathermap.org/data/2.5/weather?q=' . urlencode($_REQUEST['country']) . '&appid=ae8183305930109bde697b966d0122af';

// Initialize cURL session
$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

// Execute the cURL request
$result = curl_exec($ch);

// Close the cURL session
curl_close($ch);

// Decode the JSON response
$decodedResult = json_decode($result, true);

// Check if decoding was successful and the required data is present
if ($decodedResult !== null && isset($decodedResult['name'])) {
    // Prepare the response data
    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
    $output['data'] = $decodedResult; 
} else {
    // If decoding failed or required data is missing, set an error response
    $output['status']['code'] = "400";
    $output['status']['name'] = "error";
    $output['status']['description'] = "Failed to retrieve valid data from OpenWeatherMap API";
}

// Set the response header only if no output has been sent yet
if (!headers_sent()) {
    // Set the response header
    header('Content-Type: application/json; charset=UTF-8');
}

// Output the response JSON
echo json_encode($output);

?>



