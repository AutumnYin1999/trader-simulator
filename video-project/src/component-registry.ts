import { TitleCard } from "./TitleCard";
import { StatCard } from "./StatCard";
import { ModuleOverview } from "./ModuleOverview";
import { AnimatedText } from "./AnimatedText";

export type ComponentName = "TitleCard" | "StatCard" | "ModuleOverview" | "AnimatedText";

export const componentRegistry: Record<ComponentName, React.FC<any>> = {
  TitleCard,
  StatCard,
  ModuleOverview,
  AnimatedText,
};
