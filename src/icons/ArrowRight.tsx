function ArrowRight({ size = 15, ...props }) {
   return (
      <svg
         width={size}
         height={size}
         viewBox="0 0 25 20"
         fill="none"
         xmlns="http://www.w3.org/2000/svg"
         {...props}
      >
         <path
            d="M9.05151 4.88574L16.5515 12.3857L9.05151 19.8857"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
         />
      </svg>
   );
}

export default ArrowRight;
