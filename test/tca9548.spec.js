const { describe, it } = require('mocha');
const { expect } = require('chai');

const { I2CAddressedBus, I2CMockBus } = require('@johntalton/and-other-delights');

const { Tca9548 } = require('../');

const MOCK_TCA_DEFINITION = {
  register: {
    0x00: { data: 0b10101000 }
  }
};

async function mockBus(busNumber, busAddress) {
  // re-add device to initialize it
  I2CMockBus.addDevice(1, 0x00, MOCK_TCA_DEFINITION);
  const bus = await I2CMockBus.openPromisified(busNumber);
  return new I2CAddressedBus(bus, busAddress);
}

describe('tca9548', () => {
  describe('#from', () => {
    it('should construct object without error', async () => {
      //
      //
      const ab = await mockBus(1, 0x00);

      expect(async () => {
        const tca = await Tca9548.from(ab, {});
      }).to.not.throw();
    });
  });

  describe('#getChannels', () => {
    it('should get channels', async () => {
      //
      //
      const ab = await mockBus(1, 0x00);
      const tca = await Tca9548.from(ab, {});
      const channels = await tca.getChannels();
      expect(channels).to.deep.equal([3, 5, 7]);
    });
  });

  describe('#setChannels', () => {
    it('should set without throw', async () => {
      //
      //
      const ab = await mockBus(1, 0x00);
      const tca = await Tca9548.from(ab, {});
      expect(() => tca.setChannels([3, 5, 7])).to.not.throw();
    });

    it('should read same value as set', async () => {
      //
      //
      const ab = await mockBus(1, 0x00);
      const tca = await Tca9548.from(ab, {});
      const channels = [2, 3, 5];
      await tca.setChannels(channels);
      const result = await tca.getChannels();
      expect(result).to.deep.equal(channels);
    });
  });
});