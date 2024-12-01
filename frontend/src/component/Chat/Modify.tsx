import * as React from 'react';
import {useEffect, useState, ChangeEvent, FormEvent} from 'react';
import {Modal, TextField, Button, Typography, Box} from '@mui/material';
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
            console.log('Modify component opened. Perform setup tasks.');
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
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    }

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        console.log(newMessage);
        fetch('http://localhost:3000/message', {
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
            console.log(data);
            setIsOpen(false);
        })
        .catch((error) => {
            console.error('Error during fetch: ' + error);
            alert('Error while editing message');
        })
        // setIsOpen(false);

    }
    return (
            <Modal
                open={isOpen}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Modifier
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <form onSubmit={handleSubmit}>
                            <TextField value={newMessage} 
                                onChange={(event: ChangeEvent<HTMLInputElement>): void => {setNewMessage(event.target.value)}}
                                label="Message" variant="outlined" sx={{width: '80%'}} />
                            <Button type="submit" variant='contained' sx={{width: '80%', mt: 2}}>Modifier</Button>
                        </form>
                    </Typography>
                </Box>
            </Modal>
    )
}
export default Modify;