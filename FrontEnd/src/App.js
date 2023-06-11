import './App.css';
import React, { useEffect, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  Button,
  Stack,
  useMediaQuery,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  Switch
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  MenuRounded,
  Cancel,
  TrackChanges,
  CrisisAlert,
  CameraRounded,
  Settings,
  ArrowBack,
  Battery0Bar,
  Battery1Bar,
  Battery2Bar,
  Battery3Bar,
  Battery4Bar,
  Battery5Bar,
  Battery6Bar,
  BatteryFull,
  SignalWifiStatusbarNull,
  Wifi1Bar,
  Wifi2Bar,
  Wifi,
  ArrowUpward,
  ArrowDownward,
  DarkMode,
  LightMode
} from '@mui/icons-material';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';

function App() {

  const storedTheme = localStorage.getItem('theme');
  const [currentTheme, setCurrentTheme] = useState(storedTheme || 'light');

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const handleToggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
  };

  const theme = createTheme({
    palette: {
      mode: currentTheme // Set the default mode to 'light'
    },
  });

  const AppWrapper = styled('div')({
    backgroundColor: theme.palette.mode === 'dark' ? '#222222' : '',
    display: "block",
    minHeight: "100vh"
  });

  const handleIgnore = () => {
    // Send API request to server
    axios.post('http://localhost:8000/drones/land', { id: selectedDrone.id })
      .then((response) => {
        console.log('Land request sent successfully:', response.data);
      })
      .catch((error) => {
        console.error('Failed to send land request:', error);
      });
  };

  const handleKeepTracking = () => {
    // Send API request to server
    axios.post('http://localhost:8000/drones/take_off', { id: 1 })
      .then((response) => {
        console.log('Take off request sent successfully:', response.data);
      })
      .catch((error) => {
        console.error('Failed to send keep take off request:', error);
      });
  };

  const isPortrait = useMediaQuery('(orientation: portrait)');

  const [topBarVisible, setTopBarVisible] = useState(true);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = (droneId) => {
    if(droneId > 0){
      const selected = connectedDrones.find((drone) => drone.id === droneId);
      setSelectedDrone(selected);
    };
    setAnchorEl(null);
  };

  const [showSettings, setShowSettings] = useState(false); // State variable for settings window visibility

  const handleSettingsOpen = () => {
    setShowSettings(true);
  };

  const handleSettingsClose = () => {
    setShowSettings(false);
  };

  const [selectedDrone, setSelectedDrone] = useState({
    id: 1,
    name: '',
    ipAddress: '',
    alert: false,
    batteryStatus: 0,
    connectionStatus: '',
  });

  var [connectedDrones, setConnectedDrones] = useState([]);

  useEffect(() => {
    const fetchDrones = async () => {
      try {
        const response = await axios.get('http://localhost:8000/drones');
        console.log(response);
        const connectedDrones = response.data;
        const updatedConnectedDrones = connectedDrones.map((drone) => ({
          id: drone.id,
          name: drone.name,
          ipAddress: drone.ipAddress,
          alert: drone.alert,
          batteryStatus: drone.batteryStatus,
          connectionStatus: drone.connectionStatus,
        }));
        setConnectedDrones(updatedConnectedDrones);
  
        const updatedSelectedDrone = connectedDrones.find((drone) => drone.id === selectedDrone.id);
        setSelectedDrone(updatedSelectedDrone);
      } catch (error) {
        console.error('Failed to fetch drones:', error);
      }
    };

    const intervalId = setInterval(fetchDrones, 5000); // Fetch status every 5 seconds
    return () => clearInterval(intervalId); // Clean up the interval when component unmounts
  }, [selectedDrone.id]);

  useEffect(() => {
    localStorage.setItem('theme', currentTheme);
    if (prefersDarkMode) {
      theme.palette.mode = 'dark'; // Set the theme mode to 'dark' if the user prefers dark mode
    } else {
      theme.palette.mode = 'light'; // Set the theme mode to 'light' if the user prefers light mode
    }
  }, [prefersDarkMode, currentTheme, theme.palette]);

  const getStatusIcon = (status, isBattery) => {
    const statusMappings = {
      battery: [
        { range: [0, 5], icon: <Battery0Bar fontSize="small" /> },
        { range: [6, 15], icon: <Battery1Bar fontSize="small" /> },
        { range: [16, 30], icon: <Battery2Bar fontSize="small" /> },
        { range: [31, 45], icon: <Battery3Bar fontSize="small" /> },
        { range: [46, 60], icon: <Battery4Bar fontSize="small" /> },
        { range: [61, 75], icon: <Battery5Bar fontSize="small" /> },
        { range: [76, 90], icon: <Battery6Bar fontSize="small" /> },
        { range: [91, 100], icon: <BatteryFull fontSize="small" /> },
      ],
      connection: [
        { range: [0, 5], icon: <SignalWifiStatusbarNull fontSize="small" /> },
        { range: [4, 35], icon: <Wifi1Bar fontSize="small" /> },
        { range: [36, 70], icon: <Wifi2Bar fontSize="small" /> },
        { range: [71, 100], icon: <Wifi fontSize="small" /> },
      ],
    };
  
    const mappings = statusMappings[isBattery ? 'battery' : 'connection'];
  
    for (const mapping of mappings) {
      const [start, end] = mapping.range;
      if (status >= start && status <= end) {
        return mapping.icon;
      }
    }
  
    return null; // Return null if no matching range is found
  };

  const SettingsWindow = () => {
    return (
      <Dialog open={showSettings} onClose={handleSettingsClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="back"
              onClick={handleSettingsClose}
              sx={{ mr: 1 }}
            >
              <ArrowBack />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
              Settings
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Selected Drone
          </Typography>
          <Typography variant="body1" gutterBottom>
            ID: {selectedDrone.id}
          </Typography>
          <Typography variant="body1" gutterBottom>
            Name: {selectedDrone.name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            IP Address: {selectedDrone.ipAddress}
          </Typography>
        </DialogContent>
      </Dialog>
    );
  };

  const iconStyle = {
    marginTop: '-2px',
    marginLeft: '-2px',
  };

  const VideoPlayer = () => {
    const videoFeedUrl = 'http://localhost:8000/drone/video_feed';
  
    const wrapperStyles = {
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
    };

    const videoStyles = {
      maxWidth:"100%",
      maxHeight:"100%",
      borderRadius: '5px',
    };
  
    return (
      <div style={wrapperStyles}>
        <img src={videoFeedUrl} style={videoStyles} alt="Video Feed" />
      </div>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <AppWrapper>
        <AppBar position="static" style={{ display: topBarVisible ? 'block' : 'none' }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
            >
              <MenuRounded />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              {connectedDrones.map((drone) => (
                <MenuItem
                  value={drone.id}
                  key={drone.id}
                  onClick={() => handleMenuClose(drone.id)}
                >
                  <ListItemIcon>
                    {drone.alert ? <CrisisAlert color='error'/> : <CameraRounded />}
                  </ListItemIcon>
                  <ListItemText
                    primary={drone.name}
                    secondary={`Connection: ${
                      drone.connectionStatus > 0  ? 'Connected' : 'Disconnected'
                    }`}
                  />
                  <ListItemIcon>
                    {getStatusIcon(drone.connectionStatus, false)}
                  </ListItemIcon>
                  <ListItemIcon>
                    {getStatusIcon(drone.batteryStatus, true)}
                  </ListItemIcon>
                </MenuItem>
              ))}
            </Menu>
            <Typography variant="h6" align="center" flexGrow="1">{selectedDrone.name}</Typography>
            <Switch
              checked={currentTheme === 'light'}
              onChange={handleToggleTheme}
              edge="end"
              color="default"
              icon={<LightMode style={iconStyle}/>}
              checkedIcon={<DarkMode style={iconStyle}/>}
            />
            <IconButton
              size="large"
              edge="end"
              color="inherit"
              aria-label="settings"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleSettingsOpen}
            >
              <Settings />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Box justifyContent="center" flexDirection="column" position="relative">
            <VideoPlayer />
            <Stack spacing={1} position="absolute" top={8} left={8} direction="row">
              <Box
                backgroundColor='rgba(0, 0, 0, 0.5)'
                color='#FFFFFF'
                backdropFilter="blur(4px)"
                borderRadius="4px"
                p={1}
              >
                {getStatusIcon(selectedDrone.connectionStatus, false)}
              </Box>
              <Box
                backgroundColor='rgba(0, 0, 0, 0.5)'
                color='#FFFFFF'
                backdropFilter="blur(4px)"
                borderRadius="4px"
                p={1}
              >
                {getStatusIcon(selectedDrone.batteryStatus, true)}
              </Box>
              
            </Stack>
            <Box position="absolute" top={8} right={8}>
              <Box
                  backgroundColor='rgba(0, 0, 0, 0.5)'
                  color='#FFFFFF'
                  backdropFilter="blur(4px)"
                  borderRadius="4px"
                >
                  <IconButton
                    size="small"
                    color="inherit"
                    aria-label="toggle-top-bar"
                    onClick={() => setTopBarVisible(!topBarVisible)}
                  >
                    {topBarVisible ? <ArrowUpward /> : <ArrowDownward />}
                  </IconButton>
                </Box>
            </Box>
          {isPortrait ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              p={2}>
              <Stack
                direction="row"
                flexWrap="wrap"
                gap={2}
                justifyContent="flex-start">
                <Button
                  variant="contained"
                  startIcon={<Cancel />}
                  onClick={handleIgnore}>
                  Land
                </Button>
                <Button
                  variant="contained"
                  startIcon={<TrackChanges />}
                  onClick={handleKeepTracking}>
                  Take Off
                </Button>
              </Stack>
            </Box>
        ) : (
            <Box
              position="absolute"
              bottom={8}
              display="flex"
              justifyContent="center"
              width="100%"
            >
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: '#FFFFFF',
                    border: '1px solid #000000',
                    backdropFilter: 'blur(4px)',
                  }}
                  startIcon={<Cancel />}
                  onClick={handleIgnore}
                >
                  Land
                </Button>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    color: '#FFFFFF',
                    border: '1px solid #000000',
                    backdropFilter: 'blur(4px)',
                  }}
                  startIcon={<TrackChanges />}
                  onClick={handleKeepTracking}
                >
                  Take Off
                </Button>
              </Stack>
            </Box>
        )}
        </Box>
        <Box flex='1' flexGrow='1'>

        </Box>
        <SettingsWindow />
      </AppWrapper>
    </ThemeProvider>
  );
}

export default App;
