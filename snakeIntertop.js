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
    focusCanvas : function (id) {
        document.getElementById(id)?.focus();
    },
    drawSquare: function (ctx, x, y, size, color) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, size, size);
    },
    drawCircle: function (ctx, x, y, radius, gradientStops) {
        const gradient = ctx.createRadialGradient(
            x - radius * 0.4, y - radius * 0.4, radius * 0.2,
            x, y, radius
        );

        gradientStops.forEach(stopObj => {
            gradient.addColorStop(stopObj.stop, stopObj.color);
        });

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.strokeStyle = "#1a1a1a";
        ctx.lineWidth = 1;
        ctx.stroke();

        // 🍏 Малюємо гарний хвостик
        ctx.beginPath();
        ctx.strokeStyle = "#8b5a2b"; // гілковий коричневий, добре видно на чорному фоні
        ctx.lineWidth = 2;
        ctx.lineCap = "round";

        // Малюємо вигнуту гілочку з нахилом
        ctx.moveTo(x, y - radius + 2);
        ctx.quadraticCurveTo(
            x - radius * 0.2, // контрольна точка лівіше
            y - radius - 4,   // вище за яблуко
            x - 2,            // кінцева точка трохи лівіше
            y - radius - 2    // на рівні верхнього краю яблука
        );

        ctx.stroke();
    },
    drawText: function (ctx, text, x, y, font, color, align = "center", baseline = "middle") {
        ctx.font = font;
        ctx.textAlign = align;
        ctx.textBaseline = baseline;
        ctx.fillStyle = color;
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