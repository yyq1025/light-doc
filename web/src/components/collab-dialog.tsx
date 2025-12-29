import { useForm } from "@tanstack/react-form";
import { Check, Copy, Play } from "lucide-react";
import { useEffect } from "react";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useUser } from "@/contexts/user-context";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type CollabDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room?: string;
  onStartSession: () => void;
};

export function CollabDialog({
  open,
  onOpenChange,
  room,
  onStartSession,
}: CollabDialogProps) {
  const { user, updateUser } = useUser();
  const { copyToClipboard, isCopied } = useCopyToClipboard();
  const form = useForm({
    defaultValues: {
      name: user.name,
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      updateUser({
        ...user,
        name: value.name,
      });
    },
  });

  useEffect(() => {
    form.reset({ name: user.name });
  }, [user.name, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Live Collaboration</DialogTitle>
          <DialogDescription>
            Invite people to collaborate on your doc.
          </DialogDescription>
        </DialogHeader>

        {room ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
              onOpenChange(false);
            }}
            className="contents"
          >
            <FieldGroup className="gap-4">
              <form.Field name="name">
                {(field) => (
                  <Field
                    data-invalid={!field.state.meta.isValid}
                    className="gap-2"
                  >
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={!field.state.meta.isValid}
                      placeholder="Enter your name"
                      autoComplete="off"
                    />
                    {!field.state.meta.isValid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )}
              </form.Field>
              <Field className="gap-2">
                <FieldLabel htmlFor="link">Link</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="link"
                    name="link"
                    placeholder={window.location.href}
                    readOnly
                  />
                  <InputGroupAddon align="inline-end">
                    <InputGroupButton
                      aria-label="Copy"
                      title="Copy"
                      size="icon-xs"
                      onClick={() => {
                        copyToClipboard(window.location.href);
                      }}
                    >
                      {isCopied ? <Check /> : <Copy />}
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              <form.Subscribe selector={(state) => state.isDefaultValue}>
                {(isDefaultValue) => (
                  <Button type="submit" disabled={isDefaultValue}>
                    Save
                  </Button>
                )}
              </form.Subscribe>
            </DialogFooter>
          </form>
        ) : (
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" disabled={!!room} onClick={onStartSession}>
              <Play /> Start Session
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
