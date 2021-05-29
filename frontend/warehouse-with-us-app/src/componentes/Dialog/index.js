import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Typography} from '@material-ui/core';

export default function ScrollDialog(props) {
  const [open, setOpen] = React.useState(true);
  const [scroll, setScroll] = React.useState('paper');
  const [conflicts, setConflicts] = React.useState("");
  const [categoryConflicts, setCategoryConflicts] = React.useState("");

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
    if(props.func)
    {
      if(props.func === "sync-successful")
      {
        if(!!localStorage.getItem("conflicts") && localStorage.getItem("conflicts").length > 0) {
          const conf = JSON.parse(localStorage.getItem("conflicts"));
          const information = (
            <div>
              <Typography>W następujących produktach wystąpił konflikt. Nie wydano produktów. Przywrócono poprzednią wartość i zaktualizowano stan.</Typography>
              {conf.map((element, index) => (
                  <Typography>{index + 1}. Producent: {element.manufacturer} Model: {element.model}</Typography>
              ))}
            </div>
          );
          setConflicts(information);
        }
        localStorage.removeItem("conflicts");

        if(!!localStorage.getItem("categoryConflicts") && localStorage.getItem("categoryConflicts").length > 0) {
          const conf = JSON.parse(localStorage.getItem("categoryConflicts"));
          const information = (
            <div>
              <Typography>W następujących produktach nie udało się ustawić żądanej  kategorii. Została do nich przypisana kategoria domyślna. Możliwe, że żądana kategoria została usunięta. Jeśli chcesz przypisać żądaną kategorię, utwórz ją na nowo i przypisz do produktu.</Typography>
              {conf.map((element, index) => (
                  <Typography>{index + 1}. Producent: {element.manufacturer} Model: {element.model}</Typography>
              ))}
            </div>
          );
          setCategoryConflicts(information);
        }
        localStorage.removeItem("categoryConflicts");
      }
    }
    localStorage.removeItem("sync");
    localStorage.removeItem("updated");
  }, [open]);

    

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        {props.func === "sync-error" ? (
            <div>
            <DialogTitle id="scroll-dialog-title">Błąd połączenia z Internetem</DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText
                id="scroll-dialog-description"
                ref={descriptionElementRef}
                tabIndex={-1}
            >
                <Typography>Wystąpił problem z połączeniem z Internetem. Spróbuj ponownie później</Typography>
            </DialogContentText>
            </DialogContent>
        </div>
        ) : null}
        {props.func === "sync-successful" ? (
            (conflicts !== "" || categoryConflicts !== "") ? (
                <div>
                    <DialogTitle id="scroll-dialog-title">Synchronizacja z konfliktami</DialogTitle>
                    <DialogContent dividers={scroll === 'paper'}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                    >
                      {conflicts}
                      {categoryConflicts}
                    </DialogContentText>
                    </DialogContent>
                </div>
            ) : (
                <div>
                    <DialogTitle id="scroll-dialog-title">Synchronizacja pomyślna</DialogTitle>
                    <DialogContent dividers={scroll === 'paper'}>
                    <DialogContentText
                        id="scroll-dialog-description"
                        ref={descriptionElementRef}
                        tabIndex={-1}
                    >
                        Synchronizacja przebiegła pomyślnie
                    </DialogContentText>
                    </DialogContent>
                </div>
            )
        ) : null}

        {props.func === "updated" ? (
            <div>
            <DialogTitle id="scroll-dialog-title">Aktualizacja pomyślna</DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText
                id="scroll-dialog-description"
                ref={descriptionElementRef}
                tabIndex={-1}
            >
                <Typography>Aktualizacja przebiegła pomyślnie</Typography>
            </DialogContentText>
            </DialogContent>
        </div>
        ) : null}
        
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
