// Находим нужные элементы на странице
const chatBox = document.getElementById('chat-box');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

// !!! ВАЖНО: Замените эту строку на ваш URL из n8n !!!
const N8N_WEBHOOK_URL = 'https://mrxbussiness.ru/webhook/2212b739-8e9b-4181-b5f9-73f76347d058';

// ... (предыдущий код без изменений) ...

// Находим объект Telegram Web App, который предоставляет сам Телеграм
const tg = window.Telegram.WebApp;

messageForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const userMessage = messageInput.value.trim();
    if (userMessage === '') return;

    addMessage(userMessage, 'user-message');
    messageInput.value = '';

    try {
        // Отправляем сообщение и initData на вебхук n8n
        const response = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // 👇 ВОТ ИЗМЕНЕНИЕ: Добавляем initData в тело запроса
            body: JSON.stringify({
                message: userMessage,
                initData: tg.initData // Получаем "паспорт" пользователя
            }),
        });

        if (!response.ok) {
            throw new Error('Ошибка сети или сервера n8n.');
        }

        const data = await response.json();
        const aiMessage = data.reply;

        addMessage(aiMessage, 'ai-message');

    } catch (error) {
        console.error('Произошла ошибка:', error);
        addMessage('Ой, что-то пошло не так. Попробуйте еще раз.', 'ai-message');
    }
});

// ... (функция addMessage без изменений) ...

function addMessage(text, className) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', className);
    messageElement.textContent = text;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}