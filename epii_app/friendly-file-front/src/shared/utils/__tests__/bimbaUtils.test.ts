// epii_app/friendly-file-front/src/utils/__tests__/bimbaUtils.test.ts
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'; // or jest
import { parseCoordinate, inferParentCoordinate, initializeQLProperties } from '../bimbaUtils';

describe('bimbaUtils', () => {
  describe('parseCoordinate', () => {
    it('should parse valid coordinate with hyphens', () => {
      expect(parseCoordinate("#1-2-3")).toEqual({
        fullCoordinate: "#1-2-3",
        parts: [1, 2, 3],
        qlPosition: 3,
      });
    });

    it('should parse valid coordinate with dots and preserve original fullCoordinate', () => {
      expect(parseCoordinate("#1.2.3")).toEqual({
        fullCoordinate: "#1.2.3", // Preserves original
        parts: [1, 2, 3], // Derived from normalized
        qlPosition: 3,    // Derived from normalized
      });
    });

    it('should parse mixed separators like #1-2.3 and preserve original fullCoordinate', () => {
      expect(parseCoordinate("#1-2.3")).toEqual({
        fullCoordinate: "#1-2.3", // Preserves original
        parts: [1, 2, 3],     // Derived from normalized
        qlPosition: 3,        // Derived from normalized
      });
    });

    it('should parse mixed separators like #1.2-3 and preserve original fullCoordinate', () => {
      expect(parseCoordinate("#1.2-3")).toEqual({
        fullCoordinate: "#1.2-3", // Preserves original
        parts: [1, 2, 3],     // Derived from normalized
        qlPosition: 3,        // Derived from normalized
      });
    });

    it('should handle single level coordinate', () => {
        expect(parseCoordinate("#1")).toEqual({
            fullCoordinate: "#1",
            parts: [1],
            qlPosition: 1,
        });
    });

    it('should return null for input that is just "#"', () => {
        expect(parseCoordinate("#")).toBeNull();
    });

    it('should return null for invalid input without #', () => {
      expect(parseCoordinate("1-2-3")).toBeNull();
    });

    it('should return null for non-numeric parts', () => {
      expect(parseCoordinate("#1-a-3")).toBeNull();
    });

    it('should return null for empty parts like #1--3', () => {
        expect(parseCoordinate("#1--3")).toBeNull();
    });

    it('should return null for empty parts like #1-2-', () => {
        expect(parseCoordinate("#1-2-")).toBeNull();
    });

    it('should return null for null input', () => {
        expect(parseCoordinate(null as any)).toBeNull();
    });

    it('should return null for empty string input', () => {
        expect(parseCoordinate("")).toBeNull();
    });
  });

  describe('inferParentCoordinate', () => {
    it('should infer parent for multi-level hyphenated coordinate', () => {
      expect(inferParentCoordinate("#1-2-3")).toBe("#1-2");
    });

    it('should infer parent for multi-level dotted coordinate, preserving dot', () => {
      expect(inferParentCoordinate("#1.2.3")).toBe("#1.2"); // Preserves original separator
    });

    it('should infer parent for mixed separator coordinate like #1-2.3', () => {
      expect(inferParentCoordinate("#1-2.3")).toBe("#1-2");
    });

    it('should infer parent for mixed separator coordinate like #1.2-3', () => {
      expect(inferParentCoordinate("#1.2-3")).toBe("#1.2");
    });

    it('should infer parent for mixed separator coordinate like #4.4.3-1', () => {
      expect(inferParentCoordinate("#4.4.3-1")).toBe("#4.4.3");
    });

    it('should infer parent for two-level coordinate', () => {
      expect(inferParentCoordinate("#1-2")).toBe("#1");
    });

    it('should infer parent for two-level dotted coordinate like #4.3', () => {
      expect(inferParentCoordinate("#4.3")).toBe("#4");
    });

    it('should return null for single-level coordinate', () => {
      expect(inferParentCoordinate("#1")).toBeNull();
    });

    it('should return null for root hash coordinate', () => {
      expect(inferParentCoordinate("#")).toBeNull();
    });

    it('should return null for invalid coordinate', () => {
      expect(inferParentCoordinate("invalid-coord")).toBeNull();
    });
  });

  describe('initializeQLProperties', () => {
    beforeEach(() => {
      // Mock Date for consistent timestamps
      vi.useFakeTimers();
      vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should initialize properties for a valid coordinate', () => {
      const props = initializeQLProperties("#1-2-3");
      expect(props).toEqual(expect.objectContaining({ // Using objectContaining for robustness
        bimbaCoordinate: "#1-2-3",
        qlPosition: 3,
        qlVariant: "2/3", // qlPosition 3 maps to "2/3"
        name: "Node #1-2-3",
        description: "Quaternal Logic position 3 node at #1-2-3",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      }));
      // Ensure title is not included
      expect(props).not.toHaveProperty('title');
    });

    it('should initialize properties for a valid dotted coordinate, preserving original', () => {
      const props = initializeQLProperties("#1.2.3");
      expect(props).toEqual(expect.objectContaining({
        bimbaCoordinate: "#1.2.3", // Preserves original
        qlPosition: 3,
        name: "Node #1.2.3", // Preserves original
        title: "QL Position 3 Node",
        description: "Quaternal Logic position 3 node at #1.2.3", // Preserves original
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      }));
    });

    it('should initialize properties for a mixed separator coordinate like #1-2.3, preserving original', () => {
      const props = initializeQLProperties("#1-2.3");
      expect(props).toEqual(expect.objectContaining({
        bimbaCoordinate: "#1-2.3", // Preserves original
        qlPosition: 3,
        name: "Node #1-2.3", // Preserves original
        title: "QL Position 3 Node",
        description: "Quaternal Logic position 3 node at #1-2.3", // Preserves original
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      }));
    });

    it('should initialize properties for a single level coordinate', () => {
      const props = initializeQLProperties("#5");
      expect(props).toEqual(expect.objectContaining({
        bimbaCoordinate: "#5",
        qlPosition: 5,
        name: "Node #5",
        title: "QL Position 5 Node",
        description: "Quaternal Logic position 5 node at #5",
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      }));
    });

    it('should return null for an invalid coordinate', () => {
      expect(initializeQLProperties("invalid")).toBeNull();
    });

    it('should return null for just "#" as coordinate', () => {
        // because parseCoordinate returns null for "#"
        expect(initializeQLProperties("#")).toBeNull();
    });
  });
});
