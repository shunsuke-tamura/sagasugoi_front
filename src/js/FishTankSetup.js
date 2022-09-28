import { Carp } from "./class/Carp";

const bgcol = 25;
let carps = [];

const fishTankSetup = function (p5) {
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
    });
  };
};

const addCarps = (p5, newCarps) => {
  const newCarpInstances = newCarps.map(() => {
    return new Carp(p5, 250, 250);
  });
  carps = [...carps, ...newCarpInstances];
};

export { fishTankSetup, addCarps };
