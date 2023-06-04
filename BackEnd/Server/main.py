from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import cv2
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
        batteryStatus=50,
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

# Load the pre-trained car classifier
car_cascade = cv2.CascadeClassifier('./haarcascade_car.xml')

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
    # Path to the video file
    video_path = "./traffic.mp4"

    # Open the video file
    video = cv2.VideoCapture(video_path)

    # Get video properties
    fps = video.get(cv2.CAP_PROP_FPS)
    frame_width = int(video.get(cv2.CAP_PROP_FRAME_WIDTH))
    frame_height = int(video.get(cv2.CAP_PROP_FRAME_HEIGHT))

    # Content type for streaming
    content_type = "multipart/x-mixed-replace; boundary=frame"

    # Define a function to read frames from the video and generate the stream
    async def stream_generator():
        while True:
            # Read a frame from the video
            ret, frame = video.read()

            # If the video reaches the end, go back to the beginning (loop)
            if not ret:
                video.set(cv2.CAP_PROP_POS_FRAMES, 0)
                continue

            # Convert the frame to grayscale for car detection
            gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            # Detect cars in the frame
            cars = car_cascade.detectMultiScale(gray_frame, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))

            # Draw rectangles around the detected cars
            for (x, y, w, h) in cars:
                cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)

            # Convert the frame to JPEG format
            _, jpeg_frame = cv2.imencode(".jpg", frame)

            # Yield the frame as a chunk of data
            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n\r\n" + jpeg_frame.tobytes() + b"\r\n"
            )

            # Introduce a small delay to match the video's frame rate
            await asyncio.sleep(1 / fps)

    return StreamingResponse(stream_generator(), media_type=content_type)

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
