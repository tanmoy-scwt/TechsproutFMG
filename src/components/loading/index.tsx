import "./style.css";

function Loading() {
   return (
      <div id="loading">
         <div>
            <svg
               id="L1"
               xmlns="http://www.w3.org/2000/svg"
               xmlnsXlink="http://www.w3.org/1999/xlink"
               x="0px"
               y="0px"
               viewBox="0 0 100 100"
               enableBackground="new 0 0 100 100"
               xmlSpace="preserve"
            >
               <circle
                  fill="none"
                  stroke="#0f88dc"
                  strokeWidth={6}
                  strokeMiterlimit={15}
                  strokeDasharray="14.2472,14.2472"
                  cx={50}
                  cy={50}
                  r={47}
               >
                  <animateTransform
                     attributeName="transform"
                     attributeType="XML"
                     type="rotate"
                     dur="5s"
                     from="0 50 50"
                     to="360 50 50"
                     repeatCount="indefinite"
                  />
               </circle>
               <circle
                  fill="none"
                  stroke="#0f88dc"
                  strokeWidth={1}
                  strokeMiterlimit={10}
                  strokeDasharray="10,10"
                  cx={50}
                  cy={50}
                  r={39}
               >
                  <animateTransform
                     attributeName="transform"
                     attributeType="XML"
                     type="rotate"
                     dur="5s"
                     from="0 50 50"
                     to="-360 50 50"
                     repeatCount="indefinite"
                  />
               </circle>
               <g fill="#0f88dc">
                  <rect x={30} y={35} width={5} height={30}>
                     <animateTransform
                        attributeName="transform"
                        dur="1s"
                        type="translate"
                        values="0 5 ; 0 -5; 0 5"
                        repeatCount="indefinite"
                        begin={0.1}
                     />
                  </rect>
                  <rect x={40} y={35} width={5} height={30}>
                     <animateTransform
                        attributeName="transform"
                        dur="1s"
                        type="translate"
                        values="0 5 ; 0 -5; 0 5"
                        repeatCount="indefinite"
                        begin={0.2}
                     />
                  </rect>
                  <rect x={50} y={35} width={5} height={30}>
                     <animateTransform
                        attributeName="transform"
                        dur="1s"
                        type="translate"
                        values="0 5 ; 0 -5; 0 5"
                        repeatCount="indefinite"
                        begin={0.3}
                     />
                  </rect>
                  <rect x={60} y={35} width={5} height={30}>
                     <animateTransform
                        attributeName="transform"
                        dur="1s"
                        type="translate"
                        values="0 5 ; 0 -5; 0 5"
                        repeatCount="indefinite"
                        begin={0.4}
                     />
                  </rect>
                  <rect x={70} y={35} width={5} height={30}>
                     <animateTransform
                        attributeName="transform"
                        dur="1s"
                        type="translate"
                        values="0 5 ; 0 -5; 0 5"
                        repeatCount="indefinite"
                        begin={0.5}
                     />
                  </rect>
               </g>
            </svg>
         </div>
      </div>
   );
}

export default Loading;
