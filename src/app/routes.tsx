import type { RouteObject } from 'react-router-dom';
import App from './App';
import { UserProfilePage } from '../modules/user/UserProfilePage';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/profile',
    element: <UserProfilePage />,
  },
];
