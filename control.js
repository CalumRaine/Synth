class Control {
	id = 0;
	title = "Control";
	synth = null;
	nodes = [];
	wiresIn = [];
	wiresOut = [];

	constructor(id, synth, title){
		this.id = id;
		this.synth = synth;
		this.title = title;
	}

	get LastNode(){
		return this.nodes.length == 0 ? null : this.nodes[this.nodes.length - 1];
	}

	addControl(){
		let div = document.createElement("div");
		div.className = "control";

		let h3 = this.addH3(div, this.title);
		h3.setAttribute("contenteditable", true);

		this.addTable(div);

		document.body.appendChild(div);
		return div;
	}

	addH3(div, text){
		let h3 = document.createElement("h3");
		h3.innerHTML = text;
		div.appendChild(h3);
		return h3;
	}

	addTable(div){
		let table = document.createElement("table");
		div.appendChild(table);

		let tbody = document.createElement("tbody");
		table.appendChild(tbody);

		return tbody;
	}

	addLabelledRow(tbody, text){
		let tr = document.createElement("tr");
		tbody.appendChild(tr);

		let cell = document.createElement("td");
		tr.appendChild(cell);

		let label = document.createElement("label");
		label.setAttribute("for", text);
		label.innerHTML = text;
		cell.appendChild(label);

		cell = document.createElement("td");
		tr.appendChild(cell);

		return cell;
	}

	addInput(tr, label, value, changeFunc){
		let input = document.createElement("input");
		tr.appendChild(input);

		input.type = "number";
		input.name = label;
		input.value = value;
		input.oninput = changeFunc;
		input.calumObject = this;

		return input;
	}

	addJack(cell, connectFunc){
		return this.addButton(cell, "Connect", connectFunc);
	}

	addHandle(cell){
		let button = this.addButton(cell, "", null);
		button.className = "handle";
		return button;
	}

	addButton(cell, text, clickFunc){
		let button = document.createElement("button");
		cell.appendChild(button);

		button.innerHTML = text;
		button.calumObject = this;
		button.onclick = clickFunc;
		return button;
	}

	addSelect(cell, changeFunc){
		let select = document.createElement("select");
		cell.appendChild(select);
		select.calumObject = this;
		select.onchange = changeFunc;

		return select;
	}

	addOption(select, text, value){
		let option = document.createElement("option");
		select.appendChild(option);
		option.innerHTML = text;
		option.value = value;
		return option;
	}
}
