import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const OpenSidebarButton = ({ toggleSidebar }) => {
  return (
    <TouchableOpacity onPress={toggleSidebar} style={styles.openButtonContainer}>
      <Ionicons name="menu" size={30} color="#d1e9ff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  openButtonContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#1e3a76',
    opacity: 0.5,
    padding: 10,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
});

export default OpenSidebarButton;
