// Default settings
const defaults = {
    app_size: 100,
    app_bottom: "20%",
    edge_size: 100,
    edge_bottom: "20%"
};

const inputs = Object.keys(defaults);

// Update UI elements based on values
const updateUI = (values) => {
    inputs.forEach(id => {
        const val = values[id] || defaults[id];
        const el = document.getElementById(id);
        if (el) {
            el.value = val;
            if (id.includes('size')) {
                document.getElementById('val_' + id).innerText = val;
            }
        }
    });
};

// Load saved settings on popup open
chrome.storage.local.get(inputs, (res) => {
    updateUI(res);
});

// Save changes when user interacts with sliders or textboxes
document.addEventListener('input', (e) => {
    const target = e.target;
    if (inputs.includes(target.id)) {
        const val = target.value;
        chrome.storage.local.set({ [target.id]: val });
        
        if (target.id.includes('size')) {
            document.getElementById('val_' + target.id).innerText = val;
        }
    }
});

// Handle Reset button
document.getElementById('reset_btn').addEventListener('click', () => {
    chrome.storage.local.set(defaults, () => {
        updateUI(defaults);
    });
});