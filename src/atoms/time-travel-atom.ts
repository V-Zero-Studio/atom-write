import { atom } from "jotai";
import { focusAtom } from "jotai-optics";
import { EditorState } from "lexical";

import { BlockAnnotation } from "./block-atom";

export const MIN_THRESHOLD_IN_SEC = 5;

export type UserBehaviorItem = {
  typing_speed: number;
  revisions: {
    character_deletings: number;
    range_deletings: number;
    insertings: number;
    pastings: number;
  };
  sentence_completion: number;
};

export type UserBehaviorType = {
  sentence: UserBehaviorItem;
  paragraph: UserBehaviorItem;
  document: UserBehaviorItem;
};

export const defaultUserBehavior: UserBehaviorType = {
  sentence: {
    typing_speed: 0,
    revisions: {
      character_deletings: 0,
      range_deletings: 0,
      insertings: 0,
      pastings: 0,
    },
    sentence_completion: 0,
  },
  paragraph: {
    typing_speed: 0,
    revisions: {
      character_deletings: 0,
      range_deletings: 0,
      insertings: 0,
      pastings: 0,
    },
    sentence_completion: 0,
  },
  document: {
    typing_speed: 0,
    revisions: {
      character_deletings: 0,
      range_deletings: 0,
      insertings: 0,
      pastings: 0,
    },
    sentence_completion: 0,
  },
};

export type LogItem = {
  id: string;
  time: number;
  editorState: EditorState;
  blockId?: string;
  // blockAnnotation?: BlockAnnotation;
};

export type Session = {
  id: string;
  saveTime: Date;
  logs: LogItem[];
  blocks: BlockType[];
};

export type BlockType = {
  id: string;
  start_time: number;
  duration_block: number;
  threshold: number;

  user_behavior: UserBehaviorType;
  annotated: boolean;
  annotation: BlockAnnotation;
};

export const blocksAtom = atom<BlockType[]>([]);

export type SessionList = Session[];

export const sessionListAtom = atom<SessionList>([]);

// put above together as a single atom
export const timeTravelAtom = atom<{
  timeTravelState: "recording" | "replaying";
  timeTravelRecorderState: "idle" | "recording";
  timeTravelReplayerState: "idle" | "playing" | "finished";
  latestEditorState: EditorState | null;

  currentSessionId?: string;
  blockThresholdInSec: number;
}>({
  timeTravelState: "recording",
  timeTravelRecorderState: "idle",
  timeTravelReplayerState: "idle",
  latestEditorState: null,
  blockThresholdInSec: MIN_THRESHOLD_IN_SEC,
});

export const timeTravelRecorderStateAtom = focusAtom(timeTravelAtom, (optic) =>
  optic.prop("timeTravelRecorderState")
);

export const timeTravelReplayerStateAtom = focusAtom(timeTravelAtom, (optic) =>
  optic.prop("timeTravelReplayerState")
);

export const timeTravelStateAtom = focusAtom(timeTravelAtom, (optic) =>
  optic.prop("timeTravelState")
);

export const latestEditorStateAtom = focusAtom(timeTravelAtom, (optic) =>
  optic.prop("latestEditorState")
);

export const blockThresholdInSecAtom = focusAtom(timeTravelAtom, (optic) =>
  optic.prop("blockThresholdInSec")
);

export const currentSessionIdAtom = focusAtom(timeTravelAtom, (optic) =>
  optic.prop("currentSessionId")
);

export const currentSessionAtom = atom<Session>((get) => {
  const currentSessionId = get(currentSessionIdAtom);
  const sessionList = get(sessionListAtom);
  return (
    sessionList.find((session) => session.id === currentSessionId) ?? {
      id: "",
      saveTime: new Date(),
      logs: [],
      blocks: [],
    }
  );
});
