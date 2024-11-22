class CalcolatoreMutuo {
    constructor() {
        if (!this.verificaElementiHTML()) {
            console.error('Elementi HTML mancanti.');
            return;
        }
        
        this.form = document.getElementById('mutuo-form');
        this.chart = null;
        this.ultimiRisultati = null;
        
        this.inizializzaEventi();
        this.inizializzaSliders();
        this.inizializzaGestioneMobile();
        this.inizializzaSelettoreTipoDebito();

        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener('blur', () => {
                window.scrollTo(0, 0);
            });
        });
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
        container.className = 'slider-container mb-3';
        
        const label = document.createElement('label');
        label.textContent = `${id.charAt(0).toUpperCase() + id.slice(1)}: `;
        label.className = 'form-label d-block';

        const valueDisplay = document.createElement('span');
        valueDisplay.className = 'value-display';
        
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.className = 'form-range';
        slider.min = config.min;
        slider.max = config.max;
        slider.step = config.step;
        slider.value = config.default;

        const input = document.getElementById(id);
        input.value = config.default;

        slider.addEventListener('input', (e) => {
            input.value = e.target.value;
            valueDisplay.textContent = this.formattaValore(id, e.target.value);
            this.calcolaRisultatiLive();
        });

        container.appendChild(label);
        container.appendChild(valueDisplay);
        container.appendChild(slider);
        input.parentNode.appendChild(container);
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
        let risultatiAnnuali = [];

        for (let anno = 1; anno <= anni; anno++) {
            let interessiAnnualiStandard = 0;
            let interessiAnnualiExtra = 0;

            for (let mese = 1; mese <= 12; mese++) {
                // Calcolo interessi per piano standard
                const interesseMensileStandard = saldoStandard * tassoMensile;
                interessiAnnualiStandard += interesseMensileStandard;
                const capitaleMensileStandard = rataMensile - interesseMensileStandard;
                saldoStandard -= capitaleMensileStandard;

                // Calcolo interessi per piano con extra
                const interesseMensileExtra = saldoConExtra * tassoMensile;
                interessiAnnualiExtra += interesseMensileExtra;
                const capitaleMensileExtra = rataMensile - interesseMensileExtra;
                saldoConExtra -= capitaleMensileExtra;
                
                if (mese === 12 && extraAnnuale > 0) {
                    saldoConExtra = Math.max(0, saldoConExtra - extraAnnuale);
                }
            }

            interessiTotaliStandard += interessiAnnualiStandard;
            interessiTotaliExtra += interessiAnnualiExtra;

            risultatiAnnuali.push({
                anno,
                saldoStandard: Math.max(0, saldoStandard),
                saldoConExtra: Math.max(0, saldoConExtra),
                risparmioInteressi: interessiTotaliStandard - interessiTotaliExtra
            });

            if (saldoConExtra <= 0) break;
        }

        return risultatiAnnuali;
    }

    mostraRisultati(risultati) {
        const tipoDebito = document.getElementById('tipo-debito').value;
        const sommario = document.getElementById('sommario');
        const risparmiInteressi = risultati[risultati.length - 1].risparmioInteressi;
        const anniRisparmiati = Math.max(0, 
            document.getElementById('durata').value - risultati.length);

        sommario.innerHTML = `
            <div class="col-md-6 mb-3">
                <div class="card">
                    <h5>Risparmio Interessi</h5>
                    <p class="h3">${this.formattaValuta(risparmiInteressi)}</p>
                    <small class="text-muted">Interessi risparmiati con pagamenti extra</small>
                </div>
            </div>
            <div class="col-md-6 mb-3">
                <div class="card">
                    <h5>${tipoDebito === 'mutuo' ? 'Anni' : 'Mesi'} Risparmiati</h5>
                    <p class="h3">${tipoDebito === 'mutuo' ? anniRisparmiati : anniRisparmiati * 12}</p>
                    <small class="text-muted">Durata ridotta del ${tipoDebito}</small>
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

        const isMobile = window.innerWidth < 768;

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: risultati.map(r => `Anno ${r.anno}`),
                datasets: [{
                    label: 'Saldo Standard',
                    data: risultati.map(r => r.saldoStandard),
                    borderColor: '#2563eb',
                    tension: 0.1,
                    borderWidth: isMobile ? 2 : 3
                }, {
                    label: 'Saldo con Extra',
                    data: risultati.map(r => r.saldoConExtra),
                    borderColor: '#10b981',
                    tension: 0.1,
                    borderWidth: isMobile ? 2 : 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'nearest',
                    intersect: false
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return this.formattaValuta(context.raw);
                            }
                        }
                    },
                    legend: {
                        position: isMobile ? 'bottom' : 'top',
                        labels: {
                            boxWidth: isMobile ? 8 : 12,
                            padding: isMobile ? 8 : 10,
                            font: {
                                size: isMobile ? 11 : 12
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            maxRotation: isMobile ? 0 : 45,
                            minRotation: isMobile ? 0 : 45,
                            font: {
                                size: isMobile ? 10 : 12
                            }
                        }
                    },
                    y: {
                        ticks: {
                            font: {
                                size: isMobile ? 10 : 12
                            }
                        }
                    }
                }
            }
        });
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

    calcolaRataMensile(importo, tassoAnnuale, anni) {
        const tassoMensile = tassoAnnuale / 12 / 100;
        const numRate = anni * 12;
        return (importo * tassoMensile * Math.pow(1 + tassoMensile, numRate)) / 
               (Math.pow(1 + tassoMensile, numRate) - 1);
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
            extra: { min: 0, max: 20000, step: 100, default: 0 }
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
        // Gestione dello scroll su iOS
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener('focus', () => {
                setTimeout(() => {
                    input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            });
        });

        // Migliora la gestione del grafico su mobile
        if (window.innerWidth < 768) {
            Chart.defaults.font.size = 12;
            Chart.defaults.plugins.legend.position = 'bottom';
        }

        // Gestione orientamento schermo
        window.addEventListener('orientationchange', () => {
            if (this.chart) {
                setTimeout(() => {
                    this.chart.resize();
                }, 100);
            }
        });
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
                max: config.importoMax * 0.2, 
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
}

document.addEventListener('DOMContentLoaded', () => {
    new CalcolatoreMutuo();
}); 