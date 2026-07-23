"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChatBubbleEmpty, Xmark } from "iconoir-react";
import { useTranslation } from "react-i18next";

import { ConciergePanel } from "./ConciergePanel";

const ConciergeWidget = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
          >
            <ConciergePanel onClose={() => setOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        initial={reducedMotion ? false : { opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t("concierge.close") : t("concierge.open")}
        aria-expanded={open}
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_4px_20px_hsla(40,70%,39%,0.3)] transition-shadow duration-300 hover:shadow-[0_4px_28px_hsla(40,70%,39%,0.5)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {open ? (
          <Xmark className="h-5 w-5" aria-hidden />
        ) : (
          <ChatBubbleEmpty className="h-5 w-5" aria-hidden />
        )}
      </motion.button>
    </>
  );
};

export default ConciergeWidget;
