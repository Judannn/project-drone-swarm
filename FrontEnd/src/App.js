import './App.css';
import { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box, Button, Stack, useMediaQuery, ListItemIcon, ListItemText} from '@mui/material';
import { styled } from '@mui/material/styles';
import { MenuRounded, LocationOn, Cancel, TrackChanges, CrisisAlert, CameraRounded, Settings} from '@mui/icons-material';
import axios from 'axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BatteryChargingFull, SignalCellular4Bar } from '@mui/icons-material';

const AppWrapper = styled('div')({
  flexGrow: 1,
});

const theme = createTheme();

function App() {

  const handleSwarmDrone = () => {
    // Logic to swarm the drone
    console.log('Swarming the drone...');
  };

  const handleIgnore = () => {
    // Logic to ignore the drone
    console.log('Ignoring the drone...');
  };

  const handleKeepTracking = () => {
    // Logic to keep tracking the drone
    console.log('Keeping track of the drone...');
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
  
  const [selectedDrone, setSelectedDrone] = useState({
    id: 0,
    name: '',
    ipAddress: '',
    alert: false,
    batteryStatus: 0,
    connectionStatus: '',
  });

  const [connectedDrones, setConnectedDrones] = useState([
    {id: 1,
    name: "Drone 1",
    ipAddress: "1.1.1.1",
    alert: false,
    batteryStatus: 100,
    connectionStatus: 100},
    {id: 2,
      name: "Drone 2",
      ipAddress: "1.1.1.1",
      alert: false,
      batteryStatus: 100,
      connectionStatus: 100},
      {id: 2,
        name: "Drone 2",
        ipAddress: "1.1.1.1",
        alert: false,
        batteryStatus: 100,
        connectionStatus: 100},
        {id: 2,
          name: "Drone 2",
          ipAddress: "1.1.1.1",
          alert: false,
          batteryStatus: 100,
          connectionStatus: 100}
  ]);

  useEffect(() => {
    const fetchDroneStatus = async () => {
      try {
        const response = await axios.get('<YOUR_API_ENDPOINT>');
        connectedDrones = response.data(connectedDrones);
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
        console.error('Failed to fetch drone status:', error);
      }
    };

    const intervalId = setInterval(fetchDroneStatus, 5000); // Fetch status every 5 seconds
    return () => clearInterval(intervalId); // Clean up the interval when component unmounts
  }, []);

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
            <Typography variant="h6">{selectedDrone.name}</Typography>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="settings"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={null}
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
            height="calc(100vh - 64px)" // Adjust the height to fit your layout
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
          <Box display="flex" justifyContent="center" alignItems="center" p={2}>
            <Stack direction="row" spacing={2}>
              <Button variant="contained" startIcon={<LocationOn />} onClick={handleSwarmDrone}>
                Swarm Drone
              </Button>
              <Button variant="contained" startIcon={<Cancel />} onClick={handleIgnore}>
                Ignore
              </Button>
              <Button variant="contained" startIcon={<TrackChanges />} onClick={handleKeepTracking}>
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
      </AppWrapper>
    </ThemeProvider>
  );
}

export default App;
