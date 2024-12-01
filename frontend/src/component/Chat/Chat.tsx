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
    const getMessages = () => setMessages(['message1', 'message2']);
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

    const sendMessage = (event: FormEvent): void => {
        event.preventDefault();
        console.log(newMessage);
        // console.log(localStorage.getItem('currentUser'))
    }
    useEffect(() => {
        getMessages();
    }, []);

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