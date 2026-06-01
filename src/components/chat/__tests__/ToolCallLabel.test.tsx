import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallLabel } from "../ToolCallLabel";

afterEach(cleanup);

test("str_replace_editor create shows Creating with filename", () => {
  render(<ToolCallLabel toolName="str_replace_editor" args={{ command: "create", path: "Button.tsx" }} />);
  expect(screen.getByText("Creating Button.tsx")).toBeDefined();
});

test("str_replace_editor str_replace shows Editing with filename", () => {
  render(<ToolCallLabel toolName="str_replace_editor" args={{ command: "str_replace", path: "Button.tsx" }} />);
  expect(screen.getByText("Editing Button.tsx")).toBeDefined();
});

test("str_replace_editor insert shows Editing with filename", () => {
  render(<ToolCallLabel toolName="str_replace_editor" args={{ command: "insert", path: "Button.tsx" }} />);
  expect(screen.getByText("Editing Button.tsx")).toBeDefined();
});

test("str_replace_editor view shows Reading with filename", () => {
  render(<ToolCallLabel toolName="str_replace_editor" args={{ command: "view", path: "Button.tsx" }} />);
  expect(screen.getByText("Reading Button.tsx")).toBeDefined();
});

test("str_replace_editor undo_edit shows Undoing edit", () => {
  render(<ToolCallLabel toolName="str_replace_editor" args={{ command: "undo_edit", path: "Button.tsx" }} />);
  expect(screen.getByText("Undoing edit")).toBeDefined();
});

test("str_replace_editor extracts basename from nested path", () => {
  render(<ToolCallLabel toolName="str_replace_editor" args={{ command: "create", path: "src/components/Button.tsx" }} />);
  expect(screen.getByText("Creating Button.tsx")).toBeDefined();
});

test("str_replace_editor with empty args shows fallback", () => {
  render(<ToolCallLabel toolName="str_replace_editor" args={{}} />);
  expect(screen.getByText("Processing file...")).toBeDefined();
});

test("str_replace_editor with command but no path shows fallback", () => {
  render(<ToolCallLabel toolName="str_replace_editor" args={{ command: "create" }} />);
  expect(screen.getByText("Processing file...")).toBeDefined();
});

test("file_manager delete shows Deleting with filename", () => {
  render(<ToolCallLabel toolName="file_manager" args={{ command: "delete", path: "Button.tsx" }} />);
  expect(screen.getByText("Deleting Button.tsx")).toBeDefined();
});

test("file_manager rename shows Renaming with both filenames", () => {
  render(<ToolCallLabel toolName="file_manager" args={{ command: "rename", path: "Old.tsx", new_path: "New.tsx" }} />);
  expect(screen.getByText("Renaming Old.tsx → New.tsx")).toBeDefined();
});

test("file_manager rename without new_path shows just source filename", () => {
  render(<ToolCallLabel toolName="file_manager" args={{ command: "rename", path: "Old.tsx" }} />);
  expect(screen.getByText("Renaming Old.tsx")).toBeDefined();
});

test("file_manager with empty args shows fallback", () => {
  render(<ToolCallLabel toolName="file_manager" args={{}} />);
  expect(screen.getByText("Managing file...")).toBeDefined();
});

test("unknown tool name renders the raw tool name", () => {
  render(<ToolCallLabel toolName="some_unknown_tool" args={{}} />);
  expect(screen.getByText("some_unknown_tool")).toBeDefined();
});
