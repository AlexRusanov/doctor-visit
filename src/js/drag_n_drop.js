let main = document.getElementById("main");

let dragoffset = {
    x: 0,
    y: 0
};

main.addEventListener("mousedown", function (event) {
    if (event.target.classList.contains("draggable-card") && event.button === 0) {
        event.pageX = event.pageX || event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
        event.pageY = event.pageY || event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
        dragoffset.x = event.pageX - event.target.offsetLeft;
        dragoffset.y = event.pageY - event.target.offsetTop;

        let cardToDrag = event.target;

        cardToDrag.style.position = "absolute";
        cardToDrag.style.zIndex = 1000;

        moveCard(event.pageX, event.pageY, event);

        function moveCard(x, y, event) {
            x = x || event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
            y = y || event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);

            let offsetX,
                offsetY;

            if (x - dragoffset.x < 0) {
                offsetX = 0;
            } else if (x - dragoffset.x + cardToDrag.getBoundingClientRect().width > main.clientWidth) {
                offsetX = document.body.clientWidth - cardToDrag.getBoundingClientRect().width;
            } else {
                offsetX = x - dragoffset.x;
            }

            if (y - dragoffset.y < 0) {
                offsetY = 0;
            } else if (y - dragoffset.y + cardToDrag.getBoundingClientRect().height > main.clientHeight) {
                offsetY = document.body.clientHeight - cardToDrag.getBoundingClientRect().height;
            } else {
                offsetY = y - dragoffset.y;
            }

            cardToDrag.style.top = offsetY + "px";
            cardToDrag.style.left = offsetX + "px";
        }

        function onMouseMove(event) {
            moveCard(event.pageX, event.pageY, event);
        }

        document.addEventListener("mousemove", onMouseMove);

        cardToDrag.onmouseup = function () {
            document.removeEventListener('mousemove', onMouseMove);
            cardToDrag.onmouseup = null;
        }
    }
});

main.ondragstart = function() {
    return false;
};
