import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "./ui/dialog"
import { Button } from "./ui/button"

type LeavingDialogProps = {
  isOpen: boolean;
  yesCallback: () => void;
  noCallback: () => void;
};

export const LeavingDialog = ({ isOpen, yesCallback, noCallback }: LeavingDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={() => noCallback()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            The data will be lost.
          </DialogTitle>
          <DialogDescription>Are you sure you want to leave the page?</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={noCallback}>No</Button>
          </DialogClose>
          <Button onClick={yesCallback}>Yes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};