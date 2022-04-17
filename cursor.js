const simpleHash = str => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash &= hash; // Convert to 32bit integer
    }
    return new Uint32Array([hash])[0].toString(36);
  };


class Cursor extends HTMLElement
{
    constructor()
    {
        super();

        this.hash = "cursor-" + simpleHash(Date.now().toString());
        this.attachShadow({mode: 'open'});

        this.cursorAttributes = {
            "width": 25,
            "height": 25,
            "cursor-color": "transparent",
            "cursor-outline-thickness": 1,
            "cursor-outline-style": "solid",
            "cursor-outline-color": "rgba(255, 255, 100, 0.5)",
            "cursor-smoothing-position": 0.1,
            "cursor-hovers": "",
        }

        this.customCSS = "";

        this.cursorElement = document.createElement("div");
        this.cursorElement.setAttribute('class', this.hash);
        this.cursorElement.setAttribute('tabindex', -1);

        this.shadowRoot.appendChild(this.cursorElement);

        this.width = this.cursorAttributes.width;
        this.height= this.cursorAttributes.height;
        this.outline = {
            thickness: this.cursorAttributes["cursor-outline-thickness"],
            style: this.cursorAttributes["cursor-outline-style"],
            color: this.cursorAttributes["cursor-outline-color"]
        }

        this.cursor = {
            previous: {
              x: null,
              y: null,
            },
            position: {
              x: null,
              y: null,
            }
        }

        this.styles = document.createElement('style');

        this.styles.textContent = `
            .${this.hash} {
                position: absolute;
                top: 0;
                left: 0;

                z-index: 999;

                width: ${this.cursorAttributes.width}px;
                height: ${this.cursorAttributes.height}px;
                border-radius: 50%;

                background: ${this.cursorAttributes["cursor-color"]};
                outline: ${this.cursorAttributes["cursor-outline-thickness"]}px ${this.cursorAttributes["cursor-outline-style"]} ${this.cursorAttributes["cursor-outline-color"]}
            }
        `

        this.shadowRoot.appendChild(this.styles);


        window.addEventListener("mousemove", e => this.move(e));
        window.requestAnimationFrame(() => this.render());
    }

    lerp(start, stop, amt)
    {
        return (1-amt)*start+amt*stop;
    }
  
    move(e)
    {
        this.cursorElement.style.opacity = 1;
        [this.cursor.position.x, this.cursor.position.y] = [e.clientX, e.clientY];

        window.removeEventListener("mousemove", this.move);

    }

    render()
    {
        this.cursor.previous.x = this.lerp(
        this.cursor.previous.x,
        this.cursor.position.x,
        this.cursorAttributes["cursor-smoothing-position"],
        )

        this.cursor.previous.y = this.lerp(
        this.cursor.previous.y,
        this.cursor.position.y,
        this.cursorAttributes["cursor-smoothing-position"],
        );
        
        
        this.cursorElement.style.transform = `translate(${this.cursor.previous.x - this.cursorAttributes.width/2}px, ${this.cursor.previous.y - this.cursorAttributes.height/2}px)`
        requestAnimationFrame(() => this.render())
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
        ]
    }

    attributeChangedCallback(name, oldValue, newValue)
    {
        if(name == "fixed-class")
        {
            this.cursorElement.className = newValue;
            this.hash = newValue;

            // Inject Custom CSS
            
            let customCSS = {};
            let customPropCount = 0;

            Object.values(document.styleSheets).map(stylesheet => {
                Object.values(stylesheet.cssRules).map(selector => {
                    if(selector.selectorText.slice(1) == this.hash)
                    {
                        customCSS = {...customCSS, ...selector.style};
                        customPropCount += selector.styleMap.size;
                    }
                })
            })

            for ( let i = 0; i < customPropCount; ++i) delete customCSS[i];
            console.log(customCSS)
            
            let entries = Object.entries(customCSS);

            for(let key = 0; key < entries.length; key++)
            {
                if(entries[key][1].length > 0) this.customCSS += `${entries[key][0]}: ${entries[key][1]};\n`
            }
            console.log(this.customCSS)
        }

        console.log(`Changed ${name} from \`${oldValue}\` to \`${newValue}\``)
        this.cursorAttributes[name] = newValue;

        this.styles.textContent = `
            .${this.hash} {
                position: fixed;
                z-index: 999;

                width: ${this.cursorAttributes.width}px;
                height: ${this.cursorAttributes.height}px;
                border-radius: 50%;

                background: ${this.cursorAttributes["cursor-color"]};
                outline: ${this.cursorAttributes["cursor-outline-thickness"]}px ${this.cursorAttributes["cursor-outline-style"]} ${this.cursorAttributes["cursor-outline-color"]};

                ${this.customCSS}
            }
        `
    }
}

customElements.define('custom-cursor', Cursor);
