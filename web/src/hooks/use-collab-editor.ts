import { Editor } from "@tiptap/core";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCaret from "@tiptap/extension-collaboration-caret";
import Highlight from "@tiptap/extension-highlight";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TableKit } from "@tiptap/extension-table";
import TextAlign from "@tiptap/extension-text-align";
import { Placeholder } from "@tiptap/extensions";
import { Markdown } from "@tiptap/markdown";
import { useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { prosemirrorJSONToYDoc } from "@tiptap/y-tiptap";
import { uniqBy } from "lodash-es";
import { nanoid } from "nanoid";
import {
  useCallback,
  useEffect,
  useEffectEvent,
  useMemo,
  useRef,
  useState,
} from "react";
import { IndexeddbPersistence } from "y-indexeddb";
import YProvider from "y-partyserver/provider";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";
import { useUser } from "@/contexts/user-context";
import type { UserInfo } from "@/lib/tiptap";
import { getRoomKey, Y_FRAGMENT_NAME } from "@/lib/tiptap";

type UseCollabEditorResult = {
  editor: Editor | null;
  uniqueUsers: (UserInfo & { clientId: number })[];
  startSession: () => string | null;
};

export const useCollabEditor = (
  room: string | undefined,
): UseCollabEditorResult => {
  const { user: currentUser } = useUser();
  const currentUserRef = useRef(currentUser);
  currentUserRef.current = currentUser;

  const seedDocRef = useRef<Y.Doc | null>(null);
  const [editor, setEditor] = useState<Editor | null>(null);

  const UpdateEditorUser = useEffectEvent((user: UserInfo) => {
    editor?.commands.updateUser(user);
  });

  useEffect(() => {
    UpdateEditorUser(currentUser);
  }, [currentUser]);

  const startSession = useCallback(() => {
    if (!editor || seedDocRef.current) return null;
    seedDocRef.current = prosemirrorJSONToYDoc(
      editor.schema,
      editor.getJSON(),
      Y_FRAGMENT_NAME,
    );
    return nanoid();
  }, [editor]);

  useEffect(() => {
    let mounted = true;
    const roomKey = getRoomKey(room);
    const yDoc = seedDocRef.current ?? new Y.Doc();
    seedDocRef.current = null;

    const idb = new IndexeddbPersistence(roomKey, yDoc);
    const partyserverUrl =
      import.meta.env.VITE_PARTYSERVER_URL || "localhost:8787";
    const provider = room
      ? new YProvider(partyserverUrl, roomKey, yDoc, {
          party: "my-y-server",
        })
      : new WebrtcProvider(roomKey, yDoc, { signaling: [] }); // for cross-tab sync only

    const newEditor = new Editor({
      extensions: [
        Markdown,
        StarterKit.configure({
          undoRedo: false,
        }),
        TableKit,
        TaskList,
        TaskItem.configure({
          nested: true,
        }),
        Placeholder.configure({
          placeholder: "Start typing...",
        }),
        Highlight,
        TextAlign.configure({
          types: ["heading", "paragraph"],
          defaultAlignment: "left",
        }),
        Collaboration.configure({
          document: yDoc,
          field: Y_FRAGMENT_NAME,
        }),
        CollaborationCaret.configure({
          provider,
          user: currentUserRef.current,
        }),
      ],
      editorProps: {
        attributes: {
          class:
            "prose lg:prose-lg prose-a:text-blue-500 selection:bg-blue-500/25 focus:outline-none",
        },
      },
      editable: false,
    });

    idb.whenSynced.then(() => {
      if (!mounted) return;
      newEditor.setEditable(true);
    });

    setEditor(newEditor);

    return () => {
      mounted = false;
      provider.destroy();
      idb.destroy().then(() => {
        yDoc.destroy();
      });
      newEditor.destroy();
    };
  }, [room]);

  useEffect(() => {
    editor?.view.dispatch(editor.state.tr); // force useEditorState to update
  }, [editor]);

  const users = useEditorState({
    editor,
    selector: ({ editor }) => {
      return editor?.storage.collaborationCaret.users || [];
    },
  });

  const uniqueUsers = useMemo(() => {
    return uniqBy(users || [], (user) => user.id).filter(
      (u) => u.id !== currentUser.id,
    ) as (UserInfo & { clientId: number })[];
  }, [users, currentUser.id]);

  return {
    editor,
    uniqueUsers,
    startSession,
  };
};
