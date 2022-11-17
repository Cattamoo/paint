const CANVAS_W = 800;
const CANVAS_H = 800;

const DEFAULT_BRUSH_SIZE = 5;

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// default //
canvas.width = CANVAS_W;
canvas.height = CANVAS_H;
ctx.lineCap = 'round';
const initSizeAndColor = () => {
	ctx.globalCompositeOperation = 'source-over';
	lineWidth.value = DEFAULT_BRUSH_SIZE;
	ctx.lineWidth = DEFAULT_BRUSH_SIZE;
	document.querySelector('#size label').style.width = `${DEFAULT_BRUSH_SIZE}px`;
	document.querySelector('#size label').style.height = `${DEFAULT_BRUSH_SIZE}px`;
	colorsDiv.children.item(1).classList.add('active');
	colorInput.value = colors[0].hex;
	colorView.style.backgroundColor = colors[0].hex;
}

// Brush Size //
const lineWidth = document.querySelector('#line-width');
lineWidth.addEventListener('change', ({ target }) => {
	ctx.lineWidth = target.value;
});
lineWidth.addEventListener('input', ({ target }) => {
	document.querySelector('#size label').style.width = `${target.value}px`;
	document.querySelector('#size label').style.height = `${target.value}px`;
});
ctx.lineWidth = lineWidth.value;

// Color //
const colorInput = document.querySelector('#color-input');
const colorView = document.querySelector('#color-view');
const colorsDiv = document.querySelector('#colors');
const colors = [
	{ name: 'black', 	hex: '#000000' },
	{ name: 'red', 		hex: '#ff0000' },
	{ name: 'orange', 	hex: '#ffaa00' },
	{ name: 'yellow', 	hex: '#ffff00' },
	{ name: 'green', 	hex: '#00ff00' },
	{ name: 'blue', 	hex: '#00ffff' },
	{ name: 'navy', 	hex: '#0000ff' },
	{ name: 'purple', 	hex: '#aa00ff' },
];
const clearActiveColor = () => {
	Array.from(document.querySelectorAll('.color-option')).forEach((cc) => {
		cc.classList.remove('active');
	});
}
colorInput.addEventListener('change', ({ target }) => {
	clearActiveColor();
	colorView.classList.add('active');
	ctx.globalCompositeOperation = 'source-over';
	ctx.strokeStyle = target.value;
	ctx.fillStyle = target.value;
});
colorInput.addEventListener('input', ({ target }) => {
	colorView.style.backgroundColor = target.value;
});
colorView.addEventListener('click', () => colorInput.click());
colors.forEach((c) => {
	const div = document.createElement('div');
	div.classList.add('color-option');
	div.title = c.name;
	div.style.backgroundColor = c.hex;
	div.addEventListener('click', () => {
		clearActiveColor();
		ctx.globalCompositeOperation = 'source-over';
		colorInput.value = c.hex;
		colorView.style.backgroundColor = c.hex;
		ctx.strokeStyle = c.hex;
		ctx.fillStyle = c.hex;
		div.classList.add('active');
	});
	colorsDiv.appendChild(div);
});

// Draw //
let isPainting = false;
canvas.addEventListener('mousedown', () => {
	ctx.beginPath();
	isPainting = true;
});
canvas.addEventListener('mousemove', ({ offsetX: x, offsetY: y }) => {
	if(isPainting && !isFilling) {
		ctx.lineTo(x, y);
		ctx.stroke();
		return;
	}
	ctx.moveTo(x, y);
});
document.addEventListener('mouseup', () => {
	isPainting = false;
});

// Fill //
let isFilling = false;
const modeBtn = document.querySelector('#mode-btn');
modeBtn.addEventListener('click', () => {
	if(isFilling) {
		isFilling = false;
		modeBtn.children.item(0).classList.remove('hide');
		modeBtn.children.item(1).classList.add('hide');
		document.querySelector('#size').classList.remove('hide');
	} else {
		isFilling = true;
		modeBtn.children.item(0).classList.add('hide');
		modeBtn.children.item(1).classList.remove('hide');
		document.querySelector('#size').classList.add('hide');
	}
});
canvas.addEventListener('click', () => {
	if(isFilling) {
		ctx.fillRect(0,0, CANVAS_W, CANVAS_H);
	}
});

// Clear //
const clearBtn = document.querySelector('#clear-btn');
clearBtn.addEventListener('click', () => {
	clearActiveColor();
	initSizeAndColor();
	ctx.clearRect(0,0, CANVAS_W, CANVAS_H);
});

// Eraser //
const eraserBtn = document.querySelector('#eraser-btn');
eraserBtn.addEventListener('click', () => {
	clearActiveColor();
	eraserBtn.classList.add('active');
	ctx.globalCompositeOperation = 'destination-out'
	ctx.strokeStyle = 'rgba(0, 0, 0, 1)';
	if(isFilling) {
		modeBtn.click();
	}
});

// File Input //
const fileInput = document.querySelector('#file');
const fileSelect = document.querySelector('#file-select');
fileInput.addEventListener('change', ({ target }) => {
	const file = target.files[0];
	const url = URL.createObjectURL(file); // 브라우저에서 접근 가능한 url 생성
	const image = new Image();
	image.src = url;
	image.onload = () => {
		ctx.drawImage(image, 0, 0, CANVAS_W, CANVAS_W);
		fileInput.value = null;
	}
});
fileSelect.addEventListener('click', () => fileInput.click());

// Text Input //
const textInput = document.querySelector('#text');
canvas.addEventListener('dblclick', ({ offsetX: x, offsetY: y }) => {
	const text = textInput.value;
	if(text !== '') {
		ctx.save();
		ctx.font = `${lineWidth.value * 10}px sans`;
		ctx.fillText(text, x, y);
		ctx.restore();
	}
});

// Save Image //
const saveBtn = document.querySelector('#save');
saveBtn.addEventListener('click', () => {
	const url = canvas.toDataURL();
	const a = document.createElement('a');
	a.href = url;
	a.download = `제목 없음_${new Date().getTime()}.png`;
	a.click();
});


initSizeAndColor();