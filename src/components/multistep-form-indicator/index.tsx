import { Check } from "lucide-react";
import "./style.css";

interface MultistepFormIndicatorProps {
   steps: Array<{
      name: string;
   }>;
   currentStep: number;
   onStepClick?: (currentStep: number) => void;
}

function MultistepFormIndicator({ steps, currentStep, onStepClick }: MultistepFormIndicatorProps) {
   return (
      <ul className="msf__container">
         {steps.map((step, i) => {
            const stepIndex = i + 1;
            const activeClass = currentStep >= stepIndex ? "active" : "";
            const isCompleted = currentStep > stepIndex;

            return (
               <li
                  key={i}
                  className={`msf__step ${activeClass}`}
                  onClick={() => {
                     onStepClick?.(stepIndex);
                  }}
               >
                  <span className="msf__step--index">
                     {isCompleted ? <Check size={14} color="white" strokeWidth="4" /> : i + 1}
                  </span>
                  <span className="msf__step--title">{step.name}</span>
               </li>
            );
         })}
      </ul>
   );
}

export default MultistepFormIndicator;
