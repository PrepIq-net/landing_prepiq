import { Fragment, type ReactNode } from "react";

const GOLD_OPEN = "<gold>";
const GOLD_CLOSE = "</gold>";

export const GoldText = ({ text }: { text?: string | null }) => {
  if (!text) return null;

  const parts = text.split(/(<\/??gold>)/g);
  const nodes: ReactNode[] = [];
  let isGold = false;

  parts.forEach((part, index) => {
    if (part === GOLD_OPEN) {
      isGold = true;
      return;
    }

    if (part === GOLD_CLOSE) {
      isGold = false;
      return;
    }

    if (!part) return;

    nodes.push(
      <Fragment key={`${part}-${index}`}>
        {isGold ? <span className="text-primary">{part}</span> : part}
      </Fragment>,
    );
  });

  return <>{nodes}</>;
};
