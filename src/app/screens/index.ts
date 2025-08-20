import FoundJobQ1 from "./FoundJobQ1";
import FoundJobQ2 from "./FoundJobQ2";
import FoundJobQ3 from "./FoundJobQ3";
import ScreenOne from "./ScreenOne";
import CompleteCancellation from "./CompleteCancellation";
import NoJobQ1 from "./NoJobQ1";
import NoJobQ2 from "./NoJobQ2";
import AcceptedOffer from "./AcceptedOffer";
import CompleteCancellation2 from "./CompleteCancellation2";
import NoJobQ3 from "./NoJobQ3";

export const SCREENS: Record<string, React.ComponentType> = {
  screenOne: ScreenOne,
  foundJobQ1: FoundJobQ1,
  foundJobQ2: FoundJobQ2,
  foundJobQ3: FoundJobQ3,
  completeCancellation: CompleteCancellation,
  noJobQ1: NoJobQ1,
  acceptedOffer: AcceptedOffer,
  noJobQ2: NoJobQ2,
  noJobQ3: NoJobQ3,
  cancellationComplete2: CompleteCancellation2, // Adjust as needed
};
