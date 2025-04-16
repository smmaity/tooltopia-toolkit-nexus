
import LengthConverter from "./LengthConverter";
import TemperatureConverter from "./TemperatureConverter";
import CurrencyConverter from "./CurrencyConverter";
import WeightConverter from "./WeightConverter";
import SpeedConverter from "./SpeedConverter";
import AreaConverter from "./AreaConverter";
import VolumeConverter from "./VolumeConverter";
import PressureConverter from "./PressureConverter";

const unitTools = {
  "length-converter": LengthConverter,
  "temperature-converter": TemperatureConverter,
  "currency-converter": CurrencyConverter,
  "weight-converter": WeightConverter,
  "speed-converter": SpeedConverter,
  "area-converter": AreaConverter,
  "volume-converter": VolumeConverter,
  "pressure-converter": PressureConverter,
};

export default unitTools;
