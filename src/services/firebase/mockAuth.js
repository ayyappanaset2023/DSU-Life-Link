// Mock auth service for OTP Login Simulation

export const mockSendOTP = async (phone) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (phone.length >= 10) {
        // Return a mock confirmation ID
        resolve('mock-verification-id-12345');
      } else {
        reject(new Error('Invalid phone number format.'));
      }
    }, 1000);
  });
};

export const mockVerifyOTP = async (phone, otp) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (otp === '123456') { // Mock hardcoded OTP for testing
        resolve({
          uid: 'mock-user-' + phone,
          phone,
          // We don't have user details instantly on pure OTP unless registered,
          // The UI should query the user DB next.
        });
      } else {
        reject(new Error('Invalid OTP code. Use 123456 for testing.'));
      }
    }, 1000);
  });
};
