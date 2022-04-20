const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash &= hash; // Convert to 32bit integer
  }
  return new Uint32Array([hash])[0].toString(36);
};

const workerBlob = new Blob(
  [
    "(",
    function () {
      this.updateCSS = (data) => {
        let customCSS = {};
        data.stylesheet.forEach((stylesheet) => {
          rules = stylesheet
            .slice(data.hash.length + 1)
            .trim()
            .slice(1, -1)
            .trim()
            .split(";");
          rules.forEach((rule) => {
            [property, value] = rule.length > 0 ? rule.split(":") : ["", ""];
            if (property.length > 0 && value.length > 0)
              customCSS[property.trim()] = value.trim();
          });
        });
        self.postMessage({
          case: "updatedCSS",
          css:
            Object.entries(customCSS)
              .flatMap((m) => m.join(": "))
              .join(";\n\t\t\t\t") + ";",
        });
      };

      this.updateHoverCSS = (data) => {
        let customCSS = {};
        data.stylesheet.forEach((stylesheet) => {
          rules = stylesheet
            .slice(".cursor-hover-active".length)
            .trim()
            .slice(1, -1)
            .trim()
            .split(";");
          rules.forEach((rule) => {
            [property, value] = rule.length > 0 ? rule.split(":") : ["", ""];
            if (property.length > 0 && value.length > 0)
              customCSS[property.trim()] = value.trim();
          });
        });

        self.postMessage({
          case: "updatedHoverCSS",
          css:
            Object.entries(customCSS)
              .flatMap((m) => m.join(": "))
              .join(";\n\t\t\t\t") + ";",
        });
      };

      this.onmessage = function (e) {
        switch (e.data.message) {
          case "updateCSS":
            e.data?.stylesheet?.length > 0 && updateCSS(e.data);
            break;
          case "updateHoverCSS":
            e.data?.stylesheet?.length > 0 && updateHoverCSS(e.data);
            break;
          default:
            console.log(`Case: ${e.data.message} not yet implemented!`);
        }
      };
    }.toString(),
    ")()",
  ],
  { type: "text/javascript" }
);

class Cursor extends HTMLElement {
  constructor() {
    super();
    this.hash = "cursor-" + simpleHash(Date.now().toString());
    this.customCSS = { standard: "", hover: "" };

    this.attachShadow({ mode: "open" });

    this.worker = new Worker(window.URL.createObjectURL(workerBlob));
    // this.worker.onmessage = (e) => handleWorkerMessage(e);
    // this.worker.updateCSS = (message) => workerUpdateCSS(message);
    this.worker.addEventListener("message", (message) =>
      this.handleWorkerMessage(message)
    );

    this.cursorAttributes = {
      width: 25,
      height: 25,
      scale: 1,
      "cursor-color": "transparent",
      "cursor-outline-thickness": 1,
      "cursor-outline-style": "solid",
      "cursor-outline-color": "rgba(255, 255, 100, 0.5)",
      "cursor-smoothing-position": 0.1,
      "cursor-smoothing-position": 0.15,
      "cursor-hover": "",
    };

    this.cursorElement = document.createElement("div");
    this.cursorElement.setAttribute("class", this.hash);
    this.cursorElement.setAttribute("tabindex", -1);

    this.shadowRoot.appendChild(this.cursorElement);

    this.width = this.cursorAttributes.width;
    this.height = this.cursorAttributes.height;
    this.outline = {
      thickness: this.cursorAttributes["cursor-outline-thickness"],
      style: this.cursorAttributes["cursor-outline-style"],
      color: this.cursorAttributes["cursor-outline-color"],
    };

    this.cursor = {
      previous: {
        x: null,
        y: null,
      },
      position: {
        x: null,
        y: null,
      },
    };

    this.styles = document.createElement("style");

    this.styles.textContent = `
                .${this.hash} {
                    position: absolute;
                    top: 0;
                    left: 0;
    
                    z-index: 999;
    
                    width: ${this.cursorAttributes.width}px;
                    height: ${this.cursorAttributes.height}px;
                    border-radius: 50%;
    
                    background-color: ${this.cursorAttributes["cursor-color"]};
                    outline: ${this.cursorAttributes["cursor-outline-thickness"]}px ${this.cursorAttributes["cursor-outline-style"]} ${this.cursorAttributes["cursor-outline-color"]}
                }
            `;

    this.shadowRoot.appendChild(this.styles);

    this.hoverTarget = this;

    window.addEventListener("mousemove", (e) => this.move(e));
    window.requestAnimationFrame((e) => this.render(e));
  }

  lerp(start, stop, amt) {
    return (1 - amt) * start + amt * stop;
  }

  move(e) {
    [this.cursor.position.x, this.cursor.position.y] = [e.clientX, e.clientY];

    this.hoverTarget = e.target;

    window.removeEventListener("mousemove", this.move);
  }

  render() {
    this.cursorElement.classList.remove("cursor-hover-active");
    this.cursorAttributes.scale = this.lerp(
      this.cursorAttributes.scale,
      1,
      this.cursorAttributes["cursor-smoothing-position"]
    );

    this.cursor.previous.x = this.lerp(
      this.cursor.previous.x,
      this.cursor.position.x,
      this.cursorAttributes["cursor-smoothing-position"]
    );

    this.cursor.previous.y = this.lerp(
      this.cursor.previous.y,
      this.cursor.position.y,
      this.cursorAttributes["cursor-smoothing-position"]
    );

    for (const c of this.cursorAttributes["cursor-hovers"].split(" ")) {
      if (this.hoverTarget.classList.contains(c))
        this.handleHover(this.hoverTarget);
      break;
    }

    this.cursorElement.style.transform = `scale(${
      this.cursorAttributes.scale
    }) translate(${
      this.cursor.previous.x * (1 / this.cursorAttributes.scale) -
      ((1 / this.cursorAttributes.scale) * this.cursorAttributes.width) / 2
    }px, ${
      this.cursor.previous.y * (1 / this.cursorAttributes.scale) -
      ((1 / this.cursorAttributes.scale) * this.cursorAttributes.height) / 2
    }px)`;
    requestAnimationFrame((e) => this.render(e));
  }

  static get observedAttributes() {
    return [
      "fixed-class",
      "width",
      "height",
      "cursor-color",
      "cursor-outline-thickness",
      "cursor-outline-style",
      "cursor-outline-color",
      "cursor-smoothing-position",
      "cursor-hovers",
    ];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name == "fixed-class") {
      this.cursorElement.classList.add(newValue);
      this.hash = newValue;

      // Inject Custom CSS
      let s = Object.values(document.styleSheets);

      s.map((stylesheet) => {
        this.worker.postMessage({
          message: "updateCSS",
          hash: this.hash,
          stylesheet: Array.from(stylesheet.cssRules)
            .filter((rule) => rule?.selectorText == "." + this.hash)
            .map((sheet) => sheet.cssText),
        });
      });
    }

    if (name == "cursor-hovers") {
      // Inject Custom CSS for the Hover CSS
      let s = Object.values(document.styleSheets);

      s.map((stylesheet) => {
        let sheet = Array.from(stylesheet.cssRules).filter(
          (rule) => rule?.selectorText == ".cursor-hover-active"
        );
        this.worker.postMessage({
          message: "updateHoverCSS",
          hash: this.hash,
          stylesheet: sheet.map((stylesheet) => stylesheet.cssText),
        });
      });
    }

    console.log(`Changed ${name} from \`${oldValue}\` to \`${newValue}\``);
    this.cursorAttributes[name] = newValue;

    this.updateCSS();
  }

  updateCSS() {
    this.styles.textContent = `
                .${this.hash} {
                    position: fixed;
                    z-index: 999;
    
                    width: ${this.cursorAttributes.width}px;
                    height: ${this.cursorAttributes.height}px;
                    border-radius: 50%;
    
                    background-color: ${this.cursorAttributes["cursor-color"]};
                    outline: ${this.cursorAttributes["cursor-outline-thickness"]}px ${this.cursorAttributes["cursor-outline-style"]} ${this.cursorAttributes["cursor-outline-color"]};
                    
                    pointer-events: none;
                    
                    ${this.customCSS.standard}
                }
    
                .cursor-hover-active {
                    ${this.customCSS.hover}
                }
            `;
  }

  handleHover(element) {
    this.cursorElement.classList.add("cursor-hover-active");
    this.cursorAttributes.scale = this.lerp(
      this.cursorAttributes.scale,
      parseInt(element.dataset.cursorScale) || 1,
      this.cursorAttributes["cursor-smoothing-position"]
    );
  }

  handleWorkerMessage(message) {
    console.log(`Received message \`${message.data.case}\``);
    switch (message.data.case) {
      case "updatedCSS":
        this.customCSS.standard = message.data.css;
        this.updateCSS();
        break;
      case "updatedHoverCSS":
        this.customCSS.hover = message.data.css;
        this.updateCSS();
        break;
      case "closeWorker":
        this.worker.terminate();
        break;
      default:
        console.log(`\`${message.data.case}\` not yet implemented!`);
    }
  }
}

customElements.define("custom-cursor", Cursor);
