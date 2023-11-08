const saveButton = document.getElementById("save-button");
const clearButton = document.getElementById("clear-button"); // New clear button
const sizeButtons = document.getElementById("size-buttons");
const size16Button = document.getElementById("size-16");
const size32Button = document.getElementById("size-32");
const size48Button = document.getElementById("size-48");
const canvas = document.getElementById("canvas");
const palette = document.getElementById("palette");
const brushIndicator = document.getElementById("brush-indicator");
let currentColor = "red"; // Default brush color
let isDrawing = false; // Flag to track drawing state
const pixelColors = {}; // Store colors for each pixel


// Function to create canvas grid
function createCanvas(width, height) {
    canvas.innerHTML = "";
    canvas.style.gridTemplateColumns = `repeat(${width}, 20px)`;
    canvas.style.gridTemplateRows = `repeat(${height}, 20px)`;
    canvas.style.backgroundColor = "lightgray"; // Set the background color to gray

    for (let i = 0; i < width * height; i++) {
      const pixel = document.createElement("div");
      pixel.style.width = "20px";
      pixel.style.height = "20px";
      pixel.style.backgroundColor = "transparent"; // Set uncolored pixels as transparent
      pixel.style.border = "1px solid #ccc";
      pixel.addEventListener("click", () => {
        togglePixelColor(pixel); // Toggle the pixel's color when clicked
      });
      pixel.id = `pixel-${i}`; // Assign a unique ID to each pixel
      canvas.appendChild(pixel);
    }
  }  



  function floodFill(pixel, newColor, targetColor) {
    const pixelId = pixel.id;

    if (pixelColors[pixelId] !== targetColor) {
      return;
    }

    pixelColors[pixelId] = newColor;
    pixel.style.backgroundColor = newColor;

    const x = parseInt(pixelId.split("-")[1]) % currentGridSize;
    const y = Math.floor(parseInt(pixelId.split("-")[1]) / currentGridSize);

    const neighbors = [
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < currentGridSize && ny >= 0 && ny < currentGridSize) {
        floodFill(
          document.getElementById(`pixel-${ny * currentGridSize + nx}`),
          newColor,
          targetColor
        );
      }
    }
  }

  canvas.addEventListener("mousedown", (event) => {
    if (event.button === 1) { // Middle mouse button (button code 1)
      const pixelId = event.target.id;
      const pixelColor = pixelColors[pixelId];

      if (pixelColor === "transparent") {
        floodFill(event.target, currentColor, "transparent");
      }
    }
  });

  // Function to toggle a pixel's color between currentColor and transparent
  function togglePixelColor(pixel) {
    const pixelId = pixel.id;
    if (pixelColors[pixelId] === currentColor) {
      pixel.style.backgroundColor = "transparent";
      pixelColors[pixelId] = "transparent";
    } else {
      pixel.style.backgroundColor = currentColor;
      pixelColors[pixelId] = currentColor;
    }
  }

// Function to create palette colors
function createPalette(colors) {
  palette.innerHTML = "";

  colors.forEach((color) => {
    const colorDiv = document.createElement("div");
    colorDiv.style.backgroundColor = color;
    colorDiv.addEventListener("click", () => {
      currentColor = color;
      brushIndicator.style.backgroundColor = color;
      updateBrushIndicatorText(color); // Call the function to update the text
    });
    palette.appendChild(colorDiv);
  });

    // Add the "Erase" button to the palette
    const eraseDiv = document.createElement("div");
    eraseDiv.textContent = "Erase";
    eraseDiv.addEventListener("click", () => {
    currentColor = "transparent";
    brushIndicator.style.backgroundColor = "transparent";
    updateBrushIndicatorText("Transparent");
    });

    // Center the text within the "Erase" button
    eraseDiv.style.display = "flex";
    eraseDiv.style.alignItems = "center";
    eraseDiv.style.justifyContent = "center";

    palette.appendChild(eraseDiv);

}


function clearCanvas() {
  for (const pixelId in pixelColors) {
    const pixel = document.getElementById(pixelId);
    if (pixel) {
      pixel.style.backgroundColor = "transparent";
      pixelColors[pixelId] = "transparent";
    }
  }
}


// Function to update the brush indicator text
function updateBrushIndicatorText(color) {
  brushIndicator.textContent = "" + color;
}

// Add a click event listener to the "Clear" button
clearButton.addEventListener("click", () => {
    clearCanvas();
  });

// Add a click event listener to the "Save" button
saveButton.addEventListener("click", () => {
    // Get the current grid size

    const imageCanvas = document.createElement("canvas");
    const canvasWidth = currentGridSize * 20; // Set the canvas width based on grid size
    const canvasHeight = currentGridSize * 20; // Set the canvas height based on grid size
    imageCanvas.width = canvasWidth;
    imageCanvas.height = canvasHeight;
    const ctx = imageCanvas.getContext("2d");

    // Redraw your grid onto the image canvas
    for (let x = 0; x < currentGridSize; x++) {
      for (let y = 0; y < currentGridSize; y++) {
        const pixelColor = pixelColors[`pixel-${y * currentGridSize + x}`];
        if (pixelColor) {
          ctx.fillStyle = pixelColor;
          ctx.fillRect(x * 20, y * 20, 20, 20);
        }
      }
    }

    // Create a data URL from the image canvas
    const canvasDataUrl = imageCanvas.toDataURL("image/png");

    // Create an anchor element to trigger the download
    const downloadLink = document.createElement("a");
    downloadLink.href = canvasDataUrl;
    downloadLink.download = "pixel-art.png"; // Set the desired file name

    // Simulate a click on the download link to trigger the download
    downloadLink.click();
  });

let currentGridSize = 16;

size16Button.addEventListener("click", () => {
    clearCanvas();
    createCanvas(16, 16);
    currentGridSize = 16;
  });

  size32Button.addEventListener("click", () => {
    clearCanvas();
    createCanvas(32, 32);
    currentGridSize = 32;
  });

  size48Button.addEventListener("click", () => {
    clearCanvas();
    createCanvas(48, 48);
    currentGridSize = 48;
  }); 

// Initialize canvas and palette
createCanvas(16, 16);
createPalette([
  "black", "white", "red", "blue", "green", "yellow",
  "purple", "brown", "gray", "aquamarine", "aqua", "cornflowerblue",
  "chartreuse", "yellowgreen", "darkolivegreen", "darkmagenta", "hotpink",
  "gold", "indigo", "dodgerblue", "deepskyblue", "dimgrey", "salmon", "coral",
  "limegreen", "navy", "mediumpurple", "maroon", "mistyrose",
]);

// Initialize brush color indicator
brushIndicator.style.backgroundColor = currentColor;
updateBrushIndicatorText(currentColor);
