// Initialize the ATM application
document.addEventListener('DOMContentLoaded', function() {
    // Initialize jsPDF
    const { jsPDF } = window.jspdf;

    // Initialize database in localStorage if it doesn't exist
    if (!localStorage.getItem('atmUsers')) {
        localStorage.setItem('atmUsers', JSON.stringify([]));
    }
    
    // Screen Navigation Functions
    function showScreen(screenId) {
        document.getElementById(currentScreen).classList.remove('active');
        document.getElementById(screenId).classList.add('active');
        currentScreen = screenId;
    }

    // Event Listeners for Welcome Screen
    // ATM State
let currentUser = null;
let currentScreen = 'welcome-screen';

// Add these new event listeners for the welcome screen:
document.getElementById('insert-card').addEventListener('click', function() {
    const users = JSON.parse(localStorage.getItem('atmUsers'));
    if (users && users.length > 0) {
        // Show card selection if there are registered users
        showCardSelection();
    } else {
        // If no users, go to registration
        showScreen('register-screen');
    }
});

document.getElementById('register-new-card').addEventListener('click', function() {
    showScreen('register-screen');
});

// Add this new function (can go right after the showScreen function)
function showCardSelection() {
    const users = JSON.parse(localStorage.getItem('atmUsers'));
    const cardSelection = document.createElement('div');
    cardSelection.className = 'card-selection';
    
    cardSelection.innerHTML = `
        <h2>Select Your Card</h2>
        <div class="card-list" id="card-list"></div>
        <button id="cancel-card-selection" class="btn btn-secondary">Cancel</button>
    `;
    
    // Add to DOM temporarily
    const welcomeScreen = document.getElementById('welcome-screen');
    welcomeScreen.appendChild(cardSelection);
    
    // Populate card list
    const cardList = document.getElementById('card-list');
    users.forEach(user => {
        const card = document.createElement('div');
        card.className = 'card-item';
        card.innerHTML = `
            <p>${user.name}</p>
            <p>${formatCardNumber(user.cardNumber)} (${user.bank})</p>
        `;
        card.addEventListener('click', function() {
            document.getElementById('login-card-number').textContent = 'Card: ' + formatCardNumber(user.cardNumber);
            document.getElementById('login-bank-name').textContent = 'Bank: ' + user.bank;
            document.getElementById('login-pin').value = '';
            welcomeScreen.removeChild(cardSelection);
            showScreen('login-screen');
        });
        cardList.appendChild(card);
    });
    
    // Cancel button
    document.getElementById('cancel-card-selection').addEventListener('click', function() {
        welcomeScreen.removeChild(cardSelection);
    });
}

function formatCardNumber(cardNumber) {
    return cardNumber.replace(/(\d{4})/g, '$1 ').trim();
}



    // Event Listeners for Register Screen
    document.getElementById('register-card').addEventListener('click', function() {
        const name = document.getElementById('name').value.trim();
        const cardNumber = document.getElementById('card-number').value.trim();
        const pin = document.getElementById('pin').value.trim();
        const bank = document.getElementById('bank').value;
        const initialDeposit = parseFloat(document.getElementById('initial-deposit').value) || 0;

        // Validation
        if (!name || !cardNumber || !pin) {
            alert('Please fill in all required fields');
            return;
        }

        if (cardNumber.length !== 16 || isNaN(cardNumber)) {
            alert('Card number must be 16 digits');
            return;
        }

        if (pin.length !== 4 || isNaN(pin)) {
            alert('PIN must be 4 digits');
            return;
        }

        // Check if card already exists
        const users = JSON.parse(localStorage.getItem('atmUsers'));
        if (users.find(user => user.cardNumber === cardNumber)) {
            alert('This card number is already registered');
            return;
        }

        // Create new user
        const newUser = {
            name,
            cardNumber,
            pin,
            bank,
            balance: initialDeposit,
            transactions: initialDeposit > 0 ? [
                {
                    type: 'deposit',
                    amount: initialDeposit,
                    date: new Date().toISOString(),
                    balance: initialDeposit
                }
            ] : []
        };

        // Save to database
        users.push(newUser);
        localStorage.setItem('atmUsers', JSON.stringify(users));

        // Proceed to login
        document.getElementById('login-card-number').textContent = 'Card: ' + formatCardNumber(cardNumber);
        document.getElementById('login-bank-name').textContent = 'Bank: ' + bank;
        document.getElementById('login-pin').value = '';
        showScreen('login-screen');
    });

    document.getElementById('back-to-welcome').addEventListener('click', function() {
        showScreen('welcome-screen');
    });

    // Event Listeners for Login Screen
    const keypadButtons = document.querySelectorAll('.keypad-btn');
    keypadButtons.forEach(button => {
        button.addEventListener('click', function() {
            const key = this.getAttribute('data-key');
            const pinInput = document.getElementById('login-pin');
            
            if (key === 'clear') {
                pinInput.value = '';
            } else if (key === 'enter') {
                attemptLogin();
            } else if (pinInput.value.length < 4) {
                pinInput.value += key;
            }
        });
    });

    document.getElementById('login-pin').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            attemptLogin();
        }
    });

    document.getElementById('eject-card').addEventListener('click', function() {
        showScreen('welcome-screen');
    });

    function attemptLogin() {
        const cardNumber = document.getElementById('login-card-number').textContent.replace('Card: ', '').replace(/\s/g, '');
        const pin = document.getElementById('login-pin').value;
        const errorElement = document.getElementById('pin-error');
        
        const users = JSON.parse(localStorage.getItem('atmUsers'));
        const user = users.find(u => u.cardNumber === cardNumber);
        
        if (user && user.pin === pin) {
            // Login successful
            currentUser = user;
            document.getElementById('user-name').textContent = user.name;
            document.getElementById('user-bank').textContent = user.bank;
            document.getElementById('user-card').textContent = formatCardNumber(user.cardNumber);
            document.getElementById('balance-amount').textContent = user.balance.toFixed(2);
            errorElement.textContent = '';
            showScreen('main-menu');
        } else {
            // Login failed
            errorElement.textContent = 'Invalid PIN. Please try again.';
            document.getElementById('login-pin').value = '';
        }
    }

    // Event Listeners for Main Menu
    document.getElementById('check-balance').addEventListener('click', function() {
        alert(`Your current balance is: $${currentUser.balance.toFixed(2)}`);
    });

    document.getElementById('deposit').addEventListener('click', function() {
        document.getElementById('deposit-amount').value = '';
        showScreen('deposit-screen');
    });

    document.getElementById('withdraw').addEventListener('click', function() {
        document.getElementById('withdraw-amount').value = '';
        document.getElementById('withdraw-error').textContent = '';
        showScreen('withdraw-screen');
    });

    document.getElementById('transaction-history').addEventListener('click', function() {
        displayTransactionHistory();
        showScreen('history-screen');
    });

    document.getElementById('download-statement').addEventListener('click', function() {
        generateFullStatement();
    });

    document.getElementById('logout').addEventListener('click', function() {
        currentUser = null;
        showScreen('welcome-screen');
    });

    // Event Listeners for Deposit Screen
    document.getElementById('confirm-deposit').addEventListener('click', function() {
        const amount = parseFloat(document.getElementById('deposit-amount').value);
        
        if (isNaN(amount) || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        
        processTransaction('deposit', amount);
    });

    document.getElementById('cancel-deposit').addEventListener('click', function() {
        showScreen('main-menu');
    });

    // Event Listeners for Withdraw Screen
    document.querySelectorAll('.quick-amount').forEach(button => {
        button.addEventListener('click', function() {
            const amount = parseFloat(this.getAttribute('data-amount'));
            document.getElementById('withdraw-amount').value = amount;
        });
    });

    document.getElementById('confirm-withdraw').addEventListener('click', function() {
        const amount = parseFloat(document.getElementById('withdraw-amount').value);
        const errorElement = document.getElementById('withdraw-error');
        
        if (isNaN(amount) || amount <= 0) {
            errorElement.textContent = 'Please enter a valid amount';
            return;
        }
        
        if (amount > currentUser.balance) {
            errorElement.textContent = 'Insufficient funds';
            return;
        }
        
        processTransaction('withdraw', amount);
        errorElement.textContent = '';
    });

    document.getElementById('cancel-withdraw').addEventListener('click', function() {
        showScreen('main-menu');
    });

    // Event Listeners for History Screen
    document.getElementById('back-to-menu').addEventListener('click', function() {
        showScreen('main-menu');
    });

    // Event Listeners for Receipt Screen
    document.getElementById('receipt-done').addEventListener('click', function() {
        showScreen('main-menu');
    });

    // Helper Functions
    function formatCardNumber(cardNumber) {
        return cardNumber.replace(/(\d{4})/g, '$1 ').trim();
    }

    function processTransaction(type, amount) {
        const now = new Date();
        const formattedDate = now.toLocaleDateString();
        const formattedTime = now.toLocaleTimeString();
        
        // Update balance
        if (type === 'deposit') {
            currentUser.balance += amount;
        } else if (type === 'withdraw') {
            currentUser.balance -= amount;
        }
        
        // Record transaction
        const transaction = {
            type: type,
            amount: amount,
            date: now.toISOString(),
            balance: currentUser.balance
        };
        
        currentUser.transactions.push(transaction);
        
        // Update localStorage
        const users = JSON.parse(localStorage.getItem('atmUsers'));
        const index = users.findIndex(u => u.cardNumber === currentUser.cardNumber);
        users[index] = currentUser;
        localStorage.setItem('atmUsers', JSON.stringify(users));
        
        // Update UI
        document.getElementById('balance-amount').textContent = currentUser.balance.toFixed(2);
        
        // Show receipt
        document.getElementById('receipt-date').textContent = formattedDate;
        document.getElementById('receipt-time').textContent = formattedTime;
        document.getElementById('receipt-card').textContent = formatCardNumber(currentUser.cardNumber);
        document.getElementById('receipt-type').textContent = type.charAt(0).toUpperCase() + type.slice(1);
        document.getElementById('receipt-amount').textContent = amount.toFixed(2);
        document.getElementById('receipt-balance').textContent = currentUser.balance.toFixed(2);
        
        // Generate and download transaction receipt PDF
        generateTransactionReceipt(type, amount, now);
        
        showScreen('receipt-screen');
    }

    function displayTransactionHistory() {
        const container = document.getElementById('transaction-list');
        container.innerHTML = '';
        
        if (currentUser.transactions.length === 0) {
            container.innerHTML = '<p class="transaction-item">No transactions to display</p>';
            return;
        }
        
        // Sort transactions by date (newest first)
        const sortedTransactions = [...currentUser.transactions].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        
        sortedTransactions.forEach(transaction => {
            const date = new Date(transaction.date);
            const formattedDate = date.toLocaleDateString();
            const formattedTime = date.toLocaleTimeString();
            
            const item = document.createElement('div');
            item.className = `transaction-item ${transaction.type}`;
            
            item.innerHTML = `
                <div class="transaction-info">
                    <div>${formattedDate} ${formattedTime}</div>
                    <div>${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</div>
                </div>
                <div class="transaction-amount ${transaction.type}">
                    ${transaction.type === 'deposit' ? '+' : '-'}$${transaction.amount.toFixed(2)}
                </div>
            `;
            
            container.appendChild(item);
        });
    }

    function generateTransactionReceipt(type, amount, date) {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        
        // Add header
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 100);
        doc.text(`${type.charAt(0).toUpperCase() + type.slice(1)} Receipt`, pageWidth / 2, 20, { align: 'center' });
        
        // Add bank logo/name
        doc.setFontSize(14);
        doc.text(currentUser.bank, pageWidth / 2, 30, { align: 'center' });
        
        // Add transaction details
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString();
        
        // Draw box around receipt
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.5);
        doc.roundedRect(20, 40, pageWidth - 40, 120, 3, 3);
        
        // Add receipt content
        doc.text(`Date: ${formattedDate}`, 30, 55);
        doc.text(`Time: ${formattedTime}`, 30, 65);
        doc.text(`Card Number: ${formatCardNumber(currentUser.cardNumber)}`, 30, 75);
        doc.text(`Account Holder: ${currentUser.name}`, 30, 85);
        doc.text(`Transaction Type: ${type.charAt(0).toUpperCase() + type.slice(1)}`, 30, 95);
        
        if (type === 'deposit') {
            doc.text(`Amount Deposited: $${amount.toFixed(2)}`, 30, 105);
        } else {
            doc.text(`Amount Withdrawn: $${amount.toFixed(2)}`, 30, 105);
        }
        
        doc.text(`Updated Balance: $${currentUser.balance.toFixed(2)}`, 30, 115);
        
        // Add transaction ID
        const transactionId = 'TXN' + Date.now().toString().slice(-8);
        doc.text(`Transaction ID: ${transactionId}`, 30, 125);
        
        // Add thank you message
        doc.setFontSize(10);
        doc.text('Thank you for using our ATM services.', 30, 140);
        
        // Add footer
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('This is an electronically generated receipt and requires no signature.', pageWidth / 2, 165, { align: 'center' });
        doc.text(`© ${new Date().getFullYear()} ${currentUser.bank} ATM Services`, pageWidth / 2, 170, { align: 'center' });
        
        // Save PDF - name it appropriately based on transaction type
        doc.save(`${currentUser.bank}_${type}_receipt_${date.toISOString().slice(0, 10)}.pdf`);
    }

    function generateFullStatement() {
        if (!currentUser || currentUser.transactions.length === 0) {
            alert('No transactions to display');
            return;
        }
        
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        
        // Add header
        doc.setFontSize(18);
        doc.setTextColor(0, 0, 100);
        doc.text('Account Statement', pageWidth / 2, 20, { align: 'center' });
        
        // Add user info
        doc.setFontSize(10);
        doc.text(`Name: ${currentUser.name}`, 20, 40);
        doc.text(`Card: ${formatCardNumber(currentUser.cardNumber)}`, 20, 50);
        doc.text(`Bank: ${currentUser.bank}`, 20, 60);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 70);
        doc.text(`Current Balance: $${currentUser.balance.toFixed(2)}`, 20, 80);
        
        // Add transactions table
        doc.setFontSize(10);
        let yPos = 100;
        
        // Table header
        doc.setFont(undefined, 'bold');
        doc.text('Date', 20, yPos);
        doc.text('Time', 60, yPos);
        doc.text('Type', 100, yPos);
        doc.text('Amount', 140, yPos);
        doc.text('Balance', 180, yPos);
        yPos += 10;
        
        // Draw line
        doc.setLineWidth(0.5);
        doc.line(20, yPos - 5, 190, yPos - 5);
        
        // Table content
        doc.setFont(undefined, 'normal');
        
        // Sort transactions by date (newest first)
        const sortedTransactions = [...currentUser.transactions].sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        
        sortedTransactions.forEach(transaction => {
            const date = new Date(transaction.date);
            const formattedDate = date.toLocaleDateString();
            const formattedTime = date.toLocaleTimeString();
            const type = transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1);
            const amount = `${transaction.type === 'deposit' ? '+' : '-'}$${transaction.amount.toFixed(2)}`;
            
            // Check if we need a new page
            if (yPos > 270) {
                doc.addPage();
                yPos = 30;
            }
            
            doc.text(formattedDate, 20, yPos);
            doc.text(formattedTime, 60, yPos);
            doc.text(type, 100, yPos);
            doc.text(amount, 140, yPos);
            doc.text(`$${transaction.balance.toFixed(2)}`, 180, yPos);
            
            yPos += 10;
        });
        
        // Add footer
        let footerYPos = doc.internal.pageSize.getHeight() - 20;
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('This statement was generated from ATM Simulator', pageWidth / 2, footerYPos, { align: 'center' });
        
        // Save PDF
        doc.save(`${currentUser.bank}_statement_${new Date().toISOString().slice(0, 10)}.pdf`);
    }
});
