"use client";

import "./style.css";
import { CommentCard } from "../../_components";
import { CommentCardContent } from "../comment-card";

function InfiniteComments({ postId }: { postId: string | number }) {
   console.log(postId)
   const comments: Array<CommentCardContent> = [
      {
         id: "1",
         date: new Date().toISOString(),
         coverImage: "/img/home/top-trainers-demo.webp",
         previewCoverImage:
            "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAADwAQCdASoKAAoAAgA0JQBWACHeiEEZDgAA/vfgQe4FQVD0EG+A7IW9ebDYk7Af8pmasLhnhs77gb9Nb6sMkWiv8a3rVPL/eRXPW7nj9dZpZSHrhPI9h7gA",
         name: "Anonymous",
         comment:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae eveniet excepturi suscipit, aut, delectus quam sunt quisquam corrupti iusto minima earum obcaecati et quis modi? Voluptatibus ex magnam debitis esse!",
      },
      {
         id: "2",
         date: "2024-10-24T11:14:34.730Z",
         coverImage: "/img/home/top-trainers-demo.webp",
         previewCoverImage:
            "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAADwAQCdASoKAAoAAgA0JQBWACHeiEEZDgAA/vfgQe4FQVD0EG+A7IW9ebDYk7Af8pmasLhnhs77gb9Nb6sMkWiv8a3rVPL/eRXPW7nj9dZpZSHrhPI9h7gA",
         name: "Anonymous",
         comment:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae eveniet excepturi suscipit, aut, delectus quam sunt quisquam corrupti iusto minima earum obcaecati et quis modi? Voluptatibus ex magnam debitis esse!",
      },
      {
         id: "3",
         date: "2024-09-24T11:14:34.730Z",
         coverImage: "/img/home/top-trainers-demo.webp",
         previewCoverImage:
            "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAADwAQCdASoKAAoAAgA0JQBWACHeiEEZDgAA/vfgQe4FQVD0EG+A7IW9ebDYk7Af8pmasLhnhs77gb9Nb6sMkWiv8a3rVPL/eRXPW7nj9dZpZSHrhPI9h7gA",
         name: "Anonymous",
         comment:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae eveniet excepturi suscipit, aut, delectus quam sunt quisquam corrupti iusto minima earum obcaecati et quis modi? Voluptatibus ex magnam debitis esse!",
      },
      {
         id: "4",
         date: "2023-11-24T11:14:34.730Z",
         coverImage: "/img/home/top-trainers-demo.webp",
         previewCoverImage:
            "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAADwAQCdASoKAAoAAgA0JQBWACHeiEEZDgAA/vfgQe4FQVD0EG+A7IW9ebDYk7Af8pmasLhnhs77gb9Nb6sMkWiv8a3rVPL/eRXPW7nj9dZpZSHrhPI9h7gA",
         name: "Anonymous",
         comment:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae eveniet excepturi suscipit, aut, delectus quam sunt quisquam corrupti iusto minima earum obcaecati et quis modi? Voluptatibus ex magnam debitis esse!",
      },
      {
         id: "5",
         date: "2013-10-24T11:14:34.730Z",
         coverImage: "/img/home/top-trainers-demo.webp",
         previewCoverImage:
            "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAADwAQCdASoKAAoAAgA0JQBWACHeiEEZDgAA/vfgQe4FQVD0EG+A7IW9ebDYk7Af8pmasLhnhs77gb9Nb6sMkWiv8a3rVPL/eRXPW7nj9dZpZSHrhPI9h7gA",
         name: "Anonymous",
         comment:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae eveniet excepturi suscipit, aut, delectus quam sunt quisquam corrupti iusto minima earum obcaecati et quis modi? Voluptatibus ex magnam debitis esse!",
      },
   ];

   return (
      <div className="inf-comments">
         <div className="inf-comments__inner--container">
            {comments.map((comment) => (
               <CommentCard content={comment} key={comment.id} />
            ))}
         </div>
         <button className="button__primary-light">View All Comments</button>
      </div>
   );
}

export default InfiniteComments;
