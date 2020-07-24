/* eslint-disable max-classes-per-file */
const { I2CBus } = require('@johntalton/and-other-delights');

/* interface BusManager {
  read(cmd: number, length: number)
}
*/

// StaticBusManager { setChannel([0, 2, 6]) }

/**
 *
 **/
class I2CTca9548Bus /*extends I2CBus*/ {
  constructor(manager) {
    // super();
    this.manager = manager;
  }

  close() {

  }

  sendByte(address, byte) {
    this.manager.sendByte();
  }

  readI2cBlock(address, cmd, length, buffer) {}
  writeI2cBlock(address, cmd, length, buffer) {}

  i2cRead(address, length, buffer) {}
  i2cWrite(address, length, buffer) {}
}

class I2CTca9548BusProvider {
  constructor(sourceBus, device, manager) {

  }
  openPromisified(busNumber) { return }
}

class I2CTca9548BusFactory {
  static from(sourceBus, device, manager) {
    return Promise.resolve(new I2CTca9548BusProvider(sourceBus, device, manager));
  }
}

module.exports = { I2CTca9548BusFactory, I2CTca9548Bus };
