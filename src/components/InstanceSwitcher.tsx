"use client";

import { useEffect, useRef, useState } from "react";
import { useInstance, type Instance } from "@/context/InstanceContext";
import { useT } from "@/i18n";

function ChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 opacity-50">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-[var(--fg-disabled)]">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function InstanceRow({
  inst,
  selected,
  onSelect,
}: {
  inst: Instance;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-[var(--bg-secondary)] transition-colors ${
        selected
          ? "bg-[var(--brand-50)] text-[var(--brand-600)] font-semibold"
          : "text-[var(--fg-primary)]"
      }`}
    >
      <span className="truncate flex-1">{inst.name}</span>
      <span className="text-[10px] font-mono text-[var(--fg-disabled)] shrink-0">
        {inst.ZUID}
      </span>
    </button>
  );
}

export function InstanceSwitcher() {
  const { instanceZUID, instanceName, instances, loadingInstances, switchInstance } =
    useInstance();
  const { t } = useT();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = query
    ? instances.filter(
        (i) =>
          i.name.toLowerCase().includes(query.toLowerCase()) ||
          i.ZUID.toLowerCase().includes(query.toLowerCase())
      )
    : instances;

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Focus search when opened
  useEffect(() => {
    if (open) {
      setQuery("");
      setTimeout(() => searchRef.current?.focus(), 0);
    }
  }, [open]);

  const triggerLabel = instanceName
    ?? (loadingInstances ? t("instance.loading") : t("instance.select"));

  const countLabel = query
    ? t("instance.filteredCount", { filtered: filtered.length, total: instances.length })
    : instances.length === 1
      ? t("instance.count", { count: 1 })
      : t("instance.countPlural", { count: instances.length });

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 hover:bg-white/20 px-3 py-1.5 text-sm font-medium text-white transition-colors max-w-[220px]"
        aria-label={t("instance.switcherLabel")}
      >
        <span className="truncate">{triggerLabel}</span>
        <ChevronDown />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-72 rounded-xl border border-[var(--border)] bg-white shadow-[var(--shadow-sm)] overflow-hidden">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border)]">
            <SearchIcon />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("instance.searchPlaceholder")}
              className="flex-1 text-sm text-[var(--fg-primary)] placeholder:text-[var(--fg-disabled)] outline-none bg-transparent"
            />
          </div>

          {/* Count */}
          {instances.length > 0 && (
            <div className="px-3 py-1 text-[10px] text-[var(--fg-tertiary)] border-b border-[var(--border)]">
              {countLabel}
            </div>
          )}

          {/* List */}
          <div className="max-h-60 overflow-y-auto">
            {loadingInstances ? (
              <p className="px-3 py-4 text-sm text-[var(--fg-tertiary)] text-center">
                {t("instance.loading")}
              </p>
            ) : filtered.length === 0 ? (
              <p className="px-3 py-4 text-sm text-[var(--fg-tertiary)] text-center">
                {query ? t("instance.noMatches") : t("instance.noInstances")}
              </p>
            ) : (
              filtered.map((inst) => (
                <InstanceRow
                  key={inst.ZUID}
                  inst={inst}
                  selected={inst.ZUID === instanceZUID}
                  onSelect={() => {
                    switchInstance(inst.ZUID, inst.name);
                    setOpen(false);
                  }}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
