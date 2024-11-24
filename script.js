class CalcolatoreMutuo {
    constructor() {
        this.verificaElementiHTML = () => {
            const elementiRichiesti = [
                'mutuo-form',
                'importo',
                'tasso',
                'durata',
                'extra',
                'sommario',
                'mutuoChart',
                'dettaglio-tabella'
            ];
            
            return elementiRichiesti.every(id => document.getElementById(id));
        };

        if (!this.verificaElementiHTML()) {
            console.error('Elementi HTML mancanti.');
            return;
        }
        
        this.form = document.getElementById('mutuo-form');
        this.chart = null;
        this.ultimiRisultati = null;
        
        this.inizializzaEventi();
        this.inizializzaGestioneMobile();
        this.inizializzaSelettoreTipoDebito();
    }

    inizializzaEventi() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.calcolaRisultati();
        });

        this.form.addEventListener('reset', () => {
            if (this.chart) {
                this.chart.destroy();
            }
            document.getElementById('sommario').innerHTML = '';
            document.getElementById('dettaglio-tabella').innerHTML = '';
        });
    }

    calcolaRisultati() {
        // Ottieni i valori dal form
        const importo = parseFloat(document.getElementById('importo').value);
        const tasso = parseFloat(document.getElementById('tasso').value);
        const anni = parseInt(document.getElementById('durata').value);
        const extra = parseFloat(document.getElementById('extra').value) || 0;

        if (importo && tasso && anni) {
            try {
                const rataMensile = this.calcolaRataMensile(importo, tasso, anni);
                const risultati = this.calcolaAmmortamento(importo, tasso, anni, extra);
                
                this.mostraRisultati(risultati);
                this.ultimiRisultati = risultati;
            } catch (error) {
                console.error('Errore nel calcolo:', error);
                alert('Si è verificato un errore nel calcolo. Verifica i dati inseriti.');
            }
        } else {
            alert('Inserisci tutti i dati richiesti');
        }
    }

    creaSlider(id, config) {
        const container = document.createElement('div');
        container.className = 'slider-container';
        
        const labelContainer = document.createElement('div');
        labelContainer.className = 'd-flex justify-content-between align-items-center';
        
        const label = document.createElement('label');
        label.textContent = this.getLabelText(id);
        label.className = 'form-label';
        
        const valueDisplay = document.createElement('span');
        valueDisplay.className = 'value-display';
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.className = 'form-range';
        slider.id = `${id}-slider`;
        slider.min = config.min;
        slider.max = config.max;
        slider.step = config.step;
        slider.value = config.default;
        
        const input = document.getElementById(id);
        input.value = config.default;
        valueDisplay.textContent = this.formattaValore(id, config.default);
        
        // Gestione eventi semplificata
        const updateValue = (value) => {
            const validValue = Math.min(Math.max(value, config.min), config.max);
            slider.value = validValue;
            input.value = validValue;
            valueDisplay.textContent = this.formattaValore(id, validValue);
            this.calcolaRisultatiLive();
        };

        // Eventi per input numerico
        input.addEventListener('input', (e) => {
            updateValue(e.target.value);
        });

        // Eventi per slider
        slider.addEventListener('input', (e) => {
            updateValue(e.target.value);
        });

        // Gestione touch specifica per mobile
        if ('ontouchstart' in window) {
            slider.addEventListener('touchstart', (e) => {
                e.stopPropagation();
            }, { passive: true });

            slider.addEventListener('touchmove', (e) => {
                e.stopPropagation();
            }, { passive: true });
        }
        
        labelContainer.appendChild(label);
        labelContainer.appendChild(valueDisplay);
        container.appendChild(labelContainer);
        container.appendChild(slider);
        input.parentNode.appendChild(container);
    }

    getLabelText(id) {
        const labels = {
            importo: 'Importo del finanziamento',
            tasso: 'Tasso di interesse annuale',
            durata: 'Durata del finanziamento',
            extra: 'Pagamento extra annuale'
        };
        return labels[id] || id.charAt(0).toUpperCase() + id.slice(1);
    }

    formattaValore(tipo, valore) {
        switch(tipo) {
            case 'importo':
            case 'reddito':
                return this.formattaValuta(valore);
            case 'tasso':
                return `${valore}%`;
            case 'durata':
                return `${valore} anni`;
            default:
                return valore;
        }
    }

    formattaValuta(valore) {
        return new Intl.NumberFormat('it-IT', {
            style: 'currency',
            currency: 'EUR'
        }).format(valore);
    }

    calcolaAmmortamento(importo, tassoAnnuale, anni, extraAnnuale) {
        const rataMensile = this.calcolaRataMensile(importo, tassoAnnuale, anni);
        const tassoMensile = tassoAnnuale / 12 / 100;
        
        let saldoStandard = importo;
        let saldoConExtra = importo;
        let interessiTotaliStandard = 0;
        let interessiTotaliExtra = 0;
        
        const risultati = [];
        
        for (let anno = 1; anno <= anni && (saldoStandard > 0 || saldoConExtra > 0); anno++) {
            // Calcolo standard
            for (let mese = 1; mese <= 12 && saldoStandard > 0; mese++) {
                const interessiMese = saldoStandard * tassoMensile;
                interessiTotaliStandard += interessiMese;
                const capitaleMese = Math.min(rataMensile - interessiMese, saldoStandard);
                saldoStandard = Math.max(0, saldoStandard - capitaleMese);
            }
            
            // Calcolo con extra
            for (let mese = 1; mese <= 12 && saldoConExtra > 0; mese++) {
                const interessiMese = saldoConExtra * tassoMensile;
                interessiTotaliExtra += interessiMese;
                const capitaleMese = Math.min(rataMensile - interessiMese, saldoConExtra);
                saldoConExtra = Math.max(0, saldoConExtra - capitaleMese);
                
                // Applica il pagamento extra alla fine dell'anno
                if (mese === 12 && saldoConExtra > 0) {
                    saldoConExtra = Math.max(0, saldoConExtra - extraAnnuale);
                }
            }
            
            risultati.push({
                anno,
                rataMensile,
                saldoStandard: Math.round(saldoStandard * 100) / 100,
                saldoConExtra: Math.round(saldoConExtra * 100) / 100,
                interessiTotaliStandard: Math.round(interessiTotaliStandard * 100) / 100,
                interessiTotaliExtra: Math.round(interessiTotaliExtra * 100) / 100,
                risparmioInteressi: Math.round((interessiTotaliStandard - interessiTotaliExtra) * 100) / 100
            });
        }
        
        return risultati;
    }

    mostraRisultati(risultati) {
        // Trova l'ultimo anno con saldo extra > 0
        const durataEffettiva = risultati.findIndex(r => r.saldoConExtra <= 0) + 1;
        const durataStandard = risultati.length;
        const anniRisparmiati = durataStandard - durataEffettiva;
        
        const sommario = document.getElementById('sommario');
        sommario.innerHTML = `
            <div class="col-md-3 col-6">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Rata Mensile</h5>
                        <p class="card-text">${this.formattaValuta(risultati[0].rataMensile)}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3 col-6">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Interessi Totali</h5>
                        <p class="card-text">${this.formattaValuta(risultati[risultati.length - 1].interessiTotaliStandard)}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3 col-6">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Risparmio Totale</h5>
                        <p class="card-text">${this.formattaValuta(risultati[risultati.length - 1].risparmioInteressi)}</p>
                    </div>
                </div>
            </div>
            <div class="col-md-3 col-6">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Durata Effettiva</h5>
                        <p class="card-text">${durataEffettiva} anni (-${anniRisparmiati} anni)</p>
                    </div>
                </div>
            </div>
        `;

        this.aggiornaGrafico(risultati);
        this.aggiornaTabella(risultati);
    }

    aggiornaGrafico(risultati) {
        const ctx = document.getElementById('mutuoChart').getContext('2d');
        
        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: risultati.map(r => `Anno ${r.anno}`),
                datasets: [{
                    label: 'Piano Standard',
                    data: risultati.map(r => r.saldoStandard),
                    borderColor: '#2563eb',
                    tension: 0.1
                }, {
                    label: 'Piano con Extra',
                    data: risultati.map(r => r.saldoConExtra),
                    borderColor: '#10b981',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    calcolaRataMensile(importo, tassoAnnuale, anni) {
        const tassoMensile = tassoAnnuale / 12 / 100;
        const numeroRate = anni * 12;
        
        if (tassoMensile === 0) {
            return importo / numeroRate;
        }
        
        return (importo * tassoMensile * Math.pow(1 + tassoMensile, numeroRate)) / 
               (Math.pow(1 + tassoMensile, numeroRate) - 1);
    }

    calcolaTotaleInteressi(risultati) {
        let totaleInteressi = 0;
        for (const r of risultati) {
            totaleInteressi += (r.saldoStandard - r.saldoConExtra);
        }
        return totaleInteressi;
    }

    inizializzaSliders() {
        const configurazioni = {
            importo: { min: 50000, max: 1000000, step: 1000, default: 200000 },
            tasso: { min: 0.1, max: 10, step: 0.1, default: 3.5 },
            durata: { min: 5, max: 30, step: 1, default: 20 },
            extra: { min: 0, max: 10000, step: 100, default: 0 }
        };

        for (const [id, config] of Object.entries(configurazioni)) {
            this.creaSlider(id, config);
        }
    }

    verificaElementiHTML() {
        const elementiNecessari = [
            'mutuo-form',
            'importo',
            'tasso',
            'durata',
            'extra',
            'sommario',
            'dettaglio-tabella',
            'mutuoChart'
        ];

        for (const id of elementiNecessari) {
            const elemento = document.getElementById(id);
            if (!elemento) {
                console.error(`Elemento mancante: ${id}`);
                return false;
            }
        }
        return true;
    }

    inizializzaGestioneMobile() {
        if ('ontouchstart' in window) {
            // Previeni il bounce dello scroll orizzontale
            document.addEventListener('touchmove', (e) => {
                if (Math.abs(e.touches[0].clientX) > 10) {
                    e.preventDefault();
                }
            }, { passive: false });

            // Gestisci meglio gli input su mobile
            document.querySelectorAll('input[type="range"], input[type="number"]').forEach(input => {
                input.addEventListener('touchstart', (e) => {
                    e.stopPropagation();
                }, { passive: true });
            });

            // Ottimizza il grafico per mobile
            if (window.innerWidth < 768) {
                Chart.defaults.font.size = 12;
                Chart.defaults.plugins.legend.position = 'bottom';
            }
        }
    }

    inizializzaSelettoreTipoDebito() {
        const tipoDebito = document.getElementById('tipo-debito');
        const importoLabel = document.getElementById('importo-label');
        
        // Configurazioni per tipo di debito
        const configurazioni = {
            mutuo: {
                importoMin: 50000,
                importoMax: 1000000,
                importoDefault: 200000,
                tassoMin: 0.1,
                tassoMax: 10,
                durataMax: 30,
                label: 'Importo mutuo (€)'
            },
            prestito: {
                importoMin: 1000,
                importoMax: 100000,
                importoDefault: 20000,
                tassoMin: 1,
                tassoMax: 15,
                durataMax: 10,
                label: 'Importo prestito (€)'
            },
            auto: {
                importoMin: 5000,
                importoMax: 150000,
                importoDefault: 30000,
                tassoMin: 1,
                tassoMax: 12,
                durataMax: 7,
                label: 'Importo finanziamento (€)'
            },
            altro: {
                importoMin: 1000,
                importoMax: 500000,
                importoDefault: 10000,
                tassoMin: 0.1,
                tassoMax: 20,
                durataMax: 15,
                label: 'Importo debito (€)'
            }
        };

        tipoDebito.addEventListener('change', (e) => {
            const config = configurazioni[e.target.value];
            
            // Aggiorna i limiti degli input
            const importoInput = document.getElementById('importo');
            const durataInput = document.getElementById('durata');
            const tassoInput = document.getElementById('tasso');
            
            importoInput.min = config.importoMin;
            importoInput.max = config.importoMax;
            importoInput.value = config.importoDefault;
            
            durataInput.max = config.durataMax;
            tassoInput.min = config.tassoMin;
            tassoInput.max = config.tassoMax;
            
            // Aggiorna label
            importoLabel.textContent = config.label;
            
            // Aggiorna classe per stile
            document.body.className = `tipo-${e.target.value}`;
            
            // Aggiorna gli slider
            this.aggiornaSliders(config);
        });

        // Imposta configurazione iniziale
        tipoDebito.dispatchEvent(new Event('change'));
    }

    aggiornaSliders(config) {
        const configurazioni = {
            importo: { 
                min: config.importoMin, 
                max: config.importoMax, 
                step: Math.max(100, config.importoMax / 1000),
                default: config.importoDefault 
            },
            tasso: { 
                min: config.tassoMin, 
                max: config.tassoMax, 
                step: 0.1, 
                default: 3.5 
            },
            durata: { 
                min: 1, 
                max: config.durataMax, 
                step: 1, 
                default: Math.min(20, config.durataMax) 
            },
            extra: { 
                min: 0, 
                max: 10000,
                step: 100, 
                default: 0 
            }
        };

        // Rimuovi gli slider esistenti
        document.querySelectorAll('.slider-container').forEach(el => el.remove());

        // Crea nuovi slider con le nuove configurazioni
        for (const [id, sliderConfig] of Object.entries(configurazioni)) {
            this.creaSlider(id, sliderConfig);
        }
    }

    aggiornaTabella(risultati) {
        const tbody = document.getElementById('dettaglio-tabella');
        tbody.innerHTML = risultati.map(r => `
            <tr>
                <td>${r.anno}</td>
                <td>${this.formattaValuta(r.saldoStandard)}</td>
                <td>${this.formattaValuta(r.saldoConExtra)}</td>
                <td>${this.formattaValuta(r.risparmioInteressi)}</td>
            </tr>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CalcolatoreMutuo();
});  
