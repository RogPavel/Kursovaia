const API_URL = 'http://localhost:3000/api';

const currentRole = localStorage.getItem('userRole') || 'user';
const currentName = localStorage.getItem('userName') || 'Гость';

// --- ФУНКЦИЯ ОТОБРАЖЕНИЯ РОЛИ И ПЛАШЕК ---
function checkRoleDisplay() {
    const statusBadge = document.getElementById('userStatusBadge');
    if (statusBadge) {
        if (currentRole === 'admin') {
            statusBadge.innerText = `Администратор: ${currentName}`;
            statusBadge.style.background = '#e74c3c'; // Красный фон для админа
            statusBadge.style.color = '#fff';
        } else {
            statusBadge.innerText = `Пользователь: ${currentName}`;
            statusBadge.style.background = '#2ecc71'; // Зеленый фон для обычного пользователя
            statusBadge.style.color = '#fff';
        }
    }

    // Управление видимостью кнопок управления для админа
    if (currentRole === 'admin') {
        const addServiceBtn = document.getElementById('addServiceBtn');
        const addSitterBtn = document.getElementById('addSitterBtn');
        if (addServiceBtn) addServiceBtn.style.display = 'inline-flex';
        if (addSitterBtn) addSitterBtn.style.display = 'inline-flex';
    } else {
        const statusCard = document.getElementById('adminStatusCard');
        const infoCard = document.getElementById('adminInfoCard');
        if (statusCard) statusCard.style.display = 'none';
        if (infoCard) infoCard.style.display = 'none';
    }
}

// --- 1. УСЛУГИ (POSTGRESQL) ---
async function renderServices() {
    const grid = document.getElementById('servicesGrid');
    if (!grid) return;
    try {
        const res = await fetch(`${API_URL}/services`);
        const data = await res.json();

        // Отображаем карточки услуг на странице
        grid.innerHTML = data.map(s => {
            const isUrl = s.icon && (s.icon.startsWith('http') || s.icon.startsWith('./') || s.icon.startsWith('/'));
            const imageHtml = isUrl
                ? `<img src="${s.icon}" alt="${s.name}" class="card-image-content">`
                : `<span class="avatar">${s.icon || '🩺'}</span>`;

            return `
                <div class="service-card" style="position: relative;">
                    ${currentRole === 'admin' ? `
                    <div class="pet-actions" style="position: absolute; top: 10px; right: 10px; z-index: 10;">
                        <button class="edit-btn" onclick="updateService('${s.id}', '${s.name}', '${s.description || ''}', '${s.price}', '${s.icon || ''}')" title="Изменить">✏️</button>
                        <button class="pet-delete" onclick="deleteService('${s.id}')" title="Удалить">✕</button>
                    </div>
                    ` : ''}
                    <div class="image-container-wrapper">${imageHtml}</div>
                    <h3>${s.name}</h3>
                    <p>${s.description || ''}</p>
                    <b>${s.price} леев</b>
                </div>
            `;
        }).join('');

        // Обновление выбора направления в онлайн-записи
        const serviceSelect = document.getElementById('serviceSelect');
        if (serviceSelect) {
            serviceSelect.innerHTML = `
                <option value="" disabled selected>Выберите направление</option>
                ${data.map(s => `<option value="${s.name}">${s.name} (${s.price} леев)</option>`).join('')}
            `;
        }

    } catch (e) { console.error("Ошибка загрузки услуг:", e); }
}

async function addService() {
    const name = prompt('Введите название новой услуги:');
    if (!name) return;
    const description = prompt('Введите описание услуги:');
    const price = prompt('Введите цену услуги (леи):');

    const cleanPrice = price ? price.replace(',', '.').replace(/\s/g, '') : '0';
    const validatedPrice = parseFloat(cleanPrice) || 0;

    // УМНЫЙ ПОДБОР ИКОНКИ
    let icon = '🩺';
    const lowerName = name.toLowerCase();

    if (lowerName.includes('сидел') || lowerName.includes('выгул') || lowerName.includes('няня') || lowerName.includes('передерж')) {
        icon = '🏠';
    } else if (lowerName.includes('стриж') || lowerName.includes('грум') || lowerName.includes('мыть') || lowerName.includes('уход')) {
        icon = '✂️';
    } else if (lowerName.includes('вакцин') || lowerName.includes('привив') || lowerName.includes('укол')) {
        icon = '💉';
    } else if (lowerName.includes('анализ') || lowerName.includes('кровь') || lowerName.includes('лабор')) {
        icon = '🔬';
    } else if (lowerName.includes('чип') || lowerName.includes('электрон')) {
        icon = '🏷️';
    } else if (lowerName.includes('корм') || lowerName.includes('диет') || lowerName.includes('витамин')) {
        icon = '🦴';
    }

    try {
        const res = await fetch(`${API_URL}/services`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description, price: validatedPrice, icon })
        });
        if (res.ok) {
            alert('Услуга успешно добавлена!');
            renderServices();
        } else {
            alert(`Ошибка сервера: ${res.status}`);
        }
    } catch (e) {
        console.error("Ошибка при добавлении услуги:", e);
        alert('Не удалось связаться с сервером.');
    }
}

async function updateService(id, oldName, oldDesc, oldPrice, oldIcon) {
    const name = prompt("Изменить название услуги:", oldName);
    if (!name) return;
    const description = prompt("Изменить описание услуги:", oldDesc);
    const price = prompt("Изменить цену услуги (леи):", oldPrice);

    const cleanPrice = price ? price.toString().replace(',', '.').replace(/\s/g, '') : '0';
    const validatedPrice = parseFloat(cleanPrice) || 0;

    let icon = oldIcon || '🩺';
    const lowerName = name.toLowerCase();
    if (lowerName.includes('сидел') || lowerName.includes('выгул') || lowerName.includes('няня') || lowerName.includes('передерж')) icon = '🏠';
    else if (lowerName.includes('стриж') || lowerName.includes('грум') || lowerName.includes('мыть')) icon = '✂️';
    else if (lowerName.includes('вакцин') || lowerName.includes('привив') || lowerName.includes('укол')) icon = '💉';
    else if (lowerName.includes('анализ') || lowerName.includes('кровь')) icon = '🔬';
    else if (lowerName.includes('чип') || lowerName.includes('электрон')) icon = '🏷️';
    else if (lowerName.includes('корм') || lowerName.includes('диет') || lowerName.includes('витамин')) icon = '🦴';

    try {
        const res = await fetch(`${API_URL}/services/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ name, description, price: validatedPrice, icon })
        });
        if (res.ok) renderServices();
    } catch (e) { console.error(e); }
}

async function deleteService(id) {
    if (confirm('Удалить эту услугу из PostgreSQL?')) {
        try {
            await fetch(`${API_URL}/services/${id}`, { method: 'DELETE' });
            renderServices();
        } catch (e) { console.error(e); }
    }
}

// --- 2. СИДЕЛКИ (MONGODB) ---
async function renderSitters() {
    const grid = document.getElementById('sittersGrid');
    if (!grid) return;
    try {
        const res = await fetch(`${API_URL}/sitters`);
        const data = await res.json();
        grid.innerHTML = data.map(sit => {
            const isUrl = sit.avatar && (sit.avatar.startsWith('http') || sit.avatar.startsWith('./') || sit.avatar.startsWith('/'));
            const imageHtml = isUrl
                ? `<img src="${sit.avatar}" alt="${sit.name}" class="card-image-content rounded-avatar">`
                : `<span class="avatar">${sit.avatar || '👤'}</span>`;

            return `
                <div class="sitter-card" style="position: relative; padding-top: 35px;">
                    <span style="position: absolute; top: 12px; left: 12px; font-size: 0.9rem; font-weight: bold; z-index: 10; background: rgba(255,255,255,0.8); padding: 2px 6px; border-radius: 4px;">
                        ${sit.rating}
                    </span>
                    ${currentRole === 'admin' ? `
                    <div class="pet-actions" style="position: absolute; top: 10px; right: 10px; z-index: 10;">
                        <button class="edit-btn" onclick="updateSitter('${sit._id}', '${sit.name}', '${sit.experience}', '${sit.bio || ''}', '${sit.rating}', '${sit.avatar}')" title="Изменить">✏️</button>
                        <button class="pet-delete" onclick="deleteSitter('${sit._id}')" title="Удалить">✕</button>
                    </div>
                    ` : ''}
                    <div class="image-container-wrapper" style="margin: 10px auto;">${imageHtml}</div>
                    <h3>${sit.name}</h3>
                    <span class="badge">${sit.experience}</span>
                    <p>${sit.bio || ''}</p>
                </div>
            `;
        }).join('');
    } catch (e) { console.error("Ошибка загрузки сиделок:", e); }
}

async function addSitter() {
    const name = prompt('Имя сиделки:');
    if (!name) return;
    const experience = prompt('Опыт работы (например, "3 года опыта"):');
    const bio = prompt('Коротко о себе:');
    const rating = prompt('Рейтинг:', '⭐ 5.0');
    let avatar = prompt('Вставьте URL-ссылку на фотографию сиделки (или нажмите Enter для авто-аватара):');

    if (!avatar || avatar.trim() === '') {
        avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`;
    }

    try {
        const res = await fetch(`${API_URL}/sitters`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, experience, bio, rating, avatar })
        });
        if (res.ok) {
            alert('Сиделка успешно добавлена!');
            renderSitters();
        }
    } catch (e) { console.error(e); }
}

async function updateSitter(id, oldName, oldExp, oldBio, oldRating, oldAvatar) {
    const name = prompt("Изменить имя сиделки:", oldName);
    if (!name) return;
    const experience = prompt("Изменить опыт работы:", oldExp);
    const bio = prompt("Изменить описание:", oldBio);
    const rating = prompt("Изменить рейтинг:", oldRating);
    let avatar = prompt("Изменить URL-ссылку на фото сиделки:", oldAvatar);

    if (!avatar || avatar.trim() === '') {
        avatar = `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`;
    }

    try {
        const res = await fetch(`${API_URL}/sitters/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ name, experience, bio, rating, avatar })
        });
        if (res.ok) renderSitters();
    } catch (e) { console.error(e); }
}

async function deleteSitter(id) {
    if (confirm('Удалить сиделку из MongoDB?')) {
        try {
            await fetch(`${API_URL}/sitters/${id}`, { method: 'DELETE' });
            renderSitters();
        } catch (e) { console.error(e); }
    }
}

// --- 3. ПИТОМЦЫ (MONGODB) ---
async function renderPets() {
    const grid = document.getElementById('petsGrid');
    if (!grid) return;
    try {
        const res = await fetch(`${API_URL}/pets`);
        const data = await res.json();
        grid.innerHTML = data.map(p => {
            const isUrl = p.type && (p.type.startsWith('http') || p.type.startsWith('./') || p.type.startsWith('/'));

            let emoji = p.type || '🐾';
            if (!isUrl && emoji.includes(' ')) {
                emoji = emoji.split(' ')[0];
            }

            const imageHtml = isUrl
                ? `<img src="${p.type}" alt="${p.name}" class="card-image-content rounded-avatar">`
                : `<span class="avatar">${emoji}</span>`;

            // ИСПРАВЛЕНО: Передаем в функцию updatePet и старое имя, и старую породу питомца
            return `
                <div class="pet-card">
                    ${currentRole === 'admin' ? `
                    <div class="pet-actions">
                        <button class="edit-btn" onclick="updatePet('${p._id}', '${p.name}', '${p.breed || ''}')" title="Изменить">✏️</button>
                        <button class="pet-delete" onclick="deletePet('${p._id}')" title="Удалить">✕</button>
                    </div>
                    ` : ''}
                    <div class="image-container-wrapper" style="margin: 0 auto 15px;">${imageHtml}</div>
                    <h4>${p.name}</h4>
                    <p>${p.breed}</p>
                </div>
            `;
        }).join('');
    } catch (e) { console.error("Ошибка загрузки питомцев:", e); }
}

async function addPet() {
    const pet = {
        name: document.getElementById('newPetName').value,
        type: document.getElementById('newPetType').value,
        breed: document.getElementById('newPetBreed').value
    };
    if (!pet.name) return alert('Введите кличку питомца');

    const usePhoto = confirm("Хотите автоматически сгенерировать векторную аватарку для питомца вместо эмодзи?");
    if (usePhoto) {
        pet.type = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(pet.name)}`;
    }

    try {
        await fetch(`${API_URL}/pets`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(pet)
        });
        document.getElementById('newPetName').value = '';
        document.getElementById('newPetBreed').value = '';
        renderPets();
    } catch (e) { console.error(e); }
}

// ИСПРАВЛЕНО: Теперь функция принимает и изменяет как имя (кличку), так и породу питомца
async function updatePet(id, oldName, oldBreed) {
    const name = prompt("Изменить кличку питомца:", oldName);
    if (name === null) return; // Если нажали "Отмена", прерываем

    const breed = prompt("Изменить породу питомца:", oldBreed);
    if (breed === null) return;

    // Формируем объект для отправки (берем новые значения или оставляем старые, если введена пустота)
    const updatedData = {
        name: name.trim() || oldName,
        breed: breed.trim() || oldBreed
    };

    try {
        const res = await fetch(`${API_URL}/pets/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updatedData)
        });
        if (res.ok) renderPets();
    } catch (e) { console.error(e); }
}

async function deletePet(id) {
    if(confirm('Удалить питомца из базы?')) {
        try {
            await fetch(`${API_URL}/pets/${id}`, { method: 'DELETE' });
            renderPets();
        } catch (e) { console.error(e); }
    }
}

// --- 4. ЗАПИСИ НА ПРИЕМ ---
async function handleBooking(e) {
    e.preventDefault();
    const booking = {
        owner_name: document.getElementById('ownerName').value,
        phone: document.getElementById('ownerPhone').value,
        pet_name: document.getElementById('bookingPetName').value,
        service_name: document.getElementById('serviceSelect').value,
        booking_date: document.getElementById('bookingDate').value
    };

    try {
        const res = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(booking)
        });
        if (res.ok) {
            alert('Запись успешно оформлена!');
            e.target.reset();
        }
    } catch (e) { console.error(e); }
}

// --- СЛУШАТЕЛЬ ЗАГРУЗКИ СТРАНИЦЫ ---
document.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.getItem('userName')) {
        window.location.href = 'auth.html';
        return;
    }
    checkRoleDisplay();
    renderServices();
    renderSitters();
    renderPets();

    const form = document.getElementById('bookingForm');
    if (form) form.addEventListener('submit', handleBooking);
});