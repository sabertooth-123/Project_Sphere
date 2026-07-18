"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { DURATION, EASE } from "@/lib/motion";

const PHRASES = [
  "Search AI Projects...",
  "Search Hackathon Winners...",
  "Search Robotics...",
  "Search Web Apps...",
];

const TYPE_SPEED_MS = 45;
const DELETE_SPEED_MS = 25;
const HOLD_MS = 1400;

function useTypingPlaceholder(active: boolean) {
  const [text, setText] = useState("");
  const phraseIndex = useRef(0);
  const charIndex = useRef(0);
  const deleting = useRef(false);

  useEffect(() => {
    if (!active) return;

    const tick = () => {
      const phrase = PHRASES[phraseIndex.current];

      if (!deleting.current) {
        charIndex.current += 1;
        setText(phrase.slice(0, charIndex.current));
        if (charIndex.current === phrase.length) {
          deleting.current = true;
          return HOLD_MS;
        }
        return TYPE_SPEED_MS;
      }

      charIndex.current -= 1;
      setText(phrase.slice(0, charIndex.current));
      if (charIndex.current === 0) {
        deleting.current = false;
        phraseIndex.current = (phraseIndex.current + 1) % PHRASES.length;
      }
      return DELETE_SPEED_MS;
    };

    let timeoutId: ReturnType<typeof setTimeout>;
    const loop = () => {
      const delay = tick();
      timeoutId = setTimeout(loop, delay);
    };
    timeoutId = setTimeout(loop, TYPE_SPEED_MS);

    return () => clearTimeout(timeoutId);
  }, [active]);

  return text;
}

export function HeroSearchBar() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);
  const placeholder = useTypingPlaceholder(!focused && value === "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = value.trim() ? `?q=${encodeURIComponent(value.trim())}` : "";
    router.push(`/explore${params}`);
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      animate={{
        boxShadow: focused
          ? "0 0 0 3px var(--accent-soft, rgba(217,166,83,0.16)), 0 8px 24px -8px rgba(0,0,0,0.25)"
          : "0 0 0 0px transparent, 0 1px 2px rgba(0,0,0,0.04)",
      }}
      transition={{ duration: DURATION.hover, ease: EASE }}
      className="mx-auto flex w-full max-w-md items-center gap-2 rounded-xl border border-input bg-card px-4 py-3"
    >
      <Search className="size-4 shrink-0 text-muted-foreground" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder || "Search projects..."}
        aria-label="Search projects"
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
      />
    </motion.form>
  );
}
