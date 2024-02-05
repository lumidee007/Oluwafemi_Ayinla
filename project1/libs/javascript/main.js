let map;
let marker;
let countryName;
let countryCode;
let currency_Code;
let BoundaryStyling = {
  color: "blue",
  weight: 2.9,
  opacity: 0.55,
};

$(document).ready(function () {
  if ($("#preloader").length) {
    $("#preloader")
      .delay(1000)
      .fadeOut("slow", function () {
        $(this).remove();
      });

    updateCurrentLocation();
    mapConfig();
    getCountryList();

    $("#countrySelect").change(handleCountryChange);
  }
});

function handleCountryChange() {
  let TerritoryGeo = L.geoJson();
  countryName = $("#countrySelect option:selected").text();

  $.ajax({
    url: "libs/php/getCountryBorder.php",
    type: "POST",
    dataType: "json",
    data: {
      country: countryName,
    },
    success: function (result) {
      TerritoryGeo.clearLayers();
      TerritoryGeo.addData(result);
      TerritoryGeo.setStyle(BoundaryStyling);
      TerritoryGeo.addTo(map); //
      map.fitBounds(TerritoryGeo.getBounds());
      fetchCountryWeather();
      fetchCountryInfo();
      fetchCountryHolidays();
      fetchCountryNews();
      fetchCountryCities();
      currencyConversion();
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
    let options = { timeout: 55000 };
    navigator.geolocation.getCurrentPosition(
      setNewPosition,
      initializeDefaultCountry,
      options
    );
  }
}

//Default location
function initializeDefaultCountry() {
  let defaultCountryCode = "FR";
  countryCode = defaultCountryCode;
  $("#countrySelect").val(countryCode).change();
}

//Current Location
function setNewPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  $.ajax({
    url: "libs/php/getLatLong.php",
    type: "POST",
    dataType: "json",
    data: {
      lat: latitude,
      long: longitude,
    },
    success: function (result) {
      countryCode =
        result["data"]["results"][0]["components"]["ISO_3166-1_alpha-2"];
      $("#countrySelect").val(countryCode).change(handleCountryChange);
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("error", errorThrown);
      alert("Error getting your current location");
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
      maxZoom: 8,
      format: "jpg",
      time: "",
      tilematrixset: "GoogleMapsCompatible_Level",
    }
  );

  let basemaps = {
    Streets: streets,
    Satellite: satellite,
    EarthAtNight: EarthAtNight,
  };

  map = L.map("map", {
    layers: [streets],
  }).setView([51.51, -0.09], 6);

  L.control.layers(basemaps).addTo(map);

  marker = L.marker([51.5, -0.08]).addTo(map);

  //DEFINE ALL MODALS

  L.easyButton("fa-solid fa-info fa-lg text-success", function (btn, map) {
    $("#countryMainInfo").modal("show");
  }).addTo(map);

  L.easyButton("fa-solid fa-cloud fa-lg text-success", function (btn, map) {
    $("#countryWeatherInfo").modal("show");
  }).addTo(map);

  L.easyButton(
    "fa-solid fa-umbrella-beach fa-lg text-success",
    function (btn, map) {
      $("#CountryHolidaysInfo").modal("show");
    }
  ).addTo(map);

  L.easyButton(
    "fa-solid fa-regular fa-newspaper fa-lg text-success",
    function (btn, map) {
      $("#CountryNewsInfo").modal("show");
    }
  ).addTo(map);

  L.easyButton(
    "fa-solid fa-regular fa-city fa-lg text-success",
    function (btn, map) {
      $("#citiesAroundInfo").modal("show");
    }
  ).addTo(map);

  L.easyButton(
    "fa-solid fa-regular fa-money-bill fa-lg text-success",
    function (btn, map) {
      $("#country-currency-conversion").modal("show");
    }
  ).addTo(map);

  // Random easy button to change country
  L.easyButton(
    "fa-solid fa-rotate-right fa-lg text-success",
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
function fetchCountryInfo() {
  $("#country-information").html(
    $("#countrySelect option:selected").text() + " main information"
  );
  $.ajax({
    url: "libs/php/getCountryInfo.php",
    type: "POST",
    dataType: "json",
    data: {
      country_code: $("#countrySelect").val(),
    },

    success: (result) => {
      if (result.status.name == "ok") {
        $("#infoContainer").empty();

        currency_Code = result["data"][0]["currencyCode"];
        $("#country-name").html(countryName);
        $("#country-capital").html(result["data"][0]["capital"]);
        $("#country-continent").html(result["data"][0]["continentName"]);
        $("#country-population").html(
          parseInt(result["data"][0]["population"]).toLocaleString()
        );
        $("#country-area").html(
          parseInt(result["data"][0]["areaInSqKm"]).toLocaleString()
        );
        $("#country-currency").html(currency_Code);
      }
    },
    error: (textStatus, errorThrown) => {
      console.log("Error getting your the get country api");
    },
  });
}

// =================== GET COUNTRY WEATHER ====================================================

function fetchCountryWeather() {
  $("#country-weather-info").html(
    $("#countrySelect option:selected").text() + " Weather Information"
  );
  $.ajax({
    url: "libs/php/getWeatherInfo.php",
    type: "POST",
    dataType: "json",
    data: {
      country: $("#countrySelect option:selected").text(),
    },
    success: function (result) {
      if (result.status.name == "ok") {
        $("#country-temp").html(result["data"]["main"]["temp"] + "°C");
        $("#country-pressure").html(
          result["data"]["main"]["pressure"] + " bar"
        );
        $("#country-humidity").html(result["data"]["main"]["humidity"] + " %");
        $("#country-low-temp").html(
          result["data"]["main"]["feels_like"] + " °C"
        );
        $("#country-wind-speed").html(result["data"]["wind"]["speed"] + " m/s");
        $("#country-weather-direction").html(
          result["data"]["weather"][0]["description"]
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log("Error getting the get country weather");
    },
  });
}

// =================== GET COUNTRY HOLIDAY ====================================================
function fetchCountryHolidays() {
  let cCode = $("#countrySelect").val();
  $("#country-holiday-info").html(
    "National holidays in " +
      $("#countrySelect option:selected").text() +
      " for 2024"
  );
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
            year: "numeric",
            month: "long",
            day: "numeric",
          });

          $("#tableContainer").append(
            "<tr><td>" +
              holidayEvent.name +
              "</td><td>" +
              formattedDate +
              "</td></tr>"
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
  $("#newsFeedCountry").html(
    "News in " + $("#countrySelect option:selected").text()
  );
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
          <div class="card mb-3">
            <div class="card-body">
              <h5 class="card-title">${article.title}</h5>
              <h6 class="card-subtitle mb-2 text-muted">${article.author}</h6>
              <h6 class="card-subtitle mb-2 text-muted">${
                article.source.name
              }</h6>
              <p class="card-text">Published At: ${new Date(
                article.publishedAt
              ).toLocaleDateString()}</p>
              <a href="${
                article.url
              }" class="card-link" target="_blank">Read More</a>
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

// =================== GET CITIES AROUND ====================================================
function fetchCountryCities() {
  let cCode = $("#countrySelect").val();
  $.ajax({
    url: "libs/php/getWikipediaSearch.php",
    type: "POST",
    dataType: "json",
    data: {
      country: cCode,
    },
    success: function (data) {
      $("#cities-around-country").html(
        "Cities Around " + $("#countrySelect option:selected").text()
      );
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
  $("#info-country").html(
    $("#countrySelect option:selected").text() + " currency converter"
  );
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
            $("#info-country").html(
              selectedCurrencyName + " currency converter"
            );

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
