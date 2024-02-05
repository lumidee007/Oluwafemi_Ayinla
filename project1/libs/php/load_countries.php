<?php

// Read JSON file
$jsonData = file_get_contents('../javascript/countryBorders.geo.json');
$data = json_decode($jsonData, true);

// Extract ISO codes and names
$options = array();
foreach ($data['features'] as $feature) {
    $iso2 = $feature['properties']['iso_a2'];
    $iso3 = $feature['properties']['iso_a3'];
    $name = $feature['properties']['name'];

    $options[] = array('iso2' => $iso2, 'iso3' => $iso3, 'name' => $name);
}

// Output as JSON for use in JavaScript
echo json_encode($options);

?>
