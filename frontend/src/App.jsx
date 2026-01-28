import './App.css'
import React from 'react'
import {
  Snackbar, IconButton, Alert, Typography, Button, Stack, ListItem, Box,
  List, Drawer
} from '@mui/material'
import { hideNotification } from './redux/notificationSlice'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from './redux/loginSlice';
import pages from './common/pages';
import { useNavigate, Routes, Route } from 'react-router-dom'
import FloatingChat from './components/FloatingChat'

function App() {
  const dispatch = useDispatch()
  const loginState = useSelector((state) => state.login)
  const notification = useSelector((state) => state.notification)
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const navigate = useNavigate();

  return (
    <div>
      <Snackbar
        open={notification.open}
        autoHideDuration={notification.autoHideDuration}
        onClose={() => { dispatch(hideNotification()) }}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          variant='filled'
          severity={notification.type}
          action={
            <IconButton size="small" aria-label="close" color="inherit" onClick={() => { dispatch(hideNotification()) }}>
              x
            </IconButton>
          }
        >{notification.message}</Alert>
      </Snackbar>
  
      <Drawer open={drawerOpen} onClose={() => { setDrawerOpen(false); }}>
        <Box>
          <Typography fontSize={20} fontWeight="bold" p={2}>Menu</Typography>
          <List>
            {
              pages.map((page) => (
                page.hiddenTo.includes(loginState.user.role || 'guest')
                  ? null
                  : (<ListItem key={page.path} style={{ cursor: 'pointer'}} >
                    <Button
                      onClick={()=>{setDrawerOpen(false); navigate(page.path);}}
                    >{page.name}</Button>
                  </ListItem>)
              ))
            }
          </List>
        </Box>
      </Drawer>

      <Stack direction={'row'} justifyContent={'space-between'}>
        <Button onClick={()=>{setDrawerOpen(true)}} variant='contained' color='info' size='small'>Menu</Button>
        <Typography fontSize={20} fontWeight="bold"
        >Parking Management System</Typography>
        {loginState.loggedIn ?
          <Typography>{loginState.user.name} ({loginState.user.role})
            <Button onClick={() => { dispatch(logout()); navigate('/login'); }}
            >Logout</Button>
          </Typography>
          : <Typography>Not logged in</Typography>
        }
      </Stack>
      <Routes>
        {
          pages.map((page) => (
            <Route key={page.path} path={page.path} element={page.element} />
          ))
        }
        <Route path='*' element={<Typography>404 Not Found</Typography>} />
      </Routes>
      <FloatingChat />
    </div>
  )
}

export default App
