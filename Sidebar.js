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

const Sidebar = ({ navigation }) => {
  const [isOpen, setIsOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-sidebarWidth)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOpen ? 0 : -sidebarWidth,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen, slideAnim]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

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
    <>
      <Animated.View
        style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
        <Text style={styles.sidebarTitle}>Menu</Text>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Main')}>
          <Ionicons name="home" size={22} color="#c4f3e6" />
          <Text style={styles.sidebarText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Nutrient Calculator')}>
          <Ionicons name="calculator" size={22} color="#c4f3e6" />
          <Text style={styles.sidebarText}>Nutrient Calculator</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('BMI Calculator')}>
          <Ionicons name="body" size={22} color="#c4f3e6" />
          <Text style={styles.sidebarText}>BMI Calculator</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('BMR Calculator')}>
          <Ionicons name="flame" size={22} color="#c4f3e6" />
          <Text style={styles.sidebarText}>BMR Calculator</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('3 Course Meal Planner')}>
          <Ionicons name="restaurant" size={22} color="#c4f3e6" />
          <Text style={styles.sidebarText}>3 Course Meal Planner</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Notes')}>
          <Ionicons name="book" size={22} color="#c4f3e6" />
          <Text style={styles.sidebarText}>Notes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
          <Ionicons name="log-out" size={22} color="#c4f3e6" />
          <Text style={styles.sidebarText}>Sign Out</Text>
        </TouchableOpacity>
      </Animated.View>
      {isOpen && (
        <TouchableWithoutFeedback onPress={toggleSidebar}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}
      {!isOpen && (
        <TouchableOpacity
          onPress={toggleSidebar}
          style={styles.openButtonContainer}>
          <Ionicons name="menu" size={30} color="#c4f3e6" />
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    zIndex: 999,
  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: sidebarWidth,
    height: '100%',
    backgroundColor: '#1e4d3d',
    padding: 20,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
  },
  sidebarTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#c4f3e6',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#8de2d1',
  },
  sidebarText: {
  fontSize: 18,
  color: '#c4f3e6',
  marginLeft: 12,
  fontWeight: '600',
  textShadowColor: 'rgba(0, 0, 0, 0.5)', // Shadow color
  textShadowOffset: { width: 1, height: 1 }, // Shadow offset
  textShadowRadius: 2, // Shadow blur radius
},
  openButtonContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#3a7859',
    padding: 10,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    opacity: 0.5,
  },
});

export default Sidebar;
