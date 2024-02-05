<?php
// Check if the POST data 'country' is set
if (isset($_POST['country'])) {
    $searchTerm = $_POST['country'];

    // Read the GeoJSON file content
    $geoJsonContent = file_get_contents('../javascript/countryBorders.geo.json');
    $geoJsonData = json_decode($geoJsonContent, true);

    // Search for the country in the GeoJSON data
    $matchingFeature = null;

    foreach ($geoJsonData['features'] as $feature) {
        // Check if the country name matches the search term
        if (isset($feature['properties']['name']) && $feature['properties']['name'] === $searchTerm) {
            $matchingFeature = $feature;
            break;
        }
    }

    // Return the matching feature as JSON response
    header('Content-Type: application/json');
    echo json_encode($matchingFeature);
} else {
    // If 'country' parameter is not provided in the POST request, return an error
    header('HTTP/1.1 400 Bad Request');
    echo json_encode(array('error' => 'Country name not provided.'));
}
?>
