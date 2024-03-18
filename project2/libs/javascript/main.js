$(document).ready(function () {
  getAllPersonnels();
  getAllDepartments();
  getAllLocations();
});

// ++++++++++++++++++++++++++++++  SEARCH  +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
$("#searchInp").on("keyup", function () {
  let searchTerm = $(searchInp).val().toLowerCase();
  let activeButtonId = $(".nav-link.active").attr("data-bs-target");
  let tableBody = "";

  if (activeButtonId === "#personnel-tab-pane") {
    tableBody = $("#personnel-table-body");

    $.ajax({
      type: "GET",
      url: "libs/php/personnelSearch.php",
      data: { search: searchTerm },
      dataType: "json",
      async: false,
      success: function (results) {
        tableBody.empty();

        let data = results["data"];

        const table = document.getElementById("personnel-table-body");

        data.personnel.forEach((item) => {
          // Create a new table row
          const row = document.createElement("tr");

          // Create the name cell
          const nameCell = document.createElement("td");
          nameCell.classList.add("align-middle", "text-nowrap");
          nameCell.textContent = `${item.firstName}, ${item.lastName}`;

          // Create the department cell
          const departmentCell = document.createElement("td");
          departmentCell.classList.add(
            "align-middle",
            "text-nowrap",
            "d-none",
            "d-md-table-cell"
          );
          departmentCell.textContent = item.department;

          // Create the location cell
          const locationCell = document.createElement("td");
          locationCell.classList.add(
            "align-middle",
            "text-nowrap",
            "d-none",
            "d-md-table-cell"
          );
          locationCell.textContent = item.location;

          // Create the email cell
          const emailCell = document.createElement("td");
          emailCell.classList.add(
            "align-middle",
            "text-nowrap",
            "d-none",
            "d-md-table-cell"
          );
          emailCell.textContent = item.email;

          // Create the jobTitle cell
          const jobTitleCell = document.createElement("td");
          jobTitleCell.classList.add(
            "align-middle",
            "text-nowrap",
            "d-none",
            "d-md-table-cell"
          );
          jobTitleCell.textContent = item.jobTitle;

          // Create the button cell
          const buttonCell = document.createElement("td");
          buttonCell.classList.add("text-end", "text-nowrap");

          // Create the edit button
          const editButton = document.createElement("button");
          editButton.setAttribute("type", "button");
          editButton.classList.add("btn", "btn-primary", "btn-sm", "me-1");
          editButton.setAttribute("data-bs-toggle", "modal");
          editButton.setAttribute("data-bs-target", "#editPersonnelModal");
          editButton.setAttribute("data-id", item.id);
          const editIcon = document.createElement("i");
          editIcon.classList.add("fa-solid", "fa-pencil", "fa-fw");
          editButton.appendChild(editIcon);

          // Create the delete button
          const deleteButton = document.createElement("button");
          deleteButton.setAttribute("type", "button");
          deleteButton.classList.add("btn", "btn-primary", "btn-sm", "me-1");
          deleteButton.setAttribute("data-bs-toggle", "modal");
          deleteButton.setAttribute("data-bs-target", "#deletePersonnelModal");
          deleteButton.setAttribute("data-id", item.id);
          const deleteIcon = document.createElement("i");
          deleteIcon.classList.add("fa-solid", "fa-trash", "fa-fw");
          deleteButton.appendChild(deleteIcon);

          // Append buttons to the button cell
          buttonCell.appendChild(editButton);
          buttonCell.appendChild(deleteButton);

          // Append cells to the row
          row.appendChild(nameCell);
          row.appendChild(departmentCell);
          row.appendChild(locationCell);
          row.appendChild(emailCell);
          row.appendChild(jobTitleCell);
          row.appendChild(buttonCell);

          // Append row to the table
          table.appendChild(row);
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
      },
    });
  } else if (activeButtonId === "#departments-tab-pane") {
    tableBody = $("#department-table-body");

    $.ajax({
      type: "GET",
      url: "libs/php/departmentSearch.php",
      data: { search: searchTerm },
      dataType: "json",
      async: false,
      success: function (results) {
        // Update Main HTML Table
        tableBody.empty();
        let data = results["data"];

        const table = document.getElementById("department-table-body");
        // $(".department-table-body").html("");

        data.departments.forEach((item) => {
          // Create a new table row
          const row = document.createElement("tr");

          // Create the name cell
          const nameCell = document.createElement("td");
          nameCell.classList.add("align-middle", "text-nowrap");
          nameCell.textContent = item.name;

          // Create the location cell
          const locationCell = document.createElement("td");
          locationCell.classList.add(
            "align-middle",
            "text-nowrap",
            "d-none",
            "d-md-table-cell"
          );
          locationCell.textContent = item.location;

          // Create the button cell
          const buttonCell = document.createElement("td");
          buttonCell.classList.add("align-middle", "text-end", "text-nowrap");

          // Create the edit button
          const editButton = document.createElement("button");
          editButton.setAttribute("type", "button");
          editButton.classList.add("btn", "btn-primary", "btn-sm", "me-1");
          editButton.setAttribute("data-bs-toggle", "modal");
          editButton.setAttribute("data-bs-target", "#editDepartmentModal");
          editButton.setAttribute("data-id", item.id);
          const editIcon = document.createElement("i");
          editIcon.classList.add("fa-solid", "fa-pencil", "fa-fw");
          editButton.appendChild(editIcon);

          // Create the delete button
          const deleteButton = document.createElement("button");
          deleteButton.setAttribute("type", "button");
          deleteButton.classList.add(
            "btn",
            "btn-primary",
            "btn-sm",
            "deleteDepartmentBtn"
          );
          deleteButton.setAttribute("data-id", item.id);
          const deleteIcon = document.createElement("i");
          deleteIcon.classList.add("fa-solid", "fa-trash", "fa-fw");
          deleteButton.setAttribute("data-bs-toggle", "modal");
          deleteButton.setAttribute("data-bs-target", "#deleteDepartmentModal");
          deleteButton.appendChild(deleteIcon);

          // Append buttons to the button cell
          buttonCell.appendChild(editButton);
          buttonCell.appendChild(deleteButton);

          // Append cells to the row
          row.appendChild(nameCell);
          row.appendChild(locationCell);
          row.appendChild(buttonCell);

          // Append row to the table
          table.appendChild(row);
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
      },
    });
  } else if (activeButtonId === "#locations-tab-pane") {
    tableBody = $("#location-table-body");

    $.ajax({
      type: "GET",
      url: "libs/php/locationSearch.php",
      data: { search: searchTerm },
      dataType: "json",
      async: false,
      success: function (results) {
        // Update Main HTML Table
        tableBody.empty();
        let locationData = results["data"];
        const locationTable = document.getElementById("location-table-body");

        locationData.locations.forEach((item) => {
          // Create a new table row
          const locationRow = document.createElement("tr");

          // Create the name cell
          const nameCell = document.createElement("td");
          nameCell.classList.add("align-middle", "text-nowrap");
          nameCell.textContent = item.name;

          // Create the button cell
          const buttonCell = document.createElement("td");
          buttonCell.classList.add("align-middle", "text-end", "text-nowrap");

          // Create the edit button
          const editLocationButton = document.createElement("button");
          editLocationButton.setAttribute("type", "button");
          editLocationButton.classList.add(
            "btn",
            "btn-primary",
            "btn-sm",
            "me-1"
          );
          editLocationButton.setAttribute("data-bs-toggle", "modal");
          editLocationButton.setAttribute(
            "data-bs-target",
            "#editLocationModal"
          );
          editLocationButton.setAttribute("data-id", item.id);
          const editLocationIcon = document.createElement("i");
          editLocationIcon.classList.add("fa-solid", "fa-pencil", "fa-fw");
          editLocationButton.appendChild(editLocationIcon);

          // Create the delete button
          const deleteLocationButton = document.createElement("button");
          deleteLocationButton.setAttribute("type", "button");
          deleteLocationButton.classList.add("btn", "btn-primary", "btn-sm");
          deleteLocationButton.setAttribute("data-bs-toggle", "modal");
          deleteLocationButton.setAttribute(
            "data-bs-target",
            "#deleteLocationModal"
          );
          deleteLocationButton.setAttribute("data-id", item.id);
          const deleteLocationIcon = document.createElement("i");
          deleteLocationIcon.classList.add("fa-solid", "fa-trash", "fa-fw");
          deleteLocationButton.appendChild(deleteLocationIcon);

          // Append buttons to the button cell
          buttonCell.appendChild(editLocationButton);
          buttonCell.appendChild(deleteLocationButton);

          // Append cells to the row
          locationRow.appendChild(nameCell);
          locationRow.appendChild(buttonCell);

          // Append row to the table
          locationTable.appendChild(locationRow);
        });
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
      },
    });
  }
});

// REFRESH PERSONNEL, DEPARTMENT AND LOCATION DATA
$("#refreshBtn").click(refreshData);

function refreshData() {
  document.getElementById("searchInp").value = "";
  if ($("#personnelBtn").hasClass("active")) {
    $("#personnel-table-body").html("");
    getAllPersonnels();
  } else {
    if ($("#departmentsBtn").hasClass("active")) {
      getAllDepartments();
    } else {
      getAllLocations();
    }
  }
}

// ========================= FILTER =================================

let selectedDepartmentName = null;
let selectedLocationName = null;

function loadDepartments(locName) {
  $.ajax({
    url: "libs/php/getAllDepartments.php",
    type: "GET",
    dataType: "json",
    cache: false,
    success: function (result) {
      $("#selectPersonnelDepartment").empty();
      $("#selectPersonnelDepartment").append(
        $("<option>", {
          text: "Select department",
          value: "",
        })
      );
      result.data.forEach((item) => {
        if (item.location == locName) {
          $("#selectPersonnelDepartment").append(`
                        <option value="${item.id}">${item.name}</option>
                    `);
        }
      });
    },
  });
}

$("#selectPersonnelLocation").on("change", function () {
  const selectedLocation = $("#selectPersonnelLocation").val();
  $.ajax({
    url: "libs/php/getLocationByID.php",
    type: "POST",
    dataType: "json",
    cache: false,
    data: {
      id: selectedLocation,
    },
    success: function (result) {
      // let locationName = result.data.location[0].name;
      selectedLocationName = result.data.location[0].name;
      loadDepartments(selectedLocationName);
    },
  });
});

$("#selectPersonnelDepartment").on("change", function () {
  const selectedDepartment = $("#selectPersonnelDepartment").val();
  $.ajax({
    url: "libs/php/getDepartmentByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: selectedDepartment,
    },
    success: function (result) {
      selectedDepartmentName = result.data.department[0].name;
    },
  });
});

$("#applyPersonnelFilterButton").click(function (e) {
  e.preventDefault();
  $.ajax({
    url: "libs/php/getAll.php",
    type: "GET",
    dataType: "json",
    cache: false,
    success: function (result) {
      const filterResult = result.data.filter((item) => {
        if (selectedDepartmentName) {
          return item.department == selectedDepartmentName;
        } else if (selectedLocationName) {
          return item.location == selectedLocationName;
        } else {
          return (
            item.department == selectedDepartmentName &&
            item.location == selectedLocationName
          );
        }
      });

      $("#personnelBtn").tab("show");
      $(".tab-pane .personnel-table-body").html("");
      $("#personnel-table-body").html("");

      const table = document.getElementById("personnel-table-body");

      filterResult.forEach((item) => {
        // Create a new table row
        const row = document.createElement("tr");

        // Create the name cell
        const nameCell = document.createElement("td");
        nameCell.classList.add("align-middle", "text-nowrap");
        nameCell.textContent = `${item.firstName}, ${item.lastName}`;

        // Create the department cell
        const departmentCell = document.createElement("td");
        departmentCell.classList.add(
          "align-middle",
          "text-nowrap",
          "d-none",
          "d-md-table-cell"
        );
        departmentCell.textContent = item.department;

        // Create the location cell
        const locationCell = document.createElement("td");
        locationCell.classList.add(
          "align-middle",
          "text-nowrap",
          "d-none",
          "d-md-table-cell"
        );
        locationCell.textContent = item.location;

        // Create the email cell
        const emailCell = document.createElement("td");
        emailCell.classList.add(
          "align-middle",
          "text-nowrap",
          "d-none",
          "d-md-table-cell"
        );
        emailCell.textContent = item.email;

        // Create the jobTitle cell
        const jobTitleCell = document.createElement("td");
        jobTitleCell.classList.add(
          "align-middle",
          "text-nowrap",
          "d-none",
          "d-md-table-cell"
        );
        jobTitleCell.textContent = item.jobTitle;

        // Create the button cell
        const buttonCell = document.createElement("td");
        buttonCell.classList.add("text-end", "text-nowrap");

        // Create the edit button
        const editButton = document.createElement("button");
        editButton.setAttribute("type", "button");
        editButton.classList.add("btn", "btn-primary", "btn-sm", "me-1");
        editButton.setAttribute("data-bs-toggle", "modal");
        editButton.setAttribute("data-bs-target", "#editPersonnelModal");
        editButton.setAttribute("data-id", item.id);
        const editIcon = document.createElement("i");
        editIcon.classList.add("fa-solid", "fa-pencil", "fa-fw");
        editButton.appendChild(editIcon);

        // Create the delete button
        const deleteButton = document.createElement("button");
        deleteButton.setAttribute("type", "button");
        deleteButton.classList.add("btn", "btn-primary", "btn-sm", "me-1");
        deleteButton.setAttribute("data-bs-toggle", "modal");
        deleteButton.setAttribute("data-bs-target", "#deletePersonnelModal");
        deleteButton.setAttribute("data-id", item.id);
        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa-solid", "fa-trash", "fa-fw");
        deleteButton.appendChild(deleteIcon);

        // Append buttons to the button cell
        buttonCell.appendChild(editButton);
        buttonCell.appendChild(deleteButton);

        // Append cells to the row
        row.appendChild(nameCell);
        row.appendChild(departmentCell);
        row.appendChild(locationCell);
        row.appendChild(emailCell);
        row.appendChild(jobTitleCell);
        row.appendChild(buttonCell);

        // Append row to the table
        table.appendChild(row);
      });
      if (filterResult.length == 0) {
        var noDataFoundRow = $('<tr class="no-data-found"></tr>');
        var noDataFoundCell = $("<td></td>")
          .attr("colspan", "3")
          .addClass("text-center")
          .text("No Data Found");

        noDataFoundRow.append(noDataFoundCell);
        $("#personnel-table-body").append(noDataFoundRow);
      }
      $("#filterPersonnelModal").modal("hide");
      selectedDepartmentName = null;
      selectedLocationName = null;
    },
  });
});

$("#applyDepartmentFilterButton").click(function (e) {
  e.preventDefault();
  let DepartmentName = $("#selectDepartmentLocation").val();
  $.ajax({
    url: "libs/php/getAllDepartments.php",
    method: "GET",
    dataType: "json",
    success: function (response) {
      let newData = response.data.filter(
        (item) => item.locationID == DepartmentName
      );

      $("#departmentsBtn").tab("show");
      $(".tab-pane .department-table-body").html("");
      $("#department-table-body").html("");

      const table = document.getElementById("department-table-body");
      newData.forEach((item) => {
        // Create a new table row
        const row = document.createElement("tr");

        // Create the name cell
        const nameCell = document.createElement("td");
        nameCell.classList.add("align-middle", "text-nowrap");
        nameCell.textContent = item.name;

        // Create the location cell
        const locationCell = document.createElement("td");
        locationCell.classList.add(
          "align-middle",
          "text-nowrap",
          "d-none",
          "d-md-table-cell"
        );
        locationCell.textContent = item.location;

        // Create the button cell
        const buttonCell = document.createElement("td");
        buttonCell.classList.add("align-middle", "text-end", "text-nowrap");

        // Create the edit button
        const editButton = document.createElement("button");
        editButton.setAttribute("type", "button");
        editButton.classList.add("btn", "btn-primary", "btn-sm", "me-1");
        editButton.setAttribute("data-bs-toggle", "modal");
        editButton.setAttribute("data-bs-target", "#editDepartmentModal");
        editButton.setAttribute("data-id", item.id);
        const editIcon = document.createElement("i");
        editIcon.classList.add("fa-solid", "fa-pencil", "fa-fw");
        editButton.appendChild(editIcon);

        // Create the delete button
        const deleteButton = document.createElement("button");
        deleteButton.setAttribute("type", "button");
        deleteButton.classList.add(
          "btn",
          "btn-primary",
          "btn-sm",
          "deleteDepartmentBtn"
        );
        deleteButton.setAttribute("data-id", item.id);
        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa-solid", "fa-trash", "fa-fw");
        deleteButton.setAttribute("data-bs-toggle", "modal");
        deleteButton.setAttribute("data-bs-target", "#deleteDepartmentModal");
        deleteButton.appendChild(deleteIcon);

        // Append buttons to the button cell
        buttonCell.appendChild(editButton);
        buttonCell.appendChild(deleteButton);

        // Append cells to the row
        row.appendChild(nameCell);
        row.appendChild(locationCell);
        row.appendChild(buttonCell);

        // Append row to the table
        table.appendChild(row);
      });
      if (newData.length == 0) {
        var noDataFoundRow = $('<tr class="no-data-found"></tr>');
        var noDataFoundCell = $("<td></td>")
          .attr("colspan", "3")
          .addClass("text-center")
          .text("No Data Found");

        noDataFoundRow.append(noDataFoundCell);
        $("#department-table-body").append(noDataFoundRow);
      }
      $("#filterDepartmentModal").modal("hide");
      DepartmentName = null;
    },
    error: function (xhr, status, error) {
      console.error("Error fetching departments:", error);
    },
  });
});

$("#filterPersonnelModal").on("hidden.bs.modal", function () {
  $("#addPersonnelForm").trigger("reset");
});
$("#filterDepartmentModal").on("hidden.bs.modal", function () {
  $("#addDepartmentForm").trigger("reset");
});

$("#filterBtn").click(function () {
  var activeButtonId = $(".nav-link.active").attr("data-bs-target");
  $("#selectPersonnelDepartment").val("");
  $("#selectPersonnelLocation").val("");

  refreshData();

  if (activeButtonId === "#personnel-tab-pane") {
    var selectPersonnelDepartment = $("#selectPersonnelDepartment");

    selectPersonnelDepartment.empty();

    selectPersonnelDepartment.append(
      $("<option>", {
        text: "Select department",
        value: "",
      })
    );

    $.ajax({
      url: "libs/php/getAllDepartments.php",
      method: "GET",
      dataType: "json",
      success: function (response) {
        response.data.forEach(function (department) {
          var option = $("<option>");

          option.text(department.name);
          option.val(department.id);

          selectPersonnelDepartment.append(option);
        });
      },
      error: function (xhr, status, error) {
        console.error("Error fetching departments:", error);
      },
    });
    var selectPersonnelLocation = $("#selectPersonnelLocation");

    selectPersonnelLocation.empty();

    selectPersonnelLocation.append(
      $("<option>", {
        text: "Select Location",
        value: "",
      })
    );

    $.ajax({
      url: "libs/php/getAllLocations.php",
      method: "GET",
      dataType: "json",
      success: function (response) {
        response.data.forEach(function (location) {
          var option = $("<option>");

          option.text(location.name);
          option.val(location.id);

          selectPersonnelLocation.append(option);
        });
      },
      error: function (xhr, status, error) {
        console.error("Error fetching locations:", error);
      },
    });
    $("#filterPersonnelModal").modal("show");
  } else if (activeButtonId === "#departments-tab-pane") {
    var selectDepartmentLocation = $("#selectDepartmentLocation");

    selectDepartmentLocation.empty();

    selectDepartmentLocation.append(
      $("<option>", {
        text: "Select Location",
        value: "",
      })
    );

    $.ajax({
      url: "libs/php/getAllLocations.php",
      method: "GET",
      dataType: "json",
      success: function (response) {
        allLocations = response.data;
        response.data.forEach(function (location) {
          var option = $("<option>");

          option.text(location.name);
          option.val(location.id);

          selectDepartmentLocation.append(option);
        });
      },
      error: function (xhr, status, error) {
        console.error("Error fetching locations:", error);
      },
    });
    $("#filterDepartmentModal").modal("show");
  } else if (activeButtonId === "#locations-tab-pane") {
    $("#filterLocationModal").modal("show");
  }
});

// ==============================================ADD =================================================

$("#addBtn").click(function () {
  if ($("#personnelBtn").hasClass("active")) {
    $.ajax({
      url: "libs/php/getAllDepartments.php",
      type: "POST",
      dataType: "json",
      data: { type: "department" },
      success: function (result) {
        result.data.sort((a, b) => a.name.localeCompare(b.name));
        var $department = $("#department");

        $department.empty();

        $.each(result.data, function () {
          $department.append(
            $("<option>", {
              value: this.id,
              text: this.name,
            })
          );
        });
      },
    });

    $("#addPersonnelModal").modal("show");
  } else if ($("#departmentsBtn").hasClass("active")) {
    $.ajax({
      url: "libs/php/getAllLocations.php",
      type: "POST",
      dataType: "json",
      data: { type: "location" },
      success: function (result) {
        result.data.sort((a, b) => a.name.localeCompare(b.name));
        var $addDepartmentLocation = $("#addDepartmentLocation");

        $addDepartmentLocation.empty();

        $.each(result.data, function () {
          $addDepartmentLocation.append(
            $("<option>", {
              value: this.id,
              text: this.name,
            })
          );
        });
      },
    });
    $("#addDepartmentModal").modal("show");
  } else {
    $("#addLocationModal").modal("show");
  }
});

// ============== INSERT NEW DATA INTO PERSONNEL, DEPARTMENT AND LOCATION TABLE  =================

// ADD PERSONNEL DATA
$("#addPersonnelForm").submit(addPersonnelData);

function addPersonnelData(event) {
  event.preventDefault();
  let firstName = $("#firstName").val();
  let lastName = $("#lastName").val();
  let jobTitle = $("#jobTitle").val();
  let email = $("#emailAddress").val();
  let departmentID = $("#department").val();

  let personnelFormData = {
    firstName,
    lastName,
    jobTitle,
    email,
    departmentID,
  };
  let personnelExist = false;
  $.ajax({
    url: "libs/php/getAll.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      for (item of result.data) {
        if (item.email == personnelFormData.email) {
          personnelExist = true;
          $("#addPersonnelModal").modal("hide");
          $("#personnelCheckModal").modal("show");
          break;
        }
      }

      if (!personnelExist) {
        $.ajax({
          url: "libs/php/insertPersonnel.php",
          type: "POST",
          dataType: "json",
          data: personnelFormData,
          success: function (result) {
            $("#addPersonnelModal").modal("hide");
            $("#firstName").val("");
            $("#lastName").val("");
            $("#jobTitle").val("");
            $("#emailAddress").val("");
            $("#department").val("");
            getAllPersonnels();
            updateModalMessage("Personnel added successfully");
          },
          error: function (jqXHR, textStatus, errorThrown) {
            $("#addPersonnelModal").modal("hide");
            updateModalMessage("Error adding personnel");
          },
        });
      }
    },
  });

  $(this).trigger("reset");
}

// ADD DEPARTMENT DATA
$("#addDepartmentForm").submit(addDepartmentData);

function addDepartmentData(event) {
  event.preventDefault();
  let name = $("#addDepartmentName").val();
  let locationID = $("#addDepartmentLocation").val();

  let departmentLocation = null;
  let departmentExist = false;

  let departmentFormData = {
    name,
    locationID,
  };

  $.ajax({
    url: "libs/php/getAllLocations.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      for (item of result.data) {
        if (item.id == departmentFormData.locationID) {
          departmentLocation = item.name;
          break;
        }
      }
    },
  });

  setTimeout(function () {
    $.ajax({
      url: "libs/php/getAllDepartments.php",
      type: "GET",
      dataType: "json",
      success: function (result) {
        for (item of result.data) {
          if (
            item.name == departmentFormData.name &&
            item.location == departmentLocation
          ) {
            departmentExist = true;
            $("#addDepartmentModal").modal("hide");
            $("#departmentCheckModal").modal("show");
            break;
          }
        }
        if (!departmentExist) {
          $.ajax({
            url: "libs/php/insertDepartment.php",
            type: "POST",
            data: departmentFormData,
            success: function (result) {
              $("#addDepartmentModal").modal("hide");
              $("#addDepartmentName").val("");
              $("#addDepartmentLocation").val("");
              updateModalMessage("Department added successfully");
              getAllDepartments();
            },
            error: function (jqXHR, textStatus, errorThrown) {
              $("#addPersonnelModal").modal("hide");
              updateModalMessage("Error adding department");
            },
          });
        }
      },
    });
  });

  $(this).trigger("reset");
}

// ADD LOCATION DATA
$("#addLocationForm").submit(addLocationData);

function addLocationData(event) {
  event.preventDefault();
  let name = $("#addLocationName").val();

  let locationFormData = {
    name,
  };
  let locationExist = false;
  $.ajax({
    url: "libs/php/getAllLocations.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      for (item of result.data) {
        if (locationFormData.name == item.name) {
          locationExist = true;
          $("#addLocationModal").modal("hide");
          $("#locationCheckModal").modal("show");
          break;
        }
      }

      if (!locationExist) {
        $.ajax({
          url: "libs/php/insertLocation.php",
          type: "POST",
          data: locationFormData,
          success: function (result) {
            $("#addLocationModal").modal("hide");
            $("#addLocationName").val("");
            getAllLocations();
            updateModalMessage("Location added successfully");
          },
          error: function (jqXHR, textStatus, errorThrown) {
            $("#addPersonnelModal").modal("hide");
            updateModalMessage("Error adding location.");
          },
        });
      }
    },
  });

  $(this).trigger("reset");
}

// ============== DELETE DATA FROM PERSONNEL, DEPARTMENT AND LOCATION TABLE  =================
// DELETE PERSONNEL
$("#deletePersonnelModal").on("show.bs.modal", function (e) {
  $.ajax({
    url: "libs/php/getPersonnelByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $(e.relatedTarget).attr("data-id"),
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        $("#deletePersonnelEmployeeID").val(result.data.personnel[0].id);
        $firstName = result.data.personnel[0].firstName;
        $lastName = result.data.personnel[0].lastName;
        $("#employeeName").html(
          "<strong>" + $firstName + " " + $lastName + "</strong>"
        );
      } else {
        $("#deletePersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#deletePersonnelModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    },
  });
});

$("#deletePersonnelForm").submit(function (event) {
  event.preventDefault();

  var deletePersonnelID = $("#deletePersonnelEmployeeID").val();

  $.ajax({
    url: "libs/php/deletePersonnelByID.php",
    type: "POST",
    data: { id: deletePersonnelID },
    success: function (result) {
      getAllPersonnels();
      updateModalMessage("Personnel deleted successfully");
      $("#deletePersonnelModal").modal("hide");
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#deletePersonnelModal").modal("hide");
      console.error(textStatus, "error");
    },
  });
});

// DELETE DEPARTMENT
let deptRow = null;
let personnelInDepartment = null;
$("#deleteDepartmentModal").on("show.bs.modal", (e) => {
  $("#departmentID").val($(e.relatedTarget).attr("data-id"));
  deptRow = $(e.relatedTarget).closest("tr");
  const targetDepartment = deptRow[0].children[0].innerText;

  personnelInDepartment = [];
  $.ajax({
    type: "GET",
    url: "libs/php/getAll.php",
    dataType: "json",
    success: function (result) {
      let data = result["data"];
      data.forEach((i) => {
        if (i.departmentId == $(e.relatedTarget).attr("data-id")) {
          personnelInDepartment.push(i);
        }
      });
      if (personnelInDepartment.length > 0) {
        $("#deleteDepartmentModal .modal-body p").html(
          `There are currently ${personnelInDepartment.length} employee(s) assigned to ${targetDepartment}.  Deletion is not possible.`
        );
        $("#deleteDepartmentModal .modal-footer").html(
          `<button type="button"
              class="btn btn-outline-primary btn-sm myBtn"
              data-bs-dismiss="modal">Close</button>`
        );
      } else {
        $("#deleteDepartmentModal .modal-body p").html(
          `This action can't be reversed. Are you sure you want to delete ${targetDepartment}?`
        );
        $("#deleteDepartmentModal .modal-footer").html(`
              <button type="submit"
              form="deleteDepartmentForm"
              class="btn btn-outline-primary btn-sm myBtn">Yes
              </button>
              <button type="button"
              class="btn btn-outline-primary btn-sm myBtn"
              data-bs-dismiss="modal">Cancel</button>
                `);
      }
    },
  });
});

$("#deleteDepartmentForm").submit(function (e) {
  e.preventDefault();
  $.ajax({
    url: `libs/php/deleteDepartmentByID.php`,
    type: "POST",
    data: {
      id: $("#departmentID").val(),
    },
    success: function (result) {
      $("#deleteDepartmentModal").modal("hide");
      getAllDepartments();
      updateModalMessage("Department deleted successfully");
    },
  });
});

// DELETE LOCATION
let locID = null;
let locRow = null;
let departmentInLocation = [];
$("#deleteLocationModal").on("show.bs.modal", function (e) {
  locRow = $(e.relatedTarget).closest("tr");
  $("#LocationID").val($(e.relatedTarget).attr("data-id"));
  let locationForDelete = locRow[0].children[0].innerText;
  departmentInLocation = [];
  $.ajax({
    url: "libs/php/getLocationByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $(e.relatedTarget).attr("data-id"),
    },
    success: function (result) {
      targetLocation = result.data.location[0].name;
      let resultCode = result.status.code;
      if (resultCode == 200) {
        $.ajax({
          type: "GET",
          url: "libs/php/getAllDepartments.php",
          // data: {},
          dataType: "json",
          async: false,
          success: function (results) {
            // Update Main HTML Table
            let data = results["data"];
            data.forEach((i) => {
              if (i.location == targetLocation) {
                departmentInLocation.push(i);
              }
            });
            if (departmentInLocation.length > 0) {
              $("#deleteLocationModal .modal-body p").html(
                `There are currently ${departmentInLocation.length} department(s) assigned to ${locationForDelete}.  Deletion is not possible.`
              );
              $("#deleteLocationModal .modal-footer").html(
                `<button type="button"
              class="btn btn-outline-primary btn-sm myBtn"
              data-bs-dismiss="modal">Close</button>`
              );
            } else {
              $("#deleteLocationModal .modal-body p").html(
                `This action can't be reversed. Are you sure you want to delete ${locationForDelete}?`
              );
              $("#deleteLocationModal .modal-footer").html(
                `<button type="submit"
              form="deleteLocationForm"
              class="btn btn-outline-primary btn-sm myBtn">Yes
              </button>
              <button type="button"
              class="btn btn-outline-primary btn-sm myBtn"
              data-bs-dismiss="modal">Cancel</button>`
              );
            }
          },
        });
      } else {
        $("#deleteLocationModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#deleteLocationModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    },
  });
});

$("#deleteLocationForm").submit(function (e) {
  e.preventDefault();
  $.ajax({
    url: `libs/php/deleteLocationByID.php`,
    type: "POST",
    data: {
      id: $("#LocationID").val(),
    },
    success: function (result) {
      $("#deleteLocationModal").modal("hide");
      getAllLocations();
      updateModalMessage("Location deleted successfully");
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#deleteLocationModal").modal("hide");
      updateModalMessage("Error deleting location.");
    },
  });
});

// ============== REFRESH PERSONNEL, DEPARTMENT, LOCATION DATA  =================
// refresh personnel table
$("#personnelBtn").click(getAllPersonnels);

// refresh department table
$("#departmentsBtn").click(getAllDepartments);

// refresh location table
$("#locationsBtn").click(getAllLocations);
// ============== EDIT DATA FROM PERSONNEL, DEPARTMENT AND LOCATION TABLE  =================
// EDIT PERSONNEL

$("#editPersonnelModal").on("show.bs.modal", function (e) {
  $.ajax({
    url: "libs/php/getPersonnelByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $(e.relatedTarget).attr("data-id"),
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        $("#editPersonnelEmployeeID").val(result.data.personnel[0].id);

        $("#editPersonnelFirstName").val(result.data.personnel[0].firstName);
        $("#editPersonnelLastName").val(result.data.personnel[0].lastName);
        $("#editPersonnelJobTitle").val(result.data.personnel[0].jobTitle);
        $("#editPersonnelEmailAddress").val(result.data.personnel[0].email);

        $("#editPersonnelDepartment").html("");

        $.each(result.data.department, function () {
          $("#editPersonnelDepartment").append(
            $("<option>", {
              value: this.id,
              text: this.name,
            })
          );
        });

        $("#editPersonnelDepartment").val(
          result.data.personnel[0].departmentID
        );
      } else {
        $("#editPersonnelModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editPersonnelModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    },
  });
});
const getPersonnelDetails = (i) => $(`#editPersonnel${i}`).val();
$("#editPersonnelForm").submit(function (event) {
  event.preventDefault();

  let firstName = getPersonnelDetails("FirstName");
  let lastName = getPersonnelDetails("LastName");
  let jobTitle = getPersonnelDetails("JobTitle");
  let email = getPersonnelDetails("EmailAddress");
  let departmentID = getPersonnelDetails("Department");
  let id = getPersonnelDetails("EmployeeID");

  let formData = {
    firstName,
    lastName,
    jobTitle,
    email,
    departmentID,
    id,
  };

  $.ajax({
    url: "libs/php/updatePersonnel.php",
    type: "POST",
    data: formData,
    dataType: "json",
    success: function (result) {
      getAllPersonnels();
      $("#editPersonnelModal").modal("hide");
      updateModalMessage("Updated successfully.");
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editPersonnelModal").modal("hide");
      updateModalMessage("Error updating.");
    },
  });
});

// EDIT DEPARTMENT
$("#editDepartmentModal").on("show.bs.modal", function (e) {
  $.ajax({
    url: "libs/php/getDepartmentByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $(e.relatedTarget).attr("data-id"), // Retrieves the data-id attribute from the calling button
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        $("#editDepartmentID").val(result.data.department[0].id);
        $("#editDepartmentName").val(result.data.department[0].name);
        $("#editDepartmentLocation").html("");

        $.each(result.data.location, function () {
          $("#editDepartmentLocation").append(
            $("<option>", {
              value: this.id,
              text: this.name,
            })
          );
        });

        $("#editDepartmentLocation").val(result.data.department[0].locationID);
      } else {
        $("#editDepartmentModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editDepartmentModal .modal-title").replaceWith(
        "Error retrieving data"
      );
    },
  });
});

$("#editDepartmentForm").submit(function (event) {
  event.preventDefault();

  let departmentName = $("#editDepartmentName").val();
  let departmentLocation = $("#editDepartmentLocation").val();
  let departmentID = $("#editDepartmentID").val();

  let formData = {
    name: departmentName,
    locationID: departmentLocation,
    departmentID: departmentID,
  };

  $.ajax({
    url: "libs/php/updateDepartment.php",
    type: "POST",
    data: formData,
    dataType: "json",
    success: function (result) {
      getAllDepartments();
      $("#editDepartmentModal").modal("hide");
      updateModalMessage("Updated successfully.");
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editDepartmentModal").modal("hide");
      updateModalMessage("Error updating.");
    },
  });
});

// EDIT LOCATION
$("#editLocationModal").on("show.bs.modal", function (e) {
  $.ajax({
    url: "libs/php/getLocationByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: $(e.relatedTarget).attr("data-id"),
    },
    success: function (result) {
      var resultCode = result.status.code;

      if (resultCode == 200) {
        $("#editLocationID").val(result.data.location[0].id);
        $("#editLocationName").val(result.data.location[0].name);
      } else {
        $("#editDepartmentModal .modal-title").replaceWith(
          "Error retrieving data"
        );
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editLocationModal .modal-title").replaceWith("Error retrieving data");
    },
  });
});

$("#editLocationForm").submit(function (event) {
  event.preventDefault();

  let locationName = $("#editLocationName").val();
  let locationID = $("#editLocationID").val();

  let formData = {
    name: locationName,
    locationID: locationID,
  };

  $.ajax({
    url: "libs/php/updateLocation.php",
    type: "POST",
    data: formData,
    dataType: "json",
    success: function (result) {
      getAllLocations();
      $("#editLocationModal").modal("hide");
      updateModalMessage("Updated successfully");
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#editLocationModal").modal("hide");
      updateModalMessage("Error updating.");
    },
  });
});

//===================================== GET ALL PERSONNEL========================================================
function getAllPersonnels() {
  // Generate all user data for the table
  $.ajax({
    type: "GET",
    url: "libs/php/getAll.php",
    // data: {},
    dataType: "json",
    cache: false,
    async: false,
    success: function (results) {
      // Update Main HTML Table
      let data = results["data"];

      // console.log(data);
      const table = document.getElementById("personnel-table-body");
      $(".personnel-table-body").html("");

      data.forEach((item) => {
        // Create a new table row
        const row = document.createElement("tr");

        // Create the name cell
        const nameCell = document.createElement("td");
        nameCell.classList.add("align-middle", "text-nowrap");
        nameCell.textContent = `${item.firstName}, ${item.lastName}`;

        // Create the department cell
        const departmentCell = document.createElement("td");
        departmentCell.classList.add(
          "align-middle",
          "text-nowrap",
          "d-none",
          "d-md-table-cell"
        );
        departmentCell.textContent = item.department;

        // Create the location cell
        const locationCell = document.createElement("td");
        locationCell.classList.add(
          "align-middle",
          "text-nowrap",
          "d-none",
          "d-md-table-cell"
        );
        locationCell.textContent = item.location;

        // Create the email cell
        const emailCell = document.createElement("td");
        emailCell.classList.add(
          "align-middle",
          "text-nowrap",
          "d-none",
          "d-md-table-cell"
        );
        emailCell.textContent = item.email;

        // Create the jobTitle cell
        const jobTitleCell = document.createElement("td");
        jobTitleCell.classList.add(
          "align-middle",
          "text-nowrap",
          "d-none",
          "d-md-table-cell"
        );
        jobTitleCell.textContent = item.jobTitle;

        // Create the button cell
        const buttonCell = document.createElement("td");
        buttonCell.classList.add("text-end", "text-nowrap");

        // Create the edit button
        const editButton = document.createElement("button");
        editButton.setAttribute("type", "button");
        editButton.classList.add("btn", "btn-primary", "btn-sm", "me-1");
        editButton.setAttribute("data-bs-toggle", "modal");
        editButton.setAttribute("data-bs-target", "#editPersonnelModal");
        editButton.setAttribute("data-id", item.id);
        const editIcon = document.createElement("i");
        editIcon.classList.add("fa-solid", "fa-pencil", "fa-fw");
        editButton.appendChild(editIcon);

        // Create the delete button
        const deleteButton = document.createElement("button");
        deleteButton.setAttribute("type", "button");
        deleteButton.classList.add("btn", "btn-primary", "btn-sm", "me-1");
        deleteButton.setAttribute("data-bs-toggle", "modal");
        deleteButton.setAttribute("data-bs-target", "#deletePersonnelModal");
        deleteButton.setAttribute("data-id", item.id);
        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa-solid", "fa-trash", "fa-fw");
        deleteButton.appendChild(deleteIcon);

        // Append buttons to the button cell
        buttonCell.appendChild(editButton);
        buttonCell.appendChild(deleteButton);

        // Append cells to the row
        row.appendChild(nameCell);
        row.appendChild(departmentCell);
        row.appendChild(locationCell);
        row.appendChild(emailCell);
        row.appendChild(jobTitleCell);
        row.appendChild(buttonCell);

        // Append row to the table
        table.appendChild(row);
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
    },
  });
}

// =========GET ALL DEPARTMENTS =================================
function getAllDepartments() {
  // Generate all user data for the table
  $.ajax({
    type: "GET",
    url: "libs/php/getAllDepartments.php",
    // data: {},
    dataType: "json",
    cache: false,
    async: false,
    success: function (results) {
      // Update Main HTML Table
      let data = results["data"];
      allDepartment = data;
      // console.log(data);
      const table = document.getElementById("department-table-body");
      $(".department-table-body").html("");
      data.forEach((item) => {
        // Create a new table row
        const row = document.createElement("tr");

        // Create the name cell
        const nameCell = document.createElement("td");
        nameCell.classList.add("align-middle", "text-nowrap");
        nameCell.textContent = item.name;

        // Create the location cell
        const locationCell = document.createElement("td");
        locationCell.classList.add(
          "align-middle",
          "text-nowrap",
          "d-none",
          "d-md-table-cell"
        );
        locationCell.textContent = item.location;

        // Create the button cell
        const buttonCell = document.createElement("td");
        buttonCell.classList.add("align-middle", "text-end", "text-nowrap");

        // Create the edit button
        const editButton = document.createElement("button");
        editButton.setAttribute("type", "button");
        editButton.classList.add("btn", "btn-primary", "btn-sm", "me-1");
        editButton.setAttribute("data-bs-toggle", "modal");
        editButton.setAttribute("data-bs-target", "#editDepartmentModal");
        editButton.setAttribute("data-id", item.id);
        const editIcon = document.createElement("i");
        editIcon.classList.add("fa-solid", "fa-pencil", "fa-fw");
        editButton.appendChild(editIcon);

        // Create the delete button
        const deleteButton = document.createElement("button");
        deleteButton.setAttribute("type", "button");
        deleteButton.classList.add(
          "btn",
          "btn-primary",
          "btn-sm",
          "deleteDepartmentBtn"
        );
        deleteButton.setAttribute("data-id", item.id);
        const deleteIcon = document.createElement("i");
        deleteIcon.classList.add("fa-solid", "fa-trash", "fa-fw");
        deleteButton.setAttribute("data-bs-toggle", "modal");
        deleteButton.setAttribute("data-bs-target", "#deleteDepartmentModal");
        deleteButton.appendChild(deleteIcon);

        // Append buttons to the button cell
        buttonCell.appendChild(editButton);
        buttonCell.appendChild(deleteButton);

        // Append cells to the row
        row.appendChild(nameCell);
        row.appendChild(locationCell);
        row.appendChild(buttonCell);

        // Append row to the table
        table.appendChild(row);
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
    },
  });
}

// =========GET ALL LOCATIONS =================================
function getAllLocations() {
  // Generate all user data for the table
  $.ajax({
    type: "GET",
    url: "libs/php/getAllLocations.php",
    // data: {},
    dataType: "json",
    cache: false,
    async: false,
    success: function (results) {
      let locationData = results["data"];
      const locationTable = document.getElementById("location-table-body");
      // console.log(data);
      $(".location-table-body").html("");
      locationData.forEach((item) => {
        // Create a new table row
        const locationRow = document.createElement("tr");

        // Create the name cell
        const nameCell = document.createElement("td");
        nameCell.classList.add("align-middle", "text-nowrap");
        nameCell.textContent = item.name;

        // Create the button cell
        const buttonCell = document.createElement("td");
        buttonCell.classList.add("align-middle", "text-end", "text-nowrap");

        // Create the edit button
        const editLocationButton = document.createElement("button");
        editLocationButton.setAttribute("type", "button");
        editLocationButton.classList.add(
          "btn",
          "btn-primary",
          "btn-sm",
          "me-1"
        );
        editLocationButton.setAttribute("data-bs-toggle", "modal");
        editLocationButton.setAttribute("data-bs-target", "#editLocationModal");
        editLocationButton.setAttribute("data-id", item.id);
        const editLocationIcon = document.createElement("i");
        editLocationIcon.classList.add("fa-solid", "fa-pencil", "fa-fw");
        editLocationButton.appendChild(editLocationIcon);

        // Create the delete button
        const deleteLocationButton = document.createElement("button");
        deleteLocationButton.setAttribute("type", "button");
        deleteLocationButton.classList.add("btn", "btn-primary", "btn-sm");
        deleteLocationButton.setAttribute("data-bs-toggle", "modal");
        deleteLocationButton.setAttribute(
          "data-bs-target",
          "#deleteLocationModal"
        );
        deleteLocationButton.setAttribute("data-id", item.id);
        const deleteLocationIcon = document.createElement("i");
        deleteLocationIcon.classList.add("fa-solid", "fa-trash", "fa-fw");
        deleteLocationButton.appendChild(deleteLocationIcon);

        // Append buttons to the button cell
        buttonCell.appendChild(editLocationButton);
        buttonCell.appendChild(deleteLocationButton);

        // Append cells to the row
        locationRow.appendChild(nameCell);
        locationRow.appendChild(buttonCell);

        // Append row to the table
        locationTable.appendChild(locationRow);
      });
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(errorThrown);
    },
  });
}

// Dynamic Modal message
function updateModalMessage(message) {
  $("#modalMessage").text(message);
  $("#dynamicMessageModal").modal("show");
}
