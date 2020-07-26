/* eslint-disable max-classes-per-file */
const throat = require('throat');

// const { I2CBus } = require('@johntalton/and-other-delights');

/**
 *
 **/
class I2CTca9548Bus /* extends I2CBus */ {
  static wrap(provider, channel, fn) {
    let error = false;
    let result;

    // console.log('wrap provider', provider);

    return provider.lock(() => {
      return provider.manager.before(channel)
        .then(() => fn())
        .then(r => { result = r; return; })
        .catch(e => { error = e; })
        .then(() => provider.manager.after().catch(e => console.log('deep after fail', e)))
        .then(() => {
          if(error) { throw error; }
          // console.log('returning result', result);
          return result;
        });
    });
  }

  constructor(busNumberChannel, provider) {
    // super();
    this.channel = busNumberChannel;
    this.provider = provider;
  }

  close() {
    this.manager.close();
  }

  sendByte(address, byte) {
    this.manager.sendByte();
  }

  readI2cBlock(address, cmd, length, buffer) {
    return I2CTca9548Bus.wrap(this.provider, this.channel, () => this.provider.sourceBus.readI2cBlock(address, cmd, length, buffer));
  }

  writeI2cBlock(address, cmd, length, buffer) {
    return I2CTca9548Bus.wrap(this.provider, this.channel, () => this.provider.sourceBus.writeI2cBlock(address, cmd, length, buffer));
  }

  i2cRead(address, length, buffer) {
    return I2CTca9548Bus.wrap(this.provider, this.channel, () => this.provider.sourceBus.i2cRead(address, length, buffer));
  }

  i2cWrite(address, length, buffer) {
    return I2CTca9548Bus.wrap(this.provider, this.channel, () => this.provider.sourceBus.i2cWrite(address, length, buffer));
  }
}

class I2CTca9548BusProvider {
  constructor(sourceBus, device, manager) {
    this.lock = throat(1);
    this.sourceBus = sourceBus;
    this.device = device;
    this.manager = manager;
  }

  openPromisified(busNumber) {
    return Promise.resolve(new I2CTca9548Bus(busNumber, this));
  }
}

class I2CTca9548BusFactory {
  static from(sourceBus, device, manager) {
    return Promise.resolve(new I2CTca9548BusProvider(sourceBus, device, manager));
  }
}

module.exports = { I2CTca9548BusFactory, I2CTca9548Bus };
