const dns = require('dns');
const hostname = '_mongodb._tcp.myatlasclusteredu.ddmjp4u.mongodb.net';
dns.resolveSrv(hostname, (err, addresses) => {
  if (err) {
    console.error('DNS Resolution Failed:', err.message);
  } else {
    console.log('DNS Resolution Success! Addresses:', addresses);
  }
});
