export function audioBufferToWav(buffer: AudioBuffer): Blob {
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;

    let result: Int16Array;

    if (numberOfChannels === 2) {
        result = interleave(buffer.getChannelData(0), buffer.getChannelData(1));
    } else {
        result = floatTo16BitPCM(buffer.getChannelData(0));
    }

    return writeWav(result, numberOfChannels, sampleRate, format, bitDepth);
}

function interleave(inputL: Float32Array, inputR: Float32Array): Int16Array {
    const length = inputL.length + inputR.length;
    const result = new Int16Array(length);

    let index = 0;
    let inputIndex = 0;

    while (index < length) {
        result[index++] = Math.max(-1, Math.min(1, inputL[inputIndex])) * 0x7FFF;
        result[index++] = Math.max(-1, Math.min(1, inputR[inputIndex])) * 0x7FFF;
        inputIndex++;
    }
    return result;
}

function floatTo16BitPCM(input: Float32Array): Int16Array {
    const result = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
        const s = Math.max(-1, Math.min(1, input[i]));
        result[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return result;
}

function writeWav(samples: Int16Array, channels: number, sampleRate: number, format: number, bitDepth: number): Blob {
    const blockAlign = channels * (bitDepth / 8);
    const byteRate = sampleRate * blockAlign;
    const dataSize = samples.length * (bitDepth / 8);
    const buffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(buffer);

    /* RIFF identifier */
    writeString(view, 0, 'RIFF');
    /* file length */
    view.setUint32(4, 36 + dataSize, true);
    /* RIFF type */
    writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, format, true);
    /* channel count */
    view.setUint16(22, channels, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, byteRate, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, blockAlign, true);
    /* bits per sample */
    view.setUint16(34, bitDepth, true);
    /* data chunk identifier */
    writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, dataSize, true);

    /* write the PCM samples */
    let offset = 44;
    for (let i = 0; i < samples.length; i++, offset += 2) {
        view.setInt16(offset, samples[i], true);
    }

    return new Blob([buffer], { type: 'audio/wav' });
}

function writeString(view: DataView, offset: number, string: string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}
