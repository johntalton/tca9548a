const Gpio = require('onoff').Gpio;
const i2c = require('i2c-bus');

const { I2CAddressedBus } = require('@johntalton/and-other-delights');

const { Tca9548 } = require('../');

const config = {
  bus: {
    driver: 'i2c',
    id: [1, 0x70]
  }
};

function setup() {
  if(config.bus.driver !== 'i2c') { throw Error('driver not supported'); }

  return i2c.openPromisified(config.bus.id[0])
    .then(bus => {
      const abus = new I2CAddressedBus(bus, config.bus.id[1]);
      return Tca9548.from(bus, abus);
    });
}

function parseArgv(argv) {
  if(argv.length <= 2) { throw Error('need more arguments'); }

  const first = argv[2];
  if(['out', 'off', 'none'].includes(first.toLowerCase())) {
    if(argv.length !== 3) { throw Error('extra tune out parameters: ' + argv.slice(3)) }
    return [];
  }

  if(['list', 'show'].includes(first.toLowerCase())) {
    if(argv.length !== 3) { throw Error('extra tune out parameters: ' + argv.slice(3)) }
    return false;
  }

  if(['int', 'interrupt', 'reset'].includes(first.toLowerCase())) {
    if(argv.length !== 4) { throw Error('reset requires pin parameter: ' + argv.slice(3)) }
    doset = false;
    doint = true;

    return argv[3];
  }

  return argv.splice(2).map(arg => {
    const n = Number.parseInt(arg, 10);
    if(Number.isNaN(n)) { throw Error('failed to parse channel: ' + arg); }
    if(n.toString() !== arg) { throw Error('parse int success, but did not match full argument: ' + arg + ' vs ' + n); }
    if(!Number.isInteger(n)) { throw Error('unable to parse channel argument: ' + arg); }
    return n;
  });
}


// -------------------
let doset = true;
let doint = false;
const channels = parseArgv(process.argv);
if(!Array.isArray(channels)) {
  doset = false;
}

function reset(pin) {
  const gpio = new Gpio(pin, 'out', { activeLow: true });
  return gpio.write(Gpio.HIGH)
    .then(gpio.write(Gpio.LOW))
    .then(gpio.unexport());
}


setup().then(device => {
  return Promise.resolve()
    .then(() => (doset ? device.setChannels(channels) : Promise.resolve()))
    .then(() => (doint ? reset(channels) : Promise.resolve()))
    .then(() => device.getChannels()
      .then(resultChannels => {
        if(resultChannels.length === 0) {
          console.log('tuned out');
        }
        else {
          console.log('tuned to', resultChannels)
        }
        return true;
      })
      .catch(e => console.log('failure to tune', e))
    );
})
.catch(e => {
  console.log('top level error', e);
})


