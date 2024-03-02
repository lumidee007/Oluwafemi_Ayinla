$(document).ready(function () {
  getAllUsers();
  getAllDepartment();
  getAllLocations();
});

$("#searchInp").on("keyup", function () {
  // your code
});

$("#refreshBtn").click(function () {
  if ($("#personnelBtn").hasClass("active")) {
    // Refresh personnel table
  } else {
    if ($("#departmentsBtn").hasClass("active")) {
      // Refresh department table
    } else {
      // Refresh location table
    }
  }
});

$("#filterBtn").click(function () {
  // Open a modal of your own design that allows the user to apply a filter to the personnel table on either department or location
});

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

  $.ajax({
    url: "libs/php/insertPersonnel.php",
    type: "POST",
    data: personnelFormData,
    success: function (result) {
      $("#addPersonnelModal").modal("hide");
      $("#firstName").val("");
      $("#lastName").val("");
      $("#jobTitle").val("");
      $("#emailAddress").val("");
      $("#department").val("");

      if (result.status.code === 200) {
        $("#successModal").modal("show");
      } else {
        if (result.status.code === 400) {
          $("#ErrorModal").modal("show");
        } else {
          $("#warningModal").modal("show");
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#addPersonnelModal").modal("hide");
    },
  });
}

// ADD DEPARTMENT DATA
$("#addDepartmentForm").submit(addDepartmentData);

function addDepartmentData(event) {
  event.preventDefault();
  let name = $("#addDepartmentName").val();
  let locationID = $("#addDepartmentLocation").val();

  let departmentFormData = {
    name,
    locationID,
  };

  $.ajax({
    url: "libs/php/insertDepartment.php",
    type: "POST",
    data: departmentFormData,
    success: function (result) {
      $("#addDepartmentModal").modal("hide");
      $("#addDepartmentName").val("");
      $("#addDepartmentLocation").val("");

      if (result.status.code === 200) {
        $("#successModal").modal("show");
      } else {
        if (result.status.code === 400) {
          $("#ErrorModal").modal("show");
        } else {
          $("#warningModal").modal("show");
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#addPersonnelModal").modal("hide");
    },
  });
}

// ADD LOCATION DATA
$("#addLocationForm").submit(addLocationData);

function addLocationData(event) {
  event.preventDefault();
  let name = $("#addLocationName").val();

  let locationFormData = {
    name,
  };

  $.ajax({
    url: "libs/php/insertLocation.php",
    type: "POST",
    data: locationFormData,
    success: function (result) {
      $("#addLocationModal").modal("hide");
      $("#addLocationName").val("");

      if (result.status.code === 200) {
        $("#successModal").modal("show");
      } else {
        if (result.status.code === 400) {
          $("#ErrorModal").modal("show");
        } else {
          $("#warningModal").modal("show");
        }
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      $("#addPersonnelModal").modal("hide");
    },
  });
}

// ============== GET ALL PERSONNEL, DEPARTMENT, LOCATION DATA  =================
// refresh personnel table
$("#personnelBtn").click(() => getAllUsers);

// refresh department table
$("#departmentsBtn").click(() => getAllDepartment);

// refresh location table
$("#locationsBtn").click(() => getAllLocations);

// EDIT Personnel, Department and Location by ID's
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
        $("#editDepartmentNameID").val(result.data.department[0].id);
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

$("#editPersonnelForm").on("submit", function (e) {
  // Executes when the form button with type="submit" is clicked
  // stop the default browser behaviour

  e.preventDefault();

  // AJAX call to save form data
});

//===================================== GET ALL PERSONNEL========================================================
function getAllUsers() {
  // Generate all user data for the table
  $.ajax({
    type: "GET",
    url: "libs/php/getAll.php",
    // data: {},
    dataType: "json",
    async: false,
    success: function (results) {
      // Update Main HTML Table
      let data = results["data"];

      // console.log(data);
      const table = document.getElementById("personnel-table-body");

      // Loop through the data and append each item to a new row in the table
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
        deleteButton.classList.add(
          "btn",
          "btn-primary",
          "btn-sm",
          "deletePersonnelBtn"
        );
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
function getAllDepartment() {
  // Generate all user data for the table
  $.ajax({
    type: "GET",
    url: "libs/php/getAllDepartments.php",
    // data: {},
    dataType: "json",
    async: false,
    success: function (results) {
      // Update Main HTML Table
      let data = results["data"];

      // console.log(data);
      const table = document.getElementById("department-table-body");

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
    async: false,
    success: function (results) {
      // Update Main HTML Table
      let locationData = results["data"];
      const locationTable = document.getElementById("location-table-body");
      // console.log(data);
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
