import { View, Svg, Path } from "react-xnft";

export function LinkIcon({ lightMode, ...props }) {
  return (
    <Svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" {...props}>
      <Path
        fill={lightMode ? "#71717A" : "#ffffff"}
        // style="stroke:none;fill-rule:nonzero;fill:rgb(100%,100%,100%);fill-opacity:1;"
        d="M 5 3 C 3.90625 3 3 3.90625 3 5 L 3 19 C 3 20.09375 3.90625 21 5 21 L 19 21 C 20.09375 21 21 20.09375 21 19 L 21 12 L 19 12 L 19 19 L 5 19 L 5 5 L 12 5 L 12 3 Z M 14 3 L 14 5 L 17.585938 5 L 8.292969 14.292969 L 9.707031 15.707031 L 19 6.414062 L 19 10 L 21 10 L 21 3 Z M 14 3 "
      />
    </Svg>
  );
}

export function ExpandIcon({ expanded, lightMode, ...props }) {
  return (
    <View {...props} style={{ transform: expanded ? "rotate(-90deg)" : "rotate(90deg)" }}>
      <Svg width="24px" height="24px" version="1.1" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
        <Path d="m412.55 939.95 24.289 24.293 355.65-355.65-355.65-355.65-24.289 24.289 331.36 331.36z" fill={lightMode ? "#71717A" : "#ffffff"} />
      </Svg>
    </View>)
}

export function AlertIcon() {
  return (
    <Svg height="50px" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.89 111.55">
      <Path d="M2.35 84.43 45.29 10.2l.17-.27a22.92 22.92 0 0 1 7-7.23A17 17 0 0 1 61.58 0a16.78 16.78 0 0 1 9.11 2.69 22.79 22.79 0 0 1 7 7.26c.13.21.25.42.36.64l42.24 73.34.23.44a22.22 22.22 0 0 1 2.37 10.19 17.59 17.59 0 0 1-2.16 8.35 16 16 0 0 1-6.94 6.61l-.58.26a21.34 21.34 0 0 1-9.11 1.74H16.96a18.07 18.07 0 0 1-6.2-1.15A16.46 16.46 0 0 1 3 104.26a17.59 17.59 0 0 1-3-9.58 23 23 0 0 1 1.57-8.74 8.24 8.24 0 0 1 .77-1.51Z" fill="#b71616" />
      <Path d="m9 88.76 43.15-74.6c5.23-8.25 13.53-8.46 18.87 0l42.44 73.7c3.38 6.81 1.7 16-9.34 15.77h-86.5c-7.27.18-12-6.19-8.64-14.87Z" fill="#e21b1b" fillRule="evenodd" />
      <Path d="M57.57 82.7a5.51 5.51 0 0 1 3.48-1.58 5.75 5.75 0 0 1 2.4.35 5.82 5.82 0 0 1 2 1.31 5.53 5.53 0 0 1 1.62 3.55 6.05 6.05 0 0 1-.08 1.4 5.54 5.54 0 0 1-5.64 4.6 5.67 5.67 0 0 1-2.27-.52 5.56 5.56 0 0 1-2.82-2.94 5.65 5.65 0 0 1-.35-1.27 5.83 5.83 0 0 1-.06-1.31 6.19 6.19 0 0 1 .57-2 4.57 4.57 0 0 1 1.13-1.56Zm8.16-10.24c-.2 4.79-8.31 4.8-8.5 0-.82-8.21-2.92-29.39-2.85-37.1.07-2.38 2-3.79 4.56-4.33a12.83 12.83 0 0 1 5 0c2.61.56 4.65 2 4.65 4.44v.24l-2.86 36.75Z" fill={"#fff"} />
    </Svg>
  )
}

export function LiquidIcon() {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 32 32" viewBox="0 0 32 32">
      <Path fill="#fff" d="M17.14746,1.03418C16.8623,0.69531,16.44238,0.5,16,0.5s-0.8623,0.19531-1.14746,0.53418C14.44238,1.52051,4.81738,13.03613,4.81738,20.31738C4.81738,26.4834,9.83398,31.5,16,31.5s11.18262-5.0166,11.18262-11.18262C27.18262,13.04199,17.55762,1.52148,17.14746,1.03418z M16,28.5c-4.51172,0-8.18262-3.6709-8.18262-8.18262c0-4.49414,5.15527-12.04492,8.18262-15.92871c3.02832,3.88379,8.18262,11.43262,8.18262,15.92871C24.18262,24.8291,20.51172,28.5,16,28.5z" />
    </Svg>)
}

export function HomeIcon() {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      {/* <g data-name="Layer 2"><g data-name="home"><rect width="24" height="24" opacity="0"/> */}
      <Path fill={"#fff"} d="M20.42 10.18L12.71 2.3a1 1 0 0 0-1.42 0l-7.71 7.89A2 2 0 0 0 3 11.62V20a2 2 0 0 0 1.89 2h14.22A2 2 0 0 0 21 20v-8.38a2.07 2.07 0 0 0-.58-1.44zM10 20v-6h4v6zm9 0h-3v-7a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v7H5v-8.42l7-7.15 7 7.19z" />
      {/* </g> */}
      {/* </g> */}
    </Svg>)
}