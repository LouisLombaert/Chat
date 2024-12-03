import {useEffect, useState, ChangeEvent, FormEvent} from 'react';
import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import {Typography, FormControl} from '@mui/material';


function Register() {
    const [user, setUser] = useState<string>('');
    const [open, setOpen] = useState<boolean>(true);

    const handleSubmit = (event: FormEvent): void => {
        event.preventDefault();
        if (user == '') {
            return;
        }

        fetch(`${process.env.REACT_APP_URL}/user`, {
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
            localStorage.setItem('currentUser', JSON.stringify(data));
            alert('Bienvenue, ' + data.username)
            setOpen(false);
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
        bgcolor: '#D9D9D9',
        boxShadow: 24,
        p: 5,
        borderRadius: 5,
        justifyContent: 'center'
    };

    return (
        <Box>
            <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={style}>
                    <Box sx={{display: 'flex', justifyContent: 'center'}}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{}}>
                            Entrer votre pseudo
                        </Typography>
                    </Box>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <FormControl onSubmit={handleSubmit} sx={{width: '100%'}}>
                            <TextField value={user} 
                                onChange={(event: ChangeEvent<HTMLInputElement>): void => {setUser(event.target.value)}}
                                label="Pseudo" variant="outlined" sx={{width: '100%'}} />
                            <Button  onClick={handleSubmit} type="submit" variant='contained' sx={{width: '100%', mt: 2}}>submit</Button>
                        </FormControl>
                    </Typography>
                </Box>
            </Modal>
        </Box>
    )
}

export default Register