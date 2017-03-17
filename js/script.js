
var headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

var getConf = {method: 'GET', header: headers};
var postConf = {method: 'POST', header: headers};
var putConf = {method: 'PUT', header: headers};
var deleteConf = {method: 'DELETE', header: headers};

var tbody = document.getElementById("tbody");
var refresh = document.getElementById("refresh");

var persons = [{
        id: 1,
        email: "asd@asd.com",
        firstName: "First Name",
        lastName: "Last Name"
    }];

function updateTable() {
    tbody.innerHTML = persons.map(function (p) {
        return "<tr><td>" +
                p.id +
                "</td><td>" +
                p.email +
                "</td><td>" +
                p.firstName +
                "</td><td>" +
                p.lastName +
                "</td><td>" +
                "<button class= 'btn btn-warning edit' value=" + p.id + ">edit</button> " +
                "<button class= 'btn btn-danger delete' value=" + p.id + ">delete</button>" +
                "</td></tr>";
    }).join("\n");
};
refresh.addEventListener("click", updateTable);
