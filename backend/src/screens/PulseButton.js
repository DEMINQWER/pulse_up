import React, { useState, useRef } from 'react';
import { TouchableOpacity, Text, Vibration, StyleSheet, Animated } from 'react-native';
import { startPulseScan } from '../../utils/PulseBluetooth';
import { updatePulseUser } from '../../utils/PulseAPI';

export default function PulseButton({ setFoundUsers }) {
  const [scanning, setScanning] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const handlePress = async () => {
    if (!scanning) {
      setScanning(true);

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.3, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();

      Vibration.vibrate([100, 200, 100, 200], true);

      const localUsers = await startPulseScan();
      setFoundUsers(localUsers);

      // Отправка на сервер
      await updatePulseUser('myUserId', 'MyUsername', [0, 0]);

      Vibration.cancel();
      setScanning(false);
    }
  };

  return (
    <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text style={styles.text}>ПУЛЬС</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: { width: 150, height: 150, borderRadius: 75, backgroundColor: '#a64cff33', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#a64cff' },
  text: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
});
