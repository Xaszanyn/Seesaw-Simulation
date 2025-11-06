import { grabObject, dropObject } from "./ui.js";

var object;
var position;

export function drag(event) {
  object = event.target;
  position = event.screenX;

  grabObject(object);
}

export function initializeDrag(moveObject) {
  window.addEventListener("mousemove", (event) => {
    if (!object) return;

    moveObject(object, position - event.screenX);
    position = event.screenX;
  });

  window.addEventListener("mouseup", () => {
    if (!object) return;

    dropObject(object);

    object = null;
    position = null;
  });
}
