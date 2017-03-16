

var tbody = document.getElementById("tbody");
var refresh = document.getElementById("refresh");

var persons = [];

function updateTable() {
    tbody.innerHTML = persons.map(function (p) {
        return "<tr><td>"+
        p.id +
        "</td><td>"+
        p.email +
        "</td><td>"+
        p.firstName +
        "</td><td>"+
        p.lastName +
        "</td><td>"+
        // Buttons?
        "</td></tr>"
    }).join("\n");
}












