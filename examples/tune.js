/* eslint-disable promise/no-nesting */
const { Gpio } = require('onoff');

let i2c;
try { i2c = require('i2c-bus'); } catch (e) { }

const { I2CAddressedBus, I2CMockBus } = require('@johntalton/and-other-delights');

const { Tca9548, DEFAULT_I2C_ADDRESS } = require('../');

const BUS_NUMBER = 1;
const BUS_ADDRESS = DEFAULT_I2C_ADDRESS;

const OPTIONS = ['mock'];
const COMMANDS_NO_CHANNELS = ['out', 'off', 'none'];
const COMMANDS_LIST_CHANNELS = ['list', 'show'];
const COMMANDS_RESET = ['reset'];


/**
* node tune show
* node tune out
* node tune <channel> [, <channel>]*
* node tune reset <pin>
**/

function stringToNumber(item) {
  const n = Number.parseInt(item, 10);
  if(Number.isNaN(n) || !Number.isInteger(n) || (n.toString(10) !== item)) {
    throw new Error('unknown number: ' + item.toString());
  }
  return n;
}

async function resetDevice(pin) {
  if(!Gpio.accessible) { console.log(' ** Gpio is not accessible **'); return; }
  const gpio = new Gpio(pin, 'out', { activeLow: true });
  await gpio.write(Gpio.HIGH);
  // maybe delay
  await gpio.write(Gpio.LOW);
  await gpio.unexport();
}

async function handleCommand(provider, options) {
  // console.log(options);

  const i2c1 = await provider.openPromisified(options.busNumber);
  const device = await Tca9548.from(new I2CAddressedBus(i2c1, options.busAddress));

  if(options.reset) {
    //
    const pin = 17;
    await resetDevice(pin);
  }

  if(options.setChannels !== false) {
    // console.log('setting channels', options.setChannels, device);
    await device.setChannels(options.setChannels);
  }

  if(options.show) {
    const channels = await device.getChannels();
    console.log(channels.length === 0 ? 'tuned out' : channels);
  }
}

//
if(!module.parent) {
  if(process.argv.length < 3) {
    console.log(' ** missing arguments ** ');
    process.exit(-1);
  }

  const options = process.argv
    .slice(2)
    .filter(item => item.toLowerCase())
    .reduce((acc, item) => {
      if(OPTIONS.includes(item)) {
        acc[item] = true;
        return acc;
      }

      if(acc.reset === true && acc.pin === undefined) {
        // reset enabled, assume this is the pin number
        const pin = stringToNumber(item);
        return { ...acc, pin };
      }

      if(COMMANDS_NO_CHANNELS.includes(item)) {
        return { ...acc, setChannels: [] };
      }
      else if(COMMANDS_LIST_CHANNELS.includes(item)) {
        return { ...acc, show: true };
      }
      else if(COMMANDS_RESET.includes(item)) {
        return { ...acc, reset: true };
      }

      const n = stringToNumber(item);
      console.log('found channel', n);

      if(acc.setChannels === false) { acc.setChannels = []; }
      acc.setChannels.push(n);

      return acc;
    }, {
      pin: undefined,
      mock: false,
      show: true,
      reset: false,
      setChannels: false,
      busNumber: BUS_NUMBER,
      busAddress: BUS_ADDRESS
    });

  if(options.mock) {
    I2CMockBus.addDevice(options.busNumber, options.busAddress, {
      register: {
        0x00: { data: 0b10101000 }
      }
    });
  }

  const provider = options.mock ? I2CMockBus : i2c;

  if(provider === undefined) {
    if(i2c === undefined) { console.log('i2c-bus unavailable'); }
    console.log(' ** provider is undefined **');
    process.exit(-2);
  }

  if(options.reset && options.pin === undefined) {
    console.log(' ** missing gpio pin argument for reset call ** ');
    process.exit(-3);
  }

  handleCommand(provider, options);
}
