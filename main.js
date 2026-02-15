const state = {
    currentScreen: 'intro',
    selectedQuestion: null,
    disabledQuestions: new Set(),
    questions: []
};

const appContainer = document.getElementById('screen-container');

// Inject Global Animations and Decorative Elements
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    @keyframes float {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        50% { transform: translateY(-15px) rotate(2deg); }
    }
    @keyframes rotate-slow {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    .hover-scale { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .hover-scale:hover { transform: scale(1.05) translateY(-5px); }
    .premium-card {
        background: rgba(255, 255, 255, 0.85);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.6);
        box-shadow: 0 15px 35px rgba(219, 39, 119, 0.08);
    }
    .flower-icon {
        position: absolute;
        opacity: 0.1;
        z-index: -1;
        animation: rotate-slow 20s linear infinite;
    }
`;
document.head.appendChild(style);

async function init() {
    try {
        const response = await fetch('questions.json');
        if (!response.ok) throw new Error('Load failed');
        state.questions = await response.json();
        render();
    } catch (e) {
        appContainer.innerHTML = `<h1 style="color:#ef4444; font-family: Montserrat; text-align:center;">ОШИБКА: ${e.message}</h1>`;
    }
}

function render() {
    appContainer.innerHTML = '';

    const screenDiv = document.createElement('div');
    screenDiv.style.width = '100%';
    screenDiv.style.position = 'relative';
    screenDiv.style.animation = 'fadeIn 0.8s ease-out forwards';

    if (state.currentScreen === 'intro') {
        screenDiv.style.textAlign = 'center';
        screenDiv.style.padding = '40px';
        screenDiv.innerHTML = `
            <!-- Decorative Elements -->
            <div class="flower-icon" style="top: -50px; left: -50px; font-size: 15rem;">🌸</div>
            <div class="flower-icon" style="bottom: -50px; right: -50px; font-size: 12rem; animation-direction: reverse;">🌺</div>
            
            <div style="margin-bottom: 40px; animation: float 6s ease-in-out infinite;">
                <h1 style="font-family: 'Playfair Display', serif; font-size: 6rem; font-style: italic; color: #1e1b4b; margin: 0; line-height: 1.1; background: linear-gradient(135deg, #1e1b4b 0%, #be185d 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Весенний Квиз</h1>
                <div style="width: 100px; height: 4px; background: #db2777; margin: 25px auto; border-radius: 10px;"></div>
            </div>
            
            <p style="font-family: 'Montserrat', sans-serif; font-size: 1.3rem; letter-spacing: 6px; text-transform: uppercase; color: #64748b; margin-bottom: 60px; font-weight: 500;">Для самых прекрасных дам</p>
            
            <button onclick="goToGrid()" class="hover-scale" style="background: #db2777; color: white; border: none; padding: 24px 80px; font-size: 1.5rem; font-family: 'Montserrat', sans-serif; font-weight: 800; border-radius: 100px; cursor: pointer; box-shadow: 0 15px 30px rgba(219, 39, 119, 0.3); text-transform: uppercase; letter-spacing: 3px; position: relative; overflow: hidden;">
                Начать Праздник
            </button>
        `;
    } else if (state.currentScreen === 'grid') {
        screenDiv.innerHTML = `<h2 style="font-family: 'Montserrat', sans-serif; text-align:center; color: #1e1b4b; text-transform: uppercase; letter-spacing: 5px; font-weight: 900; margin-bottom: 50px; font-size: 1.8rem; border-bottom: 2px solid #fecdd3; display: inline-block; padding-bottom: 10px; left: 50%; transform: translateX(-50%); position: relative;">Выберите Вопрос</h2>`;

        const grid = document.createElement('div');
        grid.style.display = 'grid';
        grid.style.gridTemplateColumns = 'repeat(5, 1fr)';
        grid.style.gap = '25px';
        grid.style.marginTop = '20px';

        for (let i = 1; i <= 25; i++) {
            const sq = document.createElement('div');
            sq.className = 'premium-card hover-scale';
            sq.innerText = i;
            sq.style.aspectRatio = '1';
            sq.style.display = 'flex';
            sq.style.justifyContent = 'center';
            sq.style.alignItems = 'center';
            sq.style.fontSize = '2.4rem';
            sq.style.fontWeight = '900';
            sq.style.fontFamily = 'Montserrat';
            sq.style.borderRadius = '28px';
            sq.style.cursor = 'pointer';

            if (state.disabledQuestions.has(i)) {
                sq.style.background = '#f8fafc';
                sq.style.color = '#e2e8f0';
                sq.style.boxShadow = 'none';
                sq.style.pointerEvents = 'none';
                sq.classList.remove('hover-scale');
            } else {
                sq.style.color = '#334155';
                sq.onmouseover = () => { sq.style.color = '#db2777'; sq.style.boxShadow = '0 10px 20px rgba(219, 39, 119, 0.15)'; };
                sq.onmouseout = () => { sq.style.color = '#334155'; sq.style.boxShadow = '0 15px 35px rgba(219, 39, 119, 0.08)'; };
                sq.onclick = () => selectQuestion(i);
            }
            grid.appendChild(sq);
        }
        screenDiv.appendChild(grid);
    } else {
        const q = state.selectedQuestion;
        const container = document.createElement('div');
        container.className = 'premium-card';
        container.style.padding = '80px';
        container.style.borderRadius = '50px';
        container.style.textAlign = 'center';
        container.style.maxWidth = '900px';
        container.style.margin = '0 auto';

        if (state.currentScreen === 'answer' && q.id === 13) {
            container.style.background = 'linear-gradient(135deg, #be185d, #db2777)';
            container.style.color = '#ffffff';
            container.style.boxShadow = '0 30px 60px rgba(190, 24, 93, 0.4)';
        }

        if (state.currentScreen === 'topic') {
            container.innerHTML = `
                <div style="font-family: Montserrat; color: #db2777; text-transform: uppercase; margin-bottom: 25px; font-weight: 700; letter-spacing: 5px;">Раздел</div>
                <div style="font-family: 'Playfair Display'; font-size: 4.5rem; margin-bottom: 60px; color: #1e1b4b; font-weight: 700; font-style: italic;">${q.topic}</div>
                <button onclick="goToQuestion()" class="hover-scale" style="background: #1e1b4b; color: white; border: none; padding: 20px 60px; font-size: 1.2rem; font-family: Montserrat; font-weight: 700; border-radius: 100px; cursor: pointer; text-transform: uppercase; letter-spacing: 3px;">Открыть Вопрос</button>
            `;
        } else if (state.currentScreen === 'question') {
            let img = q.image && q.id !== 13 ? `<img src="${q.image}" style="max-width: 100%; max-height: 450px; border-radius: 30px; margin-bottom: 40px; box-shadow: 0 20px 40px rgba(0,0,0,0.1);">` : '';
            container.innerHTML = `
                <div style="font-family: Montserrat; color: #94a3b8; text-transform: uppercase; margin-bottom: 25px; font-weight: 600; letter-spacing: 4px;">${q.topic}</div>
                ${img}
                <div style="font-family: 'Inter'; font-size: 2.4rem; margin-bottom: 60px; line-height: 1.6; font-weight: 400; color: #1e293b; padding: 0 20px;">${q.question}</div>
                <button onclick="goToAnswer()" class="hover-scale" style="background: #db2777; color: white; border: none; padding: 20px 60px; font-size: 1.2rem; font-family: Montserrat; font-weight: 700; border-radius: 100px; cursor: pointer; text-transform: uppercase; letter-spacing: 3px;">Показать Ответ</button>
            `;
        } else if (state.currentScreen === 'answer') {
            let isSpecial = q.id === 13;
            let content = isSpecial ? `<img src="pointing_finger.png" style="width: 280px; margin-bottom: 40px; filter: drop-shadow(0 20px 40px rgba(0,0,0,0.3));">` : `<div style="font-family: Montserrat; color: ${isSpecial ? '#ffffff' : '#db2777'}; text-transform: uppercase; margin-bottom: 25px; font-weight: 700; letter-spacing: 5px;">Верный Ответ</div>`;
            container.innerHTML = `
                ${content}
                <div style="font-family: 'Playfair Display'; font-size: 3.5rem; margin-bottom: 60px; font-weight: 700; line-height: 1.2;">${q.answer}</div>
                <button onclick="backToGrid()" class="hover-scale" style="background: ${isSpecial ? '#ffffff' : '#1e1b4b'}; color: ${isSpecial ? '#be185d' : 'white'}; border: none; padding: 20px 60px; font-size: 1.2rem; font-family: Montserrat; font-weight: 700; border-radius: 100px; cursor: pointer; text-transform: uppercase; letter-spacing: 3px;">Назад к Сетке</button>
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
