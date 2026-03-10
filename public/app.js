/**
 * ════════════════════════════════════════════════════════════════════════════
 *                          POKETEAM - APPLICATION JS
 * ════════════════════════════════════════════════════════════════════════════
 * 
 * Application JavaScript principale pour PokeTeam
 * Gestion de l'authentification, du Pokédex, des équipes et des favoris
 * ════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// VARIABLES GLOBALES
// ═══════════════════════════════════════════════════════════════════════════

const API_URL = 'http://localhost:3000/api';
let currentPage = 1;
const limit = 20;
let allStats = null;
let allPokemons = [];
let token = localStorage.getItem('token');
let currentUser = null;
let selectedTeamPokemons = [];
let editingTeamId = null;
let currentPokemonDetail = null;

// ═══════════════════════════════════════════════════════════════════════════
// INITIALISATION
// ═══════════════════════════════════════════════════════════════════════════

window.addEventListener('load', () => {
    checkAuth();
    loadStats();
    loadPokemons();
    loadAllPokemons();
});

// ═══════════════════════════════════════════════════════════════════════════
// AUTHENTIFICATION
// ═══════════════════════════════════════════════════════════════════════════

async function checkAuth() {
    if (!token) {
        document.getElementById('authButtons').style.display = 'flex';
        document.getElementById('userInfo').style.display = 'none';
        document.getElementById('tabsContainer').style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            currentUser = await response.json();
            displayUserInfo();
            document.getElementById('authButtons').style.display = 'none';
            document.getElementById('userInfo').style.display = 'flex';
            document.getElementById('tabsContainer').style.display = 'flex';
        } else {
            logout();
        }
    } catch (error) {
        console.error('Auth check error:', error);
        logout();
    }
}

function displayUserInfo() {
    document.getElementById('userName').textContent = `Bienvenue, ${currentUser.firstName}!`;
    document.getElementById('userAvatar').textContent = currentUser.firstName[0].toUpperCase();
}

function openAuthModal(tab) {
    document.getElementById('authModal').classList.add('active');
    switchAuthTab(tab);
}

function closeAuthModal() {
    document.getElementById('authModal').classList.remove('active');
    document.getElementById('errorMessage').innerHTML = '';
}

function switchAuthTab(tab) {
    document.querySelectorAll('.auth-tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(tab + 'Form').classList.add('active');
}

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        token = data.token;
        localStorage.setItem('token', token);
        currentUser = data.user;
        closeAuthModal();
        checkAuth();
        loadTeams();
    } catch (error) {
        document.getElementById('errorMessage').innerHTML = 
            `<div class="error-message">${error.message}</div>`;
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('registerUsername').value;
    const firstName = document.getElementById('registerFirstName').value;
    const lastName = document.getElementById('registerLastName').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, firstName, lastName, password })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error);
        }

        document.getElementById('errorMessage').innerHTML = 
            `<div class="success-message">Compte créé! Veuillez vous connecter.</div>`;
        
        setTimeout(() => {
            switchAuthTab('login');
        }, 1000);
    } catch (error) {
        document.getElementById('errorMessage').innerHTML = 
            `<div class="error-message">${error.message}</div>`;
    }
}

function logout() {
    token = null;
    currentUser = null;
    localStorage.removeItem('token');
    checkAuth();
    switchTab('pokedex');
}

// ═══════════════════════════════════════════════════════════════════════════
// POKÉDEX
// ═══════════════════════════════════════════════════════════════════════════

async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/pokemons/stats/overview`);
        allStats = await response.json();
        displayStats();
    } catch (error) {
        console.error('Stats error:', error);
    }
}

function displayStats() {
    if (!allStats) return;

    const html = `
        <div class="stat-card">
            <div class="stat-label">Total Pokémons</div>
            <div class="stat-value">${allStats.totalPokemons}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">HP Moyen</div>
            <div class="stat-value">${Math.round(allStats.avgHP)}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Attaque Moyenne</div>
            <div class="stat-value">${Math.round(allStats.avgAttack)}</div>
        </div>
        <div class="stat-card">
            <div class="stat-label">Max Attaque</div>
            <div class="stat-value">${allStats.maxAttack}</div>
        </div>
    `;

    document.getElementById('statsContainer').innerHTML = html;
}

async function loadAllPokemons() {
    try {
        let page = 1;
        let allData = [];
        let totalPages = 1;

        while (page <= totalPages) {
            const response = await fetch(`${API_URL}/pokemons?page=${page}&limit=50`);
            const data = await response.json();
            allData = allData.concat(data.data);
            totalPages = data.totalPages;
            page++;
        }

        allPokemons = allData;
        populatePokemonSelect();
    } catch (error) {
        console.error('Error loading all pokemons:', error);
    }
}

function populatePokemonSelect() {
    const select = document.getElementById('addPokemonSelect');
    select.innerHTML = '<option value="">-- Sélectionner un Pokémon --</option>';
    
    allPokemons.forEach(pokemon => {
        const option = document.createElement('option');
        option.value = pokemon.id;
        option.textContent = `${pokemon.name.french} (#${pokemon.id})`;
        select.appendChild(option);
    });
}

async function loadPokemons() {
    try {
        const type = document.getElementById('searchType').value;
        const name = document.getElementById('searchName').value;
        const sort = document.getElementById('sortBy').value;

        let url = `${API_URL}/pokemons?page=${currentPage}&limit=${limit}`;
        if (type) url += `&type=${type}`;
        if (name) url += `&name=${name}`;
        if (sort) url += `&sort=${sort}`;

        const response = await fetch(url);
        const data = await response.json();

        displayPokemons(data.data, data.totalPages, data.page);
    } catch (error) {
        console.error('Pokemons load error:', error);
        document.getElementById('pokemonGrid').innerHTML = '<p>Erreur de chargement</p>';
    }
}

function displayPokemons(pokemons, totalPages, currentPageNum) {
    const html = pokemons.map(pokemon => `
        <div class="pokemon-card" data-type="${pokemon.type.map(t => t.toLowerCase()).join(' ')}" onclick="showPokemonDetail(${pokemon.id})">
            <div class="card-reflection-streak"></div>
            <div class="pokemon-id">#${String(pokemon.id).padStart(3, '0')}</div>
            <div class="pokemon-image">
                <img src="http://localhost:3000/assets/pokemons/${pokemon.id}.png" 
                     alt="${pokemon.name.french}"
                     onerror="this.src='https://via.placeholder.com/120?text=No+Image'">
            </div>
            <div class="pokemon-name">${pokemon.name.french}</div>
            <div class="pokemon-types">
                ${pokemon.type.map(t => `<span class="type-badge type-${t.toLowerCase()}">${t}</span>`).join('')}
            </div>
        </div>
    `).join('');

    document.getElementById('pokemonGrid').innerHTML = html;

    // Afficher la pagination
    let paginationHtml = '';
    for (let i = 1; i <= totalPages; i++) {
        paginationHtml += `<button class="pagination-btn ${i === currentPageNum ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }
    document.getElementById('pagination').innerHTML = paginationHtml;
}

async function showPokemonDetail(id) {
    try {
        const response = await fetch(`${API_URL}/pokemons/${id}`);
        const pokemon = await response.json();
        currentPokemonDetail = pokemon;

        // Check if this pokemon is in favorites
        let isFavorite = false;
        if (token) {
            try {
                const favResponse = await fetch(`${API_URL}/auth/favorites`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const favorites = await favResponse.json();
                isFavorite = favorites.includes(pokemon.id);
            } catch (e) {
                console.log('Could not check favorites:', e);
            }
        }

        const html = `
            <div class="pokemon-modal-hero">
                <div class="modal-image" data-type="${pokemon.type[0].toLowerCase()}">
                    <img src="http://localhost:3000/assets/pokemons/${pokemon.id}.png" 
                         alt="${pokemon.name.french}">
                </div>
                <div class="pokemon-modal-name">
                    ${pokemon.name.french}
                </div>
                <div class="pokemon-modal-types">
                    ${pokemon.type.map(t => `<span class="type-badge type-${t.toLowerCase()}">${t}</span>`).join('')}
                </div>
            </div>
            <div class="pokemon-modal-stats">
                <div class="pokemon-stat-card">
                    <div class="pokemon-stat-label">HP</div>
                    <div class="pokemon-stat-value">${pokemon.base.HP}</div>
                </div>
                <div class="pokemon-stat-card">
                    <div class="pokemon-stat-label">Attaque</div>
                    <div class="pokemon-stat-value">${pokemon.base.Attack}</div>
                </div>
                <div class="pokemon-stat-card">
                    <div class="pokemon-stat-label">Défense</div>
                    <div class="pokemon-stat-value">${pokemon.base.Defense}</div>
                </div>
                <div class="pokemon-stat-card">
                    <div class="pokemon-stat-label">Vitesse</div>
                    <div class="pokemon-stat-value">${pokemon.base.Speed}</div>
                </div>
            </div>
            <div class="pokemon-modal-actions">
                <button class="btn-add-to-team ${isFavorite ? 'btn-favorite-active' : 'btn-favorite-default'}" id="favBtn" onclick="toggleFavorite(${pokemon.id})">
                    ${isFavorite ? 'Retirer des Favoris' : 'Ajouter aux Favoris'}
                </button>
                <button class="btn-add-to-team" onclick="addPokemonToExistingTeam(${pokemon.id})">Ajouter à une équipe</button>
                <button class="btn-add-to-team btn-team-create" onclick="createNewTeamWithPokemon(${pokemon.id})">Créer équipe avec ce Pokémon</button>
            </div>
        `;

        document.getElementById('modalTitle').textContent = `${pokemon.name.french}`;
        document.getElementById('modalPokemon').innerHTML = html;
        document.getElementById('pokemonModal').classList.add('active');
    } catch (error) {
        console.error('Pokemon detail error:', error);
    }
}

function closePokemonModal() {
    document.getElementById('pokemonModal').classList.remove('active');
}

function goToPage(page) {
    currentPage = page;
    loadPokemons();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ═══════════════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════

function switchTab(tab) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(el => el.classList.remove('active'));
    
    document.getElementById(tab + '-tab').classList.add('active');
    event.target.classList.add('active');

    if (tab === 'teams' && currentUser) {
        loadTeams();
    }
    if (tab === 'favorites' && currentUser) {
        loadFavorites();
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// ÉQUIPES
// ═══════════════════════════════════════════════════════════════════════════

async function loadTeams() {
    if (!token) {
        document.getElementById('teamsList').innerHTML = 
            '<div class="empty-message">Veuillez vous connecter pour voir vos équipes.</div>';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/teams`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to load teams');

        const teams = await response.json();
        displayTeams(teams);
    } catch (error) {
        console.error('Load teams error:', error);
        document.getElementById('teamsList').innerHTML = 
            '<div class="empty-message">Erreur lors du chargement des équipes.</div>';
    }
}

function displayTeams(teams) {
    if (teams.length === 0) {
        document.getElementById('teamsList').innerHTML = 
            '<div class="empty-message">Aucune équipe créée. Commencez par en créer une!</div>';
        return;
    }

    const html = teams.map(team => `
        <div class="team-card">
            <div class="team-header">
                <div class="team-name">${team.name}</div>
                <div class="team-actions">
                    <button class="btn-small btn-edit" onclick="editTeam('${team._id}')">Modifier</button>
                    <button class="btn-small btn-delete" onclick="deleteTeam('${team._id}')">Supprimer</button>
                </div>
            </div>
            <div class="team-pokemons" id="team-${team._id}">
                ${team.pokemons.map(pokemonId => {
                    const pokemon = allPokemons.find(p => p.id === pokemonId);
                    if (!pokemon) return '';
                    return `
                        <div class="team-pokemon-item">
                            <div class="pokemon-info">
                                <div class="pokemon-mini-image">
                                    <img src="http://localhost:3000/assets/pokemons/${pokemon.id}.png" 
                                         alt="${pokemon.name.french}">
                                </div>
                                <div class="pokemon-details">
                                    <div class="pokemon-mini-name">${pokemon.name.french}</div>
                                    <div class="pokemon-mini-type">
                                        ${pokemon.type.map(t => `<span class="type-badge type-${t.toLowerCase()}">${t}</span>`).join('')}
                                    </div>
                                </div>
                            </div>
                            <button class="btn-remove" onclick="removePokemonFromTeam('${team._id}', ${pokemonId})">Retirer</button>
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="team-count">${team.pokemons.length}/6 Pokémons</div>
        </div>
    `).join('');

    document.getElementById('teamsList').innerHTML = html;
}

function openTeamModal() {
    if (!token) {
        openAuthModal('login');
        return;
    }

    if (allPokemons.length === 0) {
        alert('Veuillez attendre le chargement de la liste des Pokémons...');
        setTimeout(() => {
            loadAllPokemons().then(() => openTeamModal());
        }, 1000);
        return;
    }

    editingTeamId = null;
    selectedTeamPokemons = [];
    document.getElementById('teamModalTitle').textContent = 'Créer une Équipe';
    document.getElementById('teamName').value = '';
    document.getElementById('addPokemonSelect').value = '';
    document.getElementById('selectedPokemonsList').innerHTML = '';
    document.getElementById('pokemonCount').textContent = '0';
    document.getElementById('teamModal').classList.add('active');
    displaySelectedPokemons();
}

async function editTeam(teamId) {
    try {
        const response = await fetch(`${API_URL}/teams/${teamId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error('Impossible de charger l\'équipe');
        }

        const team = await response.json();
        
        editingTeamId = teamId;
        selectedTeamPokemons = [...team.pokemons];
        document.getElementById('teamModalTitle').textContent = 'Modifier l\'Équipe: ' + team.name;
        document.getElementById('teamName').value = team.name;
        document.getElementById('addPokemonSelect').value = '';
        displaySelectedPokemons();
        document.getElementById('teamModal').classList.add('active');
    } catch (error) {
        console.error('Edit team error:', error);
        alert('Erreur: ' + error.message);
    }
}

function closeTeamModal() {
    document.getElementById('teamModal').classList.remove('active');
    editingTeamId = null;
    selectedTeamPokemons = [];
}

function addPokemonToTeam() {
    const select = document.getElementById('addPokemonSelect');
    const pokemonId = parseInt(select.value);

    if (!pokemonId) {
        alert('Sélectionnez un Pokémon d\'abord!');
        return;
    }

    if (selectedTeamPokemons.length >= 6) {
        alert('Maximum 6 Pokémons par équipe!');
        return;
    }

    if (selectedTeamPokemons.includes(pokemonId)) {
        alert('Ce Pokémon est déjà dans l\'équipe!');
        return;
    }

    selectedTeamPokemons.push(pokemonId);
    select.value = '';
    displaySelectedPokemons();
}

function removeSelectedPokemon(pokemonId) {
    selectedTeamPokemons = selectedTeamPokemons.filter(id => id !== pokemonId);
    displaySelectedPokemons();
}

function displaySelectedPokemons() {
    document.getElementById('pokemonCount').textContent = selectedTeamPokemons.length;

    if (selectedTeamPokemons.length === 0) {
        document.getElementById('selectedPokemonsList').innerHTML = 
            '<div class="selected-pokemon-empty">Aucun Pokémon sélectionné</div>';
        return;
    }

    const html = selectedTeamPokemons.map((pokemonId, index) => {
        const pokemon = allPokemons.find(p => p.id === pokemonId);
        if (!pokemon) return '';
        return `
            <div class="selected-pokemon-item">
                <div class="selected-pokemon-main">
                    <div class="selected-pokemon-index">${index + 1}.</div>
                    <div class="pokemon-mini-image selected-pokemon-image">
                        <img src="http://localhost:3000/assets/pokemons/${pokemon.id}.png" 
                             alt="${pokemon.name.french}">
                    </div>
                    <div class="pokemon-details">
                        <div class="pokemon-mini-name">${pokemon.name.french}</div>
                    </div>
                </div>
                <button type="button" class="btn-remove" onclick="removeSelectedPokemon(${pokemonId})">✕ Retirer</button>
            </div>
        `;
    }).join('');

    document.getElementById('selectedPokemonsList').innerHTML = html;
}

async function handleTeamSubmit(e) {
    e.preventDefault();

    if (!token) {
        openAuthModal('login');
        return;
    }

    const name = document.getElementById('teamName').value.trim();
    const pokemons = selectedTeamPokemons;

    // Validations
    if (!name) {
        alert('Le nom de l\'équipe est requis!');
        return;
    }

    if (pokemons.length === 0) {
        alert('Vous devez ajouter au moins un Pokémon!');
        return;
    }

    if (pokemons.length > 6) {
        alert('Maximum 6 Pokémons par équipe!');
        return;
    }

    console.log('Submitting team:', { name, pokemons, editingTeamId });

    try {
        const method = editingTeamId ? 'PUT' : 'POST';
        const url = editingTeamId 
            ? `${API_URL}/teams/${editingTeamId}`
            : `${API_URL}/teams`;

        console.log('Request:', { method, url, body: { name, pokemons } });

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, pokemons })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('API Error:', data);
            throw new Error(data.error || 'Erreur lors de la sauvegarde');
        }

        console.log('Success:', data);
        closeTeamModal();
        await loadTeams();
        showPremiumToast('Equipe creee avec succes!');
        triggerCaptureRing(document.querySelector('.btn-primary'));
    } catch (error) {
        console.error('Team save error:', error);
        alert('Erreur: ' + error.message);
    }
}

async function deleteTeam(teamId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette équipe?')) return;

    try {
        const response = await fetch(`${API_URL}/teams/${teamId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to delete team');

        loadTeams();
    } catch (error) {
        console.error('Delete team error:', error);
        alert('Erreur lors de la suppression');
    }
}

async function removePokemonFromTeam(teamId, pokemonId) {
    try {
        const response = await fetch(`${API_URL}/teams/${teamId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const team = await response.json();
        team.pokemons = team.pokemons.filter(id => id !== pokemonId);

        const updateResponse = await fetch(`${API_URL}/teams/${teamId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name: team.name, pokemons: team.pokemons })
        });

        if (!updateResponse.ok) throw new Error('Failed to update team');

        loadTeams();
    } catch (error) {
        console.error('Remove pokemon error:', error);
    }
}

async function addPokemonToExistingTeam(pokemonId) {
    if (!token) {
        alert('Veuillez vous connecter d\'abord');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/teams`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const teams = await response.json();

        if (teams.length === 0) {
            alert('Créez d\'abord une équipe!');
            return;
        }

        // Show a simple dropdown to select team
        let teamOptions = teams.map(t => `<option value="${t._id}">${t.name} (${t.pokemons.length}/6)</option>`).join('');
        const teamId = prompt(`Sélectionnez une équipe:\n\n${teams.map(t => `${t.name} (${t.pokemons.length}/6)`).join('\n')}\n\nID de l'équipe (${teams.map(t => `${t._id.substring(0, 8)}=${t.name}`).join(', ')})`);

        if (!teamId) return;

        // Ajouter le pokémon à l'équipe
        const team = teams.find(t => t._id === teamId);
        if (!team) {
            alert('Équipe non trouvée');
            return;
        }

        if (team.pokemons.length >= 6) {
            alert('Cette équipe a déjà 6 Pokémons!');
            return;
        }

        if (team.pokemons.includes(pokemonId)) {
            alert('Ce Pokémon est déjà dans cette équipe!');
            return;
        }

        team.pokemons.push(pokemonId);

        const updateResponse = await fetch(`${API_URL}/teams/${teamId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name: team.name, pokemons: team.pokemons })
        });

        if (!updateResponse.ok) throw new Error('Failed to update team');

        document.getElementById('pokemonModal').classList.remove('active');
        await loadTeams();
        showPremiumToast('Pokemon ajoute a l\'equipe!');
    } catch (error) {
        console.error('Add pokemon to team error:', error);
        alert('Erreur: ' + error.message);
    }
}

async function createNewTeamWithPokemon(pokemonId) {
    if (!token) {
        alert('Veuillez vous connecter d\'abord');
        return;
    }

    const teamName = prompt('Nom de la nouvelle équipe:');
    if (!teamName || teamName.trim() === '') return;

    try {
        const createResponse = await fetch(`${API_URL}/teams`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name: teamName, pokemons: [pokemonId] })
        });

        if (!createResponse.ok) throw new Error('Failed to create team');

        document.getElementById('pokemonModal').classList.remove('active');
        await loadTeams();
        alert('Équipe créée avec le Pokémon!');
    } catch (error) {
        console.error('Create team with pokemon error:', error);
        alert('Erreur: ' + error.message);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// FAVORIS
// ═══════════════════════════════════════════════════════════════════════════

async function loadFavorites() {
    if (!token) {
        document.getElementById('favoritesGrid').innerHTML = 
            '<div class="empty-message">Veuillez vous connecter pour voir vos favoris.</div>';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/auth/favorites`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to load favorites');

        const favoriteIds = await response.json();
        
        if (favoriteIds.length === 0) {
            document.getElementById('favoritesGrid').innerHTML = 
                '<div class="empty-message">Aucun Pokémon favori. Ajoutez-en depuis le Pokédex!</div>';
            return;
        }

        // Fetch Pokemon details for each favorite
        const pokemonPromises = favoriteIds.map(id => 
            fetch(`${API_URL}/pokemons/${id}`).then(res => res.json())
        );
        const pokemons = await Promise.all(pokemonPromises);
        displayFavorites(pokemons);
    } catch (error) {
        console.error('Load favorites error:', error);
        document.getElementById('favoritesGrid').innerHTML = 
            '<div class="empty-message">Erreur lors du chargement des favoris.</div>';
    }
}

function displayFavorites(pokemons) {
    const html = pokemons.map(pokemon => `
        <div class="pokemon-card" data-type="${pokemon.type.map(t => t.toLowerCase()).join(' ')}" onclick="showPokemonDetail(${pokemon.id})">
            <div class="card-reflection-streak"></div>
            <div class="pokemon-id">#${String(pokemon.id).padStart(3, '0')}</div>
            <div class="pokemon-image">
                <img src="http://localhost:3000/assets/pokemons/${pokemon.id}.png" 
                     alt="${pokemon.name.french}">
            </div>
            <div class="pokemon-name">${pokemon.name.french}</div>
            <div class="pokemon-types">
                ${pokemon.type.map(t => `<span class="type-badge type-${t.toLowerCase()}">${t}</span>`).join('')}
            </div>
        </div>
    `).join('');

    document.getElementById('favoritesGrid').innerHTML = html;
}

async function toggleFavorite(pokemonId) {
    if (!token) {
        alert('Veuillez vous connecter d\'abord');
        return;
    }

    try {
        // Check if already favorite
        const favResponse = await fetch(`${API_URL}/auth/favorites`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const favorites = await favResponse.json();

        let response;
        if (favorites.includes(pokemonId)) {
            // Remove from favorites
            response = await fetch(`${API_URL}/auth/favorites/${pokemonId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                alert('Pokémon retiré des favoris!');
                // Refresh modal
                showPokemonDetail(pokemonId);
            }
        } else {
            // Add to favorites
            response = await fetch(`${API_URL}/auth/favorites/${pokemonId}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                showPremiumToast('Pokemon ajoute aux favoris!');
                // Refresh modal
                showPokemonDetail(pokemonId);
            }
        }

        if (!response.ok) throw new Error('Failed to toggle favorite');
    } catch (error) {
        console.error('Toggle favorite error:', error);
        alert('Erreur: ' + error.message);
    }
}

// ═══════════════════════════════════════════════════════════════════════════
// EVENT LISTENERS
// ═══════════════════════════════════════════════════════════════════════════

document.getElementById('searchName').addEventListener('input', () => {
    currentPage = 1;
    loadPokemons();
});

document.getElementById('searchType').addEventListener('change', () => {
    currentPage = 1;
    loadPokemons();
});

document.getElementById('sortBy').addEventListener('change', () => {
    currentPage = 1;
    loadPokemons();
});

// Close modals on outside click
[document.getElementById('authModal'), document.getElementById('pokemonModal'), document.getElementById('teamModal')].forEach(modal => {
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
});

// ═══════════════════════════════════════════════════════════════════════════
// EFFETS SIGNATURE AAA (SKILLS.MD)
// ═══════════════════════════════════════════════════════════════════════════

// Curseur personnalisé premium
function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = `
        <div class="cursor-ring"></div>
        <div class="cursor-dot"></div>
    `;
    document.body.appendChild(cursor);

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
}

// Toast premium (skills.md)
function showPremiumToast(message, duration = 3000) {
    const toast = document.createElement('div');
    toast.className = 'premium-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'toast-enter 0.3s reverse';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Capture ring burst effect (skills.md microinteraction)
function triggerCaptureRing(triggerEl) {
    // Feedback haptique visuel
    triggerEl.style.transform = 'scale(0.97)';
    setTimeout(() => triggerEl.style.transform = '', 120);
    
    // Ring d'expansion
    const ring = document.createElement('div');
    ring.className = 'capture-ring-burst';
    const rect = triggerEl.getBoundingClientRect();
    ring.style.left = (rect.left + rect.width/2) + 'px';
    ring.style.top = (rect.top + rect.height/2) + 'px';
    document.body.appendChild(ring);
    
    setTimeout(() => ring.remove(), 700);
}

// Initialiser au chargement
window.addEventListener('load', () => {
    initCustomCursor();
});
