import socket
from flask import Flask, request

app = Flask(__name__)

@app.route("/")
def return_hostname():
    return "This is an example wsgi app served from {} to {}".format(socket.gethostname(), request.remote_addr)

@app.route("/vm1")
def return_vm1():
        return "This is VM1 wsgi app served from {} to {}".format(socket.gethostname(), request.remote_addr)

@app.route("/vm2")
def return_vm2():
        return "This is VM2 wsgi app served from {} to {}".format(socket.gethostname(), request.remote_addr)

if __name__ == "__main__":
    app.run(host='0.0.0.0')