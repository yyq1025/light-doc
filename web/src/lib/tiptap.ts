import { getRandomUsername } from "@excalidraw/random-username";
import { random } from "lodash-es";
import { nanoid } from "nanoid";
import * as z from "zod";

const UserInfoSchema = z.object({
  name: z.string().min(1),
  color: z.string().min(4),
  id: z.nanoid(),
});

export type UserInfo = z.infer<typeof UserInfoSchema>;

export const Y_FRAGMENT_NAME = "tiptap";

export const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;

  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };

  return `#${f(0)}${f(8)}${f(4)}`;
};

export const getOrCreateUser = () => {
  const key = "tiptap:user";
  try {
    const raw = localStorage.getItem(key);
    if (!raw) throw new Error("No user found");
    return UserInfoSchema.parse(JSON.parse(raw));
  } catch {
    const user: UserInfo = {
      name: getRandomUsername(),
      color: hslToHex(random(0, 360), random(55, 65), random(35, 40)),
      id: nanoid(),
    };
    localStorage.setItem(key, JSON.stringify(user));
    return user;
  }
};

export const getRoomKey = (roomId?: string | null) => {
  return roomId ? `room:${roomId}` : "solo";
};

export const downloadTextFile = ({
  filename,
  content,
  mime = "text/plain;charset=utf-8",
}: {
  filename: string;
  content: string;
  mime?: string;
}) => {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
};

const MAX_BYTES = 2 * 1024 * 1024;

export const pickAndReadTextFile = ({
  accept = ".md,text/markdown,text/plain",
} = {}) => {
  return new Promise<{ text: string } | null>((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = accept;

    const cleanup = () => {
      input.onchange = null;
      input.value = "";
    };

    input.addEventListener(
      "change",
      async () => {
        try {
          const file = input.files?.[0];
          if (!file) {
            // User cancelled
            resolve(null);
            return;
          }
          if (file.size > MAX_BYTES) {
            reject(
              new Error(
                `File size exceeds limit of ${MAX_BYTES / (1024 * 1024)} MB`,
              ),
            );
            return;
          }

          const text = await file.text();
          resolve({ text });
        } catch (err) {
          reject(err);
        } finally {
          cleanup();
        }
      },
      { once: true },
    );

    input.click();
  });
};
