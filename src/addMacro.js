const addMacroOverviewButton_el = document.getElementById('addMacroOverviewButton');
const addMacroOverlay_el = document.getElementById('addMacroOverlay');
const addMacroContent_el = document.getElementById('addMacroContent');
const addMacroCloseButton_el = document.getElementById('addMacroCloseButton');
const mediaTypeHeader_el = document.getElementById('mediaTypeHeader');
const macroTitleInput_el = document.getElementById('macroTitleInput');
const addMacroButton_el = document.getElementById('addMacroButton');

addMacroOverviewButton_el.addEventListener('click', () => {
    toggleAddMacroOverlay();
});

addMacroCloseButton_el.addEventListener('click', () => {
    toggleAddMacroOverlay();
});

function toggleAddMacroOverlay(){
    if (addMacroOverlay_el.style.display === 'none'){
        addMacroOverlay_el.style.display = 'flex';
    } else {
        addMacroOverlay_el.style.display = 'none';
    }
}

addMacroButton_el.addEventListener('click', async () => {
    const success = await api.databaseHandler({request: 'Add', title: macroTitleInput_el.value});
    if (success) {
        toggleAddMacroOverlay();
    } else {
        console.error('Error adding macro');
    }
});