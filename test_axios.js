const http = require('http');
const axios = require('axios');

// Create a local HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Set-Cookie': [
      'refresh_token=mock_refresh_token_value; Path=/; HttpOnly; SameSite=Lax',
      'other_cookie=other_value; Path=/'
    ]
  });
  res.end('OK');
});

server.listen(0, async () => {
  const port = server.address().port;
  console.log(`Server listening on port ${port}`);

  try {
    const res = await axios.post(`http://127.0.0.1:${port}/`);
    console.log('Axios version:', require('axios/package.json').version);
    console.log('res.headers type:', typeof res.headers);
    console.log('res.headers constructor name:', res.headers.constructor.name);
    console.log("res.headers['set-cookie']:", res.headers['set-cookie']);
    console.log("res.headers.get('set-cookie'):", res.headers.get?.('set-cookie'));
    if (res.headers.getSetCookie) {
      console.log("res.headers.getSetCookie():", res.headers.getSetCookie());
    } else {
      console.log("res.headers.getSetCookie is undefined");
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    server.close();
  }
});
