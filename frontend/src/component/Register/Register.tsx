import {useEffect, useState, ChangeEvent, FormEvent} from 'react';
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


function Register() {
    const [user, setUser] = useState<string>('');
    const [open, setOpen] = useState<boolean>(true);

    const handleSubmit = (event: FormEvent): void => {
        event.preventDefault();

        fetch('http://localhost:3000/user', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                },
            body: JSON.stringify({username: user}),
        })
        .then((response) => {
            if (!response.ok){
                throw new Error('HTTP error! Status: ' + response.status);

            }
            return response.json();
        })
        .then((data) => {
            console.log(data);
            localStorage.setItem('currentUser', JSON.stringify(data));
            alert('Bienvenue, ' + data.username)
            setOpen(false);
            // window.location.reload();
        })
        .catch((error) => {
            console.error('Error while fetching data: ', error);
            alert('Error while creating user');
        })
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <div>
            <head>
                <meta name="viewport" content="initial-scale=1, width=device-width" />
            </head>
            <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Entrer votre pseudo
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <form onSubmit={handleSubmit}>
                            <TextField value={user} 
                                onChange={(event: ChangeEvent<HTMLInputElement>): void => {setUser(event.target.value)}}
                                label="Pseudo" variant="outlined" sx={{width: '80%'}} />
                            <Button type="submit" variant='contained' sx={{width: '80%', mt: 2}}>submit</Button>
                        </form>
                    </Typography>
                </Box>
            </Modal>
        </div>
    )
}

export default Register