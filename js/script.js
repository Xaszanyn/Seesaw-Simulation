import {
  resetButton,
  objectContainer,
  interactionLayer,
  previewObject,
  redThemeButton,
  greenThemeButton,
  blueThemeButton,
} from "./elements.js";

import {
  updateSeesaw,
  updateNextWeight,
  updateLeftWeight,
  updateLeftTorque,
  updateTiltAngle,
  updateRightTorque,
  updateRightWeight,
  resetAll,
  createObject,
  updateObject,
  log,
  updatePreviewObject,
  movePreviewObject,
} from "./ui.js";

import {
  loadState,
  saveState,
  resetState,
  loadTheme,
  saveTheme,
} from "./storage.js";

import { playWhoosh, playPop, playKeyPress } from "./sound.js";

import { drag, initializeDrag } from "./drag.js";

var state = loadState(); //* { objects, tiltAngle, nextWeight, previewWeight, previewPosition }

function previewNextObject() {
  state.color = `hsl(${Math.ceil(Math.random() * 360)} 100% 70%)`;
  updatePreviewObject(state.nextWeight, state.color);
  state.previewWeight = state.nextWeight;

  state.nextWeight = Math.ceil(Math.random() * 10);
  updateNextWeight(state.nextWeight);
}

(function initialize() {
  state.objects.map((object, index) => {
    createObject(object[0], [object[1], 150], object[2], drag, index); //* 150 is initial y value.
    log(object[0], object[1]);
  });

  calculateTiltAngle();
  calculateObjectsPosition();

  previewNextObject();

  initializeDrag(moveObject);

  setTheme(loadTheme());
})();

interactionLayer.addEventListener("mousemove", ({ offsetX, offsetY }) => {
  offsetX = Math.min(400, Math.max(0, offsetX));
  state.previewPosition = [offsetX, offsetY];
  movePreviewObject(offsetX, offsetY, state.previewWeight, state.tiltAngle);
});

interactionLayer.addEventListener(
  "mouseleave",
  () => (previewObject.style.display = "none")
);

interactionLayer.addEventListener("click", (event) => {
  state.objects.push([
    state.previewWeight,
    state.previewPosition[0],
    state.color,
  ]);

  saveState(state);

  createObject(
    state.previewWeight,
    state.previewPosition,
    state.color,
    drag,
    state.objects.length - 1
  );

  log(state.previewWeight, state.previewPosition[0]);

  calculateObjectsPosition();
  calculateTiltAngle(false);

  previewNextObject();

  playPop();
});

function calculateTiltAngle(instant = true) {
  if (!state.objects.length) return;

  let [leftWeight, leftTorque, rightWeight, rightTorque] = state.objects.reduce(
    (stats, object) => {
      stats[object[1] <= 200 ? 0 : 2] += object[0];
      stats[object[1] <= 200 ? 1 : 3] += object[0] * Math.abs(200 - object[1]);

      return stats;
    },
    [0, 0, 0, 0]
  );

  if (!leftTorque && !rightTorque) return; //* When objects are placed at the exact pivot.

  updateLeftWeight(leftWeight);
  updateLeftTorque(leftTorque);
  updateRightTorque(rightTorque);
  updateRightWeight(rightWeight);

  let previousTiltAngle = state.tiltAngle ?? 0;

  state.tiltAngle =
    Math.round(Math.tanh(Math.log(rightTorque / leftTorque)) * 30 * 100) / 100;

  setTimeout(
    () => {
      updateSeesaw(state.tiltAngle);
      updateTiltAngle(state.tiltAngle);
      calculateObjectsPosition();
    },
    instant ? 4 : 250
  );

  saveState(state);

  playWhoosh(Math.abs(previousTiltAngle - state.tiltAngle));
}

function calculateObjectPosition(object) {
  let top, left, distance;

  distance = Math.min(400, Math.max(0, object.dataset.distance));

  top =
    Math.sin((state.tiltAngle * Math.PI) / 180) * (distance - 200) -
    parseInt(object.style.height) / 2;
  left = Math.cos((state.tiltAngle * Math.PI) / 180) * (distance - 200);

  updateObject(object, top, left);
}

function calculateObjectsPosition() {
  [...objectContainer.children].map(calculateObjectPosition);
}

function moveObject(object, offset = 0) {
  object.dataset.distance = Math.min(
    400,
    Math.max(0, object.dataset.distance - offset)
  );

  state.objects[object.dataset.index][1] = object.dataset.distance;
  saveState(state);

  calculateObjectPosition(object);
  calculateTiltAngle();
}

resetButton.addEventListener("click", () => {
  state = resetState();
  resetAll();
  playKeyPress();
});

function setTheme(theme) {
  document.body.className = `${theme}-theme`;
  saveTheme(theme);
  playKeyPress();
}

redThemeButton.addEventListener("click", () => setTheme("red"));
greenThemeButton.addEventListener("click", () => setTheme("green"));
blueThemeButton.addEventListener("click", () => setTheme("blue"));
