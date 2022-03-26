import { HTMLClip, loadPlugin } from "@donkeyclip/motorcortex";
import ThreeDefinition from "@donkeyclip/motorcortex-threejs";
const threejs = loadPlugin(ThreeDefinition);

export const clip = new HTMLClip({
  html: `
    <div class="container"></div>`,
  css: `
  .container {
    width:100%;
    height:100%;
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items: center;
    color: {{ initParams.color }};
  }
  `,
  host: document.getElementById("clip"),
  containerParams: {
    width: "1920px",
    height: "1080px",
  },
  // initParamsValidationRules: {
  //   color: {
  //     label: "Text Color",
  //     type: "color",
  //     optional: true,
  //     default: "white",
  //   },
  // },
  // initParams: initParams[1].value,
});
const entities = [];
for (let j = 0; j < 3; j++) {
  const instances = [];
  const count = 20;
  for (let i = 0; i < count; i++) {
    instances.push([
      i,
      [
        (Math.random() + 0.2) * 20 * (Math.random() > 0.5 ? -1 : 1),
        (Math.random() + 0.2) * 20 * (Math.random() > 0.5 ? -1 : 1),
        (Math.random() + 0.2) * 20 * (Math.random() > 0.5 ? -1 : 1),
      ],
      [0, 0, 0],
    ]);
  }

  entities.push({
    id: "instance_" + j,
    geometry: {
      type: "SphereBufferGeometry",
      parameters: [parseInt(4 * Math.random()), 32, 16],
    },
    material: {
      type: "MeshLambertMaterial",
      parameters: [
        {
          color: "#fff",
        },
      ],
    },
    settings: {
      count: count,
      instance: instances,
    },
    class: ["instance"],
  });
}

const threeclip = new threejs.Clip(
  {
    renderers: {
      type: "WebGLRenderer",
      parameters: [{ powerPreference: "high-performance" }],
      settings: {
        setClearColor: ["#f1f1f1"],
      },
    },
    scenes: {},
    lights: [
      {
        id: "light_amb",
        type: "AmbientLight",
        parameters: ["#111"],
        settings: {
          position: { set: [0, 0, 0] },
        },
      },
      {
        id: "light_spot",
        type: "PointLight",
        parameters: ["#fff"],
        settings: {
          position: { set: [20, 20, 0] },
        },
      },
    ],
    cameras: {
      id: "camera_1",
      type: "PerspectiveCamera",
      settings: {
        position: { x: 0, y: 0, z: 0 },
        far: 10000,
        near: 1,
      },
    },
    entities,
    controls: { enable: false, enableEvents: false, maxPolarAngle: Math.PI },
  },
  {
    selector: ".container",
    containerParams: { width: "1920px", height: "1080px" },
  }
);

const rotation = new threejs.ObjectAnimation(
  {
    animatedAttrs: {
      rotation: { x: 0, y: 2 * Math.PI, z: 0 },
    },
  },
  {
    selector: "!#instance_0",
    duration: 80000,
  }
);
const rotation1 = new threejs.ObjectAnimation(
  {
    animatedAttrs: {
      rotation: { x: 2 * -Math.PI, y: 2 * -Math.PI, z: 0 },
    },
  },
  {
    selector: "!#instance_1",
    duration: 80000,
  }
);

const rotation2 = new threejs.ObjectAnimation(
  {
    animatedAttrs: {
      rotation: { x: 2 * -Math.PI, y: 2 * Math.PI, z: 0 },
    },
  },
  {
    selector: "!#instance_2",
    duration: 80000,
  }
);

const movelight = new threejs.ObjectAnimation(
  {
    animatedAttrs: {
      position: { x: -20, y: -20, z: 20 },
    },
  },
  {
    selector: "!#light_spot",
    duration: 40000,
  }
);
const movelight2 = new threejs.ObjectAnimation(
  {
    animatedAttrs: {
      position: { x: 20, y: 20, z: 0 },
    },
  },
  {
    selector: "!#light_spot",
    duration: 40000,
  }
);
threeclip.addIncident(rotation, 0);
threeclip.addIncident(rotation1, 0);
threeclip.addIncident(rotation2, 0);
threeclip.addIncident(movelight, 0);
threeclip.addIncident(movelight2, 40000);

// threeclip.addIncident(rotation, 0);
clip.addIncident(threeclip, 0);
