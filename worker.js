updateCSS = async (data) => {
    let customCSS = {};
    data.stylesheet.forEach(stylesheet => {
        rules = stylesheet.slice(data.hash.length + 1).trim().slice(1, -1).trim().split(";");
        rules.forEach(rule => {
            [property, value] = rule.length > 0 ? rule.split(":") : ["", ""];
            if(property.length > 0 && value.length > 0) customCSS[property.trim()] = value.trim();
        })
    })
    // Object.entries(customCSS).flatMap(m => m.join(": ")).join(";\n")
    self.postMessage({case: "updatedCSS", css: Object.entries(customCSS).flatMap(m => m.join(": ")).join(";\n\t\t\t\t")+";" });
}

onmessage = function(e) {
    switch(e.data.message)
    {
        case "updateCSS":
            updateCSS(e.data);
            this.self.postMessage({ case: "closeWorker" });
            break;
        default:
            console.log("Case not implemented!")
    }
}
