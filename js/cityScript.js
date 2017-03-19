
var port = 8080;
var domain = "http://localhost";
var basePath = "/api";
var debug = true;

// url that can vary
function url(path) {
    if (!path.startsWith("/"))
        path = "/" + path;
    return domain + ":" + port + basePath + path;
}

// not used
var corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
    'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT'
}

// headers used
var myHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
};

var getConf = { method: 'GET', headers: myHeaders, mode: "cors" };
var postConf = { method: 'POST', headers: myHeaders, mode: "cors" };
var putConf = { method: 'PUT', headers: myHeaders, mode: "cors" };
var deleteConf = { method: 'DELETE', headers: myHeaders, mode: "cors" };

var tbody = document.getElementById("tbody"); // table body
var modal = $("#modal"); // JQuery required for Bootstrap modals
var modalTitle = document.getElementById("modal-title");
// simplifies inputfields by grouping them together
var modalForm = {
    id: document.getElementById("id"),
    zipCode: document.getElementById("zipCode"),
    name: document.getElementById("name")
};
var save = document.getElementById("save"); // Save Changes button
var add = document.getElementById("add"); // '+' button
var refresh = document.getElementById("refresh"); // '↻' button

// have a placeholding person which is overridden
var cities = [{
    id: 0,
    zipCode: "placeholder",
    name: "placeholder"
}];

// Updates the tbody of table with rows
function updateTable() {
    tbody.innerHTML = cities.map(function (p) {
        return "<tr><td>" +
            p.id +
            "</td><td>" +
            p.zipCode +
            "</td><td>" +
            p.name +
            "</td><td>" +
            /*"<div class='btn-group'>" +
            "<button class= 'btn btn-warning btn-sm edit' value=" + p.id + ">edit</button> " +
            "<button class= 'btn btn-danger btn-sm delete' value=" + p.id + ">delete</button>" +
            "</div>" +*/
            "</td></tr>";
    }).join("\n");
    /*var del = document.getElementsByClassName("delete");
    var edit = document.getElementsByClassName("edit");*/
    /* 
    this should be a safe for loop
    since the amount of delete and edit 
    buttons should be the same 
    */
    /*for (var i = 0; i < del.length; i++) {
        del[i].addEventListener("click", delHandler);
        edit[i].addEventListener("click", editHandler);
    }*/
}

// '↻' button
function refreshHandler() {
    log("refreshHandler on url: " + url("city"));

    var status = false;
    var promise = fetch(url("city"), getConf);

    promise.then(function (response) {
        status = response.ok;
        return response.json();
    }).then(function (json) {
        if (status) {
            cities = json;
            updateTable();
        } else {
            // display err
        }
    });
}
refresh.addEventListener('click', refreshHandler);

// '+' button
function addHandler() {
    modalTitle.innerText = "Add City";
    modalTitle["x-handler"] = "Add City";
    $('#modal').modal('show');
}
/*add.addEventListener('click', addHandler);*/

// Edit buttons
function editHandler(evt) {
    modalTitle.innerText = "Edit City";
    modalTitle["x-handler"] = "Edit City";
    var p = find(evt.target.value);
    modalForm.id.value = p.id;
    modalForm.zipCode.value = p.zipCode;
    modalForm.name.value = p.name;
    $('#modal').modal('show');
}

// When modal is saved.
function saveHandler(evt) {
    var p = {};
    var conf = postConf;
    if (modalTitle["x-handler"] === "Edit City") {
        conf = putConf;
        p.id = modalForm.id.value;
    } else if (modalTitle["x-handler"] !== "Add City") {
        log("Fail: some how you tried to save the modal without it being opened correctly!");
        return;
    }
    p.zipCode = modalForm.zipCode.value;
    p.name = modalForm.name.value;

    var json = JSON.stringify(p);
    conf.body = json;
    conf.headers["Content-Length"] = json.length;

    var promise = fetch(url("city"), conf);
    promise.then(function (res) {
        log(res);
        refreshHandler();
        $('#modal').modal('hide');
    }).catch(function () {
        modalTitle.innerText = modalTitle["x-handler"] + ", failed to save";
        log("Fail: couldn't save");
    });
}
save.addEventListener('click', saveHandler);

// Bootstrap related, this is done when the modal is closed.
$("#modal").on('hidden.bs.modal', function (e) {
    modalTitle["x-handler"] = "";
    modalForm.id.value = "";
    modalForm.zipCode.value = "";
    modalForm.name.value = "";
});

// Delete Buttons
function delHandler(evt) {
    var id = parseInt(evt.target.value);
    var delpromise = fetch(url("city") + "/" + id, deleteConf);
    delpromise.then(function (response) {
        return response.ok;
    }).then(function (status) {
        if (status) {
            remove(id);
            updateTable();
        } else {
            //Display error message and break.... alert("FEJL!!!");
        }
    });
}

// Remove person in persons
function remove(id) {
    var i = 0;
    for (; i < cities.length; i++) if (cities[i].id === id) break;
    var obj = cities[i];
    cities.splice(i, 1);
    return obj;
}

// Find person by id in persons
function find(id) {
    return cities.find(function (obj) {
        return obj.id == id;
    });
}

// Log to console if debug var in the top of document is set to true.
function log(message) {
    if (debug) console.log(message);
}

// Initial load of persons
refreshHandler();
