class Control {
	id = 0;
	title = "Control";
	synth = null;
	node = null;

	constructor(id, synth, title){
		this.id = id;
		this.synth = synth;
		this.title = title;
	}

	connectTo(id){
		this.node.disconnect();
		this.node.connect( this.synth.nodes.find(node => node.id == id).node );
	}

	addControl(){
		let div = document.createElement("div");
		this.addH3(div, this.title);

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

	addInput(tr, label, value, min, max, changeFunc){
		let input = document.createElement("input");
		tr.appendChild(input);

		input.type = "number";
		input.name = label;
		input.value = value;
		input.placeholder = `${min} - ${max}`;
		input.oninput = changeFunc;
		input.calumObject = this;

		return input;
	}

	addConnections(div){
		let tbody = this.addTable(div);
		let cell = this.addLabelledRow(tbody, "Connect To");

		let changeFunc = function() { this.calumObject.connectTo(this.value); };
		let select = this.addSelect(cell, changeFunc);
		this.synth.nodes.forEach(node => select.appendChild(node.generateOption()));

		this.connectTo(select.querySelector("option:checked").value);

		return select;
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

	generateOption(){
		let option = document.createElement("option");
		option.value = this.id;
		option.innerHTML = this.title;
		return option;
	}
}
