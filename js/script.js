
var port = 8080;
var domain = "http://localhost";
var basePath = "/api";
var debug = true;

function url(path) {
    if (!path.startsWith("/"))
        path = "/" + path;
    return domain + ":" + port + basePath + path;
}

var corsHeaders = {
'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
    'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT'
}

var myHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

var getConf = { method: 'GET', headers: myHeaders, mode: "cors" };
var postConf = { method: 'POST', headers: myHeaders, mode: "cors" };
var putConf = { method: 'PUT', headers: myHeaders, mode: "cors" };
var deleteConf = { method: 'DELETE', headers: myHeaders, mode: "cors" };

var tbody = document.getElementById("tbody");
var personForm = {
    id: document.getElementById("id"),
    firstName: document.getElementById("firstName"),
    lastName: document.getElementById("lastName"),
    email: document.getElementById("email")
}
var personModal = document.getElementById("person-modal");
var personModalTitle = document.getElementById("person-modal-title");
var save = document.getElementById("save");
var add = document.getElementById("add");
var refresh = document.getElementById("refresh");

var persons = [{
    id: 1,
    firstName: "First Name",
    lastName: "Last Name",
    email: "asd@asd.com"
}];

function updateTable() {
    tbody.innerHTML = persons.map(function (p) {
        return "<tr><td>" +
            p.id +
            "</td><td>" +
            p.firstName +
            "</td><td>" +
            p.lastName +
            "</td><td>" +
            p.email +
            "</td><td>" +
            "<div class='btn-group'>" +
            "<button class= 'btn btn-warning btn-sm edit' value=" + p.id + ">edit</button> " +
            "<button class= 'btn btn-danger btn-sm delete' value=" + p.id + ">delete</button>" +
            "</div>" +
            "</td></tr>";
    }).join("\n");
    var del = document.getElementsByClassName("delete");
    var edit = document.getElementsByClassName("edit");
    for (var i = 0; i < del.length; i++) {
        del[i].addEventListener("click", delHandler);
        edit[i].addEventListener("click", editHandler);
    }
}

function refreshHandler() {
    log("refreshHandler on url: " + url("person"));

    var status = false;
    var promise = fetch(url("person/contactinfo"), getConf);

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

function addHandler() {
    personModalTitle.innerText = "Add Person";
    personModalTitle["x-handler"] = "Add Person";
    $('#person-modal').modal('show');
    $('#firstName').focus();
}
add.addEventListener('click', addHandler);

function editHandler(evt) {
    personModalTitle.innerText = "Edit Person";
    personModalTitle["x-handler"] = "Edit Person";
    var p = findPerson(evt.target.value);
    personForm.id.value = p.id;
    personForm.firstName.value = p.firstName;
    personForm.lastName.value = p.lastName;
    personForm.email.value = p.email;
    $('#person-modal').modal('show');
    $('#firstName').focus();
}

function saveHandler(evt) {
    var p = {};
    var conf = postConf;
    if (personModalTitle["x-handler"] === "Edit Person") {
        conf = putConf;
        p.id = personForm.id.value;
    } else if (personModalTitle["x-handler"] !== "Add Person") {
        log("Fail: some how you tried to save the modal without it being opened correctly!");
        return;
    }
    p.firstName = personForm.firstName.value;
    p.lastName = personForm.lastName.value;
    p.email = personForm.email.value;

var json = JSON.stringify(p);
    conf.body = json;
    conf.headers["Content-Length"] = json.length;

    var promise = fetch(url("person"), conf);
    promise.then(function (res) {
        log(res);
        refreshHandler();
        $('#person-modal').modal('hide');
    }).catch(function () {
        personModalTitle.innerText = personModalTitle["x-handler"] + ", failed to save";
        log("Fail: couldn't save");
    });
}
save.addEventListener('click', saveHandler);

$("#person-modal").on('hidden.bs.modal', function (e) {
    personModalTitle["x-handler"] = "";
    personForm.id.value = "";
    personForm.firstName.value = "";
    personForm.lastName.value = "";
    personForm.email.value = "";
});

function delHandler(evt) {
    var id = parseInt(evt.target.value);
    var delpromise = fetch(url("person") + "/" + id, deleteConf);
    delpromise.then(function (response) {
        return response.ok;
    }).then(function (status) {
        if (status) {
            removePerson(id);
            updateTable();
        } else {
            //Display error message and break.... alert("FEJL!!!");
        }
    });
}

function removePerson(id) {
    var i = 0;
    for (; i < persons.length; i++) if (persons[i].id === id) break;
    var person = persons[i];
    persons.splice(i, 1);
    return person;
}

function findPerson(id) {
    return persons.find(function (person) {
        return person.id == id;
    });
}

function log(message) {
    if(debug) console.log(message);
}
