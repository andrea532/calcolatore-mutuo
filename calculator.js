function mutualCalculator() {
    return {
        // Variabili di input
        amount: 0,
        rate: 0,
        years: 0,
        extraPayment: 0,
        debtType: 'mutuo', // valore di default
        extraOnetime: 0,

        // Variabili di calcolo
        standardMonthlyPayment: 0,
        extraMonthlyPayment: 0,
        standardTotalInterest: 0,
        extraTotalInterest: 0,
        yearsSaved: 0,
        totalSavings: 0,
        annualPaymentDecrement: [],
        showDecreaseTable: false,
        chart: null,

        // Proprietà computata per l'importo arrotondato
        get roundedAmount() {
            if (!this.amount) return 0;
            // Arrotonda al migliaio più vicino
            return Math.round(this.amount / 1000) * 1000;
        },

        // Imposta l'importo arrotondato
        setRoundedAmount(value) {
            this.amount = Math.round(value / 1000) * 1000;
        },

        // Calcolo principale
        calculate() {
            if (!this.amount || !this.rate || !this.years) return;

            console.log('Calcolo iniziato con:', {
                amount: this.amount,
                rate: this.rate,
                years: this.years,
                extraPayment: this.extraPayment,
                extraOnetime: this.extraOnetime
            });

            // Calcolo piano standard
            this.calculateStandardPlan();
            
            // Calcolo piano con extra
            this.calculateExtraPlan();
            
            // Calcolo decrementi annuali
            this.calculateAnnualDecrements();

            // Calcola i valori per il grafico
            const standardValues = [this.amount];
            const extraValues = [this.amount];
            let standardBalance = this.amount;
            let extraBalance = this.amount;
            const monthlyRate = (this.rate / 100) / 12;

            for (let year = 1; year <= this.years; year++) {
                // Piano standard
                for (let month = 1; month <= 12; month++) {
                    const interest = standardBalance * monthlyRate;
                    standardBalance = standardBalance - this.standardMonthlyPayment + interest;
                }
                standardValues.push(Math.max(0, Math.round(standardBalance)));

                // Piano con extra
                for (let month = 1; month <= 12; month++) {
                    const interest = extraBalance * monthlyRate;
                    extraBalance = extraBalance - this.standardMonthlyPayment + interest;
                    if (month === 12 && this.extraPayment > 0) {
                        extraBalance = Math.max(0, extraBalance - this.extraPayment);
                    }
                }
                extraValues.push(Math.max(0, Math.round(extraBalance)));
            }

            // Distruggi il grafico esistente
            if (this.chart) {
                this.chart.destroy();
                this.chart = null;
            }

            // Crea un nuovo grafico con i dati aggiornati
            const ctx = document.getElementById('comparisonChart');
            if (ctx) {
                // Crea un array di etichette solo per gli anni necessari
                const labels = [];
                for (let i = 0; i <= this.years; i++) {
                    labels.push(`Anno ${i}`);
                }

                this.chart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: labels, // Usa l'array di etichette creato
                        datasets: [{
                            label: 'Piano Standard',
                            data: standardValues,
                            borderColor: '#2563eb',
                            backgroundColor: 'rgba(37, 99, 235, 0.1)',
                            borderWidth: 3,
                            fill: true
                        }, {
                            label: 'Piano con Extra',
                            data: extraValues,
                            borderColor: '#059669',
                            backgroundColor: 'rgba(5, 150, 105, 0.1)',
                            borderWidth: 3,
                            fill: true
                        }]
                    },
                    options: {
                        animation: false,
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'top',
                                labels: {
                                    padding: window.innerWidth < 640 ? 10 : 20,
                                    font: {
                                        size: window.innerWidth < 640 ? 12 : 14
                                    }
                                }
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return context.dataset.label + ': ' + 
                                               new Intl.NumberFormat('it-IT', {
                                                   style: 'currency',
                                                   currency: 'EUR',
                                                   maximumFractionDigits: 0
                                               }).format(context.parsed.y);
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function(value) {
                                        return new Intl.NumberFormat('it-IT', {
                                            style: 'currency',
                                            currency: 'EUR',
                                            maximumFractionDigits: 0
                                        }).format(value);
                                    },
                                    font: {
                                        size: window.innerWidth < 640 ? 10 : 12
                                    }
                                },
                                title: {
                                    display: window.innerWidth >= 640,
                                    text: 'Debito Residuo',
                                    font: {
                                        size: window.innerWidth < 640 ? 12 : 14
                                    }
                                }
                            },
                            x: {
                                ticks: {
                                    font: {
                                        size: window.innerWidth < 640 ? 10 : 12
                                    },
                                    maxRotation: 45, // Ruota le etichette se necessario
                                    autoSkip: true, // Salta automaticamente alcune etichette se troppo vicine
                                    maxTicksLimit: 20 // Limita il numero massimo di etichette mostrate
                                },
                                title: {
                                    display: window.innerWidth >= 640,
                                    text: 'Anni',
                                    font: {
                                        size: window.innerWidth < 640 ? 12 : 14
                                    }
                                }
                            }
                        },
                        interaction: {
                            intersect: false,
                            mode: 'index'
                        }
                    }
                });
            }
        },

        // Calcolo piano standard
        calculateStandardPlan() {
            const monthlyRate = (this.rate / 100) / 12;
            const numberOfPayments = this.years * 12;
            
            this.standardMonthlyPayment = this.calculateMonthlyPayment(this.amount, this.rate, this.years);
            this.standardTotalInterest = (this.standardMonthlyPayment * numberOfPayments) - this.amount;
        },

        // Calcolo piano con extra
        calculateExtraPlan() {
            const monthlyRate = (this.rate / 100) / 12;
            let remainingBalance = this.amount;
            let months = 0;
            let totalInterest = 0;

            // Applica l'extra una tantum all'inizio se presente
            if (this.extraOnetime > 0) {
                remainingBalance = Math.max(0, remainingBalance - this.extraOnetime);
            }

            // Ricalcola la rata mensile mantenendola costante
            const monthlyPayment = this.standardMonthlyPayment;

            while (remainingBalance > 0) {
                months++;
                
                // Calcola l'interesse mensile
                const monthlyInterest = remainingBalance * monthlyRate;
                totalInterest += monthlyInterest;
                
                // Pagamento mensile fisso
                let payment = monthlyPayment;
                
                // Aggiungi extra annuale se è dicembre
                if (months % 12 === 0 && this.extraPayment > 0) {
                    remainingBalance = remainingBalance - this.extraPayment;
                }
                
                remainingBalance = remainingBalance - payment + monthlyInterest;
            }

            this.extraTotalInterest = totalInterest;
            this.yearsSaved = this.years - (months / 12);
            this.totalSavings = this.standardTotalInterest - totalInterest;
        },

        // Calcolo decrementi annuali
        calculateAnnualDecrements() {
            const monthlyRate = (this.rate / 100) / 12;
            let remainingBalance = this.amount;
            let currentYear = 1;
            this.annualPaymentDecrement = [];

            // Applica l'extra una tantum all'inizio se presente
            if (this.extraOnetime > 0) {
                remainingBalance = Math.max(0, remainingBalance - this.extraOnetime);
            }

            while (currentYear <= this.years) {
                // Ricalcola la rata mensile per il capitale rimanente mantenendo la durata originale
                const remainingMonths = (this.years - currentYear + 1) * 12;
                const newMonthlyPayment = this.calculateMonthlyPayment(remainingBalance, this.rate, remainingMonths/12);

                this.annualPaymentDecrement.push({
                    year: currentYear,
                    newMonthlyPayment: newMonthlyPayment,
                    remainingCapital: remainingBalance
                });

                // Simula un anno di pagamenti
                for (let month = 1; month <= 12; month++) {
                    const monthlyInterest = remainingBalance * monthlyRate;
                    remainingBalance = remainingBalance + monthlyInterest - newMonthlyPayment;

                    // Applica extra annuale a dicembre
                    if (month === 12 && this.extraPayment > 0) {
                        remainingBalance = Math.max(0, remainingBalance - this.extraPayment);
                    }
                }

                currentYear++;
            }
        },

    
        calculateStandardProgression() {
            const values = [this.amount];
            let balance = this.amount;
            const monthlyRate = (this.rate / 100) / 12;

            for (let year = 1; year <= this.years; year++) {
                for (let month = 1; month <= 12; month++) {
                    const interest = balance * monthlyRate;
                    balance = balance - this.standardMonthlyPayment + interest;
                }
                values.push(Math.max(0, balance));
            }
            
            return values;
        },

        calculateExtraProgression() {
            // Se non ci sono extra payment, ritorna gli stessi valori del piano standard
            if (this.extraPayment === 0 && this.extraOnetime === 0) {
                return this.calculateStandardProgression();
            }

            const monthlyRate = (this.rate / 100) / 12;
            let balance = this.amount;
            const progression = [balance];

            // Applica l'extra una tantum all'inizio
            if (this.extraOnetime > 0) {
                balance = Math.max(0, balance - this.extraOnetime);
                progression[0] = balance;
            }

            for (let year = 1; year <= this.years; year++) {
                for (let month = 1; month <= 12; month++) {
                    // Calcola l'interesse mensile
                    const interest = balance * monthlyRate;
                    
                    // Sottrai la rata mensile standard
                    balance = balance - this.standardMonthlyPayment + interest;
                    
                    // A dicembre, applica l'extra payment annuale
                    if (month === 12 && this.extraPayment > 0) {
                        balance = Math.max(0, balance - this.extraPayment);
                    }
                }
                
                // Aggiungi il saldo alla fine dell'anno
                progression.push(Math.max(0, Math.round(balance)));
                
                // Se il debito è estinto, completa l'array con zeri
                if (balance <= 0) {
                    while (progression.length <= this.years) {
                        progression.push(0);
                    }
                    break;
                }
            }

            console.log('Extra Progression:', {
                extraPayment: this.extraPayment,
                extraOnetime: this.extraOnetime,
                values: progression
            });

            return progression;
        },

        calculateDecreaseProgression() {
            const monthlyRate = (this.rate / 100) / 12;
            let balance = this.amount;
            const progression = [balance];

            if (this.extraOnetime > 0) {
                balance -= this.extraOnetime;
            }

            for (let year = 1; year <= this.years; year++) {
                const yearlyData = this.annualPaymentDecrement.find(d => d.year === year);
                if (yearlyData) {
                    balance = yearlyData.remainingCapital;
                }
                progression.push(Math.max(0, balance));
            }

            return progression;
        },

        // Funzioni helper
        calculateMonthlyPayment(principal, rate, years) {
            const monthlyRate = (rate / 100) / 12;
            const numberOfPayments = years * 12;
            return (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                   (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
        },

        formatCurrency(value) {
            return new Intl.NumberFormat('it-IT', {
                style: 'currency',
                currency: 'EUR'
            }).format(value);
        },

        formatNumber(value) {
            if (!value) return "0";
            return new Intl.NumberFormat('it-IT', {
                maximumFractionDigits: 0,
                minimumFractionDigits: 0
            }).format(value);
        },

        unformatNumber(value) {
            if (!value) return 0;
            // Rimuove tutti i caratteri non numerici e converte in numero
            return parseInt(value.replace(/\D/g, '')) || 0;
        },

        // Gestione input importo mutuo
        handleAmountInput(value) {
            // Rimuovi tutti i caratteri non numerici
            const numericValue = value.replace(/[^0-9]/g, '');
            this.amount = parseInt(numericValue) || 0;
            this.calculate();
        },

        // Gestione input extra
        handleExtraInput(value) {
            // Rimuove tutti i caratteri non numerici e converte in numero
            const numericValue = parseInt(value.replace(/\D/g, '')) || 0;
            this.extraPayment = numericValue;
            this.calculate();
        },

        // Gestione slider importo mutuo
        handleSliderInput(value) {
            this.amount = parseInt(value);
            this.calculate();
        },

        // Gestione slider extra
        handleExtraSliderInput(value) {
            this.extraPayment = parseInt(value);
            this.calculate();
        },

        // Imposta il tipo di debito e aggiorna i valori predefiniti
        setDebtType(type) {
            this.debtType = type;
            
            // Aggiorna i valori predefiniti in base al tipo di debito
            switch(type) {
                case 'mutuo':
                    this.years = 30; // max anni per mutuo
                    break;
                case 'prestito':
                    this.years = 10; // max anni per prestito personale
                    break;
                case 'auto':
                    this.years = 7; // max anni per finanziamento auto
                    break;
            }
            
            // Aggiorna i calcoli
            this.calculate();
        },

        // Ottieni il titolo in base al tipo di debito
        getDebtTypeTitle() {
            switch(this.debtType) {
                case 'mutuo':
                    return 'Mutuo Casa';
                case 'prestito':
                    return 'Prestito Personale';
                case 'auto':
                    return 'Finanziamento Auto';
                default:
                    return 'Debito';
            }
        },

        showExtraSlider: false,

        handleExtraInput(value) {
            // Rimuove tutti i caratteri non numerici e converte in numero
            const numericValue = parseInt(value.replace(/\D/g, '')) || 0;
            this.extraPayment = numericValue;
            this.calculate();
        },

        handleExtraSliderInput(value) {
            this.extraPayment = parseInt(value);
            this.calculate();
        },

        formatNumber(value) {
            if (!value) return "0";
            return new Intl.NumberFormat('it-IT', {
                maximumFractionDigits: 0,
                minimumFractionDigits: 0
            }).format(value);
        },

        // Osservatore per ricalcolare quando cambiano i valori
        init() {
            // Inizializza il grafico solo quando necessario
            this.$nextTick(() => {
                this.initEmptyChart();
            });

            // Aggiungi gli event listeners
            this.$watch('amount', () => {
                this.calculate();
            });
            this.$watch('rate', () => {
                this.calculate();
            });
            this.$watch('years', () => {
                this.calculate();
            });
            this.$watch('extraPayment', () => {
                this.calculate();
            });
            this.$watch('extraOnetime', () => {
                this.calculate();
            });
        },

        initEmptyChart() {
            const ctx = document.getElementById('comparisonChart');
            if (!ctx) return;

            // Distruggi il grafico esistente se presente
            if (this.chart) {
                this.chart.destroy();
                this.chart = null;
            }

            // Crea un nuovo grafico vuoto
            this.chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['0'],
                    datasets: [{
                        label: 'Piano Standard',
                        data: [0],
                        borderColor: 'blue'
                    }, {
                        label: 'Piano con Extra',
                        data: [0],
                        borderColor: 'green'
                    }]
                }
            });
        }
    }
} 