import http from 'http';

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  res.end('OK\n');
});

server.listen(8080, () => {
  console.log('Dummy is running on port 8080');
});
