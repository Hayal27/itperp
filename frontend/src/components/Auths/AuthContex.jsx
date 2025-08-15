import { createContext, useContext, useReducer, useEffect } from 'react';
import Axios from 'axios';

const AuthContext = createContext();

const initialState = {
  user: localStorage.getItem('user_id') || null,
  name: localStorage.getItem('name') || null,
  lname: localStorage.getItem('lname') || null,
  role_id: localStorage.getItem('role_id') || null,
  user_name: localStorage.getItem('user_name') || null,
  isAuthenticated: !!localStorage.getItem('user_id'),
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      localStorage.setItem('user_id', action.payload.user_id);
      localStorage.setItem('name', action.payload.name);
      localStorage.setItem('lname', action.payload.lname);
      localStorage.setItem('role_id', action.payload.role_id);
      localStorage.setItem('user_name', action.payload.user_name);
      return {
        ...state,
        user: action.payload.user_id,
        name: action.payload.name,
        lname: action.payload.lname,
        role_id: action.payload.role_id,
        user_name: action.payload.user_name,
        isAuthenticated: true,
      };
    case 'LOGOUT':
      localStorage.removeItem('user_id');
      localStorage.removeItem('name');
      localStorage.removeItem('lname');
      localStorage.removeItem('role_id');
      localStorage.removeItem('user_name');
      return {
        ...state,
        user: null,
        name: null,
        lname: null,
        role_id: null,
        user_name: null,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = async (credentials) => {
    try {
        const response = await Axios.post("http://localhost:5000/login", credentials);
        if (response.data.success) {
            const { token, user } = response.data;
            localStorage.setItem("token", token); // Store JWT token
            dispatch({ type: 'LOGIN', payload: user });
        } else {
            console.error(response.data.message);
        }
    } catch (error) {
        console.error("Login failed:", error);
    }
};


  useEffect(() => {
    // Add any additional logic you may need on component mount
    // For example, you might want to check if the user's token is still valid
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch, login }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuth };
