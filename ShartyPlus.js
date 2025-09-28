// ==== Mass Reply + Reply Stats ====
(function() {
    'use strict';

    const textarea = document.querySelector("textarea[name=body]");
    if (!textarea) return;

    // ===== Container for buttons =====
    const btnContainer = document.createElement('div');
    btnContainer.style.marginTop = '5px';
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = '5px';
    textarea.insertAdjacentElement('afterend', btnContainer);

    // ===== Mass Reply Button =====
    const massReplyBtn = document.createElement("button");
    massReplyBtn.textContent = "Mass Reply";
    massReplyBtn.type = "button";
    btnContainer.appendChild(massReplyBtn);

    massReplyBtn.addEventListener("click", () => {
        const posts = document.querySelectorAll(".post");
        let refs = "";

        posts.forEach(p => {
            const id = p.getAttribute("id");
            if (id) {
                const match = id.match(/\d+/);
                if (match) {
                    const ref = ">>" + match[0] + "\n";
                    if (!textarea.value.includes(ref)) refs += ref;
                }
            }
        });

        if (!refs) return;
        textarea.value += refs;
        textarea.focus();
        updateStats();
    });

    // ===== Fonts Button =====
    const fontBtn = document.createElement("button");
    fontBtn.textContent = "Fonts";
    fontBtn.type = "button";
    btnContainer.appendChild(fontBtn);

    // Font definitions
	const fonts = [
		{ name: "Glow Text", code: "%%TEXT%%" },
		{ name: "Sneed Text", code: "::TEXT::" },
		{ name: "Red Glow", code: "!!TEXT!!" }, 
		{ name: "Blue Glow", code: ";;TEXT;;" },
		{ name: "RED TEXT", code: "==TEXT==" },
		{ name: "BLUE TEXT", code: "--TEXT--" },
		{ name: "Purple Text", code: "-=TEXT=-" },
		{ name: "ORANGETEXT", code: "<TEXT" },
		{ name: "GREENTEXT", code: ">TEXT" },
		{ name: "LIGHT BLUE TEXT", code: "^TEXT" },
		{ name: "STRIKETHROUGH", code: "~~TEXT~~" },
		{ name: "Spoiler", code: "**TEXT**" },
		{ name: "UNDERLINE", code: "__TEXT__" },
		{ name: "CODE", code: "```TEXT```" },
		{ name: "Big Text", code: "+=TEXT=+" },
		{ name: "Rainbow Text", code: "~-~TEXT~-~" },
		{ name: "Gemerald Text", code: "%%~~~TEXT~~~%%" },
		{ name: "Doll Text", code: "-~-TEXT-~-" },
		{ name: "Gold Text", code: "~-~::TEXT::~-~" },
		{ name: "Gem Text", code: "~-~;;TEXT;;~-~" },
		{ name: "Boring Text", code: "^::TEXT::" },
		{ name: "Brappy Text", code: ">%%TEXT%%" },
		{ name: "Froot Text", code: "<!!TEXT!!" },
		{ name: "Rage Text", code: "==!!Rage!!==" },
		{ name: "Calm Text", code: "--;;TEXT;;--" },
		{ name: "Anon Text", code: "**```%%~-~TEXT~-~%%```**" },
		{ name: "Spyro Text", code: "-=::TEXT::-=" },
		{ name: "Troon Text", code: "-~-;;TEXT;;-~-" }
	];

    // Create font menu
    const fontMenu = document.createElement('div');
    fontMenu.style.position = 'absolute';
    fontMenu.style.background = '#fff';
    fontMenu.style.border = '1px solid #ccc';
    fontMenu.style.padding = '5px';
    fontMenu.style.display = 'none';
    fontMenu.style.maxHeight = '300px';
    fontMenu.style.overflowY = 'auto';
    fontMenu.style.zIndex = '9999';
    document.body.appendChild(fontMenu);

    fontBtn.addEventListener('click', () => {
        const rect = fontBtn.getBoundingClientRect();
        fontMenu.style.top = rect.bottom + window.scrollY + 'px';
        fontMenu.style.left = rect.left + window.scrollX + 'px';
        fontMenu.style.display = fontMenu.style.display === 'none' ? 'block' : 'none';
    });

    // Close menu when clicking outside
    document.addEventListener('click', e => {
        if (!fontMenu.contains(e.target) && e.target !== fontBtn) {
            fontMenu.style.display = 'none';
        }
    });

    // Populate font menu
    fonts.forEach(f => {
        const btn = document.createElement('button');
        btn.textContent = f.name;
        btn.style.display = 'block';
        btn.style.width = '100%';
        btn.style.margin = '2px 0';
        btn.style.fontFamily = 'inherit';
        btn.style.textAlign = 'left';

        // Preview in button using actual code (replace TEXT with example)
        btn.innerHTML = f.code.replace(/TEXT/g, f.name);

        btn.addEventListener('click', () => {
            const selectionStart = textarea.selectionStart;
            const selectionEnd = textarea.selectionEnd;
            const selectedText = textarea.value.substring(selectionStart, selectionEnd) || textarea.value;

            const newText = f.code.replace(/TEXT/g, selectedText);

            if (selectionStart !== selectionEnd) {
                // Replace selected text
                textarea.setRangeText(newText, selectionStart, selectionEnd, 'end');
            } else {
                // Replace entire text if nothing selected
                textarea.value = newText;
            }

            textarea.focus();
            updateStats();
            fontMenu.style.display = 'none';
        });

        fontMenu.appendChild(btn);
    });

    // ===== Reply Stats (Character & Word Count) =====
    const stats = document.createElement('div');
    stats.style.marginTop = '5px';
    stats.style.fontSize = '0.9em';
    stats.style.color = '#555';
    textarea.insertAdjacentElement('afterend', stats);

    const updateStats = () => {
        const text = textarea.value;
        const charCount = text.length;
        const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
        stats.textContent = `Characters: ${charCount}/5000 | Words: ${wordCount}`;
    };

    updateStats();
    textarea.addEventListener('input', updateStats);

})();

// ==== Scroll Buttons (Jump to OP / Last Post) ====
(function() {
    'use strict';

    const posts = Array.from(document.querySelectorAll('.post'));
    if (!posts.length) return;

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '10px';
    container.style.right = '10px';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '5px';
    document.body.appendChild(container);

    const scrollToPost = (index) => {
        if (index < 0 || index >= posts.length) return;
        posts[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
        posts[index].style.outline = '2px solid #f00';
        setTimeout(() => { posts[index].style.outline = ''; }, 500);
    };

    const opBtn = document.createElement('button');
    opBtn.textContent = 'Jump to OP';
    opBtn.style.padding = '8px 12px';
    opBtn.style.backgroundColor = '#333';
    opBtn.style.color = '#fff';
    opBtn.style.border = 'none';
    opBtn.style.borderRadius = '5px';
    opBtn.style.cursor = 'pointer';
    opBtn.addEventListener('click', () => scrollToPost(0));
    container.appendChild(opBtn);

    const lastBtn = document.createElement('button');
    lastBtn.textContent = 'Jump to Last';
    lastBtn.style.padding = '8px 12px';
    lastBtn.style.backgroundColor = '#333';
    lastBtn.style.color = '#fff';
    lastBtn.style.border = 'none';
    lastBtn.style.borderRadius = '5px';
    lastBtn.style.cursor = 'pointer';
    lastBtn.addEventListener('click', () => scrollToPost(posts.length - 1));
    container.appendChild(lastBtn);
})();

