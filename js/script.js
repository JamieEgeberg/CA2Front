
var port = 8080;
var domain = "http://localhost";
var basePath = "/api";

function url(path) {
    if (!path.startsWith("/"))
        path = "/" + path;
    return domain + ":" + port + basePath + path;
}

var headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

var getConf = { method: 'GET', header: headers, mode: "cors" };
var postConf = { method: 'POST', header: headers, mode: "cors" };
var putConf = { method: 'PUT', header: headers, mode: "cors" };
var deleteConf = { method: 'DELETE', header: headers, mode: "cors" };

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
}

function refreshHandler() {
    console.log("refreshHandler on url: " + url("person"));

    var promise = fetch(url("person"), getConf);

    var status = false;
    promise.then(function (response) {
        status = response.ok;
        return response.json();
    }).then(function (json) {
        if (status) {
            persons = json;
            updateTable();
        } else {
            // display err
        }
    });
}
refresh.addEventListener('click', refreshHandler);

function delHandler(evt) {
    var delbody = parseInt(evt.target.value);
    var delpromise = fetch(url("person") + "/" + delbody, confDel);
    delpromise.then(function (response) {
        return response.ok;
    }).then(function (status) {
        if (status) {
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
}
