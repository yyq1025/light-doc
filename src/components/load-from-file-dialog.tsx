import type { Editor } from "@tiptap/core";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { pickAndReadTextFile } from "@/lib/tiptap";

type LoadFromFileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editor: Editor;
};

export function LoadFromFileDialog({
  open,
  onOpenChange,
  editor,
}: LoadFromFileDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Load from file</AlertDialogTitle>
          <AlertDialogDescription>
            Loading from a file will replace your existing content. Are you sure
            you want to continue?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async (e) => {
              try {
                e.preventDefault();
                const result = await pickAndReadTextFile();
                if (result?.text) {
                  if (
                    editor.commands.setContent(result.text, {
                      contentType: "markdown",
                    })
                  ) {
                    onOpenChange(false);
                  } else {
                    throw new Error("Failed to load content into the editor.");
                  }
                }
              } catch (err) {
                alert((err as Error).message);
              }
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
