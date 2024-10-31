let currentExpression = '';
let memory = 0;
let lastResult = 0;

// ボタンプレスエフェクト
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function() {
        this.classList.add('button-press');
        setTimeout(() => {
            this.classList.remove('button-press');
        }, 200);
    });
});

function updateDisplay() {
    const resultElement = document.getElementById('result');
    const expressionElement = document.getElementById('expression');

    resultElement.style.opacity = '0';
    setTimeout(() => {
        resultElement.textContent = lastResult;
        resultElement.style.opacity = '1';
    }, 100);

    expressionElement.textContent = currentExpression;
}

function addToExpression(value) {
    currentExpression += value;
    updateDisplay();
}

function clearAll() {
    currentExpression = '';
    lastResult = 0;
    updateDisplay();
}

function clearEntry() {
    currentExpression = '';
    updateDisplay();
}

function backspace() {
    currentExpression = currentExpression.slice(0, -1);
    updateDisplay();
}

function toggleSign() {
    if (lastResult !== 0) {
        lastResult = -lastResult;
        currentExpression = lastResult.toString();
        updateDisplay();
    }
}

function memoryStore() {
    memory = lastResult;
    showNotification('Memory Stored');
}

function memoryRecall() {
    currentExpression += memory.toString();
    updateDisplay();
}

function memoryPlus() {
    memory += lastResult;
    showNotification('Added to Memory');
}

function memoryClear() {
    memory = 0;
    showNotification('Memory Cleared');
}

function calculate(operation) {
    switch (operation) {
        case 'sqrt':
            if (lastResult >= 0) {
                lastResult = Math.sqrt(lastResult);
                currentExpression = `√(${currentExpression})`;
            }
            break;
        case 'pow':
            lastResult = Math.pow(lastResult, 2);
            currentExpression = `(${currentExpression})²`;
            break;
    }
    updateDisplay();
}

function calculateResult() {
    try {
        const originalExpression = currentExpression;
        const calculateFn = new Function('return ' + currentExpression);
        lastResult = calculateFn();

        if (isNaN(lastResult) || !isFinite(lastResult)) {
            throw new Error('Invalid calculation');
        }

        lastResult = parseFloat(lastResult.toFixed(8));
        currentExpression = lastResult.toString();
        
        // アニメーション付きの結果表示
        const resultElement = document.getElementById('result');
        resultElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            resultElement.style.transform = 'scale(1)';
        }, 200);
    } catch (error) {
        lastResult = 'Error';
        currentExpression = '';
        showNotification('Invalid Expression', 'error');
    }
    updateDisplay();
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.background = type === 'error' ? '#f44336' : '#4caf50';
    notification.style.color = 'white';
    notification.style.zIndex = '1000';
    notification.style.animation = 'fadeInOut 2s ease-in-out';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// キーボードサポート
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (/[0-9.]/.test(key)) {
        addToExpression(key);
        animateButton(key);
    } else if (['+', '-', '*', '/'].includes(key)) {
        addToExpression(key);
        animateButton(key);
    } else if (key === 'Enter') {
        calculateResult();
        animateButton('=');
    } else if (key === 'Backspace') {
        backspace();
        animateButton('←');
    } else if (key === 'Escape') {
        clearAll();
        animateButton('C');
    }
});

function animateButton(value) {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (button.textContent === value) {
            button.classList.add('button-press');
            setTimeout(() => {
                button.classList.remove('button-press');
            }, 200);
        }
    });
}

// カスタムスタイル適用
document.addEventListener('DOMContentLoaded', function() {
    // 初期アニメーション
    document.querySelector('.calculator').style.opacity = '0';
    setTimeout(() => {
        document.querySelector('.calculator').style.opacity = '1';
    }, 100);
});
