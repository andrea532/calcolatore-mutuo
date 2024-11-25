class CalcolatoreMutuo {
    constructor() {
        console.log('Inizializzazione CalcolatoreMutuo');
        if (!this.verificaElementiHTML()) {
            console.error('Elementi HTML mancanti.');
            return;
        }
        
        this.form = document.getElementById('mutuo-form');
        this.chart = null;
        this.ultimiRisultati = null;
        
        this.inizializzaEventi();
        this.inizializzaSelettoreTipoDebito();
        console.log('Inizializzazione completata');
        
        // Aggiungi gestione touch events
        this.inizializzaTouchEvents();
    }

    verificaElementiHTML() {
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
        
        const elementiMancanti = elementiRichiesti.filter(id => !document.getElementById(id));
        if (elementiMancanti.length > 0) {
            console.error('Elementi mancanti:', elementiMancanti);
            return false;
        }
        return true;
    }

    inizializzaSelettoreTipoDebito() {
        const tipoDebito = document.getElementById('tipo-debito');
        const importoLabel = document.getElementById('importo-label');
        
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
            }
        };

        tipoDebito.addEventListener('change', (e) => {
            const config = configurazioni[e.target.value];
            
            const importoInput = document.getElementById('importo');
            const durataInput = document.getElementById('durata');
            const tassoInput = document.getElementById('tasso');
            
            importoInput.min = config.importoMin;
            importoInput.max = config.importoMax;
            importoInput.value = config.importoDefault;
            
            durataInput.max = config.durataMax;
            tassoInput.min = config.tassoMin;
            tassoInput.max = config.tassoMax;
            
            importoLabel.textContent = config.label;
        });

        // Imposta configurazione iniziale
        tipoDebito.dispatchEvent(new Event('change'));
    }

    inizializzaEventi() {
        console.log('Inizializzazione eventi');
        this.form.addEventListener('submit', (e) => {
            console.log('Form sottomesso');
            e.preventDefault();
            this.calcolaMutuo();
        });

        // Aggiungi listener per il pulsante reset
        this.form.addEventListener('reset', () => {
            console.log('Form resettato');
            if (this.chart) {
                this.chart.destroy();
            }
            document.getElementById('sommario').innerHTML = '';
            document.getElementById('dettaglio-tabella').innerHTML = '';
        });
    }

    calcolaMutuo() {
        console.log('Inizio calcolo mutuo');
        const importo = parseFloat(document.getElementById('importo').value);
        const tasso = parseFloat(document.getElementById('tasso').value) / 100;
        const durata = parseInt(document.getElementById('durata').value);
        const extra = parseFloat(document.getElementById('extra').value) || 0;

        console.log('Valori input:', { importo, tasso, durata, extra });

        // Calcolo rata mensile
        const tassoMensile = tasso / 12;
        const numRate = durata * 12;
        const rata = (importo * tassoMensile * Math.pow(1 + tassoMensile, numRate)) / 
                    (Math.pow(1 + tassoMensile, numRate) - 1);

        console.log('Rata mensile calcolata:', rata);

        // Calcola l'ammortamento
        let saldoStandard = importo;
        let saldoExtra = importo;
        let risultati = [];

        for (let anno = 1; anno <= durata; anno++) {
            let interessiStandard = 0;
            let interessiExtra = 0;

            // Calcolo standard
            for (let mese = 1; mese <= 12; mese++) {
                interessiStandard += saldoStandard * tassoMensile;
                saldoStandard -= (rata - (saldoStandard * tassoMensile));
            }

            // Calcolo con extra
            for (let mese = 1; mese <= 12; mese++) {
                interessiExtra += saldoExtra * tassoMensile;
                saldoExtra -= (rata - (saldoExtra * tassoMensile));
                if (mese === 12) saldoExtra = Math.max(0, saldoExtra - extra);
            }

            risultati.push({
                anno,
                saldoStandard: Math.max(0, saldoStandard),
                saldoExtra: Math.max(0, saldoExtra),
                risparmioInteressi: interessiStandard - interessiExtra
            });
        }

        console.log('Risultati calcolati:', risultati);
        this.mostraRisultati(risultati, rata);
    }

    mostraRisultati(risultati, rataMensile) {
        console.log('Mostro risultati');
        try {
            // Aggiorna sommario
            const sommario = document.getElementById('sommario');
            sommario.innerHTML = `
                <div class="col-6 col-md-3">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Rata Mensile</h5>
                            <p class="card-text">€${rataMensile.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            `;

            // Aggiorna tabella
            const tbody = document.getElementById('dettaglio-tabella');
            tbody.innerHTML = risultati.map(r => `
                <tr>
                    <td>${r.anno}</td>
                    <td>€${r.saldoStandard.toFixed(2)}</td>
                    <td>€${r.saldoExtra.toFixed(2)}</td>
                    <td>€${r.risparmioInteressi.toFixed(2)}</td>
                </tr>
            `).join('');

            // Aggiorna grafico
            this.aggiornaGrafico(risultati);
            console.log('Risultati mostrati con successo');
        } catch (error) {
            console.error('Errore nel mostrare i risultati:', error);
        }
    }

    aggiornaGrafico(risultati) {
        if (this.chart) {
            this.chart.destroy();
        }

        const ctx = document.getElementById('mutuoChart').getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: risultati.map(r => `Anno ${r.anno}`),
                datasets: [{
                    label: 'Saldo Standard',
                    data: risultati.map(r => r.saldoStandard),
                    borderColor: '#2563eb',
                    tension: 0.1
                }, {
                    label: 'Saldo con Extra',
                    data: risultati.map(r => r.saldoExtra),
                    borderColor: '#16a34a',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'nearest',
                    intersect: false
                },
                events: ['mousemove', 'mouseout', 'click', 'touchstart', 'touchmove']
            }
        });
    }

    inizializzaTouchEvents() {
        const contenuto = document.querySelector('.col-lg-9');
        let touchStartY = 0;
        
        contenuto.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        }, { passive: true });

        contenuto.addEventListener('touchmove', (e) => {
            const touchY = e.touches[0].clientY;
            const scrollTop = contenuto.scrollTop;
            
            // Permetti lo scroll naturale
            if ((scrollTop === 0 && touchY > touchStartY) ||
                (scrollTop >= contenuto.scrollHeight - contenuto.offsetHeight && touchY < touchStartY)) {
                e.preventDefault();
            }
        }, { passive: false });
    }
}

// Inizializza il calcolatore quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM caricato');
    window.calcolatore = new CalcolatoreMutuo();
});  
