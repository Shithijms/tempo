
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface QuizGenerationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerateQuiz: () => void;
}

export const QuizGenerationDialog = ({ open, onOpenChange, onGenerateQuiz }: QuizGenerationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Quiz</DialogTitle>
          <DialogDescription>
            Would you like to generate a quiz from the uploaded PDF?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-4 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onGenerateQuiz}>
            Generate Quiz
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
