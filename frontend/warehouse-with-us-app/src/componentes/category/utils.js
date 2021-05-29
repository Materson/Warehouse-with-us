import {DBconfig} from '../../DBconfig';

export function compareCategories(a,b) {
    if(a.name == "-") return 1;
    if(b.name == "-") return -1;
    if(a.name.toLowerCase() < b.name.toLowerCase())
        return -1;
    else if(a.name.toLowerCase() > b.name.toLowerCase())
        return 1;
    return 0;
}

export function checkDefaultCategory() {
    const request = indexedDB.open(DBconfig.name, DBconfig.version);
    let offlineDB = [];
    request.onsuccess = function(event) {
        const db = event.target.result;
        const reqGet = db.transaction("categories").objectStore("categories").getAll();
        reqGet.onsuccess = function(event) {
            const offlineDB = event.target.result;
            const result = offlineDB.find(element => element.name === "-");
            if(result === undefined)
            {
                const defaultCategory = {name:"-"};
                const addCateg = db.transaction("categories","readwrite").objectStore("categories").add(defaultCategory);
                addCateg.onsuccess = function(event) {
                    const id = event.target.result;
                    //new id to String
                    const reqDel = db.transaction("categories","readwrite").objectStore("categories").delete(id);
                    reqDel.onsuccess = function(event) {
                        const newparams = {
                            id: id.toString(),
                            name: "-"
                        }
                        const newreqAdd = db.transaction("categories","readwrite").objectStore("categories").add(newparams);
                        newreqAdd.onsuccess = function (event) {
                            // register operation
                            const operation = {
                                id: id.toString(),
                                added: 1,
                                edited: 0,
                                deleted: 0
                            }
                            db.transaction("categoryOperations","readwrite").objectStore("categoryOperations").add(operation);                                         
                        }
                    }
                }
            }
        }
    }
}