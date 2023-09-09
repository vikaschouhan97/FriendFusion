import MuiAlert, { AlertProps } from '@mui/material/Alert';
import React, { useState } from 'react';
import { Snackbar } from '@mui/material';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
  ) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

const SnackBarComponent = ({ description, type, isOpen }: any) => {
    const [open, setOpen] = useState(isOpen);
  
    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      setOpen(false);
    };
return (
  <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
    <Alert onClose={handleClose} severity={type} sx={{ width: "100%" }}>
      {description}
    </Alert>
  </Snackbar>
)
};

export default SnackBarComponent;
