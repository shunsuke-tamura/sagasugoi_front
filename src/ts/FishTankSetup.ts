import { CarpClass } from "./class/CarpClass";
import { ref } from "vue";
import { Carp } from "@/types/Carp";
import p5 from "p5";

const bgcol = 25;
let carps: CarpClass[] = [];
const clickedCarpData = ref<Carp>();

const fishTankSetup = function (p5: p5) {
  p5.setup = () => {
    const canvas = p5.createCanvas(500, 500);
    // <div id="canvas"> に canvas を配置
    canvas.parent("canvas");
    p5.background(bgcol);
    p5.smooth();
    p5.frameRate(30);
  };

  p5.draw = () => {
    p5.background(bgcol);
    carps.forEach((carp) => {
      carp.update(p5);
      carp.display(p5);
    });
  };

  p5.mouseClicked = () => {
    carps.forEach((carp) => {
      console.log(carp.collider(p5, p5.mouseX, p5.mouseY));
      if (carp.collider(p5, p5.mouseX, p5.mouseY)) {
        clickedCarpData.value = carp.carpData;
      }
    });
  };
};

const addCarps = (p5: p5, newCarps: Carp[]) => {
  const newCarpInstances = newCarps.map((carp) => {
    return new CarpClass(p5, carp);
  });
  carps = [...carps, ...newCarpInstances];
};

export { fishTankSetup, addCarps, clickedCarpData };
