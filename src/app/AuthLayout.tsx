import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full bg-white-97 flex items-center justify-center px-4">
      <main className="w-full flex items-center justify-center">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
