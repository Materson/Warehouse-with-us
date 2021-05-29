import React, {useState} from 'react';

import Backdrop from '@material-ui/core/Backdrop';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import {DBconfig} from '../../DBconfig';

const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }));

const checkCategoryExist = (categories, newCategory, categoryId="") => {
    const index = categories.findIndex(element => element.name == newCategory && element.id !== categoryId);
    if(index === -1)
        return false;
    else
        return true;
}

export function AddCategoryDialog(props) {
    const classes = useStyles();
    const [categoryName, setCategoryName] = useState("");
    const [nameError, setNameError] = useState(false);
    const [categoryExistError, setCategoryExistError] = useState(false);

    async function addCategory() {
        if(checkCategoryExist(props.categories, categoryName))
        {
            setNameError(false);
            setCategoryExistError(true);
            return false;
        }
        else
        {
            setCategoryExistError(false);
        }

        if(categoryName !== "")
        {
            setNameError(false);
            const params = {
                name: categoryName
            }
            await new Promise(resolve => {
                const request = indexedDB.open(DBconfig.name, DBconfig.version);
                request.onsuccess = function(event) {
                    const db = event.target.result;
                    const reqAdd = db.transaction("categories","readwrite").objectStore("categories").add(params);
                    reqAdd.onsuccess = function (event) {
                        const id = event.target.result;
                        //new id to String
                        const reqDel = db.transaction("categories","readwrite").objectStore("categories").delete(id);
                        reqDel.onsuccess = function(event) {
                            const newparams = {
                                id: id.toString(),
                                name: categoryName
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
                                const newCategories = props.categories;
                                newCategories.push(newparams);
                                props.setCategories(newCategories);
                                setCategoryName("");
                                resolve(true);
                            }
                        }
                    }
                }
            });
            props.setCategoryDialog(false);
        }
        else
        {
            setNameError(true);
        }
    }

    const handleClose = () => {
        props.setCategoryDialog(false);
        setNameError(false);
        setCategoryName("");
        setCategoryExistError(false);
    }
    return(
        <Backdrop className={classes.backdrop} open={props.open}>
            <Dialog
                onClose={() => {
                    handleClose();
                }}
                open={props.open} aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">Dodaj kategorię</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Nazwa kategorii"
                        type="text"
                        fullWidth
                        value={categoryName}
                        onChange={(event) => {
                            setCategoryName(event.target.value);
                            if(event.target.value === "")
                                setNameError(true);
                            else
                                setNameError(false);
                        }}
                        {...(nameError ? {
                            error:true,
                            helperText:"Nazwa nie może być pusta"
                        }:null)}
                        {...(categoryExistError ? {
                            error:true,
                            helperText:"Kategoria o podanej nazwie już istnieje. Podaj inną nazwę"
                        }:null)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => {
                            handleClose();
                        }}
                        color="primary"
                    >
                        Anuluj
                    </Button>
                    <Button onClick={() => addCategory()} color="primary">
                        Dodaj
                    </Button>
                </DialogActions>
            </Dialog>
        </Backdrop>
    );
}

export function EditCategoryDialog(props) {
    const classes = useStyles();
    const [nameError, setNameError] = useState(false);
    const [categoryExistError, setCategoryExistError] = useState(false);

    async function editCategory() {
        if(checkCategoryExist(props.categories, props.categoryName, props.categoryId))
        {
            setNameError(false);
            setCategoryExistError(true);
            return false;
        }
        else
        {
            setCategoryExistError(false);
        }

        if(!nameError)
        {
            setNameError(false);
            const params = {
                id: props.categoryId,
                name: props.categoryName
            }
        
            const request = indexedDB.open(DBconfig.name, DBconfig.version);
            request.onsuccess = function(event) {
                const db = event.target.result;
                // const reqGet = db.transaction("categories").objectStore("categories").get(id);
                // reqGet.onsuccess = function(event) {
                // const data = event.target.result;
                // data.manufacturer = manufacturer;
                // data.model = model;
                // data.price = price;
    
                db.transaction("categories", "readwrite").objectStore("categories").put(params);
                // register operation
                const reqGetParam = db.transaction("categoryOperations").objectStore("categoryOperations").get(params.id);
                reqGetParam.onsuccess = function (event) {
                    const operation = event.target.result;
                    operation.edited = 1;
                    db.transaction("categoryOperations", "readwrite").objectStore("categoryOperations").put(operation);
                }
                const newCategories = props.categories;
                const index = newCategories.findIndex(element => element.id == params.id);
                newCategories[index] = params.name;
                // }
            }
            props.setCategoryDialog(false);
        }
    }

    const handleClose = () => {
        props.setCategoryDialog(false);
        setNameError(false);
        setCategoryExistError(false);
    }

    return(
        <Backdrop className={classes.backdrop} open={props.open}>
            <Dialog
            onClose={() => {
                handleClose();
            }}
            open={props.open} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Edytuj kategorię</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Nazwa kategorii"
                        type="text"
                        fullWidth
                        value={props.categoryName}
                        onChange={(event) => {
                            props.setCategoryName(event.target.value);
                            if(event.target.value === "")
                                setNameError(true);
                            else
                                setNameError(false);
                        }}
                        {...(nameError ? {
                            error:true,
                            helperText:"Nazwa nie może być pusta"
                        }:null)}
                        {...(categoryExistError ? {
                            error:true,
                            helperText:"Kategoria o podanej nazwie już istnieje. Podaj inną nazwę"
                        }:null)}                        
                    />
                </DialogContent>
                <DialogActions>
                <Button
                    onClick={() => {
                        handleClose();
                    }}
                    color="primary">
                    Anuluj
                </Button>
                <Button type="submit" onClick={() => editCategory()} color="primary">
                    Zapisz
                </Button>
                </DialogActions>
            </Dialog>
        </Backdrop>
    );
}

export function DeleteCategoryDialog(props) {
    const classes = useStyles();

    async function deleteCategory() {
        const id = props.categoryId;
        const request = indexedDB.open(DBconfig.name, DBconfig.version);
        
        request.onsuccess = async function(event) {
            const db = event.target.result;

            const defaultCategory = props.categories.find(element => element.name === "-");
            const reqProd =  await db.transaction("products").objectStore("products").openCursor();
            reqProd.onsuccess = async function(event) {
                const cursor = event.target.result;
                if(cursor)
                {
                    if(cursor.value.category === id)
                    {
                        cursor.value.category = defaultCategory.id;
                        db.transaction("products", "readwrite").objectStore("products").put(cursor.value);
                    }
                    cursor.continue();
                }
                else
                {
                    db.transaction("categories", "readwrite").objectStore("categories").delete(id);
                    // register operation
                    const reqGetParam = db.transaction("categoryOperations").objectStore("categoryOperations").get(id);
                    reqGetParam.onsuccess = function (event) {
                        const operation = event.target.result;
                        operation.deleted = 1;
                        operation.added = 0;
                        operation.moved = 0;
                        operation.edited = 0;
                        db.transaction("categoryOperations", "readwrite").objectStore("categoryOperations").put(operation);
                    }
                }
            }
        }
        props.setCategoryDialog(false);
    }

    return(
        <Backdrop className={classes.backdrop} open={props.open}>
            <Dialog onClose={() => props.setCategoryDialog(false)} open={props.open} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Usuń kategorię</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Czy na pewno chcesz usunąć kategorię: {props.categoryName}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button type="submit" onClick={() => deleteCategory()} color="secondary">
                    Tak
                </Button>
                <Button onClick={() => props.setCategoryDialog(false)} color="primary">
                    Nie
                </Button>
                </DialogActions>
            </Dialog>
        </Backdrop>
    );
}