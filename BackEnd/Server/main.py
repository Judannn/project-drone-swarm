from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from ffmpeg_streaming import input, Formats
import asyncio


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

@app.get("/drone/video_feed")
async def video_feed():
    # Path to the video file or video capture device (e.g., webcam)
    video_path = "./ForBiggerEscapes.mp4"

    # Input video file
    video = input(video_path)

    # Create HLS output with auto-generated representations
    hls_output = video.hls(Formats.h264())
    hls_output.auto_generate_representations()

    # Output the HLS playlist file
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, hls_output.output, './playlist.m3u8')

    # Content type for HLS streaming
    content_type = "application/vnd.apple.mpegurl"

    # Return the playlist and the generator function for frame streaming
    async def stream_generator():
        with open("./playlist.m3u8", "rb") as file:
            while True:
                chunk = file.read(8192)
                if not chunk:
                    break
                yield chunk

    return StreamingResponse(
        stream_generator(),
        media_type=content_type,
        headers={"Content-Disposition": 'attachment; filename="playlist.m3u8"'},
    )

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)