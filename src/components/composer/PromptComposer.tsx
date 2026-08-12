import { useRef, useState, type ReactNode } from "react";
import { Paperclip, Mic, Bot, Workflow, Database, Sparkles, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ModelOption {
  id: string;
  label: string;
}

export interface ComposerAttachment {
  id: string;
  name: string;
}

export interface PromptComposerProps {
  models?: ModelOption[];
  activeModelId?: string;
  onModelChange?: (id: string) => void;
  onSubmit?: (payload: {
    text: string;
    modelId: string;
    attachments: ComposerAttachment[];
  }) => void;
  onAttach?: () => void;
  onVoiceInput?: () => void;
  isSubmitting?: boolean;
  placeholder?: string;
  quickChips?: ReactNode;
  /** Controlled text value (optional). Pair with onTextChange. */
  value?: string;
  onTextChange?: (value: string) => void;
}

const DEFAULT_MODELS: ModelOption[] = [
  { id: "daycostra-3", label: "Daycostra 3" },
  { id: "daycostra-3-pro", label: "Daycostra 3 Pro" },
  { id: "daycostra-mini", label: "Daycostra Mini" },
];

const TOOLS = [
  { id: "attach", label: "Attach", icon: Paperclip },
  { id: "agent", label: "AI Agent", icon: Bot },
  { id: "workflow", label: "Workflow", icon: Workflow },
  { id: "data", label: "Data", icon: Database },
];

export function PromptComposer({
  models = DEFAULT_MODELS,
  activeModelId,
  onModelChange,
  onSubmit,
  onAttach,
  onVoiceInput,
  isSubmitting = false,
  placeholder = "Describe what you want to build…",
  quickChips,
  value,
  onTextChange,
}: PromptComposerProps) {
  const [internalText, setInternalText] = useState("");
  const text = value ?? internalText;
  const setText = (next: string) => {
    if (value === undefined) setInternalText(next);
    onTextChange?.(next);
  };
  const [modelId, setModelId] = useState(activeModelId ?? models[0].id);
  const [focused, setFocused] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentModel = models.find((m) => m.id === modelId) ?? models[0];

  const submit = () => {
    if (!text.trim() || isSubmitting) return;
    onSubmit?.({ text: text.trim(), modelId, attachments: [] });
  };

  return (
    <div className="w-full max-w-[var(--composer-max-w)] mx-auto">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          onAttach?.();
        }}
        className={cn(
          "relative rounded-2xl transition-all duration-300",
          "glass-composer elev-5",
          focused && "ring-1 ring-[var(--accent-primary)]",
          dragOver && "ring-2 ring-[var(--accent-primary)] scale-[1.005]",
        )}
        style={{
          background: "var(--glass-composer)",
          boxShadow: focused
            ? "var(--elev-5), 0 0 0 1px var(--accent-primary), 0 0 60px var(--glow-primary)"
            : "var(--elev-5)",
        }}
      >
        {/* Text row */}
        <div className="flex items-start gap-2 px-4 pt-4 pb-2">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder={placeholder}
            rows={1}
            aria-label="Prompt input"
            className="flex-1 resize-none bg-transparent text-[15px] leading-6 text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none min-h-[28px] max-h-[220px]"
            style={{ height: "auto" }}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "auto";
              el.style.height = Math.min(el.scrollHeight, 220) + "px";
            }}
          />
          <button
            type="button"
            onClick={onVoiceInput}
            aria-label="Voice input"
            className="shrink-0 rounded-lg p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] transition-colors"
          >
            <Mic className="h-4 w-4" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-2 px-3 pb-3 pt-1 flex-wrap">
          <div className="flex items-center gap-1 flex-wrap">
            <button
              type="button"
              onClick={onAttach}
              aria-label="Attach files"
              className="rounded-md p-1.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)]"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            {TOOLS.slice(1).map((t) => (
              <button
                key={t.id}
                type="button"
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-secondary)] hairline"
              >
                <t.icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setModelOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-[var(--text-primary)] hairline hover:bg-[var(--surface-secondary)]"
                aria-haspopup="listbox"
                aria-expanded={modelOpen}
              >
                {currentModel.label}
                <ChevronDown className="h-3.5 w-3.5 opacity-60" />
              </button>
              {modelOpen && (
                <div
                  role="listbox"
                  className="absolute right-0 bottom-full mb-2 min-w-[180px] glass-panel elev-4 rounded-lg p-1 fade-up"
                >
                  {models.map((m) => (
                    <button
                      key={m.id}
                      role="option"
                      aria-selected={m.id === modelId}
                      onClick={() => {
                        setModelId(m.id);
                        onModelChange?.(m.id);
                        setModelOpen(false);
                      }}
                      className={cn(
                        "w-full text-left rounded-md px-2.5 py-1.5 text-xs",
                        m.id === modelId
                          ? "bg-[var(--surface-secondary)] text-[var(--text-primary)]"
                          : "text-[var(--text-secondary)] hover:bg-[var(--surface-secondary)]",
                      )}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={submit}
              disabled={!text.trim() || isSubmitting}
              className="inline-flex items-center gap-1.5 rounded-md px-3.5 py-2 text-xs font-bold uppercase tracking-wide transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background:
                  "linear-gradient(180deg, var(--accent-secondary), var(--accent-primary))",
                color: "var(--accent-on)",
                boxShadow: "0 4px 14px var(--glow-primary)",
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              {isSubmitting ? "Generating…" : "Generate"}
            </button>
          </div>
        </div>
      </div>

      {quickChips && <div className="mt-4">{quickChips}</div>}
    </div>
  );
}
