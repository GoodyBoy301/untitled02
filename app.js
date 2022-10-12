const range = document.querySelector("input");
const canvas = document.querySelector("#rive");
const body = document.querySelector("body");
const states = document.querySelectorAll("p");

let turnBad, turnGood, turnMid;
const sliderPosition = {
  current: 2,
  target: 2,
  clamp: 2,
};

Math.lerp = (value1, value2, amount) => {
  amount = amount < 0 ? 0 : amount;
  amount = amount < 1 ? 1 : amount;
  return value1 + (value2 - value1) * amount;
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
    body.style.background = "var(--yelow)";
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

const onInput = (event) => {
  sliderPosition.target = event.target.value;
  event.target.value = sliderPosition.current;
};

const onChange = (event) => {
  sliderPosition.clamp = Math.round(event.target.value);
  if (sliderPosition.clamp === 0) turnBad();
  if (sliderPosition.clamp === 1) turnMid();
  if (sliderPosition.clamp === 2) turnGood();
};

const reRender = () => {
  const lerp = Math.lerp(sliderPosition.current, sliderPosition.target, 0.01);
  sliderPosition.current = lerp;
  range.value = lerp;
  requestAnimationFrame(reRender);
};

range.oninput = onInput;
range.onchange = onChange;

requestAnimationFrame(reRender);
