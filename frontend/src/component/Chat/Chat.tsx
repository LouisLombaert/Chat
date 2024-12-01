import * as React from 'react'
import {useState, useEffect, ChangeEvent, FormEvent} from 'react';
import Stack from '@mui/material/Stack';
import Item from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { FormControl } from '@mui/material';

function Chat() {
    const [pending, setPending] = useState<boolean>(false);
    const [messages, setMessages] = useState<Array<string>>([]);
    const [newMessage, setNewMessage] = useState<string>('');
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
    const formStyle = {
        position: 'absolute',
        bottom: '5%',
        right: '10%',
        display: 'flex',
        flexDirection: 'row'
    }

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
            let messagesList: Array<string> = [];
            for (let message of data){
                messagesList.push(message.message);
            }
            setMessages(messagesList);
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
        let user: string|null = localStorage.getItem('currentUser');
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
                setMessages([...messages, data.message]);
                setNewMessage('');
            })
            .catch((error) => {
                console.error('Error while fetching data: ', error);
                alert('Error while sending message');
            })
        }
    }
    

    return (
        <div>
            <Stack spacing={2} sx={style}>
                {messages.map((message, id) => (
                    <Item key={id} sx={itemStyle}>{message}</Item>
                ))}
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