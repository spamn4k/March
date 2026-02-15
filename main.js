const state = {
    currentScreen: 'intro',
    selectedQuestion: null,
    disabledQuestions: new Set(),
    questions: []
};

const appContainer = document.getElementById('screen-container');

async function init() {
    try {
        const response = await fetch('questions.json');
        if (!response.ok) throw new Error('Failed to load JSON');
        state.questions = await response.json();
        render();
    } catch (e) {
        appContainer.innerHTML = `<h1 style="color:red; text-align:center;">ОШИБКА: ${e.message}</h1>`;
    }
}

function render() {
    appContainer.innerHTML = '';

    const screenDiv = document.createElement('div');
    screenDiv.style.width = '100%';
    screenDiv.style.textAlign = 'center';

    if (state.currentScreen === 'intro') {
        screenDiv.innerHTML = `
            <h1 style="font-size: 3.5rem; color: #1e3a8a; margin-bottom: 20px;">ВЕСЕННИЙ КВИЗ</h1>
            <p style="font-size: 1.5rem; color: #475569; margin-bottom: 40px;">К международному женскому дню</p>
            <button onclick="goToGrid()" style="background: #2563eb; color: white; border: none; padding: 20px 60px; font-size: 1.5rem; font-weight: bold; border-radius: 50px; cursor: pointer; box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.4);">НАЧАТЬ ИГРУ</button>
        `;
    } else if (state.currentScreen === 'grid') {
        screenDiv.innerHTML = `<h2 style="color: #1e3a8a; margin-bottom: 30px;">ВЫБЕРИТЕ ВОПРОС</h2>`;
        const grid = document.createElement('div');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(5, 1fr)';
        grid.style.gap = '20px';

        for (let i = 1; i <= 25; i++) {
            const sq = document.createElement('div');
            sq.innerText = i;
            sq.style.aspectRatio = '1';
            sq.style.display = 'flex';
            sq.style.justifyContent = 'center';
            sq.style.alignItems = 'center';
            sq.style.fontSize = '2.5rem';
            sq.style.fontWeight = '800';
            sq.style.borderRadius = '15px';
            sq.style.cursor = 'pointer';
            sq.style.transition = 'transform 0.2s';

            if (state.disabledQuestions.has(i)) {
                sq.style.backgroundColor = '#e2e8f0';
                sq.style.color = '#94a3b8';
                sq.style.cursor = 'default';
            } else {
                sq.style.backgroundColor = '#ffffff';
                sq.style.color = '#2563eb';
                sq.style.border = '2px solid #e2e8f0';
                sq.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                sq.onclick = () => selectQuestion(i);
            }
            grid.appendChild(sq);
        }
        screenDiv.appendChild(grid);
    } else {
        const q = state.selectedQuestion;
        const container = document.createElement('div');
        container.style.backgroundColor = '#ffffff';
        container.style.padding = '50px';
        container.style.borderRadius = '30px';
        container.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
        container.style.border = '1px solid #e2e8f0';

        if (state.currentScreen === 'answer' && q.id === 13) {
            container.style.backgroundColor = '#ef4444';
            container.style.color = '#ffffff';
        }

        if (state.currentScreen === 'topic') {
            container.innerHTML = `
                <div style="color: #64748b; text-transform: uppercase; margin-bottom: 20px; font-weight: bold; letter-spacing: 0.1em;">ТЕМА</div>
                <div style="font-size: 3rem; margin-bottom: 40px; color: #1e293b;">${q.topic}</div>
                <button onclick="goToQuestion()" style="background: #2563eb; color: white; border: none; padding: 15px 40px; font-size: 1.2rem; font-weight: bold; border-radius: 30px; cursor: pointer;">УВИДЕТЬ ВОПРОС</button>
            `;
        } else if (state.currentScreen === 'question') {
            let img = q.image && q.id !== 13 ? `<img src="${q.image}" style="max-width: 100%; max-height: 400px; border-radius: 20px; margin-bottom: 30px; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">` : '';
            container.innerHTML = `
                <div style="color: #64748b; text-transform: uppercase; margin-bottom: 20px; font-weight: bold;">${q.topic}</div>
                ${img}
                <div style="font-size: 2.2rem; margin-bottom: 40px; line-height: 1.4; color: #1e293b;">${q.question}</div>
                <button onclick="goToAnswer()" style="background: #2563eb; color: white; border: none; padding: 15px 40px; font-size: 1.2rem; font-weight: bold; border-radius: 30px; cursor: pointer;">УВИДЕТЬ ОТВЕТ</button>
            `;
        } else if (state.currentScreen === 'answer') {
            let isSpecial = q.id === 13;
            let content = isSpecial ? `<img src="pointing_finger.png" style="width: 250px; margin-bottom: 30px;">` : `<div style="color: ${isSpecial ? '#ffffff' : '#64748b'}; text-transform: uppercase; margin-bottom: 20px; font-weight: bold;">ОТВЕТ</div>`;
            container.innerHTML = `
                ${content}
                <div style="font-size: 3rem; margin-bottom: 40px; font-weight: bold;">${q.answer}</div>
                <button onclick="backToGrid()" style="background: ${isSpecial ? '#ffffff' : '#2563eb'}; color: ${isSpecial ? '#ef4444' : 'white'}; border: none; padding: 15px 40px; font-size: 1.2rem; font-weight: bold; border-radius: 30px; cursor: pointer;">ВЕРНУТЬСЯ К СЕТКЕ</button>
            `;
        }
        screenDiv.appendChild(container);
    }

    appContainer.appendChild(screenDiv);
}

window.goToGrid = () => { state.currentScreen = 'grid'; render(); };
window.selectQuestion = (id) => {
    state.selectedQuestion = state.questions.find(q => q.id === id);
    if (state.selectedQuestion) {
        state.currentScreen = 'topic';
        render();
    }
};
window.goToQuestion = () => { state.currentScreen = 'question'; render(); };
window.goToAnswer = () => { state.currentScreen = 'answer'; render(); };
window.backToGrid = () => {
    state.disabledQuestions.add(state.selectedQuestion.id);
    state.currentScreen = 'grid';
    render();
};

init();
