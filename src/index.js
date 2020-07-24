const { Tca9548, DEFAULT_I2C_ADDRESS } = require('./tca9548.js');
const { I2CTca9548BusFactory, I2CTca9548Bus } = require('./i2c-bus/i2c-tca9548.js');

module.exports = {
  Tca9548, DEFAULT_I2C_ADDRESS,
  I2CTca9548BusFactory, I2CTca9548Bus
};
