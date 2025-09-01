// Hebrew Wordle Game
class HebrewWordle {
    constructor() {
        // Hebrew words list from provided data
        this.words = ["אבא", "אבן", "אדם", "אהל", "אור", "אחד", "איש", "אלה", "אמא", "אמן", "בגד", "ביץ", "בית", "בכה", "בלי", "בנה", "בקר", "ברד", "בשר", "גבה", "גבר", "גדל", "גדע", "גור", "גלד", "גלל", "גמל", "גשם", "דבש", "דוד", "דור", "דיג", "דלת", "דמה", "דמם", "דפק", "דרך", "הבה", "הור", "הלך", "הלם", "המה", "הפך", "הרג", "הרר", "ולד", "וחש", "ויר", "וסד", "ורד", "ושב", "ושש", "זהב", "זוג", "זור", "זכר", "זמר", "זמם", "זקן", "זרק", "חבה", "חור", "חכם", "חלק", "חפר", "חרב", "חרר", "חשך", "חתל", "טבח", "טבה", "טור", "טוב", "טלא", "טלה", "טמן", "טפף", "טרף", "יבה", "יור", "יער", "ידע", "ילד", "ילל", "ירק", "יסד", "יצא", "כור", "כוס", "כלב", "כנס", "כפר", "כרע", "כסס", "כסף", "לבא", "לבה", "לבן", "לבש", "לוח", "לור", "לחם", "למד", "לקח", "מבה", "מור", "מוח", "מים", "מכר", "מלא", "מלח", "מלל", "מחר", "נבה", "נהג", "נור", "נוח", "נחש", "נער", "נטל", "נמר", "נפל", "נתן", "סבא", "סבב", "סגר", "סור", "סוס", "סמל", "סתר", "עבה", "עבר", "עגל", "עוף", "עור", "עלה", "עצב", "פבה", "פור", "פוך", "פדה", "פחק", "פיל", "פקד", "פרח", "פרק", "פתח", "צבע", "צבה", "צום", "צור", "צהר", "צעד", "צעק", "צלח", "צפר", "קבה", "קבר", "קור", "קום", "קוף", "קלל", "קמח", "קרא", "קסם", "רבה", "רגל", "רדף", "רור", "רוח", "רכב", "רמש", "רפא", "שבה", "שבר", "שום", "שור", "שחק", "שכח", "שלל", "שמש", "תבה", "תור", "תוך", "תחל", "תנה", "תפח", "תפס", "תקע", "תקק"];
        
        // Final letters mapping - letters that change when in final position
        this.finalLetters = {
            "כ": "ך",
            "מ": "ם", 
            "נ": "ן",
            "פ": "ף",
            "צ": "ץ"
        };

        // Regular keyboard letters (no final letters)
        this.keyboardLetters = ["א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י", "כ", "ל", "מ", "נ", "ס", "ע", "פ", "צ", "ק", "ר", "ש", "ת"];

        // Game state
        this.currentWord = '';
        this.currentGuess = '';
        this.currentRow = 0;
        this.currentCol = 0;
        this.gameEnded = false;
        this.guesses = [];
        this.keyboardState = {}; // Track keyboard key states

        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initElements());
        } else {
            this.initElements();
        }
    }

    initElements() {
        // Initialize DOM elements
        this.gameBoard = document.querySelector('.game-board');
        this.keyboard = document.querySelector('.keyboard');
        this.messageEl = document.getElementById('message');
        this.newGameBtn = document.getElementById('new-game');
        this.howToPlayBtn = document.getElementById('how-to-play');
        this.modal = document.getElementById('instructions-modal');
        this.closeModalBtn = document.getElementById('close-modal');

        this.setupEventListeners();
        this.updateKeyboard();
        this.startNewGame();
    }

    updateKeyboard() {
        // Update keyboard to only show regular letters, not final letters
        const keyRows = [
            ["ש", "ק", "ר", "א", "ט", "ו", "נ", "מ", "פ"],
            ["ד", "ג", "כ", "ע", "י", "ח", "ל", "צ", "ס"], 
            ["ז", "ב", "ה", "ת"]
        ];

        const keyboardRows = document.querySelectorAll('.keyboard-row');
        
        // Clear existing keys except action row
        keyboardRows.forEach((row, index) => {
            if (index < 3) { // Only update first 3 rows (letter rows)
                row.innerHTML = '';
                keyRows[index].forEach(letter => {
                    const keyElement = document.createElement('button');
                    keyElement.className = 'key';
                    keyElement.setAttribute('data-key', letter);
                    keyElement.textContent = letter;
                    row.appendChild(keyElement);
                });
            }
        });
    }

    setupEventListeners() {
        // Keyboard clicks
        this.keyboard.addEventListener('click', (e) => {
            if (e.target.classList.contains('key')) {
                const key = e.target.dataset.key;
                this.handleKeyPress(key);
            }
        });

        // Physical keyboard - better Hebrew character support
        document.addEventListener('keydown', (e) => {
            this.handlePhysicalKey(e);
        });

        // Game controls
        this.newGameBtn.addEventListener('click', () => {
            this.startNewGame();
        });

        this.howToPlayBtn.addEventListener('click', () => {
            this.showModal();
        });

        this.closeModalBtn.addEventListener('click', () => {
            this.hideModal();
        });

        // Modal close on backdrop click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });
    }

    startNewGame() {
        // Pick random word
        this.currentWord = this.words[Math.floor(Math.random() * this.words.length)];
        console.log('Target word:', this.currentWord); // For debugging
        
        // Reset game state
        this.currentGuess = '';
        this.currentRow = 0;
        this.currentCol = 0;
        this.gameEnded = false;
        this.guesses = [];
        this.keyboardState = {};

        // Clear board
        this.clearBoard();
        this.resetKeyboard();
        this.hideMessage();
    }

    clearBoard() {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
            cell.style.backgroundColor = '';
            cell.style.color = '';
            cell.style.borderColor = '';
        });
    }

    resetKeyboard() {
        const keys = document.querySelectorAll('.key');
        keys.forEach(key => {
            const isAction = key.dataset.key === 'enter' || key.dataset.key === 'backspace';
            key.className = 'key' + (isAction ? ' key--action' : '');
        });
        this.keyboardState = {};
    }

    handlePhysicalKey(e) {
        const key = e.key;
        
        if (key === 'Enter') {
            e.preventDefault();
            this.handleKeyPress('enter');
        } else if (key === 'Backspace') {
            e.preventDefault();
            this.handleKeyPress('backspace');
        } else if (this.isHebrewLetter(key)) {
            e.preventDefault();
            this.handleKeyPress(key);
        }
    }

    isHebrewLetter(char) {
        return /[\u0590-\u05FF]/.test(char);
    }

    handleKeyPress(key) {
        if (this.gameEnded) return;

        if (key === 'enter') {
            this.submitGuess();
        } else if (key === 'backspace') {
            this.deleteLetter();
        } else if (this.isValidKey(key) && this.currentCol < 3) {
            this.addLetter(key);
        }
    }

    isValidKey(key) {
        // Check if it's a regular Hebrew letter or final letter that we accept
        return this.keyboardLetters.includes(key) || Object.values(this.finalLetters).includes(key);
    }

    addLetter(letter) {
        if (this.currentCol >= 3) return;

        let displayLetter = letter;
        
        // CRITICAL FIX: Handle final letters automatically when in the last position (position 2, 0-indexed)
        if (this.currentCol === 2 && this.finalLetters[letter]) {
            displayLetter = this.finalLetters[letter];
            console.log(`Converting ${letter} to ${displayLetter} in final position`);
        }

        const cell = document.querySelector(`[data-row="${this.currentRow}"] [data-col="${this.currentCol}"]`);
        if (cell) {
            cell.textContent = displayLetter;
            cell.classList.add('filled');
            this.currentGuess += displayLetter;
            this.currentCol++;
            console.log(`Current guess: ${this.currentGuess}`);
        }
    }

    deleteLetter() {
        if (this.currentCol === 0) return;

        this.currentCol--;
        const cell = document.querySelector(`[data-row="${this.currentRow}"] [data-col="${this.currentCol}"]`);
        if (cell) {
            cell.textContent = '';
            cell.classList.remove('filled');
            this.currentGuess = this.currentGuess.slice(0, -1);
        }
    }

    submitGuess() {
        console.log(`Submitting guess: "${this.currentGuess}" (length: ${this.currentGuess.length})`);
        console.log(`Target word: "${this.currentWord}"`);
        
        if (this.currentGuess.length !== 3) {
            this.showMessage('יש להזין מילה בת 3 אותיות', 'error');
            return;
        }

        if (!this.words.includes(this.currentGuess)) {
            this.showMessage('המילה לא קיימת ברשימה', 'error');
            return;
        }

        // Evaluate the guess
        const result = this.evaluateGuess();
        console.log('Evaluation result:', result);
        
        // CRITICAL FIX: Apply colors immediately to the current guess cells
        this.applyColorsToCurrentRow(result);
        
        // Update keyboard colors
        this.updateKeyboardColors(result);
        
        // Store the guess
        this.guesses.push({ guess: this.currentGuess, result });

        // Check if game should end
        if (this.currentGuess === this.currentWord || this.currentRow >= 5) {
            setTimeout(() => this.endGame(), 1000);
        } else {
            // Move to next row
            this.currentRow++;
            this.currentCol = 0;
            this.currentGuess = '';
        }
    }

    evaluateGuess() {
        const guess = this.currentGuess;
        const target = this.currentWord;
        const result = ['wrong', 'wrong', 'wrong']; // Default to wrong
        const targetLetters = [...target];
        const guessLetters = [...guess];

        console.log('Evaluating:', {guess, target, guessLetters, targetLetters});

        // First pass: mark correct positions (green)
        for (let i = 0; i < 3; i++) {
            if (guessLetters[i] === targetLetters[i]) {
                result[i] = 'correct';
                targetLetters[i] = null; // Mark as used
                guessLetters[i] = null; // Mark as processed
            }
        }

        // Second pass: mark partial matches (orange) and wrong (gray)
        for (let i = 0; i < 3; i++) {
            if (guessLetters[i] !== null) {
                const targetIndex = targetLetters.indexOf(guessLetters[i]);
                if (targetIndex !== -1) {
                    result[i] = 'partial'; // Orange - exists but wrong position
                    targetLetters[targetIndex] = null; // Mark as used
                }
                // If not found, it remains 'wrong' (gray)
            }
        }

        console.log('Final result:', result);
        return result;
    }

    applyColorsToCurrentRow(result) {
        console.log('Applying colors to row', this.currentRow, 'with result:', result);
        const row = document.querySelector(`[data-row="${this.currentRow}"]`);
        const cells = row.querySelectorAll('.cell');

        cells.forEach((cell, index) => {
            const status = result[index];
            console.log(`Cell ${index}: status = ${status}`);
            
            // Remove any existing classes
            cell.classList.remove('cell--correct', 'cell--partial', 'cell--wrong');
            cell.classList.add('revealed');
            
            // Apply the correct color class and inline styles for immediate effect
            if (status === 'correct') {
                cell.classList.add('cell--correct');
                cell.style.backgroundColor = '#22c55e';
                cell.style.borderColor = '#22c55e';
                cell.style.color = 'white';
            } else if (status === 'partial') {
                cell.classList.add('cell--partial');
                cell.style.backgroundColor = '#f97316';
                cell.style.borderColor = '#f97316';
                cell.style.color = 'white';
            } else { // wrong
                cell.classList.add('cell--wrong');
                cell.style.backgroundColor = '#6b7280';
                cell.style.borderColor = '#6b7280';
                cell.style.color = 'white';
            }
            
            console.log(`Applied style to cell ${index}:`, cell.style.backgroundColor);
        });
    }

    updateKeyboardColors(result) {
        const guess = this.currentGuess;

        for (let i = 0; i < guess.length; i++) {
            const letter = guess[i];
            const status = result[i];
            
            // Map final letters back to regular letters for keyboard update
            let keyboardLetter = letter;
            for (const [regular, final] of Object.entries(this.finalLetters)) {
                if (letter === final) {
                    keyboardLetter = regular;
                    break;
                }
            }
            
            // Update keyboard state - prioritize better status (correct > partial > wrong)
            const currentStatus = this.keyboardState[keyboardLetter];
            if (!currentStatus || this.getStatusPriority(status) > this.getStatusPriority(currentStatus)) {
                this.keyboardState[keyboardLetter] = status;
            }

            // Update keyboard visual
            const keyElement = document.querySelector(`[data-key="${keyboardLetter}"]`);
            if (keyElement) {
                // Remove old status classes
                keyElement.classList.remove('key--correct', 'key--partial', 'key--wrong');
                // Add new status class
                if (this.keyboardState[keyboardLetter]) {
                    keyElement.classList.add(`key--${this.keyboardState[keyboardLetter]}`);
                }
            }
        }
    }

    getStatusPriority(status) {
        const priorities = { 'correct': 3, 'partial': 2, 'wrong': 1 };
        return priorities[status] || 0;
    }

    endGame() {
        this.gameEnded = true;
        
        if (this.currentGuess === this.currentWord) {
            const attempts = this.currentRow + 1;
            let message = '';
            switch (attempts) {
                case 1: message = 'מדהים! נחשת במנה ראשונה!'; break;
                case 2: message = 'מעולה! נחשת בשני נסיונות!'; break;
                case 3: message = 'יפה! נחשת בשלושה נסיונות!'; break;
                case 4: message = 'טוב! נחשת בארבעה נסיונות!'; break;
                case 5: message = 'נחמד! נחשת בחמישה נסיונות!'; break;
                case 6: message = 'כל הכבוד! נחשת בנסיון האחרון!'; break;
            }
            this.showMessage(message, 'success');
        } else {
            this.showMessage(`לא נורא! המילה הייתה: ${this.currentWord}`, 'info');
        }
    }

    showMessage(text, type) {
        this.messageEl.textContent = text;
        this.messageEl.className = `message message--${type}`;
        
        // Auto hide after 5 seconds
        setTimeout(() => {
            this.hideMessage();
        }, 5000);
    }

    hideMessage() {
        this.messageEl.classList.add('hidden');
    }

    showModal() {
        this.modal.classList.remove('hidden');
    }

    hideModal() {
        this.modal.classList.add('hidden');
    }
}

// Initialize game when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new HebrewWordle();
    });
} else {
    new HebrewWordle();
}