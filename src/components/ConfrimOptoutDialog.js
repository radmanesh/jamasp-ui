import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function ConfirmOptoutDialog(handleDialogOutput) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (selectValue) => {
    console.log("handleClose", selectValue);
    if(selectValue!==undefined && selectValue!==null && selectValue!==false){
      // TODO: callback to opt out
      //handleDialogOutput(selectValue);
    }
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button variant="outlined" onClick={handleClickOpen}>
        Opt out of Research
      </Button>
      <Dialog
        open={open}
        onClose={handleClose(undefined)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to opt out of research?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to opt out of research? This will remove your data from the study and you will no longer be able to participate. 
            <br />
            You can NOT undo this action.
            <br />
            If you are sure you want to opt out, click Agree.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose(false)}>Disagree</Button>
          <Button onClick={handleClose(true)} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
