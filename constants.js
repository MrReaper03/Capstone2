import AsyncStorage from '@react-native-async-storage/async-storage';

let newEmail = '';
let newVerificationCode = '';

const setNewEmail = async (email) => {
  newEmail = email;
  try {
    await AsyncStorage.setItem('newEmail', email);
  } catch (error) {
    console.error('Failed to save email to AsyncStorage', error);
  }
};

const setNewVerificationCode = async (code) => {
  newVerificationCode = code;
  try {
    await AsyncStorage.setItem('newVerificationCode', code);
  } catch (error) {
    console.error('Failed to save verification code to AsyncStorage', error);
  }
};

const getStoredEmail = async () => {
  try {
    const storedEmail = await AsyncStorage.getItem('newEmail');
    return storedEmail !== null ? storedEmail : '';
  } catch (error) {
    console.error('Failed to retrieve email from AsyncStorage', error);
    return '';
  }
};

const getStoredVerificationCode = async () => {
  try {
    const storedCode = await AsyncStorage.getItem('newVerificationCode');
    return storedCode !== null ? storedCode : '';
  } catch (error) {
    console.error(
      'Failed to retrieve verification code from AsyncStorage',
      error
    );
    return '';
  }
};

export {
  newEmail,
  newVerificationCode,
  setNewEmail,
  setNewVerificationCode,
  getStoredEmail,
  getStoredVerificationCode,
};
