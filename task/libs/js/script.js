$(window).on("load", function () {
  if ($("#preloader").length) {
    $("#preloader")
      .delay(1000)
      .fadeOut("slow", function () {
        $(this).remove();
      });
  }
});

//WikipediaSearch API
$("#wikiRun").click(function () {
  $.ajax({
    url: "libs/php/getWikipediaSearch.php",
    type: "POST",
    dataType: "json",
    data: {
      country: $("#selwikiCountry").val(),
    },
    success: function (result) {
      $("#results").html("");
      if (result.status.name === "ok") {
        let data = result.data;

        for (let i = 0; i < data.length; i++) {
          $("#results").append(
            `<span class="title">Title:</span> ${data[i].title} <br/>`
          );
          $("#results").append(
            `<span class="lat">Latitude:</span> ${data[i].lat} <br/>`
          );
          $("#results").append(
            `<span class="long">Longitude:</span> ${data[i].lng} <br/>`
          );
          $("#results").append(
            `<span class="sum">Summary:</span> ${data[i].summary} <br/>`
          );
          $("#results").append(`<hr/>`);
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
    },
  });
});

// Neighbor API
$("#neighbourRun").click(function () {
  $.ajax({
    url: "libs/php/getNeigborSearch.php",
    type: "POST",
    dataType: "json",
    data: {
      geonameId: $("#selNeighbour").val(),
    },
    success: function (result) {
      $("#results").html("");
      if (result.status.name === "ok") {
        let data = result.data;

        for (let i = 0; i < data.length; i++) {
          $("#results").append(
            `<span class="name">Name:</span> ${data[i].name} <br/>`
          );
          $("#results").append(
            `<span class="pop">Population:</span> ${data[i].population} <br/>`
          );
          $("#results").append(
            `<span class="topo">Toponym Name:</span> ${data[i].toponymName} <br/>`
          );
          $("#results").append(
            `<span class="geoId">GeonameId:</span> ${data[i].geonameId} <br/><br/>`
          );
          $("#results").append(`<hr/>`);
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
    },
  });
});

// Search API
$("#searchSubmit").click(function () {
  $.ajax({
    url: "libs/php/getSearch.php",
    type: "POST",
    dataType: "json",
    data: {
      country: $("#selSearch").val(),
    },
    success: function (result) {
      $("#results").html("");
      if (result.status.name === "ok") {
        let data = result.data;

        for (let i = 0; i < data.length; i++) {
          $("#results").append(
            `<span class="name">Name:</span> ${data[i].name} <br/>`
          );
          $("#results").append(
            `<span class="topo">opulation:</span> ${data[i].population} <br/>`
          );
          $("#results").append(
            `<span class="pop">CountryId:</span> ${data[i].countryId} <br/>`
          );
          $("#results").append(
            `<span class="topo">countryCode:</span> ${data[i].countryCode} <br/>`
          );
          $("#results").append(
            `<span class="geoId">FcodeName:</span> ${data[i].fcodeName} <br/><br/>`
          );
          $("#results").append(`<hr/>`);
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      // your error code
    },
  });
});
