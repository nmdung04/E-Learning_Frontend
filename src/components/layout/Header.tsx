import { Button } from "../ui/Button";
import Logo from '../../../public/assets/Logo.svg';
import { RiMenu3Fill } from "react-icons/ri";
import { IoCloseSharp } from "react-icons/io5";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { Location } from "react-router-dom";
import { AvatarMenuDropdown } from "../ui/AvatarMenuDropdown";
import { useAuth } from "@/services/auth/useAuth";

type HeaderProps = {
  isLoggedIn: boolean;
};

type NavLink = {
  href: string;
  label: string;
  ariaLabel: string;
};

const navLinks: NavLink[] = [
  { href: "/", label: "Home", ariaLabel: "Home page" },
  { href: "/topics", label: "Courses", ariaLabel: "Browse available courses" },
  { href: "/exams", label: "Examination", ariaLabel: "Take exams" },
  { href: "/about", label: "About", ariaLabel: "About our platform" },
  { href: "/vocab", label: "Vocabulary", ariaLabel: "Vocabulary learning page" },
];

export const Header = ({ isLoggedIn }: HeaderProps) => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location: Location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const isLinkActive = (href: string): boolean => {
      return location.pathname === href;
    };

    const handleMenuClick = () => {
        setMobileMenuOpen(!isMobileMenuOpen);
    }
    return (
        <>
        <header className="w-full bg-white shadow-md py-2 px-2 flex flex-col items-center justify-between border-b border-gray-200">
            <div className="announcement bg-mint-50 rounded-md w-full py-2 px-4 mb-2 text-center">
                <p className="text-sm text-white bg-mint-50">Welcome to the English Learning App!</p>
            </div>

            <div className="main-header sticky flex flex-row justify-between w-full py-1 md:px-4  ">
                <div className="nav-bar flex flex-row items-center">
                    <a href="/" className="logo w-10">
                        <img src={Logo} alt="Logo"></img>
                    </a>
                    <nav className="navigation ml-8 max-sm:hidden" aria-label="Main navigation">
                        {navLinks.map((link) => (
                          <a
                            key={link.href}
                            href={link.href}
                            className={`mx-4 ${
                              isLinkActive(link.href)
                                ? "text-mint-50 font-semibold"
                                : "text-gray-700 hover:text-gray-900"
                            }`}
                            aria-label={link.ariaLabel}
                            aria-current={isLinkActive(link.href) ? "page" : undefined}
                          >
                            {link.label}
                          </a>
                        ))}
                    </nav>
                </div>
            
                <div className="action flex flex-row items-center">
                    {
                        isLoggedIn ? (
                            <AvatarMenuDropdown
                                displayName={user?.username ?? "User"}
                                avatarUrl={user?.avatarUrl ?? null}
                                onEditProfile={() => navigate("/profile")}
                                onLogout={async () => {
                                    await logout();
                                    navigate("/login", { replace: true });
                                }}
                            />
                        ) : (
                            <>
                                <Button variant="primary">Login</Button>
                                <Button variant="outline" className="ml-4">Sign Up</Button>
                            </>
                        )       
                    }
                    <Button variant="icon" className="transition-all duration-300 ease-in-out opacity-100 sm:hidden" onClick={handleMenuClick}> {isMobileMenuOpen ? <IoCloseSharp className="w-7 h-7 "/> : <RiMenu3Fill className="w-7 h-7"/>}</Button>
                </div>
            
            </div>
            
        </header>
            <div
              className={`
                mobile-menu
                bg-white shadow-md px-4
                overflow-hidden
                sm:hidden
                transition-all duration-300 ease-in-out 
                ${isMobileMenuOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}
              `}
              role="navigation"
              aria-label="Mobile navigation"
            >
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`block py-2 px-1 my-2 cursor-pointer w-[30%] ${
                    isLinkActive(link.href)
                      ? "text-mint-600 font-semibold"
                      : "text-gray-15"
                  }`}
                  aria-label={link.ariaLabel}
                  aria-current={isLinkActive(link.href) ? "page" : undefined}
                >
                  {link.label}
                </a>
              ))}
            </div>
        </>
    )
}
