// Находим все нужные элементы на странице
const chatBox = document.getElementById('chat-box');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const tg = window.Telegram.WebApp;

// !!! ВАЖНО: Не забудьте вставить ваш URL из n8n !!!
const N8N_WEBHOOK_URL = 'https://mrxbussiness.ru/webhook/2212b739-8e9b-4181-b5f9-73f76347d058';

// Приветственное сообщение при загрузке
window.addEventListener('load', () => {
    tg.setBackgroundColor(tg.themeParams.secondary_bg_color);
    
    // 2. Раскрываем приложение на весь экран для лучшего вида
    tg.expand();
    
    addMessage('Привет! Я ваш AI-ассистент. Чем могу помочь?', 'ai-message');
    tg.ready(); // Сообщаем Телеграму, что приложение готово
});

// Обработчик отправки формы
messageForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const userMessage = messageInput.value.trim();
    if (userMessage === '') return;

    addMessage(userMessage, 'user-message');
    messageInput.value = '';
    showTypingIndicator(true); // Показываем индикатор

    try {
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: userMessage,
                initData: tg.initData
            }),
        });

        if (!response.ok) {
            throw new Error(`Ошибка сети: ${response.status}`);
        }

        const data = await response.json();
        addMessage(data.reply, 'ai-message');

    } catch (error) {
        console.error('Произошла ошибка:', error);
        addMessage('Произошла ошибка. Пожалуйста, попробуйте снова.', 'ai-message');
    } finally {
        showTypingIndicator(false); // Всегда скрываем индикатор в конце
    }
});

/**
 * Функция для добавления нового сообщения в чат
 * @param {string} text - Текст сообщения
 * @param {string} className - Класс для стилизации ('user-message' или 'ai-message')
 */
function addMessage(text, className) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', className);
    messageElement.textContent = text;
    chatBox.appendChild(messageElement);
    scrollToBottom();
}

/**
 * Функция для показа/скрытия индикатора загрузки
 * @param {boolean} show - true, чтобы показать, false, чтобы скрыть
 */
function showTypingIndicator(show) {
    let indicator = document.querySelector('.typing-indicator');
    if (show) {
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.classList.add('message', 'ai-message', 'typing-indicator');
            indicator.innerHTML = '<span></span><span></span><span></span>';
            chatBox.appendChild(indicator);
            indicator.classList.add('visible'); // Добавляем класс для плавного появления
            scrollToBottom();
        }
    } else {
        if (indicator) {
            indicator.remove();
        }
    }
}

/**
 * Плавная прокрутка чата вниз
 */
function scrollToBottom() {
    chatBox.scrollTo({
        top: chatBox.scrollHeight,
        behavior: 'smooth'
    });
}



