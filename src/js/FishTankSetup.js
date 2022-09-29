import { Carp } from "./class/Carp";
import { ref } from "vue";

const bgcol = 25;
let carps = [];
const clickedCarpData = ref();

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
      if (carp.collider(p5, p5.mouseX, p5.mouseY)) {
        clickedCarpData.value = {
          word: carp.word,
          comment: carp.comment,
          url: carp.url,
        };
      }
    });
  };
};

const addCarps = (p5, newCarps) => {
  const newCarpInstances = newCarps.map((carp) => {
    return new Carp(p5, carp.word, carp.comment, carp.url);
  });
  carps = [...carps, ...newCarpInstances];
};

export { fishTankSetup, addCarps, clickedCarpData };
