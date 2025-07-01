import "./style.css";
import Accordion, { AccordionItem } from "@/components/accordion";

interface FaqQuestionsSectionProps {
   items: Array<{
      id: number | string;
      question: string;
      answer: string;
   }>;
}

function FaqQuestionsSection({ items }: FaqQuestionsSectionProps) {
   return (
      <section className="section">
         <div className="container">
            <Accordion className="faq-questions__accordion">
               {items.map((item) => (
                  <AccordionItem
                     value={item.id}
                     key={item.id}
                     triggerItem={item.question}
                     contentItem={item.answer}
                  />
               ))}
            </Accordion>
         </div>
      </section>
   );
}

export default FaqQuestionsSection;
