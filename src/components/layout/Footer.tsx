import Logo from "../../../public/assets/Logo.svg";
import { IoMail, IoLocation } from "react-icons/io5";
import { FaPhone, FaFacebook, FaLinkedin} from "react-icons/fa6";
import { RiGlobalLine } from "react-icons/ri";


export const Footer = () => {
    return (
        <>
            <footer className="bg-white text-gray-15 py-4 w-full ">
                <div className="container mx-auto px-8">
                    <div className="flex flex-col md:flex-row justify-around items-center border-b border-gray-200 pb-6 mx-auto">
                        <div className="mb-4 md:mb-0">
                            <img src={Logo} alt="Logo" className="w-8 h-8 mb-4" />
                            <div className="contact">
                                <div className="email my-2 flex items-center"><IoMail className="inline mr-2" />GSO@enclave.vn</div>
                                <div className="phone-number my-2 flex items-center"><FaPhone className="inline mr-2" />0236 6253 000</div>
                                <div className="address my-2 flex items-center"><IoLocation className="inline mr-2" />214-218 Nguyen Phuoc Lan, Cam Le, Da Nang</div>
                            </div>
                        </div>

                        <div className=" px-4 mx-8 flex justify-start items-start flex-col space-y-6">
                            
                            <span className="text-gray-20 font-bold">Social Profiles</span>
                            <div className="social-icons flex space-x-4 flex-row items-center justify-center">

                            <a href="https://www.facebook.com/enclaveit" className="flex justify-center items-center hover:bg-gray-300 w-8 h-8 rounded-sm border border-gray-300"  target="_blank" rel="noopener noreferrer"><FaFacebook className="inline w-6 h-6 text-blue-600" /></a>
                            <a href="https://www.enclave.vn" className="flex justify-center items-center hover:bg-gray-300 w-8 h-8 rounded-sm border border-gray-300" target="_blank" rel="noopener noreferrer"><RiGlobalLine className="inline w-6 h-6" /></a>
                            <a href="https://www.linkedin.com/company/enclave.vietnam" className="flex justify-center items-center hover:bg-gray-300 w-8 h-8 rounded-sm border border-gray-300" target="_blank" rel="noopener noreferrer"><FaLinkedin className="inline w-6 h-6 text-blue-800" /></a>
                            </div>

                        </div>
                    </div>
                    <div className="mt-2 text-center text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} English Learning App. All rights reserved.
                    </div>
                </div>
            </footer>
        </>
    )
}