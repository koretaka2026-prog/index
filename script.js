const starsCanvas = document.getElementById('starsCanvas');
const sCtx = starsCanvas.getContext('2d');
let stars = [];

function resizeStars() {
    starsCanvas.width = window.innerWidth;
    starsCanvas.height = window.innerHeight * 0.68;
    initStars();
}

function initStars() {
    stars = [];
    const count = Math.floor((starsCanvas.width * starsCanvas.height) / 3500);
    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * starsCanvas.width,
            y: Math.random() * starsCanvas.height,
            radius: Math.random() * 1.5 + 0.5,
            alpha: Math.random(),
            speed: Math.random() * 0.02 + 0.005
        });
    }
}
window.addEventListener('resize', resizeStars);
resizeStars();

function drawStars(nightProgress) {
    sCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
    if (nightProgress <= 0) return;
    
    sCtx.fillStyle = `rgba(255, 255, 255, ${nightProgress})`;
    stars.forEach(star => {
        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0.2) star.speed *= -1;
        sCtx.globalAlpha = star.alpha * nightProgress;
        sCtx.beginPath();
        sCtx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        sCtx.fill();
    });
    sCtx.globalAlpha = 1.0;
}

const skyEl = document.getElementById('sky');
function createClouds() {
    for (let i = 0; i < 5; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'cloud';
        const width = 120 + Math.random() * 100;
        const height = 40 + Math.random() * 25;
        cloud.style.width = `${width}px`;
        cloud.style.height = `${height}px`;
        cloud.style.top = `${Math.random() * 50}%`;
        cloud.style.left = `${Math.random() * -200}px`;
        const duration = 40 + Math.random() * 30;
        cloud.style.animationDuration = `${duration}s`;
        cloud.style.animationDelay = `${Math.random() * duration}s`;
        skyEl.appendChild(cloud);
    }
}
createClouds();

const skyStages = [
    { r: 253, g: 186, b: 116 }, // 夕方
    { r: 125, g: 211, b: 252 }, // 昼
    { r: 244, g: 63,  b: 94  }, // 夕暮れ
    { r: 15,  g: 23,  b: 42  }  // 夜
];

const meadowBackStages = [
    { r: 134, g: 239, b: 172 },
    { r: 134, g: 239, b: 172 },
    { r: 180, g: 83,  b: 9   },
    { r: 15,  g: 23,  b: 42  }
];

const meadowFrontStages = [
    { r: 34,  g: 197, b: 94  },
    { r: 34,  g: 197, b: 94  },
    { r: 120, g: 53,  b: 15  },
    { r: 5,   g: 46,  b: 22  }
];

let envCycleProgress = 0;
const cycleDuration = 120000;
let lastEnvTime = performance.now();

function updateEnvironment(currentTime) {
    const dt = currentTime - lastEnvTime;
    lastEnvTime = currentTime;
    envCycleProgress = (envCycleProgress + dt / cycleDuration) % 1;

    const totalStages = skyStages.length;
    const scaled = envCycleProgress * totalStages;
    const index = Math.floor(scaled);
    const nextIndex = (index + 1) % totalStages;
    const factor = scaled - index;

    const skyColor = interpolateColor(skyStages[index], skyStages[nextIndex], factor);
    const medBackColor = interpolateColor(meadowBackStages[index], meadowBackStages[nextIndex], factor);
    const medFrontColor = interpolateColor(meadowFrontStages[index], meadowFrontStages[nextIndex], factor);

    skyEl.style.background = `linear-gradient(to bottom, rgb(${skyColor.r}, ${skyColor.g}, ${skyColor.b}), rgba(${skyColor.r}, ${skyColor.g}, ${skyColor.b}, 0.85))`;
    document.getElementById('meadowBack').style.background = `linear-gradient(to bottom, rgb(${medBackColor.r}, ${medBackColor.g}, ${medBackColor.b}), rgba(${medBackColor.r}, ${medBackColor.g}, ${medBackColor.b}, 0.9))`;
    document.getElementById('meadowFront').style.background = `linear-gradient(to bottom, rgb(${medFrontColor.r}, ${medFrontColor.g}, ${medFrontColor.b}), rgb(${medFrontColor.r * 0.7}, ${medFrontColor.g * 0.7}, ${medFrontColor.b * 0.7}))`;

    let nightFactor = 0;
    if (index === 3) nightFactor = 1 - factor;
    if (index === 2) nightFactor = factor;
    drawStars(nightFactor);

    requestAnimationFrame(updateEnvironment);
}
requestAnimationFrame(updateEnvironment);

function interpolateColor(c1, c2, factor) {
    return {
        r: Math.round(c1.r + (c2.r - c1.r) * factor),
        g: Math.round(c1.g + (c2.g - c1.g) * factor),
        b: Math.round(c1.b + (c2.b - c1.b) * factor)
    };
}

let fenceLevel = 1; 
let uncleSpawnTimer = null; 

function handleFenceClick(event) {
    event.stopPropagation();

    if (uncleSpawnTimer) {
        clearTimeout(uncleSpawnTimer);
        uncleSpawnTimer = null;
    }

    if (fenceLevel === 1) {
        fenceLevel = 2;
    } else if (fenceLevel === 2) {
        fenceLevel = 3;
    } else if (fenceLevel === 3) {
        fenceLevel = 3;
    }

    updateFenceAppearance();

    if (fenceLevel === 2 || fenceLevel === 3) {
        uncleSpawnTimer = setTimeout(() => {
            spawnUncleToWork();
        }, 10000); 
    }
}

const fenceContainerEl = document.getElementById('fenceContainer');
const fenceSvgEl = document.getElementById('fenceSvg');
const post1 = document.getElementById('post1');
const post2 = document.getElementById('post2');
const post3 = document.getElementById('post3');
const rail1 = document.getElementById('rail1');
const rail2 = document.getElementById('rail2');
const line1 = document.getElementById('line1');
const line2 = document.getElementById('line2');
const line3 = document.getElementById('line3');

function updateFenceAppearance() {
    if (fenceLevel === 1) {
        fenceContainerEl.style.height = '90px';
        fenceContainerEl.style.bottom = '22%';
        fenceSvgEl.setAttribute('viewBox', '0 0 160 90');
        fenceSvgEl.setAttribute('height', '90');
        
        post1.setAttribute('y', '5'); post1.setAttribute('height', '85');
        post2.setAttribute('y', '2'); post2.setAttribute('height', '88');
        post3.setAttribute('y', '5'); post3.setAttribute('height', '85');
        
        rail1.setAttribute('y', '22');
        rail2.setAttribute('y', '58');

        line1.setAttribute('y2', '80');
        line2.setAttribute('y2', '82');
        line3.setAttribute('y2', '80');
    } else if (fenceLevel === 2) {
        fenceContainerEl.style.height = '135px';
        fenceContainerEl.style.bottom = '22%';
        fenceSvgEl.setAttribute('viewBox', '0 0 160 135');
        fenceSvgEl.setAttribute('height', '135');
        
        post1.setAttribute('y', '0'); post1.setAttribute('height', '135');
        post2.setAttribute('y', '0'); post2.setAttribute('height', '135');
        post3.setAttribute('y', '0'); post3.setAttribute('height', '135');
        
        rail1.setAttribute('y', '35');
        rail2.setAttribute('y', '90');

        line1.setAttribute('y2', '125');
        line2.setAttribute('y2', '125');
        line3.setAttribute('y2', '125');
    } else if (fenceLevel === 3) {
        fenceContainerEl.style.height = '200px';
        fenceContainerEl.style.bottom = '22%';
        fenceSvgEl.setAttribute('viewBox', '0 0 160 200');
        fenceSvgEl.setAttribute('height', '200');
        
        post1.setAttribute('y', '-10'); post1.setAttribute('height', '210');
        post2.setAttribute('y', '-15'); post2.setAttribute('height', '215');
        post3.setAttribute('y', '-10'); post3.setAttribute('height', '210');
        
        rail1.setAttribute('y', '50');
        rail2.setAttribute('y', '140');

        line1.setAttribute('y2', '190');
        line2.setAttribute('y2', '195');
        line3.setAttribute('y2', '190');
    }
}

let sheepCount = 0;
let pigCount = 0;
let horseCount = 0;
let cowCount = 0;
let uncleCount = 0;

const messageEl = document.getElementById('message');
const appContainer = document.getElementById('app-container');

// 初回起動時にもすぐに1匹出す & 定期生成
setTimeout(() => {
    spawnAnimal();
}, 500);

setInterval(() => {
    spawnAnimal();
}, 6000);

function handleBackgroundClick(event) {
    spawnAnimal();
}

function spawnUncleToWork() {
    if (fenceLevel === 1) return;

    const screenWidth = window.innerWidth;
    const startX = screenWidth + 200;
    const targetX = screenWidth * 0.55;

    const uncle = document.createElement('div');
    uncle.className = 'animal';
    uncle.style.left = `${startX}px`;
    uncle.style.bottom = '24%';

    uncle.innerHTML = `
        <div style="width: 85px; height: 95px;">
            <svg width="85" height="95" viewBox="0 0 90 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="33" y="48" width="24" height="32" fill="#334155" rx="4"/>
                <path d="M37 48 L37 58 L53 58 L53 48 Z" fill="#94A3B8"/>
                <circle cx="45" cy="34" r="12" fill="#FDE68A"/>
                <path d="M30 26 Q45 20 60 26 L58 30 C50 27 40 27 32 30 Z" fill="#475569"/>
                <rect x="35" y="80" width="7" height="15" rx="3.5" fill="#1E293B"/>
                <rect x="48" y="80" width="7" height="15" rx="3.5" fill="#1E293B"/>
                <text x="30" y="38" font-size="8">🔧</text>
            </svg>
        </div>
    `;
    appContainer.appendChild(uncle);

    const walkDuration = 3000;
    const walkStartTime = performance.now();

    function animateUncleWalk(time) {
        const elapsed = time - walkStartTime;
        const progress = Math.min(elapsed / walkDuration, 1);

        const currentX = startX + (targetX - startX) * progress;
        uncle.style.left = `${currentX}px`;

        if (progress < 1) {
            requestAnimationFrame(animateUncleWalk);
        } else {
            performUncleWork(uncle);
        }
    }
    requestAnimationFrame(animateUncleWalk);
}

function performUncleWork(uncleEl) {
    uncleCount++;
    const bubble = document.createElement('div');
    bubble.className = 'speech-bubble';
    
    const uncleSpeechPatterns = [
        `もー、高さを変えないでよ…`,
        `こらこら、勝手に高くしないで！`,
        `やれやれ、また直さなくちゃ…`,
        `もう、いたずらしないでよね`,
        `トントンカンカン…ったくもう！`
    ];
    bubble.textContent = uncleSpeechPatterns[Math.floor(Math.random() * uncleSpeechPatterns.length)];
    uncleEl.appendChild(bubble);

    fenceLevel = 1;
    updateFenceAppearance();

    setTimeout(() => {
        bubble.remove();
        const screenWidth = window.innerWidth;
        const startX = parseFloat(uncleEl.style.left);
        const exitX = screenWidth + 200;
        const exitDuration = 2500;
        const exitStartTime = performance.now();

        function animateUncleExit(time) {
            const elapsed = time - exitStartTime;
            const progress = Math.min(elapsed / exitDuration, 1);

            const currentX = startX + (exitX - startX) * progress;
            uncleEl.style.left = `${currentX}px`;

            if (progress < 1) {
                requestAnimationFrame(animateUncleExit);
            } else {
                uncleEl.remove();
            }
        }
        requestAnimationFrame(animateUncleExit);
    }, 2000);
}

function spawnAnimal() {
    const screenWidth = window.innerWidth;
    const startX = -200;
    const endX = screenWidth + 200;

    const animal = document.createElement('div');
    animal.className = 'animal';
    animal.style.left = `${startX}px`;

    let duration = 7500 + Math.random() * 3000;
    let jumpHeight = 120 + Math.random() * 40;
    if (fenceLevel === 2) jumpHeight = 170 + Math.random() * 30;
    if (fenceLevel === 3) jumpHeight = 240 + Math.random() * 40;

    const jumpCenterOffset = (Math.random() - 0.5) * 0.06;
    const jumpStart = 0.35 + jumpCenterOffset;
    const jumpEnd = jumpStart + 0.24;
    const jumpPeak = jumpStart + 0.12;

    const isSuperGiantSheep = Math.random() < 0.0001; 
    const isGiantSheep = !isSuperGiantSheep && (Math.random() < 0.001); 
    
    let stumbleRate = 0.002;
    if (fenceLevel === 2) stumbleRate = 0.02;
    if (fenceLevel === 3) stumbleRate = 0.20;

    const isStumbler = !isSuperGiantSheep && !isGiantSheep && (Math.random() < stumbleRate);

    const isWalker = !isSuperGiantSheep && !isGiantSheep && !isStumbler && (Math.random() < 0.02);
    if (isWalker) {
        animal.isWalker = true;
        duration = 10000;
    }

    let animalType = 'sheep';
    if (isSuperGiantSheep) {
        animalType = 'superGiantSheep';
        animal.classList.add('super-giant');
        duration = 14000;
    } else if (isGiantSheep) {
        animalType = 'giantSheep';
        animal.classList.add('giant');
        duration = 11000;
    } else if (!isWalker) {
        const randType = Math.random();
        if (randType < 0.01) {
            animalType = 'horse';
        } else if (randType < 0.02) {
            animalType = 'cow';
        } else if (randType < 0.03) {
            animalType = 'pig';
        }
    }

    animal.animalType = animalType;

    if (isStumbler) {
        animal.isStumbler = true;
    }

    let animalInnerSvg = '';

    if (animalType === 'superGiantSheep') {
        animalInnerSvg = `
            <svg width="420" height="330" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="50" cy="48" rx="30" ry="22" fill="#FFFFFF" stroke="#64748B" stroke-width="1.5"/>
                <circle cx="32" cy="38" r="13" fill="#FFFFFF"/><circle cx="62" cy="36" r="14" fill="#FFFFFF"/>
                <circle cx="48" cy="30" r="15" fill="#FFFFFF"/><circle cx="34" cy="54" r="13" fill="#FFFFFF"/>
                <circle cx="64" cy="52" r="13" fill="#FFFFFF"/><circle cx="25" cy="45" r="10" fill="#FFFFFF"/>
                <rect x="32" y="64" width="6" height="13" rx="3" fill="#0F172A"/><rect x="42" y="66" width="6" height="11" rx="3" fill="#0F172A"/>
                <rect x="58" y="66" width="6" height="11" rx="3" fill="#0F172A"/><rect x="68" y="64" width="6" height="13" rx="3" fill="#0F172A"/>
                <ellipse cx="78" cy="40" rx="11" ry="10" fill="#0F172A"/><ellipse cx="85" cy="42" rx="5" ry="6" fill="#020617"/>
                <path d="M83 39 Q85 41 87 39" stroke="#E2E8F0" stroke-width="1.5" stroke-linecap="round"/>
                <ellipse cx="73" cy="32" rx="4" ry="7" transform="rotate(25 73 32)" fill="#0F172A"/>
                <path d="M70 26 L74 17 L78 23 L82 15 L86 23 L90 17 L94 26 Z" fill="#FACC15" stroke="#EAB308" stroke-width="1"/>
                <circle cx="74" cy="16" r="2" fill="#EF4444"/><circle cx="82" cy="14" r="2.5" fill="#3B82F6"/><circle cx="90" cy="16" r="2" fill="#10B981"/>
                <text x="70" y="11" fill="#FDE047" font-size="7" font-weight="bold" font-family="sans-serif">🌟 SUPREME 🌟</text>
            </svg>
        `;
    } else if (animalType === 'giantSheep') {
        animalInnerSvg = `
            <svg width="270" height="210" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="50" cy="48" rx="30" ry="22" fill="#EEF2F6" stroke="#94A3B8" stroke-width="1.5"/>
                <circle cx="32" cy="38" r="13" fill="#EEF2F6"/><circle cx="62" cy="36" r="14" fill="#EEF2F6"/>
                <circle cx="48" cy="30" r="15" fill="#EEF2F6"/><circle cx="34" cy="54" r="13" fill="#EEF2F6"/>
                <circle cx="64" cy="52" r="13" fill="#EEF2F6"/><circle cx="25" cy="45" r="10" fill="#EEF2F6"/>
                <rect x="32" y="64" width="6" height="13" rx="3" fill="#1E293B"/><rect x="42" y="66" width="6" height="11" rx="3" fill="#1E293B"/>
                <rect x="58" y="66" width="6" height="11" rx="3" fill="#1E293B"/><rect x="68" y="64" width="6" height="13" rx="3" fill="#1E293B"/>
                <ellipse cx="78" cy="40" rx="11" ry="10" fill="#0F172A"/><ellipse cx="85" cy="42" rx="5" ry="6" fill="#020617"/>
                <path d="M83 39 Q85 41 87 39" stroke="#E2E8F0" stroke-width="1.5" stroke-linecap="round"/>
                <ellipse cx="73" cy="32" rx="4" ry="7" transform="rotate(25 73 32)" fill="#1E293B"/>
                <path d="M72 26 L75 19 L78 24 L82 18 L86 24 L89 19 L92 26 Z" fill="#FACC15" stroke="#CA8A04" stroke-width="1"/>
                <circle cx="75" cy="18" r="1.5" fill="#EF4444"/><circle cx="82" cy="17" r="1.5" fill="#3B82F6"/><circle cx="89" cy="18" r="1.5" fill="#10B981"/>
                <text x="75" y="14" fill="#EAB308" font-size="8" font-weight="bold" font-family="sans-serif">👑KING</text>
            </svg>
        `;
    } else if (animalType === 'horse') {
        animalInnerSvg = `
            <svg width="100" height="75" viewBox="0 0 110 85" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="55" cy="52" rx="30" ry="18" fill="#B45309" stroke="#78350F" stroke-width="1.5"/>
                <rect x="35" y="66" width="6" height="15" rx="3" fill="#78350F"/><rect x="45" y="66" width="6" height="15" rx="3" fill="#78350F"/>
                <rect x="62" y="66" width="6" height="15" rx="3" fill="#78350F"/><rect x="72" y="66" width="6" height="15" rx="3" fill="#78350F"/>
                <path d="M72 48 L86 28 L94 32 L80 54 Z" fill="#B45309" stroke="#78350F" stroke-width="1.5"/>
                <ellipse cx="90" cy="28" rx="10" ry="7" transform="rotate(20 90 28)" fill="#B45309" stroke="#78350F" stroke-width="1.5"/>
                <path d="M74 42 L80 32 L78 50 Z" fill="#451A03"/><path d="M84 22 L88 27 L82 27 Z" fill="#78350F"/>
                <circle cx="93" cy="26" r="1.5" fill="#1F2937"/><text x="80" y="16" fill="#B45309" font-size="9" font-weight="bold" font-family="sans-serif">ヒヒーン</text>
            </svg>
        `;
    } else if (animalType === 'cow') {
        animalInnerSvg = `
            <svg width="100" height="75" viewBox="0 0 110 85" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="55" cy="52" rx="32" ry="20" fill="#FFFFFF" stroke="#334155" stroke-width="1.5"/>
                <path d="M35 38 Q42 34 45 42 Q40 50 35 45 Z" fill="#1E293B"/><path d="M62 45 Q70 42 68 55 Q58 58 60 48 Z" fill="#1E293B"/>
                <rect x="35" y="68" width="6" height="12" rx="3" fill="#1E293B"/><rect x="46" y="70" width="6" height="10" rx="3" fill="#1E293B"/>
                <rect x="58" y="70" width="6" height="10" rx="3" fill="#1E293B"/><rect x="69" y="68" width="6" height="12" rx="3" fill="#1E293B"/>
                <ellipse cx="82" cy="44" rx="12" ry="10" fill="#FFFFFF" stroke="#334155" stroke-width="1.5"/>
                <path d="M76 38 L80 34 L84 38 Z" fill="#1E293B"/><ellipse cx="89" cy="46" rx="5" ry="4" fill="#F472B6" stroke="#DB2777" stroke-width="1"/>
                <circle cx="87" cy="45" r="0.8" fill="#1E293B"/><circle cx="91" cy="45" r="0.8" fill="#1E293B"/><circle cx="84" cy="41" r="1.5" fill="#1E293B"/>
                <path d="M78 35 L76 29 L80 33 Z" fill="#CBD5E1" stroke="#64748B" stroke-width="1"/><path d="M85 35 L87 29 L83 33 Z" fill="#CBD5E1" stroke="#64748B" stroke-width="1"/>
                <text x="80" y="20" fill="#334155" font-size="9" font-weight="bold" font-family="sans-serif">モー</text>
            </svg>
        `;
    } else if (animalType === 'pig') {
        animalInnerSvg = `
            <svg width="90" height="70" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="50" cy="50" rx="32" ry="24" fill="#F472B6" stroke="#DB2777" stroke-width="1.5"/>
                <circle cx="28" cy="38" r="8" fill="#F472B6"/><circle cx="72" cy="38" r="8" fill="#F472B6"/>
                <rect x="30" y="66" width="6" height="11" rx="3" fill="#BE185D"/><rect x="42" y="68" width="6" height="9" rx="3" fill="#BE185D"/>
                <rect x="54" y="68" width="6" height="9" rx="3" fill="#BE185D"/><rect x="66" y="66" width="6" height="11" rx="3" fill="#BE185D"/>
                <ellipse cx="78" cy="46" rx="13" ry="12" fill="#F472B6" stroke="#DB2777" stroke-width="1.5"/>
                <ellipse cx="84" cy="48" rx="6" ry="4" fill="#FB7185" stroke="#E11D48" stroke-width="1"/>
                <circle cx="82" cy="47" r="0.8" fill="#881337"/><circle cx="86" cy="47" r="0.8" fill="#881337"/><circle cx="82" cy="40" r="1.5" fill="#881337"/>
                <path d="M70 34 L78 27 L74 37 Z" fill="#DB2777"/><path d="M84 33 L89 25 L83 34 Z" fill="#DB2777"/>
                <text x="83" y="24" fill="#DB2777" font-size="9" font-family="sans-serif">ブヒ</text>
            </svg>
        `;
    } else {
        const isRare = Math.random() < (1 / 15);
        if (isRare) {
            animalInnerSvg = `
                <svg width="90" height="70" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="50" cy="48" rx="30" ry="22" fill="#FEF08A" stroke="#EAB308" stroke-width="1.5"/>
                    <circle cx="32" cy="38" r="13" fill="#FEF08A"/><circle cx="62" cy="36" r="14" fill="#FEF08A"/>
                    <circle cx="48" cy="30" r="15" fill="#FEF08A"/><circle cx="34" cy="54" r="13" fill="#FEF08A"/>
                    <circle cx="64" cy="52" r="13" fill="#FEF08A"/><circle cx="25" cy="45" r="10" fill="#FEF08A"/>
                    <path d="M45 20 L47 25 L52 27 L47 29 L45 34 L43 29 L38 27 L43 25 Z" fill="#FACC15"/>
                    <rect x="32" y="64" width="6" height="13" rx="3" fill="#713F12"/><rect x="42" y="66" width="6" height="11" rx="3" fill="#713F12"/>
                    <rect x="58" y="66" width="6" height="11" rx="3" fill="#713F12"/><rect x="68" y="64" width="6" height="13" rx="3" fill="#713F12"/>
                    <ellipse cx="78" cy="40" rx="11" ry="10" fill="#78350F"/><ellipse cx="85" cy="42" rx="5" ry="6" fill="#451A03"/>
                    <path d="M83 39 Q85 41 87 39" stroke="#FDE047" stroke-width="1.5" stroke-linecap="round"/>
                    <ellipse cx="73" cy="32" rx="4" ry="7" transform="rotate(25 73 32)" fill="#92400E"/>
                    <text x="82" y="24" fill="#EAB308" font-size="10" font-family="sans-serif">★</text>
                </svg>`;
        } else {
            animalInnerSvg = `
                <svg width="90" height="70" viewBox="0 0 100 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="50" cy="48" rx="30" ry="22" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1.5"/>
                    <circle cx="32" cy="38" r="13" fill="#F8FAFC"/><circle cx="62" cy="36" r="14" fill="#F8FAFC"/>
                    <circle cx="48" cy="30" r="15" fill="#F8FAFC"/><circle cx="34" cy="54" r="13" fill="#F8FAFC"/>
                    <circle cx="64" cy="52" r="13" fill="#F8FAFC"/><circle cx="25" cy="45" r="10" fill="#F8FAFC"/>
                    <circle cx="45" cy="36" r="6" fill="#FFFFFF"/><circle cx="58" cy="44" r="7" fill="#FFFFFF"/>
                    <rect x="32" y="64" width="6" height="13" rx="3" fill="#334155"/><rect x="42" y="66" width="6" height="11" rx="3" fill="#334155"/>
                    <rect x="58" y="66" width="6" height="11" rx="3" fill="#334155"/><rect x="68" y="64" width="6" height="13" rx="3" fill="#334155"/>
                    <ellipse cx="78" cy="40" rx="11" ry="10" fill="#1E293B"/><ellipse cx="85" cy="42" rx="5" ry="6" fill="#0F172A"/>
                    <path d="M83 39 Q85 41 87 39" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round"/>
                    <ellipse cx="73" cy="32" rx="4" ry="7" transform="rotate(25 73 32)" fill="#334155"/>
                    <ellipse cx="73" cy="32" rx="2" ry="5" transform="rotate(25 73 32)" fill="#CBD5E1"/>
                    <text x="82" y="24" fill="#64748B" font-size="10" font-family="sans-serif" opacity="0.8">${animal.isWalker ? 'トコトコ' : 'z'}</text>
                </svg>
            `;
        }
    }

    animal.innerHTML = animalInnerSvg;
    appContainer.appendChild(animal);

    let isInteracted = false;

    animal.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isInteracted) return;
        isInteracted = true;

        const actionType = Math.random() < 0.5 ? 'flyOut' : 'dash';

        if (actionType === 'flyOut') {
            animal.classList.add('surprised');
            setReactionMessage(animal.animalType, 'flyOut');

            const clickFlyTime = performance.now();
            const startFlyBottom = parseFloat(animal.style.bottom);
            const startFlyLeft = parseFloat(animal.style.left);

            function animateUpwardFlight(time) {
                const elapsed = time - clickFlyTime;
                const progress = elapsed / 600;

                if (progress < 1) {
                    const upwardOffset = Math.sin(progress * Math.PI * 0.5) * 350;
                    animal.style.bottom = `${startFlyBottom + upwardOffset}px`;
                    animal.style.left = `${startFlyLeft + progress * 80}px`;
                    animal.style.transform = `rotate(${progress * 720}deg) scale(${1 - progress * 0.3})`;
                    requestAnimationFrame(animateUpwardFlight);
                } else {
                    animal.remove();
                }
            }
            requestAnimationFrame(animateUpwardFlight);

        } else {
            animal.classList.add('dashing');
            setReactionMessage(animal.animalType, 'dash');

            const remainingProgress = animalProgress;
            const dashStartTime = performance.now();
            const startDashX = parseFloat(animal.style.left);
            const dashDuration = (1 - remainingProgress) * 2000;

            function animateDash(time) {
                const elapsed = time - dashStartTime;
                const progress = Math.min(elapsed / dashDuration, 1);

                const currentX = startDashX + (endX - startDashX) * progress;
                animal.style.left = `${currentX}px`;
                animal.style.bottom = `24%`;

                if (progress < 1) {
                    requestAnimationFrame(animateDash);
                } else {
                    animal.remove();
                }
            }
            animalProgress = 2.0;
            requestAnimationFrame(animateDash);
        }
    });

    const startTime = performance.now();
    let animalProgress = 0;

    function animateAnimal(currentTime) {
        if (isInteracted && animalProgress >= 2.0) return;
        if (isInteracted) return;

        const elapsed = currentTime - startTime;
        animalProgress = Math.min(elapsed / duration, 1);

        const currentX = startX + (endX - startX) * animalProgress;
        
        let verticalOffset = 0;
        let tiltAngle = (Math.sin(animalProgress * Math.PI * 12) * 3);

        let stumbleExtraAngle = 0;
        let stumbleOffsetY = 0;
        if (animal.isStumbler && animalProgress >= 0.45 && animalProgress <= 0.60) {
            const stProg = (animalProgress - 0.45) / 0.15; 
            if (stProg < 0.4) {
                stumbleExtraAngle = -45 * (stProg / 0.4);
                stumbleOffsetY = -15 * (stProg / 0.4);
            } else if (stProg < 0.7) {
                stumbleExtraAngle = -45 + (Math.sin(stProg * Math.PI * 15) * 5);
                stumbleOffsetY = -15;
            } else {
                const recoverProg = (stProg - 0.7) / 0.3;
                stumbleExtraAngle = -45 * (1 - recoverProg);
                stumbleOffsetY = -15 * (1 - recoverProg);
            }
        }

        let walkerDuckOffsetY = 0;
        let walkerTilt = 0;
        if (animal.isWalker) {
            // 柵を越える区間だけ少し下をくぐる（下げ幅を調整済み）
            if (animalProgress >= jumpStart && animalProgress <= jumpEnd) {
                walkerDuckOffsetY = -6;
                walkerTilt = Math.sin(animalProgress * Math.PI * 25) * 2;
            } else {
                walkerDuckOffsetY = 0;
            }
        } else {
            if (animalProgress >= jumpStart && animalProgress <= jumpEnd) {
                const jumpProgress = (animalProgress - jumpStart) / (jumpEnd - jumpStart);
                verticalOffset = Math.sin(jumpProgress * Math.PI) * jumpHeight;
                tiltAngle = (jumpProgress - 0.5) * 40;
            }
        }

        animal.style.left = `${currentX}px`;
        animal.style.bottom = `${24 + (verticalOffset / window.innerHeight) * 100 + stumbleOffsetY + walkerDuckOffsetY}%`;
        animal.style.transform = `rotate(${tiltAngle + stumbleExtraAngle + walkerTilt}deg)`;

        const middleCheckPoint = animal.isWalker ? 0.50 : jumpPeak;
        if (animalProgress >= middleCheckPoint && !animal.hasCounted) {
            animal.hasCounted = true;
            if (animal.isWalker) {
                showSpeechBubble(animal, 'walker');
                messageEl.textContent = "「…あれ？柵の下をくぐっていっちゃった…」";
                sheepCount++; 
                updateMessage();
            } else if (animal.isStumbler) {
                showSpeechBubble(animal, 'stumble');
                messageEl.textContent = "「いてっ…！柵が高くてつまずいてしまった…」";
            } else if (animal.animalType === 'superGiantSheep') {
                showSpeechBubble(animal, 'superGiantSheep');
                messageEl.textContent = "「……ゴゴゴゴ…（究極の超巨大羊が現れた…!）」";
            } else if (animal.animalType === 'giantSheep') {
                showSpeechBubble(animal, 'giantSheep');
                messageEl.textContent = "「……ゴゴゴ…（伝説の巨大羊が現れた！）」";
            } else if (animal.animalType === 'horse') {
                horseCount++;
                showSpeechBubble(animal, 'horse');
            } else if (animal.animalType === 'cow') {
                cowCount++;
                showSpeechBubble(animal, 'cow');
            } else if (animal.animalType === 'pig') {
                pigCount++;
                showSpeechBubble(animal, 'pig');
            } else {
                sheepCount++;
                showSpeechBubble(animal, 'sheep');
                updateMessage();
            }
        }

        if (animalProgress < 1) {
            requestAnimationFrame(animateAnimal);
        } else {
            animal.remove();
        }
    }

    requestAnimationFrame(animateAnimal);
}

function setReactionMessage(type, action) {
    if (action === 'flyOut') {
        if (type === 'superGiantSheep') messageEl.textContent = "「モデーーーーーーッ！？（超巨大羊が空へ飛び立った!）」";
        else if (type === 'giantSheep') messageEl.textContent = "「モデーーッ！？（巨大羊が空へ飛び立った！）」";
        else if (type === 'horse') messageEl.textContent = "「ヒヒ〜ン！？（空へ飛び立った！）」";
        else if (type === 'cow') messageEl.textContent = "「モーッ！？（牛が空へ飛び立った！）」";
        else if (type === 'pig') messageEl.textContent = "「ブヒッ！？（空へ飛び立った！）」";
        else messageEl.textContent = "「メェッ！？（空へ飛び立った!）」";
    } else {
        if (type === 'superGiantSheep') messageEl.textContent = "「モデーーーッ！超ド級ダッシュ！」";
        else if (type === 'giantSheep') messageEl.textContent = "「モデーーッ！超高速ダッシュ！」";
        else if (type === 'horse') messageEl.textContent = "「ヒヒ〜ン！ダッシュ！」";
        else if (type === 'cow') messageEl.textContent = "「モーッ！ダッシュ！」";
        else if (type === 'pig') messageEl.textContent = "「ブヒッ！ダッシュ！」";
        else messageEl.textContent = "「メェッ！ダッシュ！」";
    }
}

function showSpeechBubble(animalEl, type) {
    const bubble = document.createElement('div');
    bubble.className = 'speech-bubble';
    
    let randomText = '';
    if (type === 'walker') {
        const walkerPatterns = [
            `くぐり抜けちゃお...`,
            `下を歩いたほうが楽ちん♪`,
            `よいしょ、よいしょ...`,
            `ジャンプしなくていっか`,
            `トコトコ...失礼しますよ...`
        ];
        randomText = walkerPatterns[Math.floor(Math.random() * walkerPatterns.length)];
    } else if (type === 'stumble') {
        const stumblePatterns = [
            `いてっ...`,
            `つまずいちゃった...`,
            `どてっ...`,
            `柵が高すぎるよ...！`,
            `あぶないあぶない...`
        ];
        randomText = stumblePatterns[Math.floor(Math.random() * stumblePatterns.length)];
    } else if (type === 'superGiantSheep') {
        const superGiantPatterns = [
            `スプリームシープあらわる...！`,
            `宇宙一のねむけ...`,
            `もふもふの神...`,
            `どどーん！`
        ];
        randomText = superGiantPatterns[Math.floor(Math.random() * superGiantPatterns.length)];
    } else if (type === 'giantSheep') {
        const giantPatterns = [
            `キングシープあらわる...！`,
            `ものすごく おおきい...`,
            `1000ぴき分のねむけ...`,
            `どーん!`
        ];
        randomText = giantPatterns[Math.floor(Math.random() * giantPatterns.length)];
    } else if (type === 'horse') {
        const horsePatterns = [
            `うまが ${horseCount} とう`,
            `うまが ${horseCount} ひき`,
            `ウマが ${horseCount} 頭`,
            `おうまさんが ${horseCount} とう`,
            `うま... ${horseCount}とう...`
        ];
        randomText = horsePatterns[Math.floor(Math.random() * horsePatterns.length)];
    } else if (type === 'cow') {
        const cowPatterns = [
            `うしが ${cowCount} とう`,
            `うしが ${cowCount} ひき`,
            `ウシが ${cowCount} 頭`,
            `ホルスタインが ${cowCount} とう`,
            `うし... ${cowCount}とう...`
        ];
        randomText = cowPatterns[Math.floor(Math.random() * cowPatterns.length)];
    } else if (type === 'pig') {
        const pigPatterns = [
            `ぶたが ${pigCount} ひき`,
            `ぶたが ${pigCount} 匹`,
            `ブタが ${pigCount} 頭`,
            `ぶちゅじが ${pigCount} ひき...？`,
            `ぶた... ${pigCount}ひき...`
        ];
        randomText = pigPatterns[Math.floor(Math.random() * pigPatterns.length)];
    } else {
        const sheepPatterns = [
            `ひつじが ${sheepCount} ひき`,
            `ひつじが ${sheepCount} 匹`,
            `ひちゅじが ${sheepCount} ひき`,
            `ひふじが ${sheepCount} ひき`,
            `羊が ${sheepCount} ひき`,
            `羊が ${sheepCount} 匹`,
            `ひつじ... ${sheepCount}ひき...`
        ];
        randomText = sheepPatterns[Math.floor(Math.random() * sheepPatterns.length)];
    }

    bubble.textContent = randomText;
    animalEl.appendChild(bubble);

    setTimeout(() => {
        bubble.remove();
    }, 2200);
}

function updateMessage() {
    const messages = [
        "だんだんまぶたが重くなってきました...",
        "心地よい風が、心を穏やかにします...",
        "ゆっくり、深呼吸を繰り返しましょう...",
        "思考が静かに溶けていきます...",
        "そのまま, 眠りの世界へ..."
    ];
    if (sheepCount % 5 === 0) {
        const index = (Math.floor(sheepCount / 5) - 1) % messages.length;
        messageEl.textContent = messages[index];
    } else {
        messageEl.textContent = "";
    }
}