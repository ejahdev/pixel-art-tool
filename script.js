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
let isMouseOverCanvas = false;
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
    pixel.id = `pixel-${i}`; // Assign a unique ID to each pixel
    pixel.classList.add("pixel"); // Add a class for pixels
    canvas.appendChild(pixel);

    // Attach mousedown event listener to each pixel
    const pixels = document.querySelectorAll(".pixel");
    pixels.forEach((pixel) => {
      pixel.addEventListener("mousedown", (event) => {
        isDrawing = true;
        paintPixel(event.target);
      });
    });
  }

  // Function to handle drawing when the mouse is moved
  function handleMouseMove(event) {
    if (isDrawing && isMouseOverCanvas) {
      const pixel = event.target;
      if (pixel.classList.contains("pixel") && !pixel.getAttribute("data-painted")) {
        paintPixel(pixel);
      }
    }
  }
    
  canvas.addEventListener("mousedown", () => {
    isDrawing = true;
  });
  
  canvas.addEventListener("mouseup", () => {
    isDrawing = false;
  });
  
  canvas.addEventListener("mouseleave", () => {
    isDrawing = false;
  });
  
  canvas.addEventListener("mouseover", (event) => {
    if (isDrawing) {
      if (event.target.classList.contains("pixel")) {
        paintPixel(event.target);
      }
    }
  });
    
  function paintPixel(pixel) {
    const pixelId = pixel.id;
    if (pixelColors[pixelId] === currentColor) {
      // If the pixel already has the current color, undo the paint
      pixel.style.backgroundColor = "transparent";
      pixelColors[pixelId] = "transparent";
      pixel.removeAttribute("data-painted");
    } else {
      pixel.style.backgroundColor = currentColor;
      pixelColors[pixelId] = currentColor;
      pixel.setAttribute("data-painted", "true");
    }
  }
}
    


// Function to undo painting by making a pixel transparent
function undoPaint(pixel) {
  const pixelId = pixel.id;
  pixel.style.backgroundColor = "transparent";
  pixelColors[pixelId] = "transparent";
  pixel.removeAttribute("data-painted");
}

// Add the "Erase" button to the palette
const eraseDiv = document.createElement("div");
eraseDiv.textContent = "";
eraseDiv.addEventListener("click", () => {
  currentColor = "transparent";
  brushIndicator.style.backgroundColor = "transparent";
  updateBrushIndicatorText("Transparent");
});

// Apply CSS styles to make the eraser button round
eraseDiv.style.display = "flex";
eraseDiv.style.alignItems = "center";
eraseDiv.style.justifyContent = "center";
eraseDiv.style.width = "20px"; // Set the width to create a round button
eraseDiv.style.height = "20px"; // Set the height to create a round button
eraseDiv.style.borderRadius = "50%"; // Make the button round
eraseDiv.style.backgroundColor = "transparent"; // Background color
eraseDiv.style.border = "2px solid black";


palette.appendChild(eraseDiv);


  function createPalette(colors) {
    palette.innerHTML = "";
  
    colors.forEach((color) => {
      const colorDiv = document.createElement("div");
      if (typeof color === "object") {
        colorDiv.style.backgroundColor = color.value; // Use color.value for RGB value
        colorDiv.addEventListener("click", () => {
          currentColor = color.value; // Use color.value for RGB value
          brushIndicator.style.backgroundColor = currentColor;
          updateBrushIndicatorText(color.value); // Call the function to update the text
        });
      } else {
        // Handle non-object colors (e.g., "Erase")
        colorDiv.style.backgroundColor = color;
        colorDiv.addEventListener("click", () => {
          currentColor = color;
          brushIndicator.style.backgroundColor = color;
          updateBrushIndicatorText(color); // Call the function to update the text
        });
      }
      palette.appendChild(colorDiv);
    });
  
    // Add the "Erase" button to the palette
    const eraseDiv = document.createElement("div");
    eraseDiv.textContent = "";
    eraseDiv.addEventListener("click", () => {
      currentColor = "transparent";
      brushIndicator.style.backgroundColor = "transparent";
      updateBrushIndicatorText("Transparent");
    });
  
    // Apply CSS styles to make the eraser button round
    eraseDiv.style.display = "flex";
    eraseDiv.style.alignItems = "center";
    eraseDiv.style.justifyContent = "center";
    eraseDiv.style.width = "20px"; // Set the width to create a round button
    eraseDiv.style.height = "20px"; // Set the height to create a round button
    eraseDiv.style.borderRadius = "50%"; // Make the button round
    eraseDiv.style.backgroundColor = "transparent"; // Background color
    eraseDiv.style.border = "2px solid black";
  
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


function updateBrushIndicatorText(color) {
  if (typeof color === "string") {
    brushIndicator.textContent = color;
  } else if (typeof color === "object" && color.name) {
    brushIndicator.textContent = color.name;
  }
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
// Initialize palette
createPalette([
  "black", "white", "red", "blue", "green", "yellow",
  "purple", "brown", "gray", "aquamarine", "aqua", "cornflowerblue",
  "chartreuse", "yellowgreen", "darkolivegreen", "darkmagenta", "hotpink",
  "gold", "indigo", "dodgerblue", "deepskyblue", "dimgrey", "salmon", "coral",
  "limegreen", "navy", "mediumpurple", "maroon", "mistyrose", {name: "Red1", value: "rgb(244, 36, 15)"},
  {name: "Red2", value: "rgb(244, 75, 5)"}, {name: "Orange1", value: "rgb(241, 143, 3)"},
  {name: "Orange2", value: "rgb(239, 174, 0)"}, {name: "Yellow1", value: "rgb(244, 243, 41)"},
  {name: "Green1", value: "rgb(198, 221, 36)"}, {name: "Green2", value: "rgb(99, 167, 46)"},
  {name: "Blue1", value: "rgb(2, 136, 195)"}, {name: "Blue2", value: "rgb(4, 66, 245)"},
  {name: "Purple1", value: "rgb(59, 0, 154)"}, {name: "Purple2", value: "rgb(129, 0, 166)"},
  {name: "Maroon1", value: "rgb(165, 23, 71)"},
]);


// Initialize brush color indicator
brushIndicator.style.backgroundColor = currentColor;
updateBrushIndicatorText(currentColor);
