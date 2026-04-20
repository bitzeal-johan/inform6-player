import { jsx } from "react/jsx-runtime";
import { useRef } from "react";
import { useTerminal } from "../hooks/use-terminal.js";
import { useGameEngine } from "../hooks/use-game-engine.js";
import { GameScreen } from "./game-screen.js";
function GamePlayer({
  game,
  gameId,
  terminalConfig,
  seed,
  className,
  styleOverrides
}) {
  const containerRef = useRef(null);
  const terminal = useTerminal(containerRef, terminalConfig);
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref: containerRef,
      className,
      style: {
        width: "100%",
        height: "100%",
        overflow: "hidden",
        ...terminal !== null ? {
          "--if-font-family": terminal.profile.fontFamily,
          "--if-font-size": `${terminal.fontSizePx}px`,
          "--if-line-height": String(terminal.profile.lineHeight),
          // Page-level colours used by `style reverse` runs in the
          // transcript. The status bar overrides these locally because it
          // already inverts its own base colours.
          "--if-fg": terminal.profile.foregroundColor ?? "#000",
          "--if-bg": terminal.profile.backgroundColor ?? "#fff"
        } : {}
      },
      children: terminal !== null && /* @__PURE__ */ jsx(
        GamePlayerInner,
        {
          game,
          gameId,
          terminal,
          seed,
          styleOverrides
        }
      )
    }
  );
}
function GamePlayerInner({ game, gameId, terminal, seed, styleOverrides }) {
  const engine = useGameEngine(game, gameId, terminal, seed);
  return /* @__PURE__ */ jsx(GameScreen, { engine, terminal, styleOverrides });
}
export {
  GamePlayer
};
