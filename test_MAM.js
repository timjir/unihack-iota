



const Mam = require('./lib/mam.client.js');
const IOTA = require('iota.lib.js');
const iota = new IOTA({ provider: 'https://nodes.testnet.iota.org:443' });
const seed = 'TRACKRYBND9AFCHFDLCWSVQU9ISCDTBKUQSLXEEUXFHVDEEQZZJPCBPBJ9QSVFBXUJXTIFBMTQSLVUFYTH';


const MODE = 'restricted'; // public, private or restricted
const SIDEKEY = 'unihack2018trackr'; // Enter only ASCII characters. Used only in restricted mode
const SECURITYLEVEL = 3; // 1, 2 or 3
const TIMEINTERVAL  = 120; // seconds


let mamState = Mam.init(iota, undefined, SECURITYLEVEL);




