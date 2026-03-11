import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface CalendlyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CALENDLY_URL = "https://calendly.com/your-link-here"; // Replace with your real Calendly URL

const CalendlyModal = ({ open, onOpenChange }: CalendlyModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] h-[85vh] max-h-[750px] p-0 overflow-hidden rounded-2xl border-border/60 bg-card">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl font-semibold text-foreground">
            Book a Demo
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Pick a time that works for you — we'll show you how PrepIQ can transform your kitchen ops.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 px-6 pb-6 h-full">
          <iframe
            src={CALENDLY_URL}
            width="100%"
            height="100%"
            frameBorder="0"
            title="Schedule a demo"
            className="rounded-xl border border-border/40 min-h-[550px]"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalendlyModal;
