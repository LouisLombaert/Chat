import * as React from 'react'
import {useState, useEffect, ChangeEvent, FormEvent} from 'react';
import Stack from '@mui/material/Stack';
import Item from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { FormControl, Fab, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Modify from './Modify';
// import Register from '../Register/Register';

export type User = {
    id: number,
}

export type Message = {
    id: number,
    message: string,
    user: User
}

function Chat() {
    const [pending, setPending] = useState<boolean>(false);
    const [messages, setMessages] = useState<Array<Message>>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [toModify, setToModify] = useState<string>('');
    const [msgId, setMsgId] = useState<number>(0);


    const inputStyle = {
        width: 300,
        background: '#C9E2FB',
        borderRadius: 2
    }
    const style = {
        display: 'flex',
        justifyContent: 'center',
        my: 12,
        mx: 37,
        maxHeight: '70%',
    }
    const itemStyle = {
        border: 1,
        borderColor: '#030303', // to change
        bgcolor: '#36414C',
        color: '#D9D9D9',
        padding: 2,
        borderRadius: 5,
        width: 'fit-content',
        maxWidth: '45%'
    }
    const currentItemStyle = {
        border: 1,
        borderColor: '#030303', // to change
        bgcolor: '#2479CF',
        padding: 2,
        borderRadius: 5,
        width: 'fit-content',
        maxWidth: '45%',
        alignSelf: 'flex-end',
        color: '#D9D9D9'
    }
    const formStyle = {
        position: 'absolute',
        bottom: '5%',
        right: '10%',
        display: 'flex',
        flexDirection: 'row',
    }

    let user: string|null = localStorage.getItem('currentUser');

    useEffect(() => {
        fetch('http://localhost:3000/message', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('HTTP error! Status: ' + response.status);
            }
            return response.json();
        })
        .then((data) => {
            //console.log(data);
            setMessages(data);
        })
        .catch((error) => {
            console.error('error while fetching data: ' + error);
            alert('Error while fetching data');
        })
    }, []);

    const sendMessage = (event: FormEvent): void => {
        event.preventDefault();
        console.log(newMessage);
        user = localStorage.getItem('currentUser');
        if (user) {
            let sender = JSON.parse(user);
            console.log(sender);
            fetch('http://localhost:3000/message', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({message: newMessage, sender: sender?.id})
            })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('HTTP error! Status: ' + response.status);
                }
                return response.json();
            })
            .then((data) => {
                let messageObject: Message = {id: data.id, message: data.message, user: data.user};
                setMessages([...messages, messageObject]);
                setNewMessage('');
            })
            .catch((error) => {
                console.error('Error while fetching data: ', error);
                alert('Error while sending message');
            })
        }
    }

    const editMessage = (id: number, msg: string) => {
        setToModify(msg);
        setMsgId(id);
        setOpenEdit(true);
    }
    

    return (
        <Box sx={{background: 'linear-gradient(#C9E2FB, #36699C)', minHeight: '100vh'}}>
            <Modify open={openEdit} message={toModify} messageId={msgId} />
            <Box sx={{maxHeight: 600, overflowY: 'auto'}}>
                <Stack spacing={2} sx={style}>
                    {messages.map((message, id) => {
                        let sender = user ? JSON.parse(user).id : ''
                        return message.user.id == sender ? 
                        (
                            <Box component="section" sx={{alignSelf: 'flex-end', width: '45%'}}>
                                <Item key={id} sx={currentItemStyle}>
                                    {message.message}
                                </Item>
                                <Fab size="small" color="primary" aria-label="add" sx={{mt: 0.2}} onClick={() => editMessage(message.id, message.message)}>
                                    <EditIcon  />
                                </Fab>
                            </Box>
                            
                            
                        ) : (
                            <Item key={id} sx={itemStyle}>{message.message}</Item>
                        )
                    })}
                </Stack>
            </Box>
            <FormControl sx={formStyle}>
                <TextField value={newMessage} sx={inputStyle} onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                    setNewMessage(event.target.value)}}
                    label="Nouveau message" variant="filled" />
                <Button onClick={sendMessage} type="submit" variant='contained' sx={{ml: 1, bgcolor: '#0C7DEF'}}>Envoyer</Button>
            </FormControl>
        </Box>
    )
}
export default Chat