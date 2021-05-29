import {DBconfig} from '../DBconfig';

function delSync(operationDel, db) {
    return new Promise(resolve => {
        if(operationDel.length > 0)
        {
        const init = {
            method: 'DELETE',
            mode: 'cors',
            headers: {
            'Content-Type': 'application/json',
            'Accept':'*/*',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
            body: JSON.stringify(operationDel)
        }
        console.log("Produkty w init: ");
        console.log(operationDel);
        const HOST = window.location.hostname;
        fetch("https://"+HOST+":8002/category", init)
        .then(res =>
            {
            if(res.ok)
                return res.json();
            else
                throw new Error("Something wrong");
            })
        .then(
            (result) => {
                Promise.all(result.map((element, index) => {
                    console.log(element);
                    console.log(operationDel[index].id);
                    console.log("wszedl del1");
                    const reqDelOp = db.transaction("categoryOperations","readwrite").objectStore("categoryOperations").delete(operationDel[index].id);
                    // resolve(true);
                    // reqDelOp.onsuccess = function (event) {
                    //   // console.log(productAdd);
                    //   // removeItemOnce(productAdd,productDel[index]);
                    //   // console.log(productAdd);
                    //   // console.log("wszedl del2");
                    //   // operationAdd[index].id = element.id;
                    //   // operationAdd[index].added = 0;
                    //   // const reqAdd = db.transaction("products", "readwrite").objectStore("products").add(element);
                    //   // reqAdd.onsuccess = function(event) {
                    //   //   db.transaction("operations","readwrite").objectStore("operations").add(operationAdd[index]);
                    //   // }
                    // }
                }));
                resolve(true);
            },
            (error) => {
                console.log("blad delete");
                console.log(error);
                localStorage.setItem("sync", "sync-error");
                resolve(false);
            }
            )
        }
        else resolve(true);
    });
}

function addSync(categoriesAdd, operationAdd, db) {
    return new Promise ( resolve => {
        if(categoriesAdd.length > 0)
        {
        const init = {
            method: 'POST',
            mode: 'cors',
            headers: {
            'Content-Type': 'application/json',
            'Accept':'*/*',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
            body: JSON.stringify(categoriesAdd)
        }
        console.log("Produkty w init: ");
        console.log(categoriesAdd);
        const HOST = window.location.hostname;
        fetch("https://"+HOST+":8002/category", init)
        .then(res =>
            {
            if(res.ok)
                return res.json();
            else
                throw new Error("Something wrong");
            })
        .then(
            (result) => {
                console.log("wszedl fetch");
                console.log(result);
                Promise.all(result.map((element, index) => {
                    console.log(element);
                    console.log(operationAdd[index].id);
                    const reqDel = db.transaction("categories", "readwrite").objectStore("categories").delete(operationAdd[index].id);
                    reqDel.onsuccess = function(event) {
                        console.log("wszedl del1");
                        const reqDelOp = db.transaction("categoryOperations","readwrite").objectStore("categoryOperations").delete(operationAdd[index].id);
                        reqDelOp.onsuccess = function (event) {
                            console.log("wszedl del2");
                            const newCateg = {...categoriesAdd[index], id:element.id}
                            const reqAdd = db.transaction("categories", "readwrite").objectStore("categories").add(newCateg);
                            reqAdd.onsuccess = function(event) {
                                const oldId = operationAdd[index].id;
                                operationAdd[index].id = element.id;
                                operationAdd[index].added = 0;
                                operationAdd[index].edited = 0;
                                db.transaction("categoryOperations","readwrite").objectStore("categoryOperations").add(operationAdd[index]);

                                const getProd = db.transaction("products").objectStore("products").getAll();
                                getProd.onsuccess = function(event) {
                                    const products = event.target.result;
                                    const prodWithCategory = products.filter(prod => prod.category === oldId);
                                    prodWithCategory.map(prod => {
                                        prod.category = element.id;
                                        db.transaction("products", "readwrite").objectStore("products").put(prod);
                                    });
                                }
                                // resolve(true);
                            }
                        }
                    }
                }));
                resolve(true);
            },
            (error) => {
                console.log("blad add");
                console.log(error);
                localStorage.setItem("sync", "sync-error");
                resolve(false);
            }
            )
        }
        else resolve(true);
    });
}

function editSync(categoryEdit, operationEdit, db) {
    return new Promise(resolve => {
        if(categoryEdit.length > 0)
        {
        const init = {
            method: 'PUT',
            mode: 'cors',
            headers: {
            'Content-Type': 'application/json',
            'Accept':'*/*',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
            },
            body: JSON.stringify(categoryEdit)
        }
        console.log("Produkty w init: ");
        console.log(categoryEdit);
        const HOST = window.location.hostname;
        fetch("https://"+HOST+":8002/category", init)
        .then(res =>
            {
            if(res.ok)
                return res.json();
            else
                throw new Error("Something wrong");
            })
        .then(
            (result) => {
                console.log("wszedl fetch");
                console.log(result);
                Promise.all(result.map((element, index) => {
                    console.log(element);
                    operationEdit[index].edited = 0;
                    db.transaction("categoryOperations", "readwrite").objectStore("categoryOperations").put(operationEdit[index]);
                    // resolve(true);
                }));
                resolve(true);
            },
            (error) => {
                console.log("blad edit");
                console.log(error);
                localStorage.setItem("sync", "sync-error");
                resolve(false);
            }
            )
        }
        else resolve(true);
    });
}

// moveSync(products, productMove, operationMove, db) {
// return new Promise (resolve => {
//     const devid = deviceID();
//     if(productMove.length > 0)
//     {
//     const init = {
//         method: 'PUT',
//         mode: 'cors',
//         headers: {
//         'Content-Type': 'application/json',
//         'Accept':'*/*',
//         'Authorization': 'Bearer ' + localStorage.getItem("token")
//         },
//         body: JSON.stringify(productMove)
//     }
//     console.log("Produkty w init: ");
//     const HOST = window.location.hostname;
//     fetch("https://"+HOST+":8002/product/move", init)
//     .then(res =>
//         {
//         if(res.ok)
//             return res.json();
//         else
//             throw new Error("Something wrong");
//         })
//     .then(
//         (result) => {
//             console.log("wszedl fetch");
//             console.log(result);
//             let conflicts = [];
//             Promise.all(result.map((element, index) => {
//             if(typeof(element.id) !== 'undefined') {
//                 operationMove[index].moved = 0;
//                 db.transaction("operations", "readwrite").objectStore("operations").put(operationMove[index]);
//             }
//             else if(element.message === "Too many to reduce")
//             {
//                 console.log(element.message);
//                 const productindex = products.findIndex(prod => prod.id === productMove[index].id)
//                 const quantityindex = products[productindex].quantity.findIndex(prod => prod.devid === devid);
//                 if(quantityindex !== -1)
//                 {
//                 products[productindex].quantity[quantityindex].delta = element.quantity;
//                 const reqPutProduct = db.transaction("products", "readwrite").objectStore("products").put(products[productindex]);
//                 reqPutProduct.onsuccess = function(event) {
//                     operationMove[index].moved = 0;
//                     db.transaction("operations", "readwrite").objectStore("operations").put(operationMove[index]);
//                     const quantity = quantitySum(products[productindex].quantity);
//                     conflicts.push({...products[productindex], quantity:quantity});
//                     if(index === result.length - 1)
//                     {
//                     localStorage.setItem("conflicts", JSON.stringify(conflicts));
//                     console.log(conflicts);
//                     }
//                 }
//                 }
                
//             }
//             }));
//             resolve(true);
//         },
//         (error) => {
//             console.log("blad move");
//             console.log(error);
//             localStorage.setItem("sync", "sync-error");
//             resolve(false);
//         }
//         )  
//     }
//     else resolve(true);
// });
// }

function getSync(categories, db) {
    return new Promise(resolve => {
        const toDelete = categories.map(element => {
            return {id:element.id, delete:true};
        });
        const init = {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Accept':'*/*',
            'Authorization': 'Bearer ' + localStorage.getItem("token")
        }
        }
        console.log("Produkty w init: ");
        const HOST = window.location.hostname;
        fetch("https://"+HOST+":8002/category", init)
        .then(res => res.json())
        // .then(res =>
        //   {
        //     if(res.ok)
        //       return res.json();
        //     else
        //       throw new Error("Something wrong");
        //   })
        .then(
            (result) => {
                // console.log("wszedl fetch");
                // console.log(result);
                Promise.all(result.map((element, index) => {
                    if(toDelete.length > 0) {
                        const categIndex = toDelete.findIndex(elem => elem.id === element.id);
                        if(categIndex !== -1) {
                            toDelete[categIndex].delete = false;
                        }
                    }

                    const categ = categories.find(categ => categ.id === element.id);
                    if(categ === undefined)
                    {
                        console.log("undefined");
                        const reqAdd = db.transaction("categories","readwrite").objectStore("categories").add(element);
                        reqAdd.onsuccess = function (event) {
                            const operation = {
                                id: element.id,
                                added: 0,
                                edited: 0,
                                deleted: 0
                            }
                            db.transaction("categoryOperations","readwrite").objectStore("categoryOperations").add(operation);
                        }
                    }
                    else
                    {
                        db.transaction("categories","readwrite").objectStore("categories").put(element);
                    }
                }));

                if(toDelete.length > 0) {
                    Promise.all(toDelete.map(element => {
                        if(element.delete)
                        {
                            // alert("To delete: "+ element.id);
                            const reqDel = db.transaction("categories","readwrite").objectStore("categories").delete(element.id);
                            reqDel.onsuccess = function() {
                                db.transaction("categoryOperations","readwrite").objectStore("categoryOperations").delete(element.id);
                            }
                        }
                    }));
                }
                resolve(true);
            },
            (error) => {
                console.log("blad get");
                console.log(error);
                localStorage.setItem("sync", "sync-error");
                resolve(false);
            }
        )
    });
}

export async function syncCategories(db) {
    return new Promise (resolve => {
        // const request = indexedDB.open(DBconfig.name, DBconfig.version);
        // request.onerror = async function(event) {
        //   console.log("Somewhere error");
        // }
        // request.onsuccess = function(event) {
        //   const db = event.target.result;
          const reqAll = db.transaction("categories").objectStore("categories").getAll();
          reqAll.onsuccess =  function(event) {
    
            const categories = event.target.result;
            let categoryAdd = [];
            let categoryOperationAdd = [];
            let categoryOperationDel = [];
            let categoryEdit = [];
            let categoryOperationEdit = [];
            const reqOpe = db.transaction("categoryOperations").objectStore("categoryOperations").openCursor();
            reqOpe.onsuccess = async function(event) {
              const cursor = event.target.result;
              if(cursor)
              {
                const category = categories.find(element => cursor.value.id === element.id);
                if(cursor.value.added)
                {
                  const {id, ...obj} = category;
                  categoryAdd.push(obj);
                  categoryOperationAdd.push(cursor.value);
                }
                if(cursor.value.deleted)
                {
                  categoryOperationDel.push({id: cursor.value.id});
                }
                if(!cursor.value.added && cursor.value.edited)
                {
                  categoryEdit.push(category);
                  categoryOperationEdit.push(cursor.value);
                }
                cursor.continue();
              }
              else
              {
                // Del operation
                await delSync(categoryOperationDel, db);
                console.log("sync del categories");
    
                // Add operation
                await addSync(categoryAdd, categoryOperationAdd, db);
                console.log("sync add categories");

                // Edit operation
                await editSync(categoryEdit, categoryOperationEdit, db);
                console.log("sync edit categories");

                // Get categories
                await getSync(categories, db);
                console.log("sync get categories");

                resolve(true);
              }
            }
          }
        // }
    });
}