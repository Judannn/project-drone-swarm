from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update with the appropriate origin URL
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

class Drone(BaseModel):
    id: int
    name: str
    ipAddress: str
    alert: bool
    batteryStatus: int
    connectionStatus: int

class DroneId(BaseModel):
    id: int

connected_drones = [
    Drone(
        id=1,
        name="Drone 1",
        ipAddress="1.1.1.1",
        alert=False,
        batteryStatus=10,
        connectionStatus=10
    ),
    Drone(
        id=2,
        name="Drone 2",
        ipAddress="1.1.1.1",
        alert=True,
        batteryStatus=50,
        connectionStatus=50
    ),
    Drone(
        id=3,
        name="Drone 3",
        ipAddress="1.1.1.1",
        alert=False,
        batteryStatus=100,
        connectionStatus=100
    )
]

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/drones/swarmdrone")
async def swarm_drone():
    # Handle the swarm drone request
    # Your logic goes here
    return {"message": "Drone swarm request received"}

@app.post("/drones/ignore")
async def ignore(droneid: DroneId):
    # Handle the ignore request
    # Your logic goes here
    print(droneid.id)
    return {"message": "Ignore request received"}

@app.post("/drones/keep-tracking")
async def keep_tracking():
    # Handle the keep tracking request
    # Your logic goes here
    return {"message": "Keep tracking request received"}

@app.get("/drones")
async def get_drones():
    return connected_drones

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)