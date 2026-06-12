import { TitleCard } from "./TitleCard";
import { StatCard } from "./StatCard";
import { ModuleOverview } from "./ModuleOverview";
import { AnimatedText } from "./AnimatedText";
import { QrCard } from "./QrCard";
// v3 cinematic components
import { CinematicTitle } from "./CinematicTitle";
import { HistoryChart } from "./HistoryChart";
import { KineticNumber } from "./KineticNumber";
import { WordBurn } from "./WordBurn";
import { SplitCompare } from "./SplitCompare";
import { PayoffDiagram } from "./PayoffDiagram";
import { BinomialTree } from "./BinomialTree";
import { BarrierBreak } from "./BarrierBreak";
import { TakeawayList } from "./TakeawayList";
import { PriceRow } from "./PriceRow";
import { TicketReveal } from "./TicketReveal";
import { ThanksCard } from "./ThanksCard";
import { DisclaimerCard } from "./DisclaimerCard";

export type ComponentName =
  | "TitleCard"
  | "StatCard"
  | "ModuleOverview"
  | "AnimatedText"
  | "QrCard"
  | "CinematicTitle"
  | "HistoryChart"
  | "KineticNumber"
  | "WordBurn"
  | "SplitCompare"
  | "PayoffDiagram"
  | "BinomialTree"
  | "BarrierBreak"
  | "TakeawayList"
  | "PriceRow"
  | "TicketReveal"
  | "ThanksCard"
  | "DisclaimerCard";

export const componentRegistry: Record<ComponentName, React.FC<any>> = {
  TitleCard,
  StatCard,
  ModuleOverview,
  AnimatedText,
  QrCard,
  CinematicTitle,
  HistoryChart,
  KineticNumber,
  WordBurn,
  SplitCompare,
  PayoffDiagram,
  BinomialTree,
  BarrierBreak,
  TakeawayList,
  PriceRow,
  TicketReveal,
  ThanksCard,
  DisclaimerCard,
};
