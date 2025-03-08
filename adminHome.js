import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const sidebarWidth = 260;

export const Sidebar = ({ isOpen, toggleSidebar, navigation }) => {
  const slideAnim = useRef(new Animated.Value(-sidebarWidth)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : -sidebarWidth,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen, slideAnim]);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            navigation.replace('Login');
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Animated.View
      style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
      <TouchableOpacity
        onPress={toggleSidebar}
        style={styles.closeButtonContainer}>
        <Ionicons name="close" size={26} color="#d1e9ff" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('Users')}>
        <Ionicons name="people" size={22} color="#d1e9ff" />
        <Text style={styles.sidebarText}>Users</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('Food Database')}>
        <Ionicons name="fast-food" size={22} color="#d1e9ff" />
        <Text style={styles.sidebarText}>Food Database</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate('Users Progress')}>
        <Ionicons name="people" size={22} color="#d1e9ff" />
        <Text style={styles.sidebarText}>Users Progress</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
        <Ionicons name="log-out" size={22} color="#d1e9ff" />
        <Text style={styles.sidebarText}>Sign Out</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const AdminHome = ({ navigation }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleOutsidePress = () => {
    if (isSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          navigation={navigation}
        />
        <View style={styles.mainContent}>
          {!isSidebarOpen && ( // Only show button when sidebar is closed
            <TouchableOpacity
              onPress={toggleSidebar}
              style={styles.openButtonContainer}>
              <Ionicons name="menu" size={30} color="#d1e9ff" />
            </TouchableOpacity>
          )}
          <Text style={styles.mainText}>Admin Dashboard</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d1e9ff',
  },
  sidebar: {
    position: 'absolute',
    width: sidebarWidth,
    height: '100%',
    backgroundColor: '#1e3a76',
    padding: 20,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
  },
  closeButtonContainer: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#5c8fff',
  },
  sidebarText: {
    fontSize: 18,
    color: '#d1e9ff',
    marginLeft: 12,
    fontWeight: '600',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#94c4ff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 7,
  },
  openButtonContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#1e3a76', //  Dark blue background
    opacity: 0.5, // Half transparency
    padding: 10,
    borderRadius: 30, // Rounded corners
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e3a76',
    textAlign: 'center',
  },
});

export default AdminHome;
