import "./style.css";
import PencilIcon from "@/icons/PencilIcon";

function AddComment() {
   return (
      <button className="add-comment__button explore">
         Add Comment <PencilIcon />
      </button>
   );
}

export default AddComment;
