//Typical document.ready function
$(document).ready(function(){
    //If the remote couch exists. Then begin syncing
    if(remoteCouch){
        sync();
    }

    createTable();
    initializeCheckbook();

    //Update button event listener
    $("#updateCurrentTotalButton").click(updateCheckbook);

    //event listener for the add to table button
    $("#containerButton").click(function(){
        var location = $("#locationTextInput").val();
        var amount = $("#amountTextInput").val();
        addTransaction(location, amount).then(function(transaction){
            addNewRow(transaction);
            updateCheckbook();
        });
    });

    //Event Listener for the Delete all buttons
    $("#deleteAll").click(function(){
        deleteDatabase().then(function(){
            document.getElementById("tableContainer-js").innerHTML = "";
            $("input").val("");
        });
    });
});

//Creates the table that shows all the existing transactions
function createTable(){
    //Grab element from the dom
    var table = document.getElementById("tableContainer-js");

    //Get all the items and add them to the table
    getAllItems().then(function(rows){
        rows.forEach(function(row){
            //Ignore the total row in db
            if(row.doc._id != "total"){
                var domRow = createNewRow(row);
                table.appendChild(domRow);
            }
        });
    });
}

//Adds a new row to the bootstrap table
function addNewRow(transaction){
    var table = document.getElementById("tableContainer-js");
    var rowDiv = createNewRow(transaction);
    table.insertBefore(rowDiv, table.firstChild);
}

//Creates a new row based off the form functions
function createNewRow(obj){
    if(obj.error){
        //Throw some type of notif explaining a bad add
    }
    else {
        //Create the Row
        var rowDiv = document.createElement("div");
        rowDiv.id = obj.doc._id;
        $(rowDiv).addClass("row");

        //Create the location column
        var locCol = createColumnDiv(obj.doc.location);
        rowDiv.appendChild(locCol);

        //Create the amount column
        var amountCol = createColumnDiv(obj.doc.amount);
        rowDiv.appendChild(amountCol);

        //Create the delete column
        var deleteCol = createColumnDiv(null);
        var delButton = document.createElement("button");
        delButton.setAttribute("_id", obj.doc._id);
        delButton.addEventListener("click", deleteRow);
        delButton.className = "rowDelete-js";
        deleteCol.appendChild(delButton);
        rowDiv.appendChild(deleteCol);

        return rowDiv;
    }

    //Creates the table column for the rowDiv
    function createColumnDiv(text){
        var columnDiv = document.createElement("div");
        $(columnDiv).addClass("col-xs-4 col-sm-3");
        columnDiv.innerText = text;
        return columnDiv;
    }

    //Runs the db delete then removes row form the dom
    function deleteRow(){
        var _id = this.getAttribute("_id");
        deleteItem(_id).then(function(){
            $(document.getElementById(_id)).detach();
            calculateAvailable();
        });
    }
}

function initializeCheckbook(){
    getItem("total").then(function(obj){
        document.getElementById("currentTotal").value = obj.amount;
        calculateAvailable();
    });
}

function updateCheckbook(){
    var total = document.getElementById("currentTotal").value;
    submitTotal(total).then(function(){
        calculateAvailable();
    });
}

function calculateAvailable(){
    var currentTotal = document.getElementById("currentTotal").value;
    getAllItems().then(function(rows){
        rows.forEach(function(row){
            //ignore the total row
            if(row.doc._id != "total"){
                currentTotal = currentTotal - row.doc.amount;
            }
        });
        $(document.getElementById("currentAvailable")).val(currentTotal);
    });
}

var syncDom = document.getElementById("sync-wrapper");
var pouchDom = document.getElementById("db-wrapper");

function syncError(){
    syncDom.innerHTML = "Sync Error";
    window.setTimeout(function(){
        syncDom.innerHTML = "";
    }, 1000);
}

function syncSuccess(){
    syncDom.innerHTML = "Sync Success";
    window.setTimeout(function(){
        syncDom.innerHTML = "";
    }, 1000);
}

function pouchSuccess(){
    pouchDom.innerHTML = "Saved to Checkbook";
    window.setTimeout(function(){
        pouchDom.innerHTML = "";
    }, 1000);
}

function pouchError(){
    pouchDom.innerHTML = "Checkbook Error";
    window.setTimeout(function(){
        pouchDom.innerHTML = "";
    }, 1000);
}





