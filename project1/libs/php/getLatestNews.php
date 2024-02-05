<?php

    // remove for production

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    $url = 'https://newsapi.org/v2/top-headlines?country='.$_REQUEST['countryCode'] .'&apiKey=60221968afc3471cb412fb630372774c';

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_USERAGENT, 'gazetteer'); 

    $result = curl_exec($ch);

    curl_close($ch);

    $decode = json_decode($result,true);

    $output['status']['code'] = "200";
    $output['status']['name'] = "ok";
    $output['status']['description'] = "success";
    $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

    if (isset($decode['status']) && $decode['status'] === "error") {
        $output['status']['code'] = "401"; 
        $output['status']['name'] = "error";
        $output['status']['description'] = $decode['No result found']; 
    } else {
        $output['data'] = $decode;
    }

    header('Content-Type: application/json; charset=UTF-8');

    echo json_encode($output);

?>
