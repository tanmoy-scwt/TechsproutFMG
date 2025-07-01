"use client";
import "./style.css";
import { useState } from "react";
import Image from "next/image";
import ToggleSwitch from "@/components/toggle-switch";
import { useRouter } from "next/navigation";

enum Mode {
   "Teacher" = 1,
   "Student" = 2,
}

function FaqToggleSection() {
    const router = useRouter();
   const [mode, setMode] = useState<Mode>(2);

   const handleToggleChange = (state: boolean) => {
        const parsedValue = state ? Mode.Teacher : Mode.Student;
        setMode(parsedValue);
        const params = new URLSearchParams();
            if (parsedValue) params.set("type", state ? "tutor-institute":"student");
            router.push(`?${params.toString()}`);
    };

   return (
      <section className="faq-toggle__section">
         <div className="container">
            <div className="faq-toggle__items--container">
            <div className="faq-toggle__item">
                  <Image src="/img/faq/student.svg" width={50} height={50} alt="Tutor FAQ's" />
                  <p className="faq-toggle__item-text">Student</p>
               </div>
               <ToggleSwitch id="faq-select"
               defaultState={mode === Mode.Teacher}
                        onChange={handleToggleChange} className="faq-toggle__switch" />

               <div className="faq-toggle__item">
                  <Image src="/img/faq/tutor.svg" width={50} height={50} alt="Tutor FAQ's" />
                  <p className="faq-toggle__item-text">Tutor</p>
               </div>
            </div>
         </div>
      </section>
   );
}

export default FaqToggleSection;
