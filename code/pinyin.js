// Initial Radios
const initials = document.getElementsByName("initial")

// Final Radios
const finals = document.getElementsByName("final")

// Tone Radios
const tones = document.getElementsByName("tone")

// Mandarin Vowels
const vowels = ['a', 'e', 'i', 'o', 'u', 'ü']
const toneDict = {
    "a": ["ā", "á", "ǎ", "à", "a"],
    "e": ["ē", "é", "ě", "è", "e"],
    "i": ["ī", "í", "ǐ", "ì", "i"],
    "o": ["ō", "ó", "ǒ", "ò", "o"],
    "u": ["ū", "ú", "ǔ", "ù", "u"],
    "ü": ["ǖ", "ǘ", "ǚ", "ǜ", "ü"]
  };

// Union of initials and finals
const phonemes = document.querySelectorAll('input[name="initial"], input[name="final"]');

// Union of initials, finals, and tones
const radios = document.querySelectorAll('input[name="initial"], input[name="final"], input[name="tone"]');

// String values of the finals
let finalValues = [];
finals.forEach((final) => {
    finalValues.push(final.value)
})

// Every input label
const symbols = document.getElementsByClassName("symbol")

// Find those symbols only used in finals
let finalSymbols = []
for (let symbol of symbols) {
    if (finalValues.includes(symbol.htmlFor)) {
        finalSymbols.push(symbol);
    }
}

// Find those symbols only used in tones
const toneValues = ['1', '2', '3', '4', '5']
let toneSymbols = []
for (let symbol of symbols) {
    if (toneValues.includes(symbol.htmlFor)) {
        toneSymbols.push(symbol);
    }
}

// Selected initial, final, and tone values
var selInitial;
var selFinal;
var selTone;

// Final pinyin syllable
var syllableStr;

// Play audio
function playAudio(audioFile) {
    var audioPlayer = document.getElementById("audio-player");
    
    // For whatever reason, Javascript doesn't like umlauts.
    audioPlayer.src = "../data/audio-backup/"+audioFile.replace(/[ü]/g, "ue")+".mp3"
    
    audioPlayer.play();
}

// Fetch the valid pinyin data and invalidator listeners on initials
fetch("../data/valid-pinyin.json")
    .then(response => response.json())
    .then(json => {
        initials.forEach((initial) => {
            initial.addEventListener('click', () => {
                // Reset radios and labels
                for (var i = 0; i < finals.length; i++) {
                    finals[i].disabled = false
                }
                for (var i = 0; i < finalSymbols.length; i++) {
                    finalSymbols[i].classList.remove("dark")
                }

                // Disactivate invalid finals
                let validFinals = json[initial.value];
                for (var i = 0; i < finals.length; i++) {
                    if (!validFinals.includes(finals[i].value)) {
                        finals[i].disabled = true
                        finals[i].checked = false
                    }
                }
                for (var i = 0; i < finalSymbols.length; i++) {
                    if (!validFinals.includes(finalSymbols[i].htmlFor)) {
                        finalSymbols[i].classList.add("dark")
                    }   
                }
                
                
            })
        })

        return fetch("../data/tone-dict.json")
    })
    .then(response => response.json())
    .then(json => {
        phonemes.forEach(phoneme => {
            phoneme.addEventListener('click', () => {
                // Reset radios and labels
                for (var i = 0; i < tones.length; i++) {
                    tones[i].disabled = false
                }
                for (var i = 0; i < toneSymbols.length; i++) {
                    toneSymbols[i].classList.remove("dark")
                }

                // Get currently selected buttons
                selInitial = ""
                selFinal = ""
        
                for (const initial of initials) { if (initial.checked && !initial.disabled) { selInitial = initial.value} }
                for (const final of finals) { if (final.checked && !final.disabled) { selFinal = final.value} }

                if (selInitial != "" && selFinal != "") {

                    // Disactivate invalid tones
                    const validTones = json[selInitial][selFinal]
                    for (var i = 0; i < tones.length; i++) {
                        if (!validTones.includes(tones[i].value)) {
                            tones[i].disabled = true
                            tones[i].checked = false
                        }
                    }
                    for (var i = 0; i < toneSymbols.length; i++) {
                        if (!validTones.includes(toneSymbols[i].htmlFor)) {
                            toneSymbols[i].classList.add("dark")
                        }   
                    }
                }

            })
        })
    })
    .then(() => {
        radios.forEach((radio) => {
            
            radio.addEventListener('click', () => {
        
                selInitial = ""
                selFinal = ""
                selTone = ""
        
                for (const initial of initials) { if (initial.checked && !initial.disabled) { selInitial = initial.value} }
                for (const final of finals) { if (final.checked && !final.disabled) { selFinal = final.value} }
                for (const tone of tones) { if (tone.checked && !tone.disabled) { selTone = tone.value} }
        

                // Algorithm to turn initial+final+tone into final pinyin syllable

                // 1. For initial, select y, w, or nothing depending on final's vowel
                let valInitial = selInitial;
                if (selInitial == "None" && selFinal != "") {

                    switch(selFinal[0]) {
                        case 'u': valInitial = "w"; break;
                        case 'ü': case 'i': valInitial = "y"; break;
                        default: valInitial = ""; break;
                    }
                }

                // 2. Finals 
                // Handle "w" and "i" contractions and mutations. 
                let valFinal = selFinal;
                
                if (selInitial == "None") {
                    switch(selFinal) {
                        case "ia": case "iao": case "ian": case "iang": case "ie": case "iong":
                        case "ua": case "uai": case "uan": case "uang": case "ueng": case "uo":
                            valFinal=valFinal.substring(1); break;

                        case "iu": valFinal = "ou"; break
                        case "ui": valFinal = "ei"; break
                        case "un": valFinal = "en"; break
                    }
                }
                // Clean "i*".
                if (selFinal == "i*") {
                    valFinal = "i";
                }

                // If j, x, q, null turn ü into u
                if (valFinal[0]=="ü") {
                    switch(selInitial) {
                        case "j": case "x": case "q": case "None":
                            valFinal = "u"+valFinal.substring(1); break;
                    }
                }

                // 3. Accent the first or second letter of the final with the tone
                let accentIndex = 
                    (valFinal.length >= 2 
                    && vowels.includes(valFinal[0])
                    && vowels.includes(valFinal[1])
                    && !(valFinal[0] == "a" || valFinal[0] == "e" || valFinal[0] == "o")) ? 1 : 0 
                
                
                const valFinalNoAccent = valFinal

                if (selTone != "" && valFinal != "") {
                    let charArray = valFinal.split("")
                    charArray[accentIndex] = toneDict[valFinal[accentIndex]][parseInt(selTone)-1]
                    valFinal = charArray.join("")
                }

                // Syllable field
                const syllable = document.getElementById("full-syllable")

                if (selInitial != "" && selFinal != "" && selTone != "") {
                    syllableStr = valInitial+valFinal
                } else {
                    syllableStr = ""
                }
                
                const audiostr = "\'"+valInitial+valFinalNoAccent+selTone+"\'"

                const tableContainer = document.getElementById("table-container")

                tableContainer.style.display = syllableStr=="" ? 'none' : 'block'
                syllable.style.display =  syllableStr=="" ? 'none' : 'block'
                syllable.textContent = syllableStr
                if (selTone != 5) {
                    syllable.innerHTML += "<audio id=\"audio-player\"></audio>" + "<button id=\"audio-button\" onclick=\"playAudio("+ audiostr +")\">&#128266;</button>"
                }

            })
        });
        return fetch("../data/pinyin-groups.json")
    })        
    .then(response => response.json())
    .then(json => {  
        radios.forEach((radio) => {
            
            radio.addEventListener('click', () => {
                // get the list element from the DOM
                var characterTable = document.getElementById('character-table').getElementsByTagName('tbody')[0];
                characterTable.innerHTML='';
            
                // loop through the data and add rows to the table body
                json[syllableStr].forEach(item => {

                    // Add a row with two cells
                    var newRow = characterTable.insertRow(-1)
                    var newCell1 = newRow.insertCell(0)
                    var newCell2 = newRow.insertCell(1)

                    // Add character and description to cells
                    newCell1.innerHTML = item[0]
                    newCell2.innerHTML = item[1]
                });
                
            })
        })                    
    
    
    }).catch(error => console.error('Error:', error))


