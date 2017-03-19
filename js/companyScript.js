
var port = 8080;
var domain = "https://ca2.skaarup.io";
var basePath = "/api";
var debug = true;

// url that can vary
function url(path) {
    if (!path.startsWith("/"))
        path = "/" + path;
    return domain + basePath + path;
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
var modal = $("#company-modal"); // JQuery required for Bootstrap modals
var modalTitle = document.getElementById("company-modal-title");
// simplifies inputfields by grouping them together
var modalForm = {
    id: document.getElementById("id"),
    name: document.getElementById("name"),
    description: document.getElementById("description"),
    email: document.getElementById("email"),
    cvr: document.getElementById("cvr"),
    noOfEmployees: document.getElementById("noOfEmployees"),
    marketValue: document.getElementById("marketValue")
};
var save = document.getElementById("save"); // Save Changes button
var add = document.getElementById("add"); // '+' button
var refresh = document.getElementById("refresh"); // '↻' button

// have a placeholding company which is overridden
var companys = [{
    id: 0,
    name: "placeholder",
    description: "placeholder",
    email: "placeholder@placeholder.com",
	cvr: "9999999",
	noOfEmployees: 99,
	marketValue: 9999999
}];

// Updates the tbody of table with rows
function updateTable() {
    tbody.innerHTML = companys.map(function (c) {
        return "<tr><td>" +
            c.id +
            "</td><td>" +
            c.name +
            "</td><td>" +
            c.email +
            "</td><td>" +
            c.description +
			"</td><td>" +
            c.cvr +
			"</td><td>" +
            c.noOfEmployees +
			"</td><td>" +
            c.marketValue +
            "</td><td>" +
            "<div class='btn-group'>" +
            "<button class= 'btn btn-warning btn-sm edit' value=" + c.id + ">edit</button> " +
            "<button class= 'btn btn-danger btn-sm delete' value=" + c.id + ">delete</button>" +
            "</div>" +
            "</td></tr>";
    }).join("\n");
    var del = document.getElementsByClassName("delete");
    var edit = document.getElementsByClassName("edit");
    /* 
    this should be a safe for loop
    since the amount of delete and edit 
    buttons should be the same 
    */
    for (var i = 0; i < del.length; i++) {
        del[i].addEventListener("click", delHandler);
        edit[i].addEventListener("click", editHandler);
    }
}

// '↻' button
function refreshHandler() {
    log("refreshHandler on url: " + url("company"));

    var status = false;
    var promise = fetch(url("company/contactinfo"), getConf);

    promise.then(function (response) {
        status = response.ok;
        return response.json();
    }).then(function (json) {
        if (status) {
            companys = json;
            updateTable();
        } else {
            // display err
        }
    });
}
refresh.addEventListener('click', refreshHandler);

// '+' button
function addHandler() {
    modalTitle.innerText = "Add company";
    modalTitle["x-handler"] = "Add company";
    $('#company-modal').modal('show');
    $('#name').focus();
}
add.addEventListener('click', addHandler);

// Edit buttons
function editHandler(evt) {
    modalTitle.innerText = "Edit company";
    modalTitle["x-handler"] = "Edit company";
    var p = findcompany(evt.target.value);
    modalForm.id.value = p.id;
    modalForm.name.value = p.name;
    modalForm.description.value = p.description;
    modalForm.email.value = p.email;	
    modalForm.cvr.value = p.cvr;	
    modalForm.noOfEmployees.value = p.noOfEmployees;	
    modalForm.marketValue.value = p.marketValue;
    $('#company-modal').modal('show');
    $('#name').focus();
}

	

// When modal is saved.
function saveHandler(evt) {
    var p = {};
    var conf = postConf;
    if (modalTitle["x-handler"] === "Edit company") {
        conf = putConf;
        p.id = modalForm.id.value;
    } else if (modalTitle["x-handler"] !== "Add company") {
        log("Fail: some how you tried to save the modal without it being opened correctly!");
        return;
    }
    p.name = modalForm.name.value;
    p.description = modalForm.description.value;
    p.email = modalForm.email.value;
    p.cvr = modalForm.cvr.value;
    p.noOfEmployees = modalForm.noOfEmployees.value;
    p.marketValue = modalForm.marketValue.value;

    var json = JSON.stringify(p);
    conf.body = json;
    conf.headers["Content-Length"] = json.length;

    var promise = fetch(url("company"), conf);
    promise.then(function (res) {
        log(res);
        refreshHandler();
        $('#company-modal').modal('hide');
    }).catch(function () {
        modalTitle.innerText = modalTitle["x-handler"] + ", failed to save";
        log("Fail: couldn't save");
    });
}
save.addEventListener('click', saveHandler);

// Bootstrap related, this is done when the modal is closed.
$("#company-modal").on('hidden.bs.modal', function (e) {
    modalTitle["x-handler"] = "";
    modalForm.id.value = "";
    modalForm.name.value = "";
    modalForm.description.value = "";
    modalForm.email.value = "";
	modalForm.cvr.value = "";	
    modalForm.noOfEmployees.value = "";	
    modalForm.marketValue.value = "";
});

// Delete Buttons
function delHandler(evt) {
    var id = parseInt(evt.target.value);
    var delpromise = fetch(url("company") + "/" + id, deleteConf);
    delpromise.then(function (response) {
        return response.ok;
    }).then(function (status) {
        if (status) {
            removecompany(id);
            updateTable();
        } else {
            //Display error message and break.... alert("FEJL!!!");
        }
    });
}

// Remove company in companys
function removecompany(id) {
    var i = 0;
    for (; i < companys.length; i++) if (companys[i].id === id) break;
    var company = companys[i];
    companys.splice(i, 1);
    return company;
}

// Find company by id in companys
function findcompany(id) {
    return companys.find(function (company) {
        return company.id == id;
    });
}

// Log to console if debug var in the top of document is set to true.
function log(message) {
    if (debug) console.log(message);
}

// Initial load of companys
refreshHandler();
