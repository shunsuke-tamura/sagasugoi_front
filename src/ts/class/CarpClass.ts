import getRandomIntNum from "@/lib/GetRandomIntNum";
import { Carp } from "@/types/Carp";
import p5 from "p5";

const size = { x: 15, y: 40 };
let f = 1;
const canvasSize = { x: 500, y: 500 };
const photoSize = 30;

type CarpColor = {
  filet: p5.Color;
  body: p5.Color;
};

type Rigidbody = {
  lt: { x: number; y: number };
  lb: { x: number; y: number };
  rt: { x: number; y: number };
  rb: { x: number; y: number };
};

export class CarpClass {
  carpData: Carp;
  position: p5.Vector;
  theta: number;
  color: CarpColor;
  angle: number;
  currentAngularVelocity: number;
  nextAngularVelocity: number;
  currentSpeed: number;
  nextSpeed: number;
  comeback: boolean;
  trajectory: { x: number; y: number }[];
  trajectoryAngle: number;
  img: p5.Image;
  constructor(p5: p5, carpData: Carp) {
    const x = getRandomIntNum(30, canvasSize.x - 30);
    const y = getRandomIntNum(30, canvasSize.y - 30);
    const angle = (p5.PI / 12) * getRandomIntNum(0, 12);
    this.carpData = carpData;
    this.position = p5.createVector(x, y);
    this.theta = 0;
    this.color = {
      filet: p5.color(153, 206, 255),
      body: p5.color(carpData.r, carpData.g, carpData.b),
    };
    this.angle = angle;
    this.currentAngularVelocity = 0;
    this.nextAngularVelocity = 0;
    this.currentSpeed = 0;
    this.nextSpeed = 1;
    this.comeback = false;
    this.trajectory = [{ x: x, y: y }];
    this.trajectoryAngle = 0;
    this.img = p5.loadImage(
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/A_cat_on_a_motorcycle_in_the_medina_of_Tunis_20171017_131525.jpg/1200px-A_cat_on_a_motorcycle_in_the_medina_of_Tunis_20171017_131525.jpg"
    );
    console.log("create");
  }

  update(p5: p5) {
    f += 1;
    this.theta += p5.PI / 100;

    // 帰巣本能
    if (
      this.position.x < -30 ||
      this.position.y < -30 ||
      this.position.x > canvasSize.x + 30 ||
      this.position.y > canvasSize.y + 30
    ) {
      this.currentSpeed = 1;
      this.nextSpeed = 1;
      this.currentAngularVelocity = 0;
      this.nextAngularVelocity = 0;
      if (!this.comeback) {
        this.angle =
          p5.atan2(
            canvasSize.y / 2 - this.position.y,
            canvasSize.x / 2 - this.position.x
          ) +
          p5.PI / 2;
        this.comeback = true;
      }
      f = 1;
    } else {
      this.comeback = false;
    }
    if (f % 60 === 0) {
      this.nextSpeed = getRandomIntNum(0, 30) / 10;
      if (this.nextSpeed < 2) {
        this.nextAngularVelocity = 2 - getRandomIntNum(0, 4);
      } else {
        this.nextAngularVelocity = 4 - getRandomIntNum(0, 8);
      }
      f = 1;
    }

    // 慣性-角度
    if (
      Math.abs(this.nextAngularVelocity) -
        Math.abs(this.currentAngularVelocity) >
      0.01
    ) {
      this.currentAngularVelocity +=
        Math.abs(this.nextAngularVelocity - this.currentAngularVelocity) *
        p5.sin(((p5.PI / 2) * f) / 60);
    } else {
      this.currentAngularVelocity = this.nextAngularVelocity;
    }
    this.angle += (p5.PI / 180) * this.currentAngularVelocity;

    // 慣性-移動
    if (Math.abs(this.nextSpeed - this.currentSpeed) > 0.01) {
      this.currentSpeed +=
        (this.nextSpeed - this.currentSpeed) * p5.sin(((p5.PI / 2) * f) / 60);
    } else {
      this.currentSpeed = this.nextSpeed;
    }
    this.position.x += this.currentSpeed * p5.sin(this.angle);
    this.position.y += -this.currentSpeed * p5.cos(this.angle);

    // 軌跡配列
    const tailPosition = {
      x: this.position.x - 25 * p5.sin(this.angle),
      y: this.position.y + 25 * p5.cos(this.angle),
    };
    this.trajectory.push(tailPosition);
    this.trajectoryAngle = p5
      .createVector(-50, 0)
      .angleBetween(
        p5.createVector(
          this.trajectory[1].x - this.trajectory[0].x,
          this.trajectory[1].y - this.trajectory[0].y
        )
      );
  }

  display(p5: p5) {
    // 軌跡
    p5.stroke(this.color.body);
    p5.strokeWeight(3);
    if (this.trajectory.length >= 45) {
      this.trajectory.shift();
    }
    for (const [idx, point] of this.trajectory.entries()) {
      this.trajectory[idx + 1] &&
        p5.line(
          point.x,
          point.y,
          this.trajectory[idx + 1].x,
          this.trajectory[idx + 1].y
        );
    }

    // 画像
    p5.push();
    p5.translate(this.trajectory[0].x, this.trajectory[0].y);
    p5.rotate(this.trajectoryAngle);
    const size =
      this.img.width > this.img.height ? this.img.height : this.img.width;
    p5.copy(
      this.img,
      (this.img.width - size) / 2,
      (this.img.height - size) / 2,
      size,
      size,
      -photoSize / 2,
      -photoSize / 2,
      photoSize,
      photoSize
    );
    p5.noFill();
    p5.stroke(this.color.body);
    p5.strokeWeight(3);
    p5.rect(-photoSize / 2, -photoSize / 2, photoSize, photoSize);
    p5.pop();

    p5.push();
    p5.noStroke();
    p5.translate(this.position.x, this.position.y);
    p5.rotate(this.angle);

    //左右のヒレ
    for (let i = -1; i <= 1; i += 2) {
      p5.push();
      p5.fill(this.color.filet);
      p5.translate(0, 10);
      p5.rotate((p5.PI / 12) * p5.sin(this.theta * 2) * i);

      p5.beginShape();
      p5.vertex(0, 0);
      p5.vertex(12 * i, 4);
      p5.vertex(10 * i, 10);
      p5.vertex(0, 4);
      p5.endShape();
      p5.pop();
    }

    //尻尾
    p5.push();
    p5.fill(this.color.filet);
    p5.translate(0, 25);
    p5.rotate((p5.PI / 12) * p5.sin(this.theta * 2));
    p5.beginShape();
    p5.vertex(0, 0);
    p5.bezierVertex(0, 0, 5, 5, 3, 15);
    p5.bezierVertex(3, 15, 0, 8, 0, 8);
    p5.bezierVertex(0, 8, 0, 8, -3, 15);
    p5.bezierVertex(-3, 15, -5, 5, 0, 0);
    p5.endShape();
    p5.pop();

    //胴体
    p5.beginShape();
    p5.fill(this.color.body);
    p5.vertex(0, 30);
    p5.bezierVertex(0, 30, -10, 10, 0, 0);
    p5.bezierVertex(0, 0, 10, 10, 0, 30);
    p5.endShape();

    // デバック用Rigidbody表示コード
    // const { lt, lb, rt, rb } = this.getRigidbody();
    // p5.stroke(this.color.body);
    // p5.line(lt.x, lt.y, lb.x, lb.y);
    // p5.line(lt.x, lt.y, rt.x, rt.y);
    // p5.line(rb.x, rb.y, lb.x, lb.y);
    // p5.line(rt.x, rt.y, rb.x, rb.y);
    p5.pop();
  }

  collider(p5: p5, mouseX: number, mouseY: number): boolean {
    return (
      this.carpCollider(p5, mouseX, mouseY) ||
      this.photoCollider(p5, mouseX, mouseY)
    );
  }

  carpCollider(p5: p5, mouseX: number, mouseY: number): boolean {
    p5.push();
    p5.translate(this.position.x, this.position.y);
    p5.rotate(this.angle);
    const { lt, lb, rt, rb } = this.getCarpRigidbody();
    const x =
      (mouseX - this.position.x) * p5.cos(-this.angle) -
      (mouseY - this.position.y) * p5.sin(-this.angle);
    const y =
      (mouseX - this.position.x) * p5.sin(-this.angle) +
      (mouseY - this.position.y) * p5.cos(-this.angle);

    const ltrt = (rt.x - lt.x) * (y - lt.y) - (x - lt.x) * (rt.y - lt.y) >= 0;
    const rtrb = (rb.x - rt.x) * (y - rt.y) - (x - rt.x) * (rb.y - rt.y) >= 0;
    const rblb = (lb.x - rb.x) * (y - rb.y) - (x - rb.x) * (lb.y - rb.y) >= 0;
    const lblt = (lt.x - lb.x) * (y - lb.y) - (x - lb.x) * (lt.y - lb.y) >= 0;
    p5.pop();
    return ltrt && rtrb && rblb && lblt;
  }

  getCarpRigidbody(): Rigidbody {
    const lt = { x: -size.x / 2, y: 0 };
    const lb = { x: -size.x / 2, y: size.y };
    const rt = { x: +size.x / 2, y: 0 };
    const rb = { x: +size.x / 2, y: size.y };
    return { lt: lt, lb: lb, rt: rt, rb: rb };
  }

  photoCollider(p5: p5, mouseX: number, mouseY: number): boolean {
    p5.push();
    p5.translate(this.trajectory[0].x, this.trajectory[0].y);
    p5.rotate(this.trajectoryAngle);
    const x =
      (mouseX - this.trajectory[0].x) * p5.cos(-this.trajectoryAngle) -
      (mouseY - this.trajectory[0].y) * p5.sin(-this.trajectoryAngle);
    const y =
      (mouseX - this.trajectory[0].x) * p5.sin(-this.trajectoryAngle) +
      (mouseY - this.trajectory[0].y) * p5.cos(-this.trajectoryAngle);
    p5.pop();

    return (
      -photoSize / 2 <= x &&
      photoSize / 2 >= x &&
      -photoSize / 2 <= y &&
      photoSize / 2 >= y
    );
  }
}
