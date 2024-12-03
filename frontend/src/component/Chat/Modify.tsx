import * as React from 'react';
import {useEffect, useState, ChangeEvent, FormEvent} from 'react';
import {Modal, TextField, Button, Typography, Box, FormControl} from '@mui/material';

export type Props = {
    open: boolean,
    message: string,
    messageId: number
}

function Modify(props: Props){
    const [isOpen, setIsOpen] = useState<boolean>(props.open);
    const [newMessage, setNewMessage] = useState<string>(props.message);
    useEffect(() => {
        if (props.open) {
            setIsOpen(true);
            setNewMessage(props.message);
        }
    }, [props.open])

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
    }

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        if (newMessage == '') {
            return;
        }
        fetch(`${process.env.REACT_APP_URL}/message`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                },
            body: JSON.stringify({messageId: props.messageId, newMessage: newMessage}),
        })
        .then((response) => {
            if (!response.ok){
                throw new Error('HTTP error! Status: ' + response.status);
            }
            return response;
        })
        .then((data) => {
            setIsOpen(false);
        })
        .catch((error) => {
            console.error('Error during fetch: ' + error);
            alert('Error while editing message');
        })
    }
    return (
            <Modal
                open={isOpen}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={style}>
                    <Box sx={{display: 'flex', justifyContent: 'center'}}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Modifier
                        </Typography>
                    </Box>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <FormControl sx={{width: '100%'}}>
                            <TextField value={newMessage} 
                                onChange={(event: ChangeEvent<HTMLInputElement>): void => {setNewMessage(event.target.value)}}
                                label="Message" variant="outlined" sx={{width: '100%'}} />
                            <Button onClick={handleSubmit} type="submit" variant='contained' sx={{width: '100%', mt: 2}}>Modifier</Button>
                        </FormControl>
                    </Typography>
                </Box>
            </Modal>
    )
}
export default Modify;