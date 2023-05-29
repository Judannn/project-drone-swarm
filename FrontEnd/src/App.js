import './App.css';
import { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box, Button, Stack, useMediaQuery, ListItemIcon, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions} from '@mui/material';
import { styled } from '@mui/material/styles';
import { MenuRounded, LocationOn, Cancel, TrackChanges, CrisisAlert, CameraRounded, Settings, ArrowBack} from '@mui/icons-material';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BatteryChargingFull, SignalCellular4Bar } from '@mui/icons-material';

const AppWrapper = styled('div')({
  flexGrow: 1,
  overflow:'hidden'
});

const theme = createTheme();

function App() {

  const handleSwarmDrone = () => {
    // Send API request to server
    axios.post('http://localhost:8000/drones/swarmdrone', { id: selectedDrone.id })
      .then((response) => {
        console.log('Drone swarm request sent successfully:', response.data);
      })
      .catch((error) => {
        console.error('Failed to send Drone swarm request:', error);
      });
  };

  const handleIgnore = () => {
    // Send API request to server
    axios.post('http://localhost:8000/drones/ignore', { id: selectedDrone.id })
      .then((response) => {
        console.log('Ignore request sent successfully:', response.data);
      })
      .catch((error) => {
        console.error('Failed to send ignore request:', error);
      });
  };

  const handleKeepTracking = () => {
    // Send API request to server
    axios.post('http://localhost:8000/drones/keep-tracking', { id: 1 })
      .then((response) => {
        console.log('Keep tracking request sent successfully:', response.data);
      })
      .catch((error) => {
        console.error('Failed to send keep tracking request:', error);
      });
  };

  const isPortrait = useMediaQuery('(orientation: portrait)');

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
        connectedDrones = response.data;
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
  }, []);

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

  return (
    <ThemeProvider theme={theme}>
      <AppWrapper>
        <AppBar position="static">
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
                    {drone.alert ? <CrisisAlert /> : <CameraRounded />}
                  </ListItemIcon>
                  <ListItemText
                    primary={drone.name}
                    secondary={`Connection: ${
                      drone.connected ? 'Connected' : 'Disconnected'
                    }`}
                  />
                  <ListItemIcon>
                    {drone.connected ? (
                      <SignalCellular4Bar fontSize="small" />
                    ) : (
                      <SignalCellular4Bar fontSize="small" color="disabled" />
                    )}
                  </ListItemIcon>
                  <ListItemIcon>
                    {drone.batteryLevel > 20 ? (
                      <BatteryChargingFull fontSize="small" />
                    ) : (
                      <BatteryChargingFull fontSize="small" color="error" />
                    )}
                  </ListItemIcon>
                </MenuItem>
              ))}
            </Menu>
            <Typography variant="h6" align="center" flexGrow="1">{selectedDrone.name}</Typography>
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
        <Box position="relative">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="calc(60vh - 64px)" // Adjust the height to fit your layout
            bgcolor="#000000" // Set the desired background color
          >
            <Box position="absolute" top={16} left={16}>
              {selectedDrone && (
                <>
                  {selectedDrone.connected ? (
                    <SignalCellular4Bar fontSize="small" />
                  ) : (
                    <SignalCellular4Bar fontSize="small" color="error" />
                  )}
                  {selectedDrone.batteryLevel > 20 ? (
                    <BatteryChargingFull fontSize="small" />
                  ) : (
                    null
                    // <BatteryChargingFull fontSize="small" color="error" />
                  )}
                </>
              )}
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
                startIcon={<LocationOn />}
                onClick={handleSwarmDrone}>
                Swarm Drone
              </Button>
              <Button
                variant="contained"
                startIcon={<Cancel />}
                onClick={handleIgnore}>
                Ignore
              </Button>
              <Button
                variant="contained"
                startIcon={<TrackChanges />}
                onClick={handleKeepTracking}>
                Keep-Tracking
              </Button>
            </Stack>
          </Box>
        ) : (
          <Box
            position="absolute"
            bottom={16}
            left={16}
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
                startIcon={<LocationOn />}
                onClick={handleSwarmDrone}
              >
                Swarm Drone
              </Button>
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
                Ignore
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
                Keep-Tracking
              </Button>
            </Stack>
          </Box>
        )}
        </Box>
        <SettingsWindow />
      </AppWrapper>
    </ThemeProvider>
  );
}

export default App;
