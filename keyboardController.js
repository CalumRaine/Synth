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
						event.stopPropagation();
						break;
					case "qwerty width":
						this.rail.HandleWidth = event.detail.attachment;
						event.stopPropagation();
						break;
					default:
						console.log("Event message", event.detail.msg, "unhandled");
						break;
				}
				break;
			case "QwertyHandle":
				switch (event.detail.msg){
					case "qwerty clicked":
						this.announce("qwerty clicked", null);
						event.stopPropagation();
						break;
					case "qwerty moved":
						this.keyboard.qwertyMoved(event.detail.attachment);
						event.stopPropagation();
						break;
					case "qwerty released":
						this.keyboard.qwertyReleased();
						event.stopPropagation();
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

	announce(msg, attachment){
                let e = new CustomEvent("KeyboardController", { detail: { msg: msg, attachment: attachment }, bubbles: true });
                this.dispatchEvent(e);
        }
}

customElements.define("keyboard-controller", KeyboardController, { extends: "div" } );
