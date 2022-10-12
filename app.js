// const range = document.querySelector("input");
const slider = document.querySelector(".slider");
const line = document.querySelector(".line");
const canvas = document.querySelector("#rive");
const body = document.querySelector("body");
const states = document.querySelectorAll("p");

let turnBad,
  turnGood,
  turnMid,
  sliderPosition,
  slidableArea,
  points,
  previousSnap;
const createSliderPosition = () => {
  slidableArea = line.getBoundingClientRect();
  points = {
    horrible: slidableArea.x,
    ok: slidableArea.x + slidableArea.width / 2,
    good: slidableArea.right,
  };
  sliderPosition = {
    current: slidableArea.right,
    target: slidableArea.right,
    previous: slidableArea.right,
    offset: slidableArea.x,
  };
};

Math.lerp = (value1, value2, amount) => {
  amount = amount < 0 ? 0 : amount;
  amount = amount > 1 ? 1 : amount;
  return value1 + (value2 - value1) * amount;
};
Math.clamp = (value, min, max) => {
  if (value < min) return min;
  else if (value > max) return max;
  return value;
};
Math.snap = (value) => {
  value /= points.good;
  const point0 = points.horrible / points.good;
  const point1 = points.ok / points.good;
  const point2 = points.good / points.good;
  const min = point0 + (point1 - point0) / 2;
  const max = point1 + (point2 - point1) / 2;
  if (value < min) return [points.horrible, 0];
  else if (value > max) return [points.good, 1];
  else if (value >= min && value <= max) return [points.ok, 2];
  else return [value, 2];
};

const classSwitcher = (class1, class2, class3) => {
  states[1].className = class1;
  states[2].className = class2;
  states[3].className = class3;
};

const onLoad = () => {
  const [badTrigger, goodTrigger, midTrigger] =
    faces.stateMachineInputs("faces");
  turnBad = () => {
    badTrigger.fire();
    body.style.background = "var(--pink)";
    classSwitcher("center", "right", "right");
  };
  turnGood = () => {
    goodTrigger.fire();
    body.style.background = "var(--green)";
    classSwitcher("left", "left", "center");
  };
  turnMid = () => {
    midTrigger.fire();
    body.style.background = "var(--yellow)";
    classSwitcher("left", "center", "right");
  };
};

const faces = new rive.Rive({
  src: "./assets/export.riv",
  stateMachines: "faces",
  fit: rive.Fit.cover,
  autoplay: true,
  canvas,
  onLoad,
});

const onChange = (event) => {
  const clientX = event.clientX || event.touches[0]?.clientX;
  if (clientX === sliderPosition.previous) return;
  sliderPosition.target = Math.clamp(clientX, points.horrible, points.good);
  sliderPosition.previous = clientX;
  if (previousSnap !== Math.snap(sliderPosition.target)) {
    const [snap, index] = Math.snap(sliderPosition.target);
    index === 0 && turnBad();
    index === 1 && turnGood();
    index === 2 && turnMid();
    previousSnap = snap;
  }
};

const reRender = () => {
  const lerp = Math.lerp(sliderPosition.current, sliderPosition.target, 0.1);
  sliderPosition.target = Math.lerp(
    sliderPosition.target,
    Math.snap(sliderPosition.target)[0],
    0.1
  );
  sliderPosition.current = lerp;
  slider.style.transform = `translateX(${lerp - sliderPosition.offset}px)`;
  requestAnimationFrame(reRender);
};

const addEventListeners = () => {
  line.ontouchstart = onChange;
  line.ontouchmove = onChange;
  line.onclick = onChange;
  line.onmousemove = onChange;
  window.onresize = createSliderPosition;
};

createSliderPosition();
addEventListeners();
requestAnimationFrame(reRender);
