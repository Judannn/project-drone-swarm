import socket
import time


class TelloDrone:
    def __init__(self, host="10.25.35.130", port=8889, state_udp_port=8890):
        self.host = host
        self.port = port
        self.state_udp_port = state_udp_port
        self.command_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.command_socket.bind(("", port))
        self.state_socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.state_socket.bind(("", self.state_udp_port))
        self.send_command(
            "command"
        )  # This is the command to start the SDK (command) mode of the drone

    def send_command(self, command):
        print(f"Sending command: {command}")
        self.command_socket.sendto(bytes(command, "utf-8"), (self.host, self.port))
        received = str(self.command_socket.recv(1024), "utf-8")
        print(f"Received: {received}")
        time.sleep(1)  # Giving some time for command to take effect

    def set_ap_mode(self, ssid, password):
        print(f"SENDING: |ap {ssid} {password}|")
        self.send_command(f"ap {ssid} {password}")

    def takeoff(self):
        self.send_command("takeoff")

    def land(self):
        self.send_command("land")

    def process_telemetry(self):
        for _ in range(5):
            data, address = self.state_socket.recvfrom(1024)
            address = address[0]
            print(f"\nData received from {address} at state_socket")
            telemetry_data = data.decode("ASCII").split(";")
            telemetry_dict = dict(
                telem.split(":") for telem in telemetry_data if telem and ":" in telem
            )
            for key, value in telemetry_dict.items():
                print(f"{key}: {value}")
            time.sleep(1)


if __name__ == "__main__":
    drone = TelloDrone()

    print(
        "Commands: ap_mode <ssid> <password>, takeoff, land, telemetry, <free form command>, quit"
    )

    while True:
        command = input("Enter command: ")

        if command == "quit":
            break
        elif command.startswith("ap_mode "):
            _, ssid, password = command.split()
            drone.set_ap_mode(ssid, password)
        elif command == "takeoff":
            drone.takeoff()
        elif command == "land":
            drone.land()
        elif command == "telemetry":
            print("Telemetry started...")
            drone.process_telemetry()
        else:
            drone.send_command(command)
