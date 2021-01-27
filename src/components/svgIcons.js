import React from "react";
import SvgIcon from "react-native-svg-icon";
import svgs from "../assets/svgIconObj";

const Icon = (props) => <SvgIcon {...props} svgs={svgs} />;

export default Icon;
