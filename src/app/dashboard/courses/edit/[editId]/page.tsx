import React from "react";
import { AddCourseForm } from "../../_components";

function EditCourse({ params }: { params: { editId: string } }) {
   return (
      <div className="dash-bg">
         <h1 className="subtitle">Update Course</h1>
         <AddCourseForm editId={params?.editId} />
      </div>
   );
}

export default EditCourse;
