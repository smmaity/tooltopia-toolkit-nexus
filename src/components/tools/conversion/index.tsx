
import BinaryConverter from "./BinaryConverter";
import HexDecimalConverter from "./HexDecimalConverter";
import Base64Converter from "./Base64Converter";

const conversionTools = {
  "binary-decimal": BinaryConverter,
  "binary-hex": BinaryConverter,
  "hex-decimal": HexDecimalConverter,
  "base64": Base64Converter,
};

export default conversionTools;
