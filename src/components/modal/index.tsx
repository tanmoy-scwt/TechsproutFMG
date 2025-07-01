"use client";

import "./style.css";
import Image from "next/image";
import React, { PropsWithChildren, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ModalProps extends PropsWithChildren {
   show: boolean;
   closeButton?: boolean;
   onBackdropClick?: () => void;
   backdropStyle?: React.CSSProperties;
   backdropClickEnabled?: boolean;
   modalStyle?: React.CSSProperties;
   closeButtonStyle?: React.CSSProperties;
}

const Modal = ({
   children,
   show,
   closeButton = true,
   onBackdropClick,
   backdropStyle = {},
   backdropClickEnabled = true,
   modalStyle,
   closeButtonStyle,
}: ModalProps) => {
   const initialRender = useRef(true);
   //Hiding scroll if Modal is showing
   useEffect(() => {
      if (initialRender.current) {
         initialRender.current = false;
         return () => {};
      }

      if (show) {
         document.body.classList.add("overflow-hidden");
      } else {
         document.body.classList.remove("overflow-hidden");
      }

      return () => {
         document.body.classList.remove("overflow-hidden");
      };
   }, [show]);

   if (!show) return;

   return createPortal(
      <div className={`modal`} style={modalStyle} role="dialog">
         {closeButton && (
            <div className="modal__close-btn-container" onClick={onBackdropClick} style={closeButtonStyle}>
               <Image src="/img/icons/close.svg" alt="Close" width={40} height={40} />
            </div>
         )}
         <div
            className="modal__backdrop"
            style={backdropStyle}
            onClick={backdropClickEnabled ? onBackdropClick : () => {}}
         ></div>
         {children}
      </div>,
      document.getElementById("portal") as HTMLDivElement
   );
};

export default Modal;
