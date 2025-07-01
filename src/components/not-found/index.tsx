import "./style.css";
import Image from "next/image";

function NotFound() {
   return (
      <div id="not-found" className="container">
         <Image src="/img/common/not-found.svg" width={350} height={350} alt="Page Not Found" />
      </div>
   );
}

export default NotFound;
