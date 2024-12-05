import * as React from 'react'
import {useState, useEffect, ChangeEvent, FormEvent} from 'react';
import Stack from '@mui/material/Stack';
import Item from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { FormControl, Fab, Box, Modal, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

export type User = {
    id: number,
    username: string
}

export type Message = {
    id: number,
    message: string,
    user: User
}

function Chat() {
    const [messages, setMessages] = useState<Array<Message>>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const [toModify, setToModify] = useState<string>('');
    const [msgId, setMsgId] = useState<number>(0);
    const [openRegister, setOpenRegister] = useState<boolean>(true);
    const [username, setUsername] = useState<string>('');
    const [user, setUser] = useState<User|null>(null);


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
        borderColor: '#030303',
        bgcolor: '#36414C',
        color: '#D9D9D9',
        padding: 2,
        borderRadius: 5,
        width: 'fit-content',
        maxWidth: '45%'
    }
    const currentItemStyle = {
        border: 1,
        borderColor: '#030303',
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
    const registerStyle = {
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
    const modifyStyle = {
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


    useEffect(() => {
        fetch(`${process.env.REACT_APP_URL}/message`, {
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
            setMessages(data);
        })
        .catch((error) => {
            console.error('error while fetching data: ' + error);
            // alert('Error while fetching dataaaaAAA');
        })
    }, [messages]);

    const sendMessage = (event: FormEvent): void => {
        event.preventDefault();
        if (user) {
            if (newMessage == '') {
                return;
            }
            fetch(`${process.env.REACT_APP_URL}/message`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({message: newMessage, sender: user?.id})
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

    const handleSubmitRegister = (event: FormEvent): void => {
        event.preventDefault();
        if (username == '') {
            return;
        }

        fetch(`${process.env.REACT_APP_URL}/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                },
            body: JSON.stringify({username: username}),
        })
        .then((response) => {
            if (!response.ok){
                throw new Error('HTTP error! Status: ' + response.status);
            }
            return response.json();
        })
        .then((data) => {
            setUser(data);
            alert('Bienvenue, ' + data.username)
            setOpenRegister(false);
        })
        .catch((error) => {
            console.error('Error while fetching data: ', error);
            alert('Error while creating user');
        })
    }

    const editMessage = (id: number, msg: string) => {
        setToModify(msg);
        setMsgId(id);
        setOpenEdit(true);
    }

    const handleSubmitModify = (event: FormEvent) => {
        event.preventDefault();
        if (toModify == '') {
            return;
        }
        fetch(`${process.env.REACT_APP_URL}/message`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                },
            body: JSON.stringify({messageId: msgId, newMessage: toModify}),
        })
        .then((response) => {
            if (!response.ok){
                throw new Error('HTTP error! Status: ' + response.status);
            }
            return response;
        })
        .then((data) => {
            console.log(data);
            setOpenEdit(false);
        })
        .catch((error) => {
            console.error('Error during fetch: ' + error);
            alert('Error while editing message');
        })
    }
    

    return (
        <Box sx={{background: 'linear-gradient(#C9E2FB, #36699C)', minHeight: '100vh'}}>
            <Modal
                open={openRegister}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={registerStyle}>
                    <Box sx={{display: 'flex', justifyContent: 'center'}}>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{}}>
                            Entrer votre pseudo
                        </Typography>
                    </Box>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <FormControl onSubmit={handleSubmitRegister} sx={{width: '100%'}}>
                            <TextField value={username} 
                                onChange={(event: ChangeEvent<HTMLInputElement>): void => {setUsername(event.target.value)}}
                                label="Pseudo" variant="outlined" sx={{width: '100%'}} />
                            <Button  onClick={handleSubmitRegister} type="submit" variant='contained' sx={{width: '100%', mt: 2}}>submit</Button>
                        </FormControl>
                    </Typography>
                </Box>
            </Modal>
            <Modal
                open={openEdit}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                >
                <Box sx={modifyStyle}>
                    <Box sx={{display: 'flex', justifyContent: 'center'}}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Modifier
                        </Typography>
                    </Box>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <FormControl sx={{width: '100%'}}>
                            <TextField value={toModify} 
                                onChange={(event: ChangeEvent<HTMLInputElement>): void => {setToModify(event.target.value)}}
                                label="Message" variant="outlined" sx={{width: '100%'}} />
                            <Button onClick={handleSubmitModify} type="submit" variant='contained' sx={{width: '100%', mt: 2}}>Modifier</Button>
                        </FormControl>
                    </Typography>
                </Box>
            </Modal>
            <Box sx={{maxHeight: 600, overflowY: 'auto'}}>
                <Stack spacing={2} sx={style}>
                    {messages.map((message, id) => {
                        //let sende
                        return message.user.id == user?.id ? 
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