const http = require('http');
const orderId = process.argv[2] || 'NS-90001';
const port = process.argv[3] ? Number(process.argv[3]) : 3002;
http.get(`http://localhost:${port}/api/order-status?order_id=${encodeURIComponent(orderId)}`, res => {
  console.log('STATUS', res.statusCode);
  let body = '';
  res.setEncoding('utf8');
  res.on('data', c => body += c);
  res.on('end', () => console.log(body));
}).on('error', e => console.error('ERR', e.message));
