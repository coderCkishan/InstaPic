import Image from "next/image"
import{
    SearchIcon,
    PlusCircleIcon,
    UserGroupIcon,
    HeartIcon,
    MenuIcon,
} from "@heroicons/react/outline";
import{HomeIcon} from "@heroicons/react/solid"
import { useSession , signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { modalState } from "../../atoms/modalAtom";
import {TotalLike} from "../../atoms/TotalLikes"
function Header() {

    const { data: session } = useSession();
    const [open, setOpen] = useRecoilState(modalState);
    const [TotalLikes,setTotalLikes] = useRecoilState(TotalLike);
    const router= useRouter();

    return (
        <div className="shadow-sm border-b bg-white sticky top-0 z-50">
            <div className="flex justify-between max-w-6xl mx-5 lg:mx-auto">

                {/* left */}
                <div onClick={() => router.push('/')} className="relative hidden lg:inline-grid w-24 cursor-pointer">
                    <Image src="/hlogo.png" layout="fill" objectFit="contain"/>
                </div>
                <div onClick={()=> router.push('/')} className="relative w-12 lg:hidden flex-shrink-0 cursor-pointer">
                    <Image src="/mlogo.png" layout="fill" objectFit="contain" />
                </div>

                {/* middle - search_bar*/}
                <div className="max-w-xs">
                <div className="relative mt-1 p-3 rounded-md">
                    <div className="absolute inset-y-0 pl-3 flex items-center pointer-events-none">
                      <SearchIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <input className="bg-gray-50 block w-full pl-10 sn:text-sm border-gray-300 focus:ring-black focus:border-black rounded-md" type="text" placeholder="Search" />
                </div>
                </div>

                {/* right */}
                <div className="flex items-center justify-end space-x-4">
                <HomeIcon onClick={()=> router.push('/')} className="navBtn"/>
                <MenuIcon className="h-6 md:hidden cursor-pointer"/>

                {session ? (
                    <>
                    <PlusCircleIcon onClick={()=> setOpen(true)} className="navBtn" />
                    <UserGroupIcon className="navBtn" />
                    <div className="relative navBtn">
                    <HeartIcon className="navBtn" /><div className="absolute -top-1 -right-2 text-xs w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse text-white">{TotalLikes}</div>
                    </div>
                    <img onClick={signOut} src={session.user.image} alt="profile pic" className="h-10 rounded-lg cursor-pointer" />
                    </>
                ):(
                    <button onClick={signIn} >SignIn</button>
                )}
               </div>
            </div>
        </div>
    );
}

export default Header