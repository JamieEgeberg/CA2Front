

var port = 8080;
var domain = "http://localhost";
var basePath = "/api";

function url(path) {
    if (!path.startsWith("/"))
        path = "/" + path;
    return domain + ":" + port + basePath + path;
};

var headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

var getConf = { method: 'GET', header: headers };
var postConf = { method: 'POST', header: headers };
var putConf = { method: 'PUT', header: headers };
var deleteConf = { method: 'DELETE', header: headers };

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
            // Buttons?
            "</td></tr>"
    }).join("\n");
};
