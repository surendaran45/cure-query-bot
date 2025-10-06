import { AlertCircle } from "lucide-react";

export const DisclaimerFooter = () => {
  return (
    <div className="mt-6 p-4 bg-accent/50 rounded-xl border border-primary/20 shadow-soft">
      <div className="flex gap-3 items-start">
        <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Medical Disclaimer:</strong> This chatbot provides general health information for educational purposes only. 
            It is not a substitute for professional medical advice, diagnosis, or treatment. 
            Always consult a qualified healthcare provider for serious health concerns.
          </p>
        </div>
      </div>
    </div>
  );
};
