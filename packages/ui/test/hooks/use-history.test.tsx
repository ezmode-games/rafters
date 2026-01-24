import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useHistory } from "../../src/hooks/use-history";

describe("useHistory", () => {
  describe("initial state", () => {
    it("returns initial state", () => {
      const { result } = renderHook(() =>
        useHistory({ initialState: "initial" }),
      );

      expect(result.current.state.current).toBe("initial");
      expect(result.current.state.canUndo).toBe(false);
      expect(result.current.state.canRedo).toBe(false);
      expect(result.current.state.undoCount).toBe(0);
      expect(result.current.state.redoCount).toBe(0);
    });

    it("works with object initial state", () => {
      const initialState = { count: 0, name: "test" };
      const { result } = renderHook(() => useHistory({ initialState }));

      expect(result.current.state.current).toEqual(initialState);
    });

    it("works with array initial state", () => {
      const initialState = [1, 2, 3];
      const { result } = renderHook(() => useHistory({ initialState }));

      expect(result.current.state.current).toEqual(initialState);
    });
  });

  describe("push", () => {
    it("updates state and triggers re-render", () => {
      const { result } = renderHook(() => useHistory({ initialState: 0 }));

      act(() => {
        result.current.push(1);
      });

      expect(result.current.state.current).toBe(1);
      expect(result.current.state.canUndo).toBe(true);
      expect(result.current.state.undoCount).toBe(1);
    });

    it("skips duplicate states when isEqual is provided", () => {
      const { result } = renderHook(() =>
        useHistory({
          initialState: { x: 0 },
          isEqual: (a, b) => a.x === b.x,
        }),
      );

      act(() => {
        result.current.push({ x: 0 });
      });

      expect(result.current.state.undoCount).toBe(0);
      expect(result.current.state.canUndo).toBe(false);
    });

    it("clears redo stack after push", () => {
      const { result } = renderHook(() => useHistory({ initialState: 0 }));

      act(() => {
        result.current.push(1);
        result.current.push(2);
      });

      act(() => {
        result.current.undo();
      });

      expect(result.current.state.canRedo).toBe(true);

      act(() => {
        result.current.push(3);
      });

      expect(result.current.state.canRedo).toBe(false);
      expect(result.current.state.redoCount).toBe(0);
    });
  });

  describe("undo/redo", () => {
    it("navigates history correctly", () => {
      const { result } = renderHook(() => useHistory({ initialState: 0 }));

      act(() => {
        result.current.push(1);
        result.current.push(2);
        result.current.push(3);
      });

      expect(result.current.state.current).toBe(3);
      expect(result.current.state.undoCount).toBe(3);

      act(() => {
        const prev = result.current.undo();
        expect(prev).toBe(2);
      });

      expect(result.current.state.current).toBe(2);
      expect(result.current.state.canUndo).toBe(true);
      expect(result.current.state.canRedo).toBe(true);

      act(() => {
        const next = result.current.redo();
        expect(next).toBe(3);
      });

      expect(result.current.state.current).toBe(3);
    });

    it("returns null when at beginning for undo", () => {
      const { result } = renderHook(() => useHistory({ initialState: 0 }));

      act(() => {
        const prev = result.current.undo();
        expect(prev).toBeNull();
      });

      expect(result.current.state.current).toBe(0);
    });

    it("returns null when at end for redo", () => {
      const { result } = renderHook(() => useHistory({ initialState: 0 }));

      act(() => {
        const next = result.current.redo();
        expect(next).toBeNull();
      });

      expect(result.current.state.current).toBe(0);
    });

    it("can undo all the way to initial state", () => {
      const { result } = renderHook(() => useHistory({ initialState: 0 }));

      act(() => {
        result.current.push(1);
        result.current.push(2);
        result.current.push(3);
      });

      act(() => {
        result.current.undo();
        result.current.undo();
        result.current.undo();
      });

      expect(result.current.state.current).toBe(0);
      expect(result.current.state.canUndo).toBe(false);
      expect(result.current.state.canRedo).toBe(true);
      expect(result.current.state.redoCount).toBe(3);
    });
  });

  describe("batch", () => {
    it("groups multiple changes into single undo step", () => {
      const { result } = renderHook(() =>
        useHistory({ initialState: [] as string[] }),
      );

      act(() => {
        result.current.batch(() => {
          result.current.push(["a"]);
          result.current.push(["a", "b"]);
          result.current.push(["a", "b", "c"]);
        });
      });

      expect(result.current.state.current).toEqual(["a", "b", "c"]);
      expect(result.current.state.undoCount).toBe(1);

      act(() => {
        result.current.undo();
      });

      expect(result.current.state.current).toEqual([]);
    });

    it("handles nested batches", () => {
      const { result } = renderHook(() => useHistory({ initialState: 0 }));

      act(() => {
        result.current.batch(() => {
          result.current.push(1);
          result.current.batch(() => {
            result.current.push(2);
            result.current.push(3);
          });
          result.current.push(4);
        });
      });

      expect(result.current.state.current).toBe(4);
      expect(result.current.state.undoCount).toBe(1);
    });

    it("does not record if state unchanged during batch", () => {
      const { result } = renderHook(() =>
        useHistory({
          initialState: { x: 0 },
          isEqual: (a, b) => a.x === b.x,
        }),
      );

      act(() => {
        result.current.batch(() => {
          result.current.push({ x: 1 });
          result.current.push({ x: 0 });
        });
      });

      expect(result.current.state.undoCount).toBe(0);
    });
  });

  describe("clear", () => {
    it("resets to initial state", () => {
      const { result } = renderHook(() => useHistory({ initialState: 0 }));

      act(() => {
        result.current.push(1);
        result.current.push(2);
        result.current.push(3);
      });

      expect(result.current.state.current).toBe(3);
      expect(result.current.state.undoCount).toBe(3);

      act(() => {
        result.current.clear();
      });

      expect(result.current.state.current).toBe(0);
      expect(result.current.state.canUndo).toBe(false);
      expect(result.current.state.canRedo).toBe(false);
      expect(result.current.state.undoCount).toBe(0);
      expect(result.current.state.redoCount).toBe(0);
    });

    it("clears redo stack as well", () => {
      const { result } = renderHook(() => useHistory({ initialState: 0 }));

      act(() => {
        result.current.push(1);
        result.current.push(2);
      });

      act(() => {
        result.current.undo();
      });

      expect(result.current.state.canRedo).toBe(true);

      act(() => {
        result.current.clear();
      });

      expect(result.current.state.canRedo).toBe(false);
    });
  });

  describe("stable function references", () => {
    it("maintains stable references across renders", () => {
      const { result, rerender } = renderHook(() =>
        useHistory({ initialState: 0 }),
      );

      const initialPush = result.current.push;
      const initialUndo = result.current.undo;
      const initialRedo = result.current.redo;
      const initialBatch = result.current.batch;
      const initialClear = result.current.clear;

      rerender();

      expect(result.current.push).toBe(initialPush);
      expect(result.current.undo).toBe(initialUndo);
      expect(result.current.redo).toBe(initialRedo);
      expect(result.current.batch).toBe(initialBatch);
      expect(result.current.clear).toBe(initialClear);
    });

    it("maintains stable references after state changes", () => {
      const { result } = renderHook(() => useHistory({ initialState: 0 }));

      const initialPush = result.current.push;
      const initialUndo = result.current.undo;

      act(() => {
        result.current.push(1);
      });

      expect(result.current.push).toBe(initialPush);
      expect(result.current.undo).toBe(initialUndo);

      act(() => {
        result.current.undo();
      });

      expect(result.current.push).toBe(initialPush);
      expect(result.current.undo).toBe(initialUndo);
    });
  });

  describe("generic types", () => {
    it("works with complex object types", () => {
      interface EditorState {
        blocks: Array<{ id: string; content: string }>;
        selection: { start: number; end: number } | null;
      }

      const initialState: EditorState = {
        blocks: [],
        selection: null,
      };

      const { result } = renderHook(() => useHistory({ initialState }));

      act(() => {
        result.current.push({
          blocks: [{ id: "1", content: "Hello" }],
          selection: { start: 0, end: 5 },
        });
      });

      expect(result.current.state.current.blocks).toHaveLength(1);
      expect(result.current.state.current.selection).toEqual({
        start: 0,
        end: 5,
      });
    });

    it("works with union types", () => {
      type Status = "idle" | "loading" | "success" | "error";

      const { result } = renderHook(() =>
        useHistory<Status>({ initialState: "idle" }),
      );

      act(() => {
        result.current.push("loading");
      });

      expect(result.current.state.current).toBe("loading");

      act(() => {
        result.current.push("success");
      });

      expect(result.current.state.current).toBe("success");

      act(() => {
        result.current.undo();
      });

      expect(result.current.state.current).toBe("loading");
    });

    it("preserves type safety for isEqual callback", () => {
      interface Point {
        x: number;
        y: number;
      }

      const { result } = renderHook(() =>
        useHistory<Point>({
          initialState: { x: 0, y: 0 },
          isEqual: (a, b) => a.x === b.x && a.y === b.y,
        }),
      );

      act(() => {
        result.current.push({ x: 1, y: 1 });
      });

      expect(result.current.state.current).toEqual({ x: 1, y: 1 });

      act(() => {
        result.current.push({ x: 1, y: 1 });
      });

      // Should not add duplicate
      expect(result.current.state.undoCount).toBe(1);
    });
  });

  describe("limit option", () => {
    it("respects limit and drops oldest entries", () => {
      const { result } = renderHook(() =>
        useHistory({
          initialState: 0,
          limit: 3,
        }),
      );

      act(() => {
        result.current.push(1);
        result.current.push(2);
        result.current.push(3);
        result.current.push(4);
        result.current.push(5);
      });

      expect(result.current.state.current).toBe(5);
      expect(result.current.state.undoCount).toBe(3);

      act(() => {
        result.current.undo();
        result.current.undo();
        result.current.undo();
      });

      // Should only go back 3 steps (to state 2, not 0 or 1)
      expect(result.current.state.current).toBe(2);
      expect(result.current.state.canUndo).toBe(false);
    });
  });
});
