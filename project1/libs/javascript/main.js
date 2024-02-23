let map;
let countryName;
let countryCode;
let currency_Code;
let TerritoryGeo;
let cityLayer;
let quakeLayer;
let layerControl;
let capital;
let continent;
let population;
let area;
let BoundaryStyling = {
  color: "darkred",
  weight: 3.9,
  opacity: 0.55,
};

$(document).ready(function () {
  if ($("#preloader").length) {
    $("#preloader")
      .delay(3500)
      .fadeOut("slow", function () {
        $(this).remove();
      });

    mapConfig();
    getCountryList();

    updateCurrentLocation();

    $("#countrySelect").change(handleCountryChange);
  }
});

function handleCountryChange() {
  countryName = $("#countrySelect option:selected").text();
  let country = countryName;
  let country_code = this.value;

  $.ajax({
    url: "libs/php/getCountryBorder.php",
    type: "POST",
    dataType: "json",
    data: {
      country: country,
    },
    success: function (result) {
      if (TerritoryGeo) {
        TerritoryGeo.clearLayers();
      } else {
        TerritoryGeo = L.geoJson();
      }
      TerritoryGeo.addData(result);
      TerritoryGeo.setStyle(BoundaryStyling);
      TerritoryGeo.addTo(map); //
      map.fitBounds(TerritoryGeo.getBounds());

      fetchCountryInfo(country_code);
      fetchCountryHolidays();
      fetchCountryNews();
      currencyConversion();
      getCities();
      getEarthQuake();
      getGeographicPoint();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
    },
  });
}

//Get countryList
function getCountryList() {
  $.ajax({
    url: "libs/php/load_countries.php",
    dataType: "json",
    success: function (options) {
      geoJsonData = options;
      geoJsonData.sort((a, b) => a.name.localeCompare(b.name));

      const select = $("#countrySelect");
      geoJsonData.forEach((option) => {
        const optionElem = $("<option></option>")
          .attr("value", option.iso2)
          .text(option.name);
        select.append(optionElem);
      });
      updateCurrentLocation();
    },
    error: function (error) {
      console.error("Error fetching countries:", error);
    },
  });
}

//GetLocation
function updateCurrentLocation() {
  if (navigator.geolocation) {
    let options = { timeout: 65000 };
    navigator.geolocation.getCurrentPosition(
      setNewPosition,
      initializeDefaultCountry,
      options
    );
  } else {
    initializeDefaultCountry();
  }
}

//Default location
function initializeDefaultCountry() {
  let defaultCountryCode = "AU";
  countryCode = defaultCountryCode;
  $("#countrySelect").val(countryCode).change();
}

//Current Location
function setNewPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  countryName = $("#countrySelect option:selected").text();
  $.ajax({
    url: "libs/php/getLatLong.php",
    type: "GET",
    dataType: "json",
    data: {
      lat: latitude,
      long: longitude,
    },
    success: function (result) {
      countryCode =
        result["data"]["results"][0]["components"]["ISO_3166-1_alpha-2"];

      $("#countrySelect").val(countryCode).change();
    },
    error: function (jqXHR, textStatus, errorThrown) {
      initializeDefaultCountry();
      console.log("error", errorThrown);
    },
  });
}

//INITIALIZE MAP
function mapConfig() {
  var streets = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      attribution: "© OpenStreetMap contributors",
    }
  );

  var satellite = L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
    }
  );

  var EarthAtNight = L.tileLayer(
    "https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}",
    {
      attribution:
        'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
      bounds: [
        [-85.0511287776, -179.999999975],
        [85.0511287776, 179.999999975],
      ],
      minZoom: 1,
      maxZoom: 19,
      format: "jpg",
      time: "",
      tilematrixset: "GoogleMapsCompatible_Level",
    }
  );

  cityLayer = L.markerClusterGroup({
    polygonOptions: {
      fillColor: "#fff",
      color: "#fff",
      weight: 1.5,
      opacity: 0.8,
      fillOpacity: 0.5,
    },
  });

  quakeLayer = L.markerClusterGroup({
    polygonOptions: {
      fillColor: "#fff",
      color: "#fff",
      weight: 1.5,
      opacity: 0.8,
      fillOpacity: 0.5,
    },
  });

  landmarkLayer = L.markerClusterGroup({
    polygonOptions: {
      fillColor: "#fff",
      color: "#fff",
      weight: 1.5,
      opacity: 0.8,
      fillOpacity: 0.5,
    },
  });

  map = L.map("map", {
    layers: [streets],
  }).setView([54.5, -4], 6);

  let baseMaps = {
    Streets: streets,
    Satellite: satellite,
    EarthAtNight: EarthAtNight,
  };

  let overlayMaps = {
    Cities: cityLayer,
    Earthquakes: quakeLayer,
    Landmark: landmarkLayer,
  };

  L.control.layers(baseMaps, overlayMaps).addTo(map),
    L.control.scale().addTo(map);

  //DEFINE ALL MODALS

  L.easyButton(
    "fa-solid fa-info fa-lg text-success text-center",
    function (btn, map) {
      $("#countryMainInfo").modal("show");
    }
  ).addTo(map);

  L.easyButton(
    "fa-solid fa-cloud fa-lg text-success text-center",
    function (btn, map) {
      $("#countryWeatherInfo").modal("show");
    }
  ).addTo(map);

  L.easyButton(
    "fa-solid fa-umbrella-beach fa-lg text-success text-center",
    function (btn, map) {
      $("#CountryHolidaysInfo").modal("show");
    }
  ).addTo(map);

  L.easyButton(
    "fa-solid fa-lg fa-newspaper fa-lg text-success text-center",
    function (btn, map) {
      $("#CountryNewsInfo").modal("show");
    }
  ).addTo(map);

  L.easyButton(
    "fa-solid fa-lg fa-city fa-lg text-success text-center",
    function (btn, map) {
      $("#citiesAroundInfo").modal("show");
    }
  ).addTo(map);

  L.easyButton(
    "fa-solid fa-lg fa-money-bill fa-lg text-success text-center",
    function (btn, map) {
      $("#country-currency-conversion").modal("show");
    }
  ).addTo(map);

  // Random easy button to change country
  L.easyButton(
    "fa-solid fa-rotate-right fa-lg text-success text-center",
    function (btn, map) {
      const list = $("#countrySelect option");
      const rand = Math.floor(Math.random() * list.length) + 1;
      $("#countrySelect").val(list[rand].value).trigger("change");
    },
    "Random Country",
    "randbtn"
  ).addTo(map);
}

// =================== GET COUNTRY INFO ====================================================
function fetchCountryInfo(countryC) {
  $("#country-information").html(
    $("#countrySelect option:selected").text() + " main information"
  );
  $.ajax({
    url: "libs/php/getCountryInfo.php",
    type: "POST",
    dataType: "json",
    data: {
      // country_code: $("#countrySelect").val(),
      country_code: countryC,
    },

    success: (result) => {
      if (result.status.name == "ok") {
        $("#infoContainer").empty();
        let countryInfoData = result["data"][0];
        let capitals = result["data"][0]["capital"];
        let countryContinent = countryInfoData["continentName"];
        let countryPopulation = parseInt(
          countryInfoData["population"]
        ).toLocaleString();
        let countryArea = parseInt(
          countryInfoData["areaInSqKm"]
        ).toLocaleString();
        let countryCurrency = countryInfoData["currencyCode"];
        // capital = countryCapital;
        continent = countryContinent;
        population = countryPopulation;
        area = countryArea;
        currency_Code = countryCurrency;

        $("#country-name").html($("#countrySelect option:selected").text());
        $("#country-capital").html(result["data"][0]["capital"]);
        $("#country-continent").html(result["data"][0]["continentName"]);
        $("#country-population").html(
          parseInt(result["data"][0]["population"]).toLocaleString()
        );
        $("#country-area").html(
          parseInt(result["data"][0]["areaInSqKm"]).toLocaleString()
        );
        $("#country-currency").html(result["data"][0]["currencyCode"]);
        fetchCountryWeather(capitals);
        fetchNearbyLocation(capitals);
      }
    },
    error: (textStatus, errorThrown) => {
      console.log("Error getting your the get country api");
    },
  });
}

// =================== GET COUNTRY WEATHER ====================================================
// Temperature conversion to celsius
const fahrenheitToCelsius = (fahrenheit) =>
  Math.round(((fahrenheit - 32) * 5) / 9);

// speed conversion to mph
const msToMph = (metersPerSecond) => Math.round(metersPerSecond * 2.23694);

function fetchCountryWeather(cc) {
  $("#country-weather-info").html(
    cc + ", " + $("#countrySelect option:selected").text()
  );
  if (countryName == undefined) {
    countryName = $("#countrySelect option:selected").text();
  }
  $.ajax({
    url: "libs/php/getWeatherInfo.php",
    type: "GET",
    dataType: "json",
    data: {
      country: cc,
    },
    success: function (result) {
      let weatherIcon;
      let icon;
      let weatherSubset;
      let weatherData;
      if (result.status.name == "ok") {
        $("#table-container").empty();
        let weatherResults = result.data.days[0];
        weatherSubset = result.data.days.slice(1, 6);
        weatherIcon = result.data.days[0]["icon"];
        icon = getIcon(weatherIcon);
        let tempConversionToCelsius = fahrenheitToCelsius(
          weatherResults["temp"]
        );
        let minTempConversionToCelsius = fahrenheitToCelsius(
          weatherResults["feelslikemin"]
        );
        let windSpeedInMph = msToMph(weatherResults["windspeed"]);
        $("#country-temp").html(tempConversionToCelsius + "°C");
        $("#country-low-temp").html(minTempConversionToCelsius + "°C");
        $("#country-pressure").html(weatherResults["pressure"] + "°C");
        $("#country-wind-speed").html(windSpeedInMph + "mph");
        $("#country-weather-direction").html(weatherResults["description"]);
        $("#weather-icon-today").html(icon);
      }
      weatherData = weatherSubset;
      renderForecastTable(weatherData);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("Error getting the get country weather");
    },
  });

  function renderForecastTable(subset) {
    const tableContainer = document.getElementById("table-container");
    const table = document.createElement("table");
    table.classList.add("table");

    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    const existingTbody = tableContainer.querySelector("tbody");
    if (existingTbody) {
      existingTbody.innerHTML = "";
    }
    $("#table-container").empty();
    // Create table header
    const headerRow = document.createElement("tr");
    const headerCell = document.createElement("th");
    headerCell.setAttribute("colspan", "5");
    headerCell.classList.add("fw-bold", "fs-4", "text-center");
    headerRow.appendChild(headerCell);
    thead.appendChild(headerRow);

    // Create date header row
    const dateRow = document.createElement("tr");
    for (let i = 0; i < 5; i++) {
      const dateCell = document.createElement("td");
      // let daySuffix = "";
      dateCell.setAttribute("id", `date${i + 1}`);

      const currentDate = new Date(subset[i].datetime);
      const options = {
        weekday: "short",
      };
      const dateStr = currentDate.toLocaleDateString("en-US", options);

      let daySuffix = "th";
      const day = currentDate.getDate();
      if (day === 1 || day === 21 || day === 31) {
        daySuffix = "st";
      } else if (day === 3 || day === 23) {
        daySuffix = "rd";
      } else if (day === 7 || day === 17 || day === 27) {
        daySuffix = "th";
      }

      dateCell.textContent = `${dateStr}, ${day}${daySuffix}`;

      dateCell.setAttribute("class", `fs-7 text-center`);
      dateRow.appendChild(dateCell);
    }
    tbody.appendChild(dateRow);

    // Create icon row
    const iconRow = document.createElement("tr");
    for (let i = 0; i < 5; i++) {
      const iconCell = document.createElement("td");
      iconCell.setAttribute("class", `text-center`);
      const icon = document.createElement("span");
      icon.classList.add("fa-solid", "fa-circle-info", "fa-xl", "text-primary");
      icon.classList.add(getIconClass(subset[i].icon));
      iconCell.appendChild(icon);
      iconRow.appendChild(iconCell);
    }
    tbody.appendChild(iconRow);

    // Create temperature row
    const tempMinRow = document.createElement("tr");
    for (let i = 0; i < 5; i++) {
      const tempMinCell = document.createElement("td");
      tempMinCell.setAttribute("id", `daily${i + 1}`);
      tempMinCell.setAttribute("class", `fs-5 text-center`);
      // tempMinCell.innerHTML = `${subset[i].temp}&#8451;`;
      tempMinCell.innerHTML = `${fahrenheitToCelsius(subset[i].temp)}&#8451;`;
      tempMinRow.appendChild(tempMinCell);
    }
    tbody.appendChild(tempMinRow);

    // Create temperature min row
    const tempMaxRow = document.createElement("tr");
    for (let i = 0; i < 5; i++) {
      const tempMaxCell = document.createElement("td");
      tempMaxCell.setAttribute("id", `daily${i + 1}`);
      tempMaxCell.setAttribute("class", `fs-6 fw-light text-center`);
      tempMaxCell.innerHTML = `${fahrenheitToCelsius(
        subset[i].tempmin
      )}&#8451;`;
      tempMaxRow.appendChild(tempMaxCell);
    }
    tbody.appendChild(tempMaxRow);

    table.appendChild(thead);
    table.appendChild(tbody);
    tableContainer.appendChild(table);
  }

  // Get Icon function for forecasted weather.
  function getIconClass(icon_name) {
    switch (icon_name) {
      case "clear-day":
        return "fa-sun";
      case "snow":
        return "fa-snowflake";
      case "rain":
        return "fa-cloud-rain";
      case "cloudy":
        return "fa-cloud";
      case "partly-cloudy-day":
        return "fa-cloud-sun";
      case "wind":
        return "fa-wind";
      default:
        return "";
    }
  }
}

// Get Icon function for current weather.
function getIcon(iconName) {
  let icon;
  switch (iconName) {
    case "clear-day":
      icon = '<span class="fa-solid fas fa-sun text-primary"></span>';
      break;
    case "cloudy":
      icon = '<span class="fa-solid fas fa-cloud text-primary"></span>';
      break;
    case "rain":
      icon = '<span class="fa-solid fas fa-cloud-rain text-primary"></span>';
      break;
    case "snow":
      icon = '<span class="fa-solid fas fa-snowflake text-primary"></span>';
      break;
    case "wind":
      icon = '<span class="fa-solid fas fa-wind text-primary"></span>';
      break;
    default:
      icon = '<span class="fa-solid fas fa-cloud-sun text-primary"></span>';
      break;
  }
  return icon;
}

// =================== GET COUNTRY HOLIDAY ====================================================
function fetchCountryHolidays() {
  let cCode = $("#countrySelect").val();

  function getCurrentYear() {
    const today = new Date();
    const year = today.getFullYear();
    return year;
  }
  const currentYear = getCurrentYear();

  $("#country-holiday-info").html("National holidays " + currentYear);

  $.ajax({
    url: "https://date.nager.at/api/v3/PublicHolidays/2024/" + cCode,
    type: "GET",
    dataType: "json",
    success: function (result) {
      if (result.length > 0) {
        $("#tableContainer").empty();

        // Sort holiday events by date
        result.sort(function (a, b) {
          return new Date(a.date) - new Date(b.date);
        });

        result.forEach(function (holidayEvent) {
          var holidayDate = new Date(holidayEvent.date);
          var formattedDate = holidayDate.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
          });

          $("#tableContainer").append(
            "<tr>" +
              "<td>" +
              holidayEvent.name +
              "</td>" +
              "<td class='d-flex justify-content-center'>" +
              formattedDate +
              "</td>" +
              "</tr>"
          );
        });
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(console.log("Error getting the country holiday api"));
    },
  });
}

// =================== GET COUNTRY NEWS ====================================================
function fetchCountryNews() {
  $("#newsFeedCountry").html("BREAKING NEWS");
  $.ajax({
    url: "libs/php/getLatestNews.php",
    type: "POST",
    dataType: "json",
    data: {
      countryCode: $("#countrySelect").val(),
    },

    success: (result) => {
      if (result.status.name == "ok") {
        $("#newsContainer").empty();
        var articles = result.data.articles;
        $.each(articles, function (index, article) {
          var newsArticle = `
          <div class="card mb-3 card-shadow">
            <div class="card-body">
              <h5 class="card-title fs-6 "><a  href="${
                article.url
              }" class="card-link text-decoration-none" target="_blank">${
            article.title
          }<a></h5>
              
              <h6 class="card-subtitle my-2 text-muted">Source: ${
                article.source.name
              }</h6>
              <p class="card-text fs-6 fw-light">Published: ${timeAgo(
                article.publishedAt
              )}</p>
            </div>
          </div>
        `;
          $("#newsContainer").append(newsArticle);
        });
      }
    },
    error: (textStatus, errorThrown) => {
      console.log(console.log("Error getting the get country news"));
    },
  });
}

function timeAgo(publishedAt) {
  const currentDate = new Date();
  const publishedDate = new Date(publishedAt);
  const timeDifference = currentDate - publishedDate;

  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  } else {
    return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
  }
}

// =================== LOCATIONS ====================================================

function fetchNearbyLocation(capital) {
  let cCode = $("#countrySelect").val();
  $.ajax({
    url: "libs/php/getWikipediaSearch.php",
    type: "POST",
    dataType: "json",
    data: {
      country: capital,
    },
    success: function (data) {
      $("#cities-around-country").html("Nearby location");
      var filteredData = data.data.filter(function (item) {
        return item.countryCode === cCode;
      });
      displayData(filteredData);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("Error getting the cities around");
    },
  });
}

function displayData(data) {
  $("#cityContainer").empty();
  data.forEach(function (item) {
    var rowHtml = `
            <tr>
                <td>${item.title}</td>
                <td class="city-summary">${item.summary.replace(
                  /\(\.\.\.\)/g,
                  "."
                )}</td>
            </tr>
        `;
    $("#cityContainer").append(rowHtml);
  });
}
// =================== GET CURRENCY CONVERSION ====================================================

function currencyConversion() {
  // $("#info-country").html(
  //   $("#countrySelect option:selected").text() + " currency converter"
  // );
  $("#info-country").html("Currency calculator");
  // Fetch currency names
  $.ajax({
    url: "https://openexchangerates.org/api/currencies.json?show_alternative=0&show_inactive=0",
    type: "GET",
    dataType: "json",
    success: function (data) {
      // load drop-down with full list of currencies.
      Object.entries(data).forEach(([code, name]) => {
        $("#select-currency").append(
          `<option class="currency-drop-down" id=${code} value=${code}>${name}</option>`
        );
      });

      // Fetch exchange rates
      $.ajax({
        url: "libs/php/getCurrency.php",
        type: "POST",
        dataType: "json",
        success: function (result) {
          if (result.status.name == "ok") {
            const rates = result.data.rates;
            let selected_Currency_Code;
            let selected_Currency_Value;

            // Retrieve the currency of the chosen country (defaulting to USD if not specified).
            Object.entries(rates).forEach(([code, value]) => {
              if (code == currency_Code) {
                selected_Currency_Code = code;
                selected_Currency_Value = value;
              }
            });

            // Add selected country's currency name to the modal
            const selectedCurrencyName = data[selected_Currency_Code];
            // $("#info-country").html(
            //   selectedCurrencyName + " currency converter"
            // );

            $("#local-currency-code").text(selected_Currency_Code);
            $("#local-currency").attr("name", "local-currency");

            // Set USD as default
            $("#select-currency").val("USD").prop("selected", true);
            $("#current-currency").text($("#select-currency").val());

            // currency conversion with USD as the base currency.
            const usd = rates["USD"];
            let baseCurrency = selected_Currency_Value;
            let convertedCurrency = rates[$("#select-currency").val()];

            const convertCurrency = (from, to, value) => {
              return (value * to) / from;
            };

            // Convert currencies based on the selected currency or the default currency.

            $("#convert-currency").val(
              parseFloat(
                convertCurrency(baseCurrency, convertedCurrency, 1)
              ).toFixed(2)
            );

            // Reset value of baseCurrency when new country is selected from #selectCountry
            $("#countrySelect").on("change", function () {
              $("#local-currency").val(1);
            });

            // Change convertedCurrency when selected and convert selected country on map baseCurrency to the country selected in drop-down
            $("#select-currency").on("change", function () {
              $("#local-currency").val(1);

              // Show currency code for selected convertedCurrency
              $("#current-currency").text($("#select-currency").val());

              // Update convertedCurrency
              convertedCurrency = rates[$("#select-currency").val()];

              // Currency conversion
              $("#convert-currency").val(
                parseFloat(
                  convertCurrency(baseCurrency, convertedCurrency, 1)
                ).toFixed(2)
              );
            });

            // Update the value of #convert-currency when #local-currency is changed

            $("#local-currency").on("change", function () {
              $("#convert-currency").val(
                parseFloat(
                  convertCurrency(
                    baseCurrency,
                    convertedCurrency,
                    $("#local-currency").val()
                  )
                ).toFixed(2)
              );
            });
            // Update the value of #convert-currency when #select-currency is changed

            $("#countrySelect").on("change", function () {
              convertedCurrency = rates[$("#select-currency").val()];
              $("#convert-currency").val(
                parseFloat(
                  convertCurrency(
                    baseCurrency,
                    convertedCurrency,
                    $("#local-currency").val()
                  )
                ).toFixed(2)
              );
            });

            // Update the value of #local-currency when #convert-currency is changed

            $("#convert-currency").on("change", function () {
              const convertedValue = $("#convert-currency").val();
              $("#local-currency").val(
                parseFloat(
                  convertCurrency(
                    convertedCurrency,
                    baseCurrency,
                    convertedValue
                  )
                ).toFixed(2)
              );
            });
          }
        },
        error: function (textStatus, errorThrown) {
          console.log("Error");
        },
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("Error");
    },
  });
}

// CITIES LAYER
function getCities() {
  let cCode = $("#countrySelect").val();
  $.ajax({
    url: "libs/php/getCitiesInfo.php",
    type: "POST",
    dataType: "json",
    data: {
      iso_a2: cCode,
    },
    success: function (results) {
      const citiesData = results.data;
      cityLayer.clearLayers();
      citiesData.forEach((cityData) => {
        const city = cityMarker(cityData);
        cityLayer.addLayer(city);
      });
      // Add cityLayer to the map
      cityLayer.addTo(map);
    },
    error: function (e, t, o) {
      console.log("Error fetching cities data from Geonames api"),
        console.log(e.responseText),
        console.log(`${t} : ${o}`);
    },
  });
}

function cityMarker(city) {
  const popupContent = `<b>${
    city.name
  }</b><br>Population: ${city.population.toLocaleString()}`;
  const cityIcon = L.ExtraMarkers.icon({
    prefix: "fa",
    icon: " fa-city",
    iconColor: "white",
    markerColor: "yellow",
    shape: "square",
  });
  return L.marker(L.latLng(city.lat, city.lng), {
    icon: cityIcon,
  }).bindTooltip(popupContent, { direction: "top", sticky: true });
}

// EARTHQUAKE LAYER

function getEarthQuake() {
  $.ajax({
    url: "libs/php/getEarthQuakeInfo.php",
    type: "POST",
    dataType: "json",
    data: {
      north: TerritoryGeo.getBounds()._northEast.lat,
      east: TerritoryGeo.getBounds()._northEast.lng,
      south: TerritoryGeo.getBounds()._southWest.lat,
      west: TerritoryGeo.getBounds()._southWest.lng,
    },
    success: function (results) {
      const earthQuakeData = results.data.earthquakes;
      quakeLayer.clearLayers();
      earthQuakeData.forEach((data) => {
        const earthQuakePoint = earthQuakeMarker(data);
        quakeLayer.addLayer(earthQuakePoint);
      });
      // Add cityLayer to the map
      quakeLayer.addTo(map);
    },
    error: function (e, t, o) {
      console.log("Error fetching earthquake data from Geonames api"),
        console.log(e.responseText),
        console.log(`${t} : ${o}`);
    },
  });
}

function earthQuakeMarker(point) {
  const t = new Date(point.datetime);
  const popupContent = `<b>Earthquake</b><br>\nMagnitude: ${
    point.magnitude
  }<br> \nDate: ${t.toLocaleString()}`;
  const cityIcon = L.ExtraMarkers.icon({
    prefix: "fa",
    icon: "fa-bolt",
    iconColor: "black",
    markerColor: "white",
    shape: "circle",
  });
  return L.marker(L.latLng(point.lat, point.lng), {
    icon: cityIcon,
  }).bindTooltip(popupContent, { direction: "top", sticky: true });
}

// TOPOGRAPHY LAYER

function getGeographicPoint() {
  let cCode = $("#countrySelect").val();
  $.ajax({
    url: "libs/php/getGeographicPoint.php",
    type: "POST",
    dataType: "json",
    data: {
      iso_a2: cCode,
    },
    success: function (results) {
      const topographyData = results.data.geonames;
      landmarkLayer.clearLayers();
      topographyData.forEach((data) => {
        const topographyPoint = geographicMarker(data);
        landmarkLayer.addLayer(topographyPoint);
      });
      // Add cityLayer to the map
      quakeLayer.addTo(map);
    },
    error: function (e, t, o) {
      console.log("Error fetching geographic data from Geonames api"),
        console.log(e.responseText),
        console.log(`${t} : ${o}`);
    },
  });
}

function geographicMarker(point) {
  const popupContent = `<b>Geographic name</b><br>${point.name}`;
  const cityIcon = L.ExtraMarkers.icon({
    prefix: "fa",
    icon: "fa-tree",
    iconColor: "white",
    markerColor: "green",
    shape: "circle",
  });
  return L.marker(L.latLng(point.lat, point.lng), {
    icon: cityIcon,
  }).bindTooltip(popupContent, { direction: "top", sticky: true });
}
