const { describe, it } = require('mocha');
const { expect } = require('chai');

const { I2CAddressedBus, I2CScriptBus, EOS_SCRIPT } = require('@johntalton/and-other-delights');

const { Tca9548, I2CTca9548BusFactory, I2CTca9548Bus } = require('../');

const DEFAULT_SCRIPT = {
  ...EOS_SCRIPT
};

async function setup(vbusNumber, busAddress, vbusAddresses = [], script = DEFAULT_SCRIPT) {
  const sb = await I2CScriptBus.openPromisified(vbusNumber, script);
  const ab = new I2CAddressedBus(sb, busAddress);
  const mp = await Tca9548.from(ab, {});
  const manager = {};

  const fact = await I2CTca9548BusFactory.from(sb, mp, manager);
  const vbus = await fact.openPromisified(vbusNumber)

  vbusAddresses.map(vbusAddress => {
    const vab = new I2CAddressedBus(vbus, vbusAddress);
    const device = { vab };
    return device;
  });
}

describe('I2CTca9548BusFactory', () => {
  describe('#constructor', () => {
    it('should construct object without error', async () => {
      //
      const s = await setup(1, 0x70, [], DEFAULT_SCRIPT);
    });
  });
});

describe('I2CTca9548Bus', () => {
  describe('#constructor', () => {
    it('should construct object without error', async () => {
      //
      const s = await setup(1, 0x70, [], DEFAULT_SCRIPT);
    });

    describe('I2CBus-Interface', () => {
      describe('#read', () => {
        it('should read', async () => {
          //
          const s = await setup(1, 0x70, [], DEFAULT_SCRIPT);
        });
      });

      describe('#write', () => {
        it('should write', () => {
          //
        });
      });

      describe('#readBuffer', () => {
        it('should read', () => {
          //
        });
      });

      describe('#writeBuffer', () => {
        it('should write', () => {
          //
        });
      });
    });

  });
});
