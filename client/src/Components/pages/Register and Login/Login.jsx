import React, { useCallback, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import LoginRoute from "../../functionalities/LoginRoute";
import { useNavigate } from "react-router-dom";

export default function Login() {

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate()

    const handleLogin = useCallback((event) => {
        event.preventDefault()
        const formData = { email, password };
        LoginRoute(formData, navigate)
    }, [email, password, navigate])



    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            {/* Centered Box */}
            <div className="flex w-[800px] h-[450px] bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Left Side - Carousel */}
                <div className="w-1/2 bg-gray-200 p-4 flex items-center">
                    <Swiper
                        modules={[Autoplay, Pagination, Navigation]}
                        spaceBetween={30}
                        pagination={{ clickable: true }}

                        autoplay={{ delay: 3000, disableOnInteraction: false }}
                        className="w-full h-full"
                    >
                        <SwiperSlide>
                            <img
                                src="https://assets-in.bmscdn.com/nmcms/events/banner/desktop/media-desktop-coldplay-music-of-the-spheres-world-tour-0-2024-11-14-t-8-17-14.jpg"
                                alt="Carousel Image 1"
                                className="w-full h-full"
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img
                                src="https://assets-in.bmscdn.com/nmcms/events/banner/desktop/media-desktop-mridanga-naadam-0-2024-11-30-t-11-22-58.jpg"
                                alt="Carousel Image 2"
                                className="w-full h-full "
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <img
                                src="https://assets-in.bmscdn.com/nmcms/events/banner/desktop/media-desktop-vineeth-sreenivasan-live-in-concert-0-2024-11-20-t-6-16-46.jpg"
                                alt="Carousel Image 3"
                                className="w-full h-full"
                            />
                        </SwiperSlide>
                    </Swiper>
                </div>

                {/* Right Side - Login Form */}
                <div className="w-1/2 flex items-center justify-center bg-gray-50">
                    <form className="w-3/4" onSubmit={handleLogin}>
                        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your email"
                                required
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="w-full p-2 mt-1 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter your password"
                                required
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                        >
                            Sign In
                        </button>
                        <p className="text-sm text-gray-500 mt-4 text-center">
                            Don’t have an account?{" "}
                            <a href="/register" className="text-blue-500 hover:underline">
                                Sign Up
                            </a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
