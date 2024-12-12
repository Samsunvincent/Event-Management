export default function Nav() {
    return (
        <>
            <nav className="flex items-center justify-between p-4">
                <div className="flex items-center">
                    <img
                        alt="bookmyshow logo"
                        className="h-10"
                        height={40}
                        src="https://storage.googleapis.com/a1aa/image/BHZg8VIn7DIeEqRCgVWXZoeewZ3yWUospLrI04cmjm7kBZ0nA.jpg"
                        width={100}
                    />
                </div>
                <div className="flex items-center w-full max-w-md mx-4">
                    <div className="relative w-full">
                        <input
                            className="w-full py-2 pl-10 pr-4 border rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300"
                            placeholder="Search for Movies, Events, Plays, Sports and Activities"
                            type="text"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <i className="fas fa-search text-gray-400"></i>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <span className="mr-1">Kochi</span>
                        <i className="fas fa-chevron-down"></i>
                    </div>
                    <button className="px-4 py-2 text-white bg-red-500 rounded-full">
                        Sign in
                    </button>
                    <i className="fas fa-bars text-xl"></i>
                </div>
            </nav>

        </>
    )
}