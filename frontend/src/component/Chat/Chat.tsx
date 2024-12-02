import * as React from 'react'
import {useState, useEffect, ChangeEvent, FormEvent} from 'react';
import Stack from '@mui/material/Stack';
import Item from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { FormControl, Fab } from '@mui/material';
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

    console.log(localStorage.getItem('currentUser'))
    // tomodify ?
    const style = {
        display: 'flex',
        justifyContent: 'center',
        my: 10,
        mx: 20,
    }
    const itemStyle = {
        border: 1,
        borderColor: '#030303', // to change
        padding: 2,
        borderRadius: 3
    }
    const currentItemStyle = {
        border: 1,
        borderColor: '#030303', // to change
        bgcolor: '#3935a6',
        padding: 2,
        borderRadius: 3
    }
    const formStyle = {
        position: 'absolute',
        bottom: '5%',
        right: '10%',
        display: 'flex',
        flexDirection: 'row'
    }

    const user: string|null = localStorage.getItem('currentUser');

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
            console.log(data);
            //toModify, state messages should be an array of Message object => Define a message type
            // let messagesList: Array<string> = [];
            setMessages(data);
            /*for (let message of data){
                console.log(message);
                messagesList.push(message.message);
            }
            setMessages(messagesList);*/
        })
        .catch((error) => {
            console.error('error while fetching data: ' + error);
            alert('Error while fetching data');
        })
    }, []);

    const sendMessage = (event: FormEvent): void => {
        event.preventDefault();
        console.log(newMessage);
        // console.log(localStorage.getItem('currentUser'))
        //let user: string|null = localStorage.getItem('currentUser');
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
                console.log(data);
                let messageObject: Message = {id: data.id, message: data.message, user: data.user.id};
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
        console.log('ok');
        setToModify(msg);
        setMsgId(id);
        setOpenEdit(true);
    }
    

    return (
        <div>
            <Modify open={openEdit} message={toModify} messageId={msgId} />
            <Stack spacing={2} sx={style}>
                {messages.map((message, id) => {
                    let sender = user ? JSON.parse(user).id : ''
                    console.log('sender: ' + sender);
                    console.log('user: ' +  message.user.id);
                    // console.log(sender.id == message.user.id)
                    return message.user.id == sender ? 
                    (
                        <Item key={id} sx={currentItemStyle}>
                            {message.message}
                            <Fab size="small" color="primary" aria-label="add" onClick={() => editMessage(message.id, message.message)}>
                                <EditIcon  />
                            </Fab>
                        </Item>
                        
                    ) : (
                        <Item key={id} sx={itemStyle}>{message.message}</Item>
                    )
                })}
            </Stack>
            <FormControl sx={formStyle}>
                <TextField value={newMessage} onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                    setNewMessage(event.target.value)}}
                    label="Nouveau message" variant="outlined" />
                <Button onClick={sendMessage} type="submit" variant='contained'>Envoyer</Button>
            </FormControl>
        </div>
    )
}
export default Chat