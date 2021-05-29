import React, {useState, useEffect} from 'react';

import {styled} from '@material-ui/core/styles'
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import {Typography} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

import {compareCategories} from './utils';
import "./categoryList.css"
import {DBconfig} from '../../DBconfig';
import {AddCategoryDialog, EditCategoryDialog, DeleteCategoryDialog} from './CategoryDialogs';

const FloatFab = styled(Fab) ({
    position: 'fixed',
    bottom: '30px',
    right: '30px',
})

function CategoriesTable(props) {
    const history = props.history;
    const [editCategoryDialog, setEditCategoryDialog] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [deleteCategoryDialog, setDeleteCategoryDialog] = useState(false);
    const [categoryId, setCategoryId] = useState("");
    const handleRowClick = (id) => {
    // history.push('/category/'+id);
    }
      
    return (
        <div>
            <EditCategoryDialog
                open={editCategoryDialog}
                setCategoryDialog={setEditCategoryDialog}
                categories={props.categories}
                setCategories={props.setCategories}
                categoryName={categoryName}
                setCategoryName={setCategoryName}
                categoryId={categoryId}
            />

            <DeleteCategoryDialog
                open={deleteCategoryDialog}
                setCategoryDialog={setDeleteCategoryDialog}
                categories={props.categories}
                setCategories={props.setCategories}
                categoryName={categoryName}
                categoryId={categoryId}
            />

            <TableContainer component={Paper}>
                <Table aria-label="products table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Edytuj</TableCell>
                        <TableCell>Usuń</TableCell>
                        <TableCell>Nazwa</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {props.categories.sort(compareCategories).map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>
                                {row.name !== "-" ? (
                                    <IconButton
                                        aria-label="edit"
                                        aria-controls="category-menu"
                                        aria-haspopup="false"
                                        color="inherit"
                                        onClick={() => {
                                            setEditCategoryDialog(true);
                                            setCategoryName(row.name);
                                            setCategoryId(row.id);
                                        }}
                                    >
                                        <EditIcon/>
                                    </IconButton>

                                ):null}
                            </TableCell>
                            <TableCell>
                                {row.name !== "-" ? (
                                    <IconButton
                                        aria-label="remove"
                                        aria-controls="category-menu"
                                        aria-haspopup="false"
                                        color="inherit"
                                        onClick={() => {
                                            setDeleteCategoryDialog(true);
                                            setCategoryId(row.id);
                                            setCategoryName(row.name);
                                        }}
                                    >
                                        <DeleteIcon/>
                                    </IconButton>
                                ):null}
                            </TableCell>
                            <TableCell>
                                <Typography>
                                {row.name}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

function CategoryList(props) {
    const [isLoaded, setIsLoaded] = useState(true);
    const [addCategoryDialog, setAddCategoryDialog] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const request = indexedDB.open(DBconfig.name, DBconfig.version);
        let offlineDB = [];
        request.onsuccess = function(event) {
            const db = event.target.result;
            const reqGet = db.transaction("categories").objectStore("categories").getAll();
            reqGet.onsuccess = function(event) {
                event.target.result.map((row) => {
                    offlineDB.push({...row});
                });
                setCategories(offlineDB);
                setIsLoaded(true);
            }
        }
    });

    return (
        <div>
            <FloatFab size="medium" color="primary" aria-label="add" onClick={() => setAddCategoryDialog(true)}>
                <AddIcon/>
            </FloatFab>
            <AddCategoryDialog
                open={addCategoryDialog}
                setCategoryDialog={setAddCategoryDialog}
                setCategories={setCategories}
                categories={categories}
            />

            {isLoaded ? (
                <CategoriesTable categories={categories} setCategories={setCategories} history={props.history}/>
            ) : (
                <Typography>Ładowanie...</Typography>
            )
            }    
            {/* <Typography>{JSON.stringify(this.state.products)}</Typography>
            <Typography>{JSON.stringify(this.state.operations)}</Typography> */}
        </div>
    );
}

export default CategoryList;