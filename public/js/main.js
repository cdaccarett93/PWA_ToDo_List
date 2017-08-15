$(document).ready(function () {

    //Open Database
    var request = indexedDB.open('todo', 1);
    var requestDone = indexedDB.open('done', 1);

    request.onupgradeneeded = function (e) {
        var db = e.target.result;

        if(!db.objectStoreNames.contains('todo')) {
            var os = db.createObjectStore('todo', {keyPath: "id", autoIncrement:true});
            os.createIndex('name', 'name', {unique:false});
        }
    };
    //Success
    request.onsuccess = function (e) {
        console.log('Success: Opened DB..');
        db = e.target.result;
        //show todos
        showTodos();
    };

    //Error
    request.onerror = function (e) {
        console.log('Error: Could Not Open Database');
    };


    requestDone.onupgradeneeded = function (e) {
        var dbdone = e.target.result;

        if(!dbdone.objectStoreNames.contains('done')) {
            var os = dbdone.createObjectStore('done', {keyPath: "id", autoIncrement:true});
            os.createIndex('name', 'name', {unique:false});
        }
    };
    //Success
    requestDone.onsuccess = function (e) {
        console.log('Success: Opened Done DB..');
        dbdone = e.target.result;
        //show Done
        showDone();
    };

    //Error
    requestDone.onerror = function (e) {
        console.log('Error: Could Not Open Database');
    };

});


//Add toDoItem
function addTodo() {
    var name = $('#item').val();

    var trasaction = db.transaction('todo', "readwrite");
    //Ask for ObjectStore
    var store = trasaction.objectStore('todo');

    //Define Todo
    var todo = {
        name: name
    };
    var request = store.add(todo);

    //Success
    request.onsuccess = function (e) {
        // window.location.href = "index.html";
        $('#item').val('');
        showTodos();
    };
    //Error
    request.onerror = function (e) {
        console.log("Error: ", e.target.error.name);
    }
}

//Show Todos
function showTodos(e) {
    var transaction = db.transaction('todo', "readonly");
    //Ask for ObjectStore
    var store = transaction.objectStore('todo');
    var index = store.index('name');

    var removeIcon = '<i class="fa fa-trash-o" aria-hidden="true"></i>';
    var completeIcon = '<i class="fa fa-check-square-o" id="todobox" aria-hidden="true"></i>';
    var output = '';
    index.openCursor().onsuccess = function (e) {
        var cursor = e.target.result;
        if(cursor) {
            output += '<li>' + cursor.value.name + '<div class="buttons">' + '<button name="delete" class="remove" onclick="deleteItem(' + cursor.value.id + ')">' + removeIcon + '</button>' + '<button name="complete" class="complete" onclick="fulfillTodo(' + cursor.value.id + ')">' + completeIcon + '</button>' + '</li>';
            cursor.continue();
        }
        $('#todo').html(output);
    }
}

//Delete TodoItem
function deleteItem(id) {
    var transaction = db.transaction('todo', "readwrite");
    //Ask for ObjectStore
    var store = transaction.objectStore('todo');
    var request = store.delete(id);

    //Success
    request.onsuccess = function () {
        console.log('todo deleted');
        showTodos();
        showDone();
    };

    //Error
    request.onerror = function (e) {
        console.log('Error', e.target.error.name);
    };
}


//Show Done
function showDone(e) {
    var transaction = dbdone.transaction('done', "readonly");
    //Ask for ObjectStore
    var store = transaction.objectStore('done');
    var index = store.index('name');

    var removeIcon = '<i class="fa fa-trash-o" aria-hidden="true"></i>';
    var output = '';
    index.openCursor().onsuccess = function (e) {
        var cursor = e.target.result;
        if(cursor) {
            output += '<li>' + cursor.value.name + '<div class="buttons">' + '<button name="delete" class="remove" onclick="deleteDoneItem(' + cursor.value.id + ')">' + removeIcon + '</button>' + '</li>';
            cursor.continue();
        }
        $('#completed').html(output);
    }
}


function fulfillTodo(id) {
    var tx = db.transaction('todo');
    var todoOS = tx.objectStore('todo');
    var toDo = todoOS.get(id);

    toDo.onsuccess = function () {
        processTodo(toDo);
    }
}

function processTodo(todo) {
        var tx = dbdone.transaction('done', 'readwrite');
        var store = tx.objectStore('done');
        deleteItem(todo.result.id);
        var name = todo.result.name;
        console.log(name);
        var item = ({
            name: name
        });
        store.add(item);
        return tx.complete;
}

//Delete TodoItem
function deleteDoneItem(id) {
    var transaction = dbdone.transaction('done', "readwrite");
    //Ask for ObjectStore
    var store = transaction.objectStore('done');
    var request = store.delete(id);

    //Success
    request.onsuccess = function () {
        console.log('todo deleted');
        showTodos();
        showDone();
    };

    //Error
    request.onerror = function (e) {
        console.log('Error', e.target.error.name);
    };
}