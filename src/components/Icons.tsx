import { View, Svg, Path } from "react-xnft";

export function LinkIcon(props) {
  return (
    <Svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fill={"#ffffff"}
        // style="stroke:none;fill-rule:nonzero;fill:rgb(100%,100%,100%);fill-opacity:1;"
        d="M 5 3 C 3.90625 3 3 3.90625 3 5 L 3 19 C 3 20.09375 3.90625 21 5 21 L 19 21 C 20.09375 21 21 20.09375 21 19 L 21 12 L 19 12 L 19 19 L 5 19 L 5 5 L 12 5 L 12 3 Z M 14 3 L 14 5 L 17.585938 5 L 8.292969 14.292969 L 9.707031 15.707031 L 19 6.414062 L 19 10 L 21 10 L 21 3 Z M 14 3 "
      />
    </Svg>
  );
}

export function ExpandIcon({ expanded, ...props }) {
  return (
    <View {...props} style={{ transform: expanded ? "rotate(-90deg)" : "rotate(90deg)" }}>
      <Svg width="24px" height="24px" version="1.1" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
        <Path d="m412.55 939.95 24.289 24.293 355.65-355.65-355.65-355.65-24.289 24.289 331.36 331.36z" fill="#fff" />
      </Svg>
    </View>)
}