import {
  textNextWeight,
  textLeftWeight,
  textLeftTorque,
  textTiltAngle,
  textRightTorque,
  textRightWeight,
  objectContainer,
  logSection,
  previewObject,
} from "./elements.js";

function updateText(element, value) {
  element.textContent = value;
}

export function updateSeesaw(tiltAngle) {
  seesaw.style.transform = `translateX(-50%) rotate(${tiltAngle}deg)`;
}

export function updateNextWeight(value) {
  updateText(textNextWeight, `${value}.0 kg`);
}

export function updateLeftWeight(value) {
  updateText(textLeftWeight, `${value}.0 kg`);
}

export function updateLeftTorque(value) {
  updateText(textLeftTorque, `${value}.0 Nm`);
}

export function updateTiltAngle(value) {
  updateText(textTiltAngle, `${value}°`);
}

export function updateRightTorque(value) {
  updateText(textRightTorque, `${value}.0 Nm`);
}

export function updateRightWeight(value) {
  updateText(textRightWeight, `${value}.0 kg`);
}

export function resetAll() {
  updateSeesaw(0);

  updateLeftWeight(0);
  updateLeftTorque(0);
  updateTiltAngle(0);
  updateRightTorque(0);
  updateRightWeight(0);

  objectContainer.innerHTML = "";
  logSection.innerHTML = "";
}

export function createObject(weight, position, color, drag, index) {
  let object = document.createElement("div");
  object.classList.add("object");
  object.style.width = `${45 + (weight - 1) * 3}px`;
  object.style.height = `${45 + (weight - 1) * 3}px`;
  object.textContent = `${weight} kg`;
  object.style.top = `${position[1] - 150}px`;
  object.style.left = `${position[0] - 200}px`;
  object.dataset.distance = position[0];
  object.dataset.index = index;
  object.style.backgroundColor = color;
  object.addEventListener("mousedown", drag);

  objectContainer.append(object);
}

export function updateObject(object, top, left) {
  setTimeout(() => {
    object.style.top = `${top}px`;
    object.style.left = `${left}px`;
  }, 4);
}

export function log(weight, distance) {
  let log = document.createElement("div");
  log.classList.add("initial");
  log.textContent = `${weight}.0 kg was dropped on the ${
    distance <= 200 ? "left" : "right"
  } side at ${Math.abs(200 - distance)}.0 cm (${
    distance - 200
  }px) from the pivot.`;

  logSection.insertBefore(log, logSection.firstElementChild);
  setTimeout(() => log.classList.remove("initial"), 4);
}

export function updatePreviewObject(nextWeight, color) {
  previewObject.style.width = `${45 + (nextWeight - 1) * 3}px`;
  previewObject.style.height = `${45 + (nextWeight - 1) * 3}px`;
  previewObject.style.backgroundColor = color;
  previewObject.textContent = `${nextWeight} kg`;
}

export function movePreviewObject(left, top, weight, tiltAngle) {
  previewObject.style.display = "flex";
  previewObject.style.top = `${top}px`;
  previewObject.style.left = `${left}px`;
  previewObject.style.setProperty("--distance", `"${left - 200}px"`);
  previewObject.style.setProperty(
    "--line-height",
    `${
      115 -
      top +
      (weight - 1) * -1.5 +
      (200 - left) * Math.tan((-tiltAngle * Math.PI) / 180)
    }px`
  );
}

export function grabObject(object) {
  object.classList.add("grab");
  object.style.transition = "border 0.25s, filter 0.25s";
  object.style.cursor = "grabbing";
}

export function dropObject(object) {
  object.classList.remove("grab");
  object.style.transition = "";
  object.style.cursor = "";
}
