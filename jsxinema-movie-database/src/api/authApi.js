export const login = async (credentials) => {
    try {
      // Mock API call - would be a real API call in production
      const response = await axios.post('https://your-backend.com/api/auth/login', credentials);
      const { token, user } = response.data;
      
      // Save auth data
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  
  export const register = async (userData) => {
    try {
      // Mock API call - would be a real API call in production
      const response = await axios.post('https://your-backend.com/api/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };
  
  export const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  };
  