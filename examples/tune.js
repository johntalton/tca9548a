const Gpio = require('onoff').Gpio;

const { Rasbus } = require('@johntalton/rasbus');

const { Tca9548 } = require('../');

const config = {
  bus: {
    driver: 'i2c',
    id: [1, 0x70]
  }
};

function setup() {
  return Rasbus.bytype(config.bus.driver).init(...config.bus.id)
    .then(bus => Tca9548.from(Rasbus.i2c, bus));
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

  if(['int', 'interupt', 'reset'].includes(first.toLowerCase())) {
    if(argv.length !== 4) { throw Error('reset requires pin parameter: ' + argv.slice(3)) }
    doset = false;
    doint = true;

    return argv[3];
  }

  return argv.splice(2).map(arg => {
    const n = Number.parseInt(arg, 10);
    if(Number.isNaN(n)) { throw Error('failed to parse channel arg: ' + arg); }
    if(n.toString() !== arg) { throw Error('parse int success, but did not match full arg: ' + arg + ' vs ' + n); }
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
    .then(() => doset ? device.setChannels(channels) : Promise.resolve())
    .then(() => doint ? reset(channels) : Promise.resolve())
    .then(() => device.getChannels()
      .then(channels => {
        if(channels.length === 0) {
          console.log('tuned out');
        } else {
          console.log('tuned to', channels)
        }
      })
      .catch(e => console.log('failure to tune', e))
    );
})
.catch(e => {
  console.log('top level error', e);
})


