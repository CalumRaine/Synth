class KeyboardController extends HTMLDivElement {
	keyboard = null;
	rail = null;
	
	constructor(){
		super();
		super.setAttribute("is", "keyboard-controller");
		this.addEventListener("KeyboardKeys", this.handleEvents);
		this.addEventListener("QwertyHandle", this.handleEvents);
	}

	connectedCallback(){
		this.rail = new QwertyRail();
		this.appendChild(this.rail);

		this.keyboard = new KeyboardKeys("A", 55, 88);
		this.appendChild(this.keyboard);
	}

	handleEvents(event){
		switch (event.type){
			case "KeyboardKeys":
				switch (event.detail.msg){
					case "qwerty start":
						this.rail.HandleLeftPos = event.detail.attachment;
						break;
					case "qwerty width":
						this.rail.HandleWidth = event.detail.attachment;
						break;
					default:
						console.log("Event message", event.detail.msg, "unhandled");
						break;
				}
				break;
			case "QwertyHandle":
				switch (event.detail.msg){
					case "qwerty moved":
						this.keyboard.qwertyMoved(event.detail.attachment);
						break;
					case "qwerty released":
						this.keyboard.qwertyReleased();
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
}

customElements.define("keyboard-controller", KeyboardController, { extends: "div" } );
