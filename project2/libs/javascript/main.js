$(document).ready(function () {
  getAllPersonnels();
  getAllDepartments();
  getAllLocations();
  updateDepartmentDropdown();
  updateLocationDropdown();
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
      success: function (results) {
        tableBody.empty();

        let data = results["data"];

        const personnelFrag = document.createDocumentFragment();
        data.personnel.forEach((item) => {
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

          // Append row to the frag
          personnelFrag.append(row);
        });

        $("#personnel-table-body").append(personnelFrag);
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
      success: function (results) {
        // Update Main HTML Table
        tableBody.empty();
        let data = results["data"];

        $(".department-table-body").html("");
        let departmentFrag = document.createDocumentFragment();

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
          departmentFrag.appendChild(row);
        });
        $("#department-table-body").append(departmentFrag);
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
      success: function (results) {
        // Update Main HTML Table
        tableBody.empty();
        let locationData = results["data"];

        let locationFrag = document.createDocumentFragment();

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
          // locationTable.appendChild(locationRow);
          locationFrag.appendChild(locationRow);
        });
        $("#location-table-body").append(locationFrag);
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(errorThrown);
      },
    });
  }
});

// REFRESH PERSONNEL, DEPARTMENT AND LOCATION DATA

$("#refreshBtn").click(function (e) {
  e.preventDefault();
  $("#selectPersonnelDepartment").val("");
  $("#selectPersonnelLocation").val("");

  document.getElementById("searchInp").value = "";
  if ($("#personnelBtn").hasClass("active")) {
    getAllPersonnels();
  } else {
    if ($("#departmentsBtn").hasClass("active")) {
      getAllDepartments();
    } else {
      getAllLocations();
    }
  }
});

// ========================= FILTER =================================

let lastSelectedDepartment = "0";
let lastSelectedLocation = "0";

$("#filterBtn").click(function () {
  var activeButtonId = $(".nav-link.active").attr("data-bs-target");
  if (activeButtonId === "#personnel-tab-pane") {
    updateDepartmentDropdown(lastSelectedDepartment);
    updateLocationDropdown(lastSelectedLocation);
    $("#filterPersonnelModal").modal("show");
  }
});

function updateDepartmentDropdown(selectedId = "0") {
  let dropdown = $("#selectPersonnelDepartment");
  dropdown.empty().append($("<option>", { text: "All", value: "0" }));
  $.ajax({
    url: "libs/php/getAllDepartments.php",
    method: "GET",
    dataType: "json",
    success: function (result) {
      result.data.forEach(function (department) {
        dropdown.append(
          $("<option>", {
            text: department.name,
            value: department.id,
            selected: department.id.toString() === selectedId.toString(),
          })
        );
      });
    },
    error: function (xhr, status, error) {
      console.error("Error fetching departments:", error);
    },
  });
}

function updateLocationDropdown(selectedId = "0") {
  let dropdown = $("#selectPersonnelLocation");
  dropdown.empty().append($("<option>", { text: "All", value: "0" }));
  $.ajax({
    url: "libs/php/getAllLocations.php",
    method: "GET",
    dataType: "json",
    success: function (result) {
      result.data.forEach(function (location) {
        dropdown.append(
          $("<option>", {
            text: location.name,
            value: location.id,
            selected: location.id.toString() === selectedId.toString(),
          })
        );
      });
    },
    error: function (xhr, status, error) {
      console.error("Error fetching locations:", error);
    },
  });
}

$("#selectPersonnelDepartment").on("change", function () {
  lastSelectedDepartment = $(this).val();
  $("#selectPersonnelLocation").val("0");
  lastSelectedLocation = "0";
});

$("#selectPersonnelLocation").on("change", function () {
  lastSelectedLocation = $(this).val();
  $("#selectPersonnelDepartment").val("0");
  lastSelectedDepartment = "0";
});

$("#applyPersonnelFilterButton").click(function (e) {
  e.preventDefault();
  const departmentName = $("#selectPersonnelDepartment option:selected").text();
  const locationName = $("#selectPersonnelLocation option:selected").text();

  $.ajax({
    url: "libs/php/getAll.php",
    type: "GET",
    dataType: "json",
    cache: false,
    success: function (result) {
      let filteredData = result.data.filter((item) => {
        const deptMatches =
          departmentName === "All" ||
          (item.department && item.department === departmentName);
        const locMatches =
          locationName === "All" ||
          (item.location && item.location === locationName);
        return deptMatches && locMatches;
      });

      populateTable(filteredData);
      $("#filterPersonnelModal").modal("hide");
    },
    error: function (xhr, textStatus, error) {
      console.error("Error fetching personnel data:", error);
      $("#personnel-table-body").html(
        '<tr><td colspan="6" class="text-center">Error loading data</td></tr>'
      );
      $("#filterPersonnelModal").modal("hide");
    },
  });
});

function populateTable(data) {
  let tbody = $("#personnel-table-body");
  tbody.empty();
  if (data.length === 0) {
    tbody.append(
      '<tr><td colspan="6" class="text-center">No Data Found</td></tr>'
    );
  } else {
    data.forEach((item) => {
      let row = `<tr>
          <td class="align-middle text-nowrap">${item.firstName}, ${item.lastName}</td>
          <td class="align-middle text-nowrap d-none d-md-table-cell">${item.department}</td>
          <td class="align-middle text-nowrap d-none d-md-table-cell">${item.location}</td>
          <td class="align-middle text-nowrap d-none d-md-table-cell">${item.email}</td>
          <td class="align-middle text-nowrap d-none d-md-table-cell">${item.jobTitle}</td>
          <td class="text-end text-nowrap">
              <button type="button" class="btn btn-primary btn-sm me-1" data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#editPersonnelModal"><i class="fa-solid fa-pencil fa-fw"></i></button>
              <button type="button" class="btn btn-primary btn-sm me-1" data-id="${item.id}" data-bs-toggle="modal" data-bs-target="#deletePersonnelModal"><i class="fa-solid fa-trash fa-fw"></i></button>
          </td>
      </tr>`;
      tbody.append(row);
    });
  }
}

// Personnel

// $("#selectPersonnelDepartment").change(function () {
//     if (this.value > 0) {

//       $("#selectPersonnelLocation").val(0);

//       // apply Filter

//     }
// })

// $("#selectPersonnelLocation").change(function () {
//     if (this.value > 0) {

//       $("#selectPersonnelDepartment").val(0);

//       // apply Filter

//     }
// })

// New Filter
// personnel
$("#personnelBtn").click(function () {
  $("#filterBtn").attr("disabled", false);
});

// department
$("#departmentsBtn").click(function () {
  $("#filterBtn").attr("disabled", true);
});

// location
$("#locationsBtn").click(function () {
  $("#filterBtn").attr("disabled", true);
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
$("#addPersonnelForm").submit(function (event) {
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
});

// ADD DEPARTMENT DATA
$("#addDepartmentForm").submit(function (event) {
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
});

// ADD LOCATION DATA
$("#addLocationForm").submit(function (event) {
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
});

// ============== DELETE DATA FROM PERSONNEL, DEPARTMENT AND LOCATION TABLE  =================

// DELETE PERSONNEL
let personnelFirstName = "";
let personnelLastName = "";

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
        personnelFirstName = $firstName;
        personnelLastName = $lastName;
        $("#employeeName").html(
          "<strong>" + $firstName + " " + $lastName + "</strong>"
        );
        $("#deletePersonnelModal").modal("show");
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
      updateModalMessage(
        `${personnelFirstName} ${personnelLastName} profile deleted successfully`
      );
      $("#deletePersonnelModal").modal("hide");
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#deletePersonnelModal").modal("hide");
      console.error(textStatus, "error");
    },
  });
});

// DELETE DEPARTMENT

$(document).on("click", ".deleteDepartmentBtn", function (e) {
  e.preventDefault();
  // var departmentId = $(e.relatedTarget).attr("data-id"); // Ensure you have a way to set this in your triggering element
  // $("#departmentID").val(departmentId);

  var departmentId = $(this).data("id"); // Use 'this' to refer to the clicked button
  $("#departmentID").val(departmentId);

  $.ajax({
    type: "GET",
    url: "libs/php/checkDepartmentUse.php",
    dataType: "json",
    data: { id: departmentId },
    success: function (result) {
      // $("areYouSureDeleteDepartmentModal").remove();
      // $("cantDeleteDepartmentModal").remove();
      if (result.status.code == "200") {
        var deptName = result.data[0].departmentName;
        var personnelCount = result.data[0].personnelCount;

        if (personnelCount == 0) {
          $("#areYouSureDeptName").text(deptName);
          // $("#cantDeleteDepartmentModal").addClass("d-none");
          // $("#areYouSureDeleteDepartmentModal").removeClass("d-none");
          // $("#del-dept-yes").removeClass("d-none");
          // $("#del-dept-no").removeClass("d-none");
          $("#areYouSureDeleteDepartmentModal").modal("show");
        } else {
          $("#cantDeleteDeptName").text(deptName);
          $("#personnelCount").text(personnelCount);
          // $("#areYouSureDeleteDepartmentModal").addClass("d-none");
          // $("#del-dept-yes").addClass("d-none");
          // $("#del-dept-no").addClass("d-none");
          // $("#cantDeleteDepartmentModal").removeClass("d-none");
          // $("#del-dept-ok").removeClass("d-none");
          $("#cantDeleteDepartmentModal").modal("show");
        }
      } else {
        $("#exampleModal .modal-title").text("Error");
        $("#deptMessage").text("Error retrieving data. Please try again.");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#exampleModal .modal-title").text("Error");
      $("#deptMessage").text("Error retrieving data. Please try again.");
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

$(document).on("click", ".deleteLocationBtn", function (e) {
  e.preventDefault();

  var locationId = $(this).data("id"); // Use 'this' to refer to the clicked button
  $("#LocationID").val(locationId);

  $.ajax({
    type: "GET",
    url: "libs/php/checkLocationUse.php",
    dataType: "json",
    data: { id: locationId },
    success: function (result) {
      if (result.status.code == "200") {
        var locName = result.data[0].locationName;
        var deptCount = result.data[0].departmentCount;

        if (deptCount == 0) {
          $("#areYouSureLocName").text(locName);
          $("#areYouSureDeleteLocationModal").modal("show");
        } else {
          $("#cantDeleteLocName").text(locName);
          $("#deptCount").text(deptCount);
          $("#cantDeleteLocationModal").modal("show");
        }
      } else {
        $("#exampleModal .modal-title").text("Error");
        $("#deptMessage").text("Error retrieving data. Please try again.");
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#exampleModal .modal-title").text("Error");
      $("#deptMessage").text("Error retrieving data. Please try again.");
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
// $("#personnelBtn").click(getAllPersonnels);

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
      id: $(e.relatedTarget).attr("data-id"),
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
    dataType: "json",
    success: function (results) {
      // Update Main HTML Table
      let data = results["data"];

      $("#personnel-table-body").empty();

      let getPersonnelFrag = document.createDocumentFragment();

      data.forEach((item) => {
        // Create a new table row
        const row = document.createElement("tr");

        // Create the name cell
        const nameCell = document.createElement("td");
        nameCell.classList.add("align-middle", "text-nowrap");
        nameCell.textContent = `${item.lastName}, ${item.firstName}`;

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

        getPersonnelFrag.appendChild(row);
      });
      $("#personnel-table-body").append(getPersonnelFrag);
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
    success: function (results) {
      // Update Main HTML Table
      let data = results["data"];
      allDepartment = data;
      // console.log(data);

      $(".department-table-body").html("");
      let getAllDeptFrag = document.createDocumentFragment();

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
        getAllDeptFrag.appendChild(row);
      });
      $("#department-table-body").append(getAllDeptFrag);
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
    success: function (results) {
      let locationData = results["data"];

      $(".location-table-body").html("");
      let getAllLocFrag = document.createDocumentFragment();

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
        deleteLocationButton.classList.add(
          "btn",
          "btn-primary",
          "btn-sm",
          "deleteLocationBtn"
        );
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

        getAllLocFrag.appendChild(locationRow);
      });
      $("#location-table-body").append(getAllLocFrag);
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
