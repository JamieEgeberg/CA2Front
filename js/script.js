
var port = 8080;
var domain = "http://localhost";
var basePath = "/api";

function url(path) {
    if (!path.startsWith("/"))
        path = "/" + path;
    return domain + ":" + port + basePath + path;
}
;

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
    var del = document.getElementsByClassName("delete");
    var edit = document.getElementsByClassName("edit");
    for (var i = 0; i < del.length; i++) {
        del[i].addEventListener("click", delHandler);
        //edit[i].addEventListener("click", editHandler);
    }
};
refresh.addEventListener('click', updateTable);

function delHandler(evt) {
    var delbody = parseInt(evt.target.value);
    var delpromise = fetch(url("person") + "/" + delbody, deleteConf);
    delpromise.then(function (response) {
        return response.statusCode();
    }).then(function (status) {
        if (status != 200) {
            //Display error message and break.... alert("FEJL!!!");
        } else {
            for (var i = 0; i < persons.length; i++) {
                if (persons[i].id === delbody) {
                    persons.splice(i, 1);
                    break;
                }
            }
            updateTable();
        }
    });
};
