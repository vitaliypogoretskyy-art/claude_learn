interface ToolCallLabelProps {
  toolName: string;
  args: Record<string, unknown>;
}

function basename(path: unknown): string {
  if (typeof path !== "string" || !path) return "";
  const segments = path.split("/");
  return segments[segments.length - 1] || path;
}

function resolveLabel(toolName: string, args: Record<string, unknown>): string {
  const command = args.command as string | undefined;
  const file = basename(args.path);

  if (toolName === "str_replace_editor") {
    if (!command || !file) return "Processing file...";
    switch (command) {
      case "create": return `Creating ${file}`;
      case "str_replace":
      case "insert": return `Editing ${file}`;
      case "view": return `Reading ${file}`;
      case "undo_edit": return "Undoing edit";
      default: return `Processing ${file}`;
    }
  }

  if (toolName === "file_manager") {
    if (!command || !file) return "Managing file...";
    switch (command) {
      case "delete": return `Deleting ${file}`;
      case "rename": {
        const newFile = basename(args.new_path);
        return newFile ? `Renaming ${file} → ${newFile}` : `Renaming ${file}`;
      }
      default: return `Processing ${file}`;
    }
  }

  return toolName;
}

export function ToolCallLabel({ toolName, args }: ToolCallLabelProps) {
  return <span className="text-neutral-700">{resolveLabel(toolName, args)}</span>;
}
