let keyboardController = document.querySelector("div[is='keyboard-controller']");

window.addEventListener("KeyboardController", this.handleEvents);

function handleEvents(event){
	switch (event.type){
		case "KeyboardController":
			switch (event.detail.msg){
				case "qwerty clicked":
					window.addEventListener("pointermove", this.slideQwerty);
					window.addEventListener("pointerup", this.releaseQwerty);
					break;
				default:
					console.log("Event message", event.detail.msg, "unhandled");
					break;
			}
			break;
		default:
			console.log("Event type", event.type, "unhandled");
			break;
	}
}

function slideQwerty(event){
	return keyboardController.rail.handle.slide(event);
}

function releaseQwerty(event){
	window.removeEventListener("pointermove", this.slideQwerty);
	window.removeEventListener("pointerup", this.releaseQwerty);
	return keyboardController.rail.handle.release(event);
}
