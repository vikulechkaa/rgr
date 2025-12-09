let selectedKeySize = 128;

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    document.getElementById(sectionId).classList.add('active');
    event.target.closest('.nav-item').classList.add('active');
}

function selectKeySize(size) {
    selectedKeySize = size;
    document.querySelectorAll('.mode-option').forEach(m => m.classList.remove('selected'));
    event.target.classList.add('selected');
}

function encryptMessage() {
    const plaintext = document.getElementById('plaintext').value;
    const key = document.getElementById('encryptKey').value;

    if (!plaintext || !key) {
        alert('Заповніть всі поля!');
        return;
    }

    try {
        const encrypted = CryptoJS.AES.encrypt(plaintext, key).toString();
        
        document.getElementById('ciphertext').value = encrypted;
        document.getElementById('decryptKey').value = key;

        document.getElementById('encryptResult').innerHTML = `
            <div class="content-box">
                <h3>✅ Шифрування виконано успішно!</h3>
                <div class="result-box">${encrypted}</div>
                <p class="info-text" style="margin-top: 15px;">
                    💾 Зашифровані дані скопійовані в розділ "Розшифрування"
                </p>
            </div>
        `;
    } catch (error) {
        alert('Помилка шифрування: ' + error.message);
    }
}

function decryptMessage() {
    const ciphertext = document.getElementById('ciphertext').value;
    const key = document.getElementById('decryptKey').value;

    if (!ciphertext || !key) {
        alert('Заповніть всі поля!');
        return;
    }

    try {
        const decrypted = CryptoJS.AES.decrypt(ciphertext, key);
        const plaintext = decrypted.toString(CryptoJS.enc.Utf8);

        if (!plaintext) {
            throw new Error('Невірний ключ або пошкоджені дані');
        }

        document.getElementById('decryptResult').innerHTML = `
            <div class="content-box">
                <h3>✅ Розшифрування виконано успішно!</h3>
                <div class="result-box">${plaintext}</div>
            </div>
        `;
    } catch (error) {
        alert('Помилка розшифрування. Перевірте правильність ключа.');
    }
}

function generateKey() {
    const length = parseInt(document.getElementById('keyLength').value);
    const includeUpper = document.getElementById('includeUpper').checked;
    const includeLower = document.getElementById('includeLower').checked;
    const includeNumbers = document.getElementById('includeNumbers').checked;
    const includeSpecial = document.getElementById('includeSpecial').checked;

    let charset = '';
    if (includeUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLower) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSpecial) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (charset === '') {
        alert('Виберіть хоча б один тип символів!');
        return;
    }

    let key = '';
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
        key += charset[array[i] % charset.length];
    }

    document.getElementById('encryptKey').value = key;
    document.getElementById('decryptKey').value = key;

    const strength = length >= 32 ? 3 : length >= 24 ? 2 : 1;
    const strengthBars = Array(3).fill(0).map((_, i) => 
        `<div class="strength-bar ${i < strength ? 'active' : ''}"></div>`
    ).join('');

    document.getElementById('generatedKeyResult').innerHTML = `
        <div class="content-box" style="margin-top: 20px;">
            <h3>✅ Ключ згенеровано!</h3>
            <div class="result-box">${key}</div>
            <div style="margin-top: 15px;">
                <label>Надійність ключа:</label>
                <div class="key-strength">${strengthBars}</div>
            </div>
            <p class="info-text" style="margin-top: 15px;">
                🔑 Ключ автоматично скопійований в поля шифрування та розшифрування
            </p>
        </div>
    `;
}