// src/BluetoothLE.js
import React, { useState } from 'react';

const BluetoothLE = () => {
  const [device, setDevice] = useState(null);
  const [characteristic, setCharacteristic] = useState(null);

  const requestDevice = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['19B10000-E8F2-537E-4F6C-D104768A1214'] }]
      });
      setDevice(device);
    } catch (error) {
      console.error('Error requesting device:', error);
    }
  };

  const connectDevice = async () => {
    if (!device) return;

    try {
      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('19B10000-E8F2-537E-4F6C-D104768A1214');
      const characteristic = await service.getCharacteristic('19B10001-E8F2-537E-4F6C-D104768A1214');
      setCharacteristic(characteristic);
    } catch (error) {
      console.error('Error connecting to device:', error);
    }
  };

  const toggleLED = async (state) => {
    if (!characteristic) return;

    try {
      await characteristic.writeValue(new Uint8Array([state ? 1 : 0]));
    } catch (error) {
      console.error('Error writing value:', error);
    }
  };

  return (
    <div>
      <button onClick={requestDevice}>Request Device</button>
      <button onClick={connectDevice} disabled={!device}>Connect Device</button>
      <button onClick={() => toggleLED(true)} disabled={!characteristic}>Turn LED On</button>
      <button onClick={() => toggleLED(false)} disabled={!characteristic}>Turn LED Off</button>
    </div>
  );
};

export default BluetoothLE;
