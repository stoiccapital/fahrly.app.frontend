// Fahrzeuge Management JavaScript

class FahrzeugeManager {
    constructor() {
        this.vehicles = this.loadVehicles();
        this.currentEditId = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.renderVehicles();
        this.updateStats();
        this.initializeSidebar();
    }

    bindEvents() {
        // Add vehicle button
        document.getElementById('addVehicleBtn').addEventListener('click', () => {
            this.openModal();
        });

        // Search functionality
        document.getElementById('searchVehicles').addEventListener('input', (e) => {
            this.filterVehicles(e.target.value);
        });

        // Filter button
        document.getElementById('filterBtn').addEventListener('click', () => {
            this.showFilterOptions();
        });

        // Modal events
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeModal();
        });

        // Form submission
        document.getElementById('vehicleForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveVehicle();
        });

        // Close modal on overlay click
        document.getElementById('vehicleModal').addEventListener('click', (e) => {
            if (e.target.id === 'vehicleModal') {
                this.closeModal();
            }
        });

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    loadVehicles() {
        const saved = localStorage.getItem('fahrzeuge');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // Sample data
        return [
            {
                id: 1,
                licensePlate: 'M-AB 1234',
                brand: 'Mercedes',
                model: 'Sprinter',
                year: 2020,
                vehicleType: 'Transporter',
                status: 'Aktiv',
                assignedDriver: 'Max Mustermann',
                nextMaintenance: '2024-03-15',
                mileage: 45000,
                fuelType: 'Diesel',
                color: 'Weiß',
                notes: 'Regelmäßige Wartung erforderlich'
            },
            {
                id: 2,
                licensePlate: 'M-CD 5678',
                brand: 'BMW',
                model: 'X5',
                year: 2021,
                vehicleType: 'Pkw',
                status: 'Verfügbar',
                assignedDriver: '',
                nextMaintenance: '2024-04-20',
                mileage: 32000,
                fuelType: 'Benzin',
                color: 'Schwarz',
                notes: 'Neuwertig'
            },
            {
                id: 3,
                licensePlate: 'M-EF 9012',
                brand: 'Volkswagen',
                model: 'Crafter',
                year: 2019,
                vehicleType: 'Transporter',
                status: 'Wartung',
                assignedDriver: 'Anna Schmidt',
                nextMaintenance: '2024-02-10',
                mileage: 78000,
                fuelType: 'Diesel',
                color: 'Blau',
                notes: 'Motorölwechsel erforderlich'
            },
            {
                id: 4,
                licensePlate: 'M-GH 3456',
                brand: 'Audi',
                model: 'A6',
                year: 2022,
                vehicleType: 'Pkw',
                status: 'Aktiv',
                assignedDriver: 'Tom Weber',
                nextMaintenance: '2024-05-05',
                mileage: 18000,
                fuelType: 'Diesel',
                color: 'Silber',
                notes: 'Firmenwagen'
            },
            {
                id: 5,
                licensePlate: 'M-IJ 7890',
                brand: 'MAN',
                model: 'TGX',
                year: 2020,
                vehicleType: 'Lkw',
                status: 'Aktiv',
                assignedDriver: 'Klaus Müller',
                nextMaintenance: '2024-03-30',
                mileage: 95000,
                fuelType: 'Diesel',
                color: 'Rot',
                notes: 'Langstreckenfahrzeug'
            }
        ];
    }

    saveVehicles() {
        localStorage.setItem('fahrzeuge', JSON.stringify(this.vehicles));
    }

    renderVehicles(vehicles = this.vehicles) {
        const tbody = document.getElementById('vehiclesTableBody');
        tbody.innerHTML = '';

        vehicles.forEach(vehicle => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${vehicle.licensePlate}</strong></td>
                <td>${vehicle.brand} ${vehicle.model}</td>
                <td>${vehicle.vehicleType}</td>
                <td><span class="status-badge status-${this.getStatusClass(vehicle.status)}">${vehicle.status}</span></td>
                <td>${vehicle.assignedDriver || '-'}</td>
                <td>${vehicle.nextMaintenance ? new Date(vehicle.nextMaintenance).toLocaleDateString('de-DE') : '-'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-small btn-view" onclick="fahrzeugeManager.viewVehicle(${vehicle.id})">Ansehen</button>
                        <button class="btn btn-small btn-edit" onclick="fahrzeugeManager.editVehicle(${vehicle.id})">Bearbeiten</button>
                        <button class="btn btn-small btn-delete" onclick="fahrzeugeManager.deleteVehicle(${vehicle.id})">Löschen</button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    getStatusClass(status) {
        switch (status) {
            case 'Aktiv': return 'active';
            case 'Wartung': return 'maintenance';
            case 'Verfügbar': return 'available';
            case 'Inaktiv': return 'inactive';
            default: return 'active';
        }
    }

    filterVehicles(searchTerm) {
        const filtered = this.vehicles.filter(vehicle => 
            vehicle.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
            vehicle.assignedDriver.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderVehicles(filtered);
    }

    showFilterOptions() {
        // Simple filter implementation - could be expanded with a dropdown
        alert('Filter-Funktion wird erweitert...');
    }

    openModal(vehicle = null) {
        const modal = document.getElementById('vehicleModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('vehicleForm');

        if (vehicle) {
            // Edit mode
            modalTitle.textContent = 'Fahrzeug bearbeiten';
            this.currentEditId = vehicle.id;
            this.populateForm(vehicle);
        } else {
            // Add mode
            modalTitle.textContent = 'Neues Fahrzeug hinzufügen';
            this.currentEditId = null;
            form.reset();
        }

        modal.classList.add('active');
    }

    closeModal() {
        const modal = document.getElementById('vehicleModal');
        modal.classList.remove('active');
        this.currentEditId = null;
    }

    populateForm(vehicle) {
        document.getElementById('licensePlate').value = vehicle.licensePlate;
        document.getElementById('brand').value = vehicle.brand;
        document.getElementById('model').value = vehicle.model;
        document.getElementById('year').value = vehicle.year;
        document.getElementById('vehicleType').value = vehicle.vehicleType;
        document.getElementById('status').value = vehicle.status;
        document.getElementById('assignedDriver').value = vehicle.assignedDriver || '';
        document.getElementById('nextMaintenance').value = vehicle.nextMaintenance || '';
        document.getElementById('mileage').value = vehicle.mileage || '';
        document.getElementById('fuelType').value = vehicle.fuelType || '';
        document.getElementById('color').value = vehicle.color || '';
        document.getElementById('notes').value = vehicle.notes || '';
    }

    saveVehicle() {
        const formData = {
            licensePlate: document.getElementById('licensePlate').value,
            brand: document.getElementById('brand').value,
            model: document.getElementById('model').value,
            year: parseInt(document.getElementById('year').value),
            vehicleType: document.getElementById('vehicleType').value,
            status: document.getElementById('status').value,
            assignedDriver: document.getElementById('assignedDriver').value,
            nextMaintenance: document.getElementById('nextMaintenance').value,
            mileage: parseInt(document.getElementById('mileage').value) || 0,
            fuelType: document.getElementById('fuelType').value,
            color: document.getElementById('color').value,
            notes: document.getElementById('notes').value
        };

        if (this.currentEditId) {
            // Update existing vehicle
            const index = this.vehicles.findIndex(v => v.id === this.currentEditId);
            if (index !== -1) {
                this.vehicles[index] = { ...this.vehicles[index], ...formData };
            }
        } else {
            // Add new vehicle
            const newVehicle = {
                id: Date.now(),
                ...formData
            };
            this.vehicles.push(newVehicle);
        }

        this.saveVehicles();
        this.renderVehicles();
        this.updateStats();
        this.closeModal();
        this.showNotification('Fahrzeug erfolgreich gespeichert!');
    }

    editVehicle(id) {
        const vehicle = this.vehicles.find(v => v.id === id);
        if (vehicle) {
            this.openModal(vehicle);
        }
    }

    viewVehicle(id) {
        const vehicle = this.vehicles.find(v => v.id === id);
        if (vehicle) {
            const details = `
Kennzeichen: ${vehicle.licensePlate}
Marke & Modell: ${vehicle.brand} ${vehicle.model}
Baujahr: ${vehicle.year}
Typ: ${vehicle.vehicleType}
Status: ${vehicle.status}
Fahrer: ${vehicle.assignedDriver || 'Kein Fahrer zugewiesen'}
Nächste Wartung: ${vehicle.nextMaintenance ? new Date(vehicle.nextMaintenance).toLocaleDateString('de-DE') : 'Nicht geplant'}
Kilometerstand: ${vehicle.mileage.toLocaleString()} km
Kraftstoff: ${vehicle.fuelType || 'Nicht angegeben'}
Farbe: ${vehicle.color || 'Nicht angegeben'}
Notizen: ${vehicle.notes || 'Keine'}
            `;
            alert('Fahrzeug Details:\n\n' + details);
        }
    }

    deleteVehicle(id) {
        if (confirm('Sind Sie sicher, dass Sie dieses Fahrzeug löschen möchten?')) {
            this.vehicles = this.vehicles.filter(v => v.id !== id);
            this.saveVehicles();
            this.renderVehicles();
            this.updateStats();
            this.showNotification('Fahrzeug erfolgreich gelöscht!');
        }
    }

    updateStats() {
        const stats = {
            active: this.vehicles.filter(v => v.status === 'Aktiv').length,
            maintenance: this.vehicles.filter(v => v.status === 'Wartung').length,
            available: this.vehicles.filter(v => v.status === 'Verfügbar').length,
            new: this.vehicles.filter(v => new Date(v.year, 0, 1) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)).length
        };

        // Update stat cards
        const statCards = document.querySelectorAll('.stat-value');
        if (statCards.length >= 4) {
            statCards[0].textContent = stats.active;
            statCards[1].textContent = stats.maintenance;
            statCards[2].textContent = stats.available;
            statCards[3].textContent = stats.new;
        }
    }

    showNotification(message) {
        // Simple notification - could be enhanced with a proper notification system
        console.log(message);
        // You could add a toast notification here
    }

    initializeSidebar() {
        // Initialize sidebar functionality manually (like fahrtenarchiv.js)
        const hamburgerMenu = document.getElementById('hamburgerMenu');
        const sidebar = document.getElementById('sidebar');
        const navLinks = document.querySelectorAll('.nav-link');
        const body = document.body;
        
        console.log('Initializing sidebar manually...');
        console.log('Hamburger menu:', hamburgerMenu);
        console.log('Sidebar:', sidebar);
        
        // Ensure initial state is correct
        if (sidebar && sidebar.classList.contains('active')) {
            body.classList.add('sidebar-open');
        } else {
            body.classList.remove('sidebar-open');
        }
        
        // Function to toggle sidebar state
        function toggleSidebar() {
            const isActive = sidebar.classList.contains('active');
            console.log('Toggle sidebar called, isActive:', isActive);
            
            if (isActive) {
                // Close sidebar
                sidebar.classList.remove('active');
                hamburgerMenu.classList.remove('active');
                body.classList.remove('sidebar-open');
            } else {
                // Open sidebar
                sidebar.classList.add('active');
                hamburgerMenu.classList.add('active');
                body.classList.add('sidebar-open');
            }
        }
        
        // Hamburger menu toggle
        if (hamburgerMenu && sidebar) {
            hamburgerMenu.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation(); // Prevent event bubbling
                console.log('Hamburger clicked!');
                toggleSidebar();
            });
        } else {
            console.error('Hamburger menu or sidebar not found!');
        }
        
        // Close sidebar when clicking outside
        document.addEventListener('click', function(e) {
            if (sidebar && sidebar.classList.contains('active') && 
                !sidebar.contains(e.target) && 
                !hamburgerMenu.contains(e.target)) {
                toggleSidebar();
            }
        });
        
        // Close sidebar on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && sidebar.classList.contains('active')) {
                toggleSidebar();
            }
        });
        
        // Handle navigation links
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                // Add active class to clicked link
                this.classList.add('active');
                
                // Close sidebar on mobile after navigation
                if (window.innerWidth <= 768) {
                    setTimeout(() => {
                        toggleSidebar();
                    }, 300); // Small delay for smooth transition
                }
            });
        });
        
        // Handle window resize
        window.addEventListener('resize', function() {
            // Close sidebar on mobile when switching to desktop
            if (window.innerWidth > 768 && sidebar.classList.contains('active')) {
                body.classList.remove('sidebar-open');
            }
        });
    }
}

// Initialize the Fahrzeuge Manager
let fahrzeugeManager;

document.addEventListener('DOMContentLoaded', () => {
    fahrzeugeManager = new FahrzeugeManager();
});

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FahrzeugeManager;
} 