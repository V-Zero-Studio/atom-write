import { atom } from "jotai";
import { focusAtom } from "jotai-optics";
import { EditorState } from "lexical";

import { MouseActivityType } from "@/components/lexical-editor/plugins/mouse-activity";
import { DEFAULT_MOUSE_ACTIVITY } from "@/lib/constants";

import { BlockAnnotation } from "./block-atom";

export const MIN_THRESHOLD_IN_SEC = 1;

export type UserBehaviorItem = {
  typing_speed: number;
  revisions: {
    character_deletions: number[];
    range_deletions: number[];
    insertions: number[];
    pastings: number[];
  };
  mouse_activity: MouseActivityType;
};

export type UserBehaviorType = {
  sentence: UserBehaviorItem;
  paragraph: UserBehaviorItem;
  document: UserBehaviorItem;
  since_last_block: UserBehaviorItem;
};

export const defaultUserBehavior: UserBehaviorType = {
  sentence: {
    typing_speed: 0,
    revisions: {
      character_deletions: [],
      range_deletions: [],
      insertions: [],
      pastings: [],
    },
    mouse_activity: DEFAULT_MOUSE_ACTIVITY,
  },
  paragraph: {
    typing_speed: 0,
    revisions: {
      character_deletions: [],
      range_deletions: [],
      insertions: [],
      pastings: [],
    },
    mouse_activity: DEFAULT_MOUSE_ACTIVITY,
  },
  document: {
    typing_speed: 0,
    revisions: {
      character_deletions: [],
      range_deletions: [],
      insertions: [],
      pastings: [],
    },
    mouse_activity: DEFAULT_MOUSE_ACTIVITY,
  },
  since_last_block: {
    typing_speed: 0,
    revisions: {
      character_deletions: [],
      range_deletions: [],
      insertions: [],
      pastings: [],
    },
    mouse_activity: DEFAULT_MOUSE_ACTIVITY,
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
  save_time: Date;
  logs: LogItem[];
  blocks: BlockType[];
  written_text: string;
};

export type BlockType = {
  id: string;
  start_time: number;
  duration: number;
  threshold: number;

  relative_start_time: number;
  num_blocks: number;
  avg_block_duration: number;

  sentence_completion: number;
  overall_word_cnt: number;
  overall_sentence_cnt: number;

  block_sentence: string;

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
  timeTravelReplayerState: "idle" | "playing" | "finished" | "looping";
  latestEditorState: EditorState | null;

  currentSessionId?: string;
  blockThresholdInSec: number;
}>({
  timeTravelState: "recording",
  timeTravelRecorderState: "idle",
  timeTravelReplayerState: "idle",
  latestEditorState: null,
  blockThresholdInSec: 5,
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
      save_time: new Date(),
      logs: [],
      blocks: [],
      written_text: "",
    }
  );
});
