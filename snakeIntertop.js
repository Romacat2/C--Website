window.snakeInterop = {
    adjustCanvasSize: function (canvasId, blockSize) {
        const canvas = document.getElementById(canvasId);

        let width, height;

        if (window.innerHeight < window.innerWidth) {
            height = Math.floor(window.innerHeight * 0.85);
            width = height;
        } else {
            width = window.innerWidth;
            height = width;
        }

        width = Math.floor(width / blockSize - 2) * blockSize;
        height = Math.floor(height / blockSize - 2) * blockSize;

        canvas.width = width;
        canvas.height = height;

        return { width: width, height: height };
    },
    drawSquare: function (ctx, x, y, size, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, size, size);
    },
    drawCircle: function (ctx, x, y, radius, color) {
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();
    },
    drawText: function (ctx, text, x, y, font, color, align = "center", baseline = "middle") {
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.textAlign = align;
        ctx.textBaseline = baseline;
        ctx.fillText(text, x, y);
    },
    drawBorder: function (ctx, blockSize, width, height, color) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, width, blockSize); // top
        ctx.fillRect(0, height - blockSize, width, blockSize); // bottom
        ctx.fillRect(0, 0, blockSize, height); // left
        ctx.fillRect(width - blockSize, 0, blockSize, height); // right
    }
};