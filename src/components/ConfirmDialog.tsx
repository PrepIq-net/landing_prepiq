import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";

type ConfirmDialogProps = {
  trigger: React.ReactNode;
  title: string;
  description: string;
  action: () => Promise<void>;
};

export function ConfirmDialog({
  trigger,
  title,
  description,
  action,
}: ConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>

      <AlertDialogContent className="bg-[#1C1C1F] border border-[#2A2A2E]">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <form action={action}>
            <AlertDialogAction asChild>
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Confirm
              </Button>
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
