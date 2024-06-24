export const MAX_CHANNEL_NUM = 8
export const BIT_SET = 1
export const SINGLE_BIT_MASK = 0b1

export class Converter {
	static encodeChannels(channels) {
		if (channels.length === 0) { return 0 }

		return Uint8Array.from([channels.reduce((acc, item) => {
			if (!Number.isInteger(item) || item < 0 || item >= MAX_CHANNEL_NUM) { throw new Error('invalid channel: ' + item) }
			return acc | (BIT_SET << item)
		}, 0)])
	}

	static decodeChannels(buffer) {
		const u8 = ArrayBuffer.isView(buffer) ?
			new Uint8Array(buffer.buffer, buffer.byteOffset) :
			new Uint8Array(buffer)

		const [ mask ] = u8

		// todo range(channelCount)
		return [ 0, 1, 2, 3, 4, 5, 6, 7 ].filter(idx => {
			return ((mask >> idx) & SINGLE_BIT_MASK) === BIT_SET
		})
	}
}
