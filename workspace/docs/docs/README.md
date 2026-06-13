then Remotion is what you want. You’ll code slides in TypeScript, render to MP4, then upload that MP4 into your course platform.

Here’s the minimal way to get from zero to a video.

First, set up the project in a clean folder:

mkdir cloud-slides
cd cloud-slides

npm init -y
npm install remotion react react-dom

npx remotion init

Start the preview player:

npm start

That opens a browser where you can see your composition live as you edit.

Now make a super simple animated “slide deck”.

Open src/Root.tsx and replace the whole file with this:

import React from "react";
import { Composition } from "remotion";
import { CloudSlides } from "./CloudSlides";

export const RemotionRoot: React.FC = () => {
return (
<>
<Composition
id="cloud-slides" // used when rendering
component={CloudSlides}
durationInFrames={300} // 10 seconds at 30 fps
fps={30}
width={1920}
height={1080}
/>
</>
);
};

Create a new file src/CloudSlides.tsx:

import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

export const CloudSlides: React.FC = () => {
const frame = useCurrentFrame();
const { fps } = useVideoConfig();

// fade in title over first 1 second
const titleOpacity = interpolate(frame, [0, fps], [0, 1], {
extrapolateLeft: "clamp",
extrapolateRight: "clamp",
});

// fade in subtitle between second 1 and 2
const subtitleOpacity = interpolate(frame, [fps, fps * 2], [0, 1], {
extrapolateLeft: "clamp",
extrapolateRight: "clamp",
});

return (
<div
style={{
        flex: 1,
        backgroundColor: "#020617",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }} >
<h1
style={{
          fontSize: 72,
          margin: 0,
          opacity: titleOpacity,
        }} >
Skilleo – Cloud Skills Boost
</h1>

      <p
        style={{
          fontSize: 32,
          marginTop: 24,
          opacity: subtitleOpacity,
        }}
      >
        AWS Solutions Architect capstone overview
      </p>
    </div>

);
};

With npm start running, you should now see the text fading in like a simple animated slide.
To turn this into a video file:
npx remotion render src/index.tsx cloud-slides out/cloud-slides.mp4
cloud-slides must match the id you set in the Composition.
You’ll get out/cloud-slides.mp4. Upload that MP4 to your course platform the same way you’d upload any lesson video, then embed it in the lesson page.
