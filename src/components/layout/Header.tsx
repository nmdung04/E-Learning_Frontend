import { Button } from "../ui/Button";
import Logo from '../../../public/assets/Logo.svg';
import { RiMenu3Fill } from "react-icons/ri";
import { IoCloseSharp } from "react-icons/io5";
import { useState } from "react";

export const Header= () =>{
    const [isOnMobile, setIsOnMobile] = useState(false);
    const handleMenuClick = () => {
        setIsOnMobile(!isOnMobile);
        // console.log(isOnMobile);
    }
    return (
        <>
        <header className="w-full bg-white shadow-md py-2 px-2 flex flex-col items-center justify-between border-b border-gray-200">
            <div className="announcement bg-mint-50 rounded-md w-full py-2 px-4 mb-2 text-center">
                <p className="text-sm text-white-600 bg-mint-50">Welcome to the English Learning App!</p>
            </div>
            <div className="main-header sticky flex flex-row justify-between w-full py-1 md:px-4  ">
                <div className="nav-bar flex flex-row items-center">
                    <a href="/" className="logo w-10">
                        <img src={Logo} alt="Logo"></img>
                    </a>
                    <nav className="navigation ml-8 max-sm:hidden">
                        <a href="#" className="text-gray-700 hover:text-gray-900 mx-4">Home</a>
                        <a href="#" className="text-gray-700 hover:text-gray-900 mx-4">Courses</a>
                        <a href="#" className="text-gray-700 hover:text-gray-900 mx-4">About</a>
                        <a href="#" className="text-gray-700 hover:text-gray-900 mx-4">Contact</a>
                    </nav>
                </div>
            
                <div className="action flex flex-row items-center">
                    <Button variant="primary">Login</Button>
                    <Button variant="outline" className="ml-4">Sign Up</Button>
                    <Button variant="icon" className="transition-all duration-300 ease-in-out opacity-100 md:hidden" onClick={handleMenuClick}> {isOnMobile ? <IoCloseSharp className="w-7 h-7 "/> : <RiMenu3Fill className="w-7 h-7"/>}</Button>
                </div>
            </div>
            
        </header>
            <div
              className={`
                mobile-menu
                bg-white shadow-md px-4
                overflow-hidden
                md:hidden
                transition-all duration-300 ease-in-out 
                ${isOnMobile ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}
              `}
            >
              <a href="#" className="block text-gray-15 py-2 px-1 my-2 cursor-pointer w-[30%]">Home</a>
              <a href="#" className="block text-gray-15 py-2 px-1 my-2 cursor-pointer w-[30%]">Courses</a>
              <a href="#" className="block text-gray-15 py-2 px-1 my-2 cursor-pointer w-[30%]">About</a>
              <a href="#" className="block text-gray-15 py-2 px-1 my-2 cursor-pointer w-[30%]">Contact</a>
            </div>

        </>
    )
}