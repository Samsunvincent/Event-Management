export default function UserRegistration() {
    return (
        <>
            <>
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
                    <h2 className="text-2xl font-semibold mb-6">Personal Details</h2>
                    <form className="grid grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="first-name">
                                First Name
                            </label>
                            <input
                                className="w-full px-3 py-2 border rounded-lg"
                                type="text"
                                id="first-name"
                                defaultValue="Samsun"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="last-name">
                                Last Name
                            </label>
                            <input
                                className="w-full px-3 py-2 border rounded-lg"
                                type="text"
                                id="last-name"
                                defaultValue="Vincent"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="email">
                                Email
                            </label>
                            <input
                                className="w-full px-3 py-2 border rounded-lg"
                                type="email"
                                id="email"
                                placeholder="example@example.com"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="phone">
                                Phone
                            </label>
                            <input
                                className="w-full px-3 py-2 border rounded-lg"
                                type="tel"
                                id="phone"
                                placeholder="123-456-7890"
                            />
                        </div>
                        <div className="mb-4 relative">
                            <label className="block text-gray-700 mb-2" htmlFor="password">
                                Password
                            </label>
                            <input
                                className="w-full px-3 py-2 border rounded-lg"
                                type="password"
                                id="password"
                                placeholder="********"
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 px-3 py-2 text-gray-600"
                                onclick="togglePassword()"
                            >
                                <i id="toggleIcon" className="far fa-eye" />
                            </button>
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 mb-2" htmlFor="usertype">
                                User Type
                            </label>
                            <select className="w-full px-3 py-2 border rounded-lg" id="usertype">
                                <option value="admin">Admin</option>
                                <option value="user">User</option>
                                <option value="guest">Guest</option>
                            </select>
                        </div>
                    </form>
                </div>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
                />
            </>

        </>
    )
}