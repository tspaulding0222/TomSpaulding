/**
 * Created by tom.spaulding on 4/9/15.
 * This file runs all the DB functions
 */

var db = new PouchDB('checkbook');
var remoteCouch = 'http://tspaulding:Dude8445@ts.iriscouch.com/checkbook';

//Sync to couchDB
function sync(){
    syncSuccess();
    var opts = {live: true};
    db.replicate.to(remoteCouch, opts, syncError);
    db.replicate.from(remoteCouch, opts, syncError);
}

//Add or Create new Item in DB
function addTransaction(location, amount){
    return new Promise(function(resolve, reject){
        var transaction = {
            _id: new Date().toISOString(),
            location: location,
            amount: amount
        };
        db.put(transaction, function callback(err, result){
            if(!err){
                var obj = {};
                obj.doc = transaction;
                resolve(obj);
                pouchSuccess();
                sync();
            }
            else{
                reject();
                pouchError();
            }
        });
    });
}

//Get all items from the db
function getAllItems(){
    return new Promise(function(resolve, reject){
        db.allDocs({include_docs: true, descending: true}, function(err, doc){
            console.log();
            resolve(doc.rows);
        });
    });
}

//DELETE EVERYTHING FROM THE DB
function deleteDatabase(){
    return new Promise(function(resolve, reject){
        db.destroy().then(function(){
            db = new PouchDB('checkbook');
            resolve();
            pouchSuccess();
            sync();
        });
    });
}

//Get single item from db based on id
function getItem(_id){
    return new Promise(function(resolve, reject){
        db.get(_id).then(function(obj){
            resolve(obj);
        });
    });
}

//Delete item from db based on id
function deleteItem(_id){
    return new Promise(function(resolve, reject){
        getItem(_id).then(function(item){
            db.remove(item).then(function(){
                resolve();
                pouchSuccess();
                sync();
            });
        })
    });

}

//Submit the current total to db
function submitTotal(total){
    return new Promise(function(resolve, reject){
        db.get("total").then(function(doc){
            var transaction = {
                _id: "total",
                _rev: doc._rev,
                location: "",
                amount: total
            };
            db.put(transaction, function callback(err, result){
                if(!err){
                    var obj = {};
                    obj.doc = transaction;
                    resolve(obj);
                    pouchSuccess();
                    sync();
                }
                else{
                    reject();
                    pouchError();
                }
            });
        }).catch(function(){
            return submitNewTotal(total);
        });
    });

    //create a new total if it doesn't exist
    function submitNewTotal(total){
        return new Promise(function(resolve, reject) {
            var transaction = {
                _id: "total",
                location: "",
                amount: total
            };
            db.put(transaction, function callback(err, result){
                if(!err){
                    var obj = {};
                    obj.doc = transaction;
                    resolve();
                    pouchSuccess();
                    sync();
                }
                else{
                    reject();
                    pouchError();
                }
            });
        });
    }
}

