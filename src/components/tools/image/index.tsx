
import ImageCompressor from "./ImageCompressor";
import ImageSizeIncreaser from "./ImageSizeIncreaser";
import ImageBase64Converter from "./ImageBase64Converter";
import ImageFormatConverter from "./ImageFormatConverter";
import ImageDimensionChanger from "./ImageDimensionChanger";

type ImageToolComponentMap = {
  [key: string]: React.ComponentType;
};

const imageTools: ImageToolComponentMap = {
  "image-compressor": ImageCompressor,
  "image-size-increaser": ImageSizeIncreaser,
  "image-base64": ImageBase64Converter,
  "image-format-converter": ImageFormatConverter,
  "image-dimension-changer": ImageDimensionChanger,
};

export default imageTools;
