import {
   BookmarkIcon,
   AnnotationIcon,
   EmojiHappyIcon,
   HeartIcon,
} from "@heroicons/react/outline";

import{ HeartIcon as HeartIconFilled } from "@heroicons/react/solid"
import {  addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { db} from "../../firebase";
import Moment from "react-moment";
import moment from "moment-timezone";
import {TotalLike} from "../../atoms/TotalLikes"
import {useRecoilState,useRecoilValue} from "recoil"

function Post({id,username,userImg,img,caption}) {
    const {data: session} = useSession();
    const [comment,setComment] = useState("");
    const [comments, setComments] = useState([]);
    const [likes,setLikes] = useState([]);
    const [TotalLikes,setTotalLikes] = useRecoilState(TotalLike);
    var totalLike = useRecoilValue(TotalLike);
    const [cycle,setCycle] = useState(true)
    const [hasLiked, setHasLiked] = useState(false);

    const DeletePost = async (id) =>{
       await deleteDoc(doc(db, "posts", `${id}`));
    };

    useEffect(()=> onSnapshot(query(collection(db,"posts",id,"comments"),orderBy("timestamp","desc")),snapshot => 
    setComments(snapshot.docs)), [db,id])

    const likesPost = async () =>{
        if(hasLiked){
           await deleteDoc(doc(db,'posts',id,'likes',session.user.uid));
           setCycle(false);
           if(session?.user?.username==username){
            totalLike--;
           setTotalLikes(totalLike);
           }
        }
        else{
        await setDoc(doc(db,'posts',id,'likes',session.user.uid),{
            username: session.user.username,
        });
        setCycle(false);
        if(session?.user?.username==username){
        totalLike++;
        setTotalLikes(totalLike);
        }
       }
    };

    const sendComment = async (e) =>{
        e.preventDefault();

        const commentToSend = comment;
        setComment('');

        await addDoc(collection(db, 'posts', id, 'comments'),{
            comment: commentToSend,
            username: session.user.username,
            userImage: session.user.image,
            timestamp: serverTimestamp(),
        });
    }

    useEffect(() => onSnapshot(collection(db,'posts',id,'likes'), (snapshot) => setLikes(snapshot.docs)), [db,id]);    

    useEffect(()=>{
        if(session?.user?.username == username && cycle ){
            totalLike= likes.length + totalLike;
            setTotalLikes(totalLike);
        }
    },[likes])

    useEffect(() => 
    setHasLiked(likes.findIndex((like) => like.id === session?.user?.uid) !== -1)
    ,[likes])

    return (
        <div className="bg-white my-7 border rounded-sm">
            {/* Header */}
            <div className="flex items-center p-5">
                <img src={userImg} className="rounded-full h-12 w-12 object-contain border p-1 mr-3" alt="" />
                <p className="flex-1 font-bold">{username}</p>
               { session?.user?.username==username && <button className="h-5 text-red-600 " onClick={() => DeletePost(id)} >Delete</button> } 
            </div> 
           
            {/* img */}
            <img src={img} className="object-cover w-full" alt="" />
             
            {/* Buttons */}
            {session && (
            <div className="flex justify-between pt-4 px-4">
            <div className="flex space-x-4">
             {
                 hasLiked ? (
                    <HeartIconFilled  onClick={likesPost} className="btn text-red-500" />
                 ): (
                    <HeartIcon  onClick={likesPost} className="btn" />
                 )
             }   
            <AnnotationIcon className="btn" />
            </div>
            <BookmarkIcon className="btn text-red-500" />
            </div>
            )} 

            {/* caption */}
            <div className="p-5 truncate">
                {likes.length > 0 && (<p className="font-bold mb-1">{likes.length} likes</p>)}
            <span className="font-bold mr-1">{username} </span>
            {caption}    
            </div>
            
            {/* comments */}
            {comments.length > 0 && (
                <div className="ml-10 h-20 overflow-y-scroll scrollbar-thumb-black scrollbar-thin">
                    {comments.map((comment) => (
                        <div key={comment.id} className="flex items-center space-x-2 mb-3">
                          <img  className="h-7 rounded-full" src={comment.data().userImage} alt="" />
                          <p className="text-sm flex-1"><span className="font-bold">{comment.data().username}</span> {comment.data().comment}</p>

                          <Moment className="pr-5 text-xs" fromNow>{comment.data().timestamp?.toDate()}</Moment>
                        </div>
                    ))}
                </div>
            )}

            {/* input Box */}
            {session && (
            <form className="flex items-center p-4" >
            <EmojiHappyIcon className="h-7" />
            <input type="text" value={comment} onChange={e=> setComment(e.target.value)} placeholder="Add a comment..." className="border-none flex-1 focus:ring-0 outline-none" />
            <button type='submit' disabled={!comment.trim()} onClick={sendComment} className="font-semibold text-blue-600">Post</button>
            </form>
            )}

        </div>
    )
}

export default Post
