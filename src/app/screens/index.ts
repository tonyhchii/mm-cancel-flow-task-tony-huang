import FoundJobQ1 from "./FoundJobQ1";
import FoundJobQ2 from "./FoundJobQ2";
import FoundJobQ3 from "./FoundJobQ3";
import ScreenOne from "./ScreenOne";
import CompleteCancellation from "./CompleteCancellation";
import NoJobQ1 from "./NoJobQ1";

export const SCREENS: Record<string, React.ComponentType> = {
  screenOne: ScreenOne,
  foundJobQ1: FoundJobQ1,
  foundJobQ2: FoundJobQ2,
  foundJobQ3: FoundJobQ3,
  completeCancellation: CompleteCancellation,
  noJobQ1: NoJobQ1,
  //noJobQ2: NoJobQ2,
  //noJobQ3: NoJobQ3,
};
