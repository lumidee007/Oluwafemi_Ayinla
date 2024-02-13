<?php
// Remove for production
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

// Check if 'country' key is set in $_REQUEST
if (!isset($_REQUEST['country'])) {
    // If 'country' is not set, return an error response
    $output['status']['code'] = "400";
    $output['status']['name'] = "Bad Request";
    $output['status']['description'] = "Country parameter is missing";
    echo json_encode($output);
    exit; // Exit the script
}

// Construct the URL with the country parameter
$url = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' . $_REQUEST['country'] . '?unitGroup=us&include=days&key=2RHUYYRXCAGD9UE8968UBGD7H&contentType=json';

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result = curl_exec($ch);

curl_close($ch);

$decode = json_decode($result, true);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $decode;

// Set the response header before any output is sent
header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output); 
?>
