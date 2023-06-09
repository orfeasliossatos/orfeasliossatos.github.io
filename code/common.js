function toggleParagraph(id) {
    var childNodes = document.getElementById(id).childNodes;
    for (var i = 0; i < childNodes.length; i++) {
        var node = childNodes[i];
        if (node.nodeType == Node.ELEMENT_NODE) {
            node.classList.toggle("hidden");
        }
    }

}