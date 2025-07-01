import React from "react";
import { AddWebinarForm } from "../../_components";

function EditWebinarPage({ params }: { params: { editId: string } }) {
   return (
      <div className="dash-bg">
         <h1 className="subtitle">Update Webinar</h1>
         <AddWebinarForm editId={params?.editId} />
      </div>
   );
}

export default EditWebinarPage;
