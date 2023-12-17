import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MainPage from '../MainPage';

export const AuthRoute = ({ component: Component, ...props }) => {
  const loggedIn = useSelector(state => !!state.session.user);

  return (
    !loggedIn ?
      <Component {...props} /> :
      <MainPage/>
  );
};

export const ProtectedRoute = ({ component: Component, ...props }) => {
  const loggedIn = useSelector(state => !!state.session.user);

  return (
    loggedIn ? 
      <Component {...props} /> :
      <Navigate to="/login" replace={true} />
  );
};