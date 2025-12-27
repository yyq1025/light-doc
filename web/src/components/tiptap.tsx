import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import type { Editor } from "@tiptap/core";
import { EditorContent, useEditorState } from "@tiptap/react";
import {
  Bold,
  Check,
  ChevronDown,
  CodeXml,
  Copy,
  Download,
  Eraser,
  FileUp,
  Heading,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Highlighter,
  Italic,
  List,
  ListOrdered,
  LogOut,
  Menu,
  Minus,
  Play,
  Redo,
  RemoveFormatting,
  SquareCode,
  Strikethrough,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignJustify,
  TextAlignStart,
  TextQuote,
  Underline,
  Undo,
  UserRoundPlus,
  UsersRound,
} from "lucide-react";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import * as z from "zod";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCollabEditor } from "@/hooks/use-collab-editor";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { downloadTextFile, pickAndReadTextFile } from "@/lib/tiptap";
import { cn } from "@/lib/utils";

function MenuBar({ editor }: { editor: Editor }) {
  // Read the current editor's state, and re-render the component when it changes
  const editorState = useEditorState({
    editor,
    selector: ({ editor }) => {
      return {
        isBold: editor.isActive("bold") ?? false,
        canBold: editor.can().chain().toggleBold().run() ?? false,
        isItalic: editor.isActive("italic") ?? false,
        canItalic: editor.can().chain().toggleItalic().run() ?? false,
        isStrike: editor.isActive("strike") ?? false,
        canStrike: editor.can().chain().toggleStrike().run() ?? false,
        isCode: editor.isActive("code") ?? false,
        canCode: editor.can().chain().toggleCode().run() ?? false,
        isUnderline: editor.isActive("underline") ?? false,
        canUnderline: editor.can().chain().toggleUnderline().run() ?? false,
        isHighlight: editor.isActive("highlight") ?? false,
        canHighlight: editor.can().chain().toggleHighlight().run() ?? false,
        canClearMarks: editor.can().chain().unsetAllMarks().run() ?? false,
        canClearNodes: editor.can().chain().clearNodes().run() ?? false,
        headingLevel: (editor.getAttributes("heading").level ?? null) as
          | 1
          | 2
          | 3
          | 4
          | 5
          | 6
          | null,
        isBulletList: editor.isActive("bulletList") ?? false,
        isOrderedList: editor.isActive("orderedList") ?? false,
        isCodeBlock: editor.isActive("codeBlock") ?? false,
        isBlockquote: editor.isActive("blockquote") ?? false,
        canBlockquote: editor.can().chain().toggleBlockquote().run() ?? false,
        canUndo: editor.can().chain().undo().run() ?? false,
        canRedo: editor.can().chain().redo().run() ?? false,
        isTextAlignLeft: editor.isActive({ textAlign: "left" }) ?? false,
        canTextAlignLeft:
          editor.can().chain().setTextAlign("left").run() ?? false,
        isTextAlignCenter: editor.isActive({ textAlign: "center" }) ?? false,
        canTextAlignCenter:
          editor.can().chain().setTextAlign("center").run() ?? false,
        isTextAlignRight: editor.isActive({ textAlign: "right" }) ?? false,
        canTextAlignRight:
          editor.can().chain().setTextAlign("right").run() ?? false,
        isTextAlignJustify: editor.isActive({ textAlign: "justify" }) ?? false,
        canTextAlignJustify:
          editor.can().chain().setTextAlign("justify").run() ?? false,
      };
    },
  });

  return (
    <ScrollArea className="min-w-0 bg-background/85 backdrop-blur-md rounded-md border">
      <div className="flex items-center gap-1 p-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editorState.canUndo}
              >
                <Undo />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">Undo</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editorState.canRedo}
              >
                <Redo />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">Redo</TooltipContent>
        </Tooltip>
        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-6"
        />
        <DropdownMenu modal={false}>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="inline-flex">
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "px-2 data-[state=open]:bg-accent",
                      editorState.headingLevel && "bg-accent",
                    )}
                  >
                    <span className="inline-flex items-center">
                      {editorState.headingLevel === 1 ? (
                        <Heading1 />
                      ) : editorState.headingLevel === 2 ? (
                        <Heading2 />
                      ) : editorState.headingLevel === 3 ? (
                        <Heading3 />
                      ) : editorState.headingLevel === 4 ? (
                        <Heading4 />
                      ) : editorState.headingLevel === 5 ? (
                        <Heading5 />
                      ) : editorState.headingLevel === 6 ? (
                        <Heading6 />
                      ) : (
                        <Heading />
                      )}
                      <ChevronDown className="size-3" />
                    </span>
                  </Button>
                </DropdownMenuTrigger>
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom">Heading</TooltipContent>
          </Tooltip>
          <DropdownMenuContent align="start">
            <DropdownMenuRadioGroup
              value={editorState.headingLevel?.toString()}
              onValueChange={(value) => {
                const level = parseInt(value, 10) as 1 | 2 | 3 | 4 | 5 | 6;
                editor.chain().focus().setHeading({ level }).run();
              }}
            >
              <DropdownMenuRadioItem value="1">
                <Heading1 />
                Heading 1
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="2">
                <Heading2 />
                Heading 2
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="3">
                <Heading3 />
                Heading 3
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="4">
                <Heading4 />
                Heading 4
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="5">
                <Heading5 />
                Heading 5
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="6">
                <Heading6 />
                Heading 6
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">
              <Toggle
                onPressedChange={() =>
                  editor.chain().focus().toggleBulletList().run()
                }
                pressed={editorState.isBulletList}
              >
                <List />
              </Toggle>
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">Bullet List</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">
              <Toggle
                onPressedChange={() =>
                  editor.chain().focus().toggleOrderedList().run()
                }
                pressed={editorState.isOrderedList}
              >
                <ListOrdered />
              </Toggle>
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">Ordered List</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">
              <Toggle
                onPressedChange={() =>
                  editor.chain().focus().toggleCodeBlock().run()
                }
                pressed={editorState.isCodeBlock}
              >
                <SquareCode />
              </Toggle>
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">Code Block</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">
              <Toggle
                onPressedChange={() =>
                  editor.chain().focus().toggleBlockquote().run()
                }
                disabled={!editorState.canBlockquote}
                pressed={editorState.isBlockquote}
              >
                <TextQuote />
              </Toggle>
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">Blockquote</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().clearNodes().run()}
                disabled={!editorState.canClearNodes}
              >
                <Eraser />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">Clear Formatting</TooltipContent>
        </Tooltip>
        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-6"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">
              <Toggle
                onPressedChange={() =>
                  editor.chain().focus().toggleBold().run()
                }
                disabled={!editorState.canBold}
                pressed={editorState.isBold}
              >
                <Bold />
              </Toggle>
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">Bold</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">
              <Toggle
                onPressedChange={() =>
                  editor.chain().focus().toggleItalic().run()
                }
                disabled={!editorState.canItalic}
                pressed={editorState.isItalic}
              >
                <Italic />
              </Toggle>
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">Italic</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">
              <Toggle
                onPressedChange={() =>
                  editor.chain().focus().toggleStrike().run()
                }
                disabled={!editorState.canStrike}
                pressed={editorState.isStrike}
              >
                <Strikethrough />
              </Toggle>
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">Strike</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">
              <Toggle
                onPressedChange={() =>
                  editor.chain().focus().toggleCode().run()
                }
                disabled={!editorState.canCode}
                pressed={editorState.isCode}
              >
                <CodeXml />
              </Toggle>
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">Code</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">
              <Toggle
                onPressedChange={() =>
                  editor.chain().focus().toggleUnderline().run()
                }
                disabled={!editorState.canUnderline}
                pressed={editorState.isUnderline}
              >
                <Underline />
              </Toggle>
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">Underline</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">
              <Toggle
                onPressedChange={() =>
                  editor.chain().focus().toggleHighlight().run()
                }
                disabled={!editorState.canHighlight}
                pressed={editorState.isHighlight}
              >
                <Highlighter />
              </Toggle>
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">Highlight</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().unsetAllMarks().run()}
                disabled={!editorState.canClearMarks}
              >
                <RemoveFormatting />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">Clear Marks</TooltipContent>
        </Tooltip>
        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-6"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">
              <Toggle
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("left").run()
                }
                disabled={!editorState.canTextAlignLeft}
                pressed={editorState.isTextAlignLeft}
              >
                <TextAlignStart />
              </Toggle>
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">Align Left</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">
              <Toggle
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("center").run()
                }
                disabled={!editorState.canTextAlignCenter}
                pressed={editorState.isTextAlignCenter}
              >
                <TextAlignCenter />
              </Toggle>
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">Align Center</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">
              <Toggle
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("right").run()
                }
                disabled={!editorState.canTextAlignRight}
                pressed={editorState.isTextAlignRight}
              >
                <TextAlignEnd />
              </Toggle>
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">Align Right</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">
              <Toggle
                onPressedChange={() =>
                  editor.chain().focus().setTextAlign("justify").run()
                }
                disabled={!editorState.canTextAlignJustify}
                pressed={editorState.isTextAlignJustify}
              >
                <TextAlignJustify />
              </Toggle>
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">Align Justify</TooltipContent>
        </Tooltip>
        <Separator
          orientation="vertical"
          className="data-[orientation=vertical]:h-6"
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
              >
                <Minus />
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent side="bottom">Horizontal Rule</TooltipContent>
        </Tooltip>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export default function Tiptap({ room }: { room?: string }) {
  const navigate = useNavigate();
  const {
    editor,
    currentUser,
    updateCurrentUser,
    uniqueUsers,
    prepareSeedFromEditor,
    hasSeed,
  } = useCollabEditor(room);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [showCollabDialog, setShowCollabDialog] = useState(false);
  const { copyToClipboard, isCopied } = useCopyToClipboard();
  const copyToNewRoom = () => {
    if (!editor || hasSeed) return;
    prepareSeedFromEditor();
    const roomId = nanoid();
    navigate({
      to: "/",
      search: (prev) => ({ ...prev, room: roomId }),
    });
  };
  const form = useForm({
    defaultValues: {
      name: currentUser.name,
    },
    validators: {
      onChange: formSchema,
    },
    onSubmit: ({ value }) => {
      updateCurrentUser({
        ...currentUser,
        name: value.name,
      });
    },
  });

  useEffect(() => {
    form.reset({ name: currentUser.name });
  }, [currentUser.name, form]);

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <>
      <div className="sticky top-0 z-10 grid grid-cols-[1fr_auto_1fr] gap-4">
        <div>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon">
                <Menu />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52" align="start">
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <FileUp /> Open
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        onSelect={() => setShowAlertDialog(true)}
                      >
                        Markdown (.md)
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuItem onSelect={() => setShowCollabDialog(true)}>
                  <UsersRound /> Collaboration
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Download /> Download
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        onSelect={() => {
                          if (!editor) return;
                          downloadTextFile({
                            filename: "document.md",
                            content: editor.getMarkdown(),
                            mime: "text/markdown;charset=utf-8",
                          });
                        }}
                      >
                        Markdown (.md)
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => {
                          if (!editor) return;
                          downloadTextFile({
                            filename: "document.html",
                            content: editor.getHTML(),
                            mime: "text/html;charset=utf-8",
                          });
                        }}
                      >
                        HTML (.html)
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              {room && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      variant="destructive"
                      onSelect={() =>
                        navigate({
                          to: "/",
                          search: (prev) => ({ ...prev, room: undefined }),
                        })
                      }
                    >
                      <LogOut /> Leave Session
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <MenuBar editor={editor} />
        <div className="flex justify-end gap-4">
          {room && (
            <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
              {uniqueUsers.slice(0, 2).map((user) => (
                <Tooltip key={user.id}>
                  <TooltipTrigger asChild>
                    <Avatar>
                      <AvatarFallback
                        style={{ backgroundColor: user.color, color: "white" }}
                      >
                        {user.name[0]}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">{user.name}</TooltipContent>
                </Tooltip>
              ))}
              {uniqueUsers.length > 2 && (
                <Avatar>
                  <AvatarFallback className="bg-gray-300 text-gray-800">
                    {`+${uniqueUsers.length - 2}`}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          )}
          {room ? (
            <Button variant="outline" onClick={() => setShowCollabDialog(true)}>
              <UsersRound /> Collaboration
            </Button>
          ) : (
            <Button onClick={() => setShowCollabDialog(true)}>
              <UserRoundPlus /> Share
            </Button>
          )}
          <Dialog open={showCollabDialog} onOpenChange={setShowCollabDialog}>
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
                    setShowCollabDialog(false);
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
                  <Button
                    type="button"
                    disabled={!!room || hasSeed}
                    onClick={copyToNewRoom}
                  >
                    <Play /> Start Session
                  </Button>
                </DialogFooter>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <EditorContent editor={editor} className="max-w-2xl p-6 mx-auto" />
      <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Load from file</AlertDialogTitle>
            <AlertDialogDescription>
              Loading from a file will replace your existing content. Are you
              sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async (e) => {
                try {
                  e.preventDefault();
                  const result = await pickAndReadTextFile();
                  if (result?.text && editor) {
                    if (
                      editor.commands.setContent(result.text, {
                        contentType: "markdown",
                      })
                    ) {
                      setShowAlertDialog(false);
                    } else {
                      throw new Error(
                        "Failed to load content into the editor.",
                      );
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
    </>
  );
}
