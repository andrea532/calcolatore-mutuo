body {
    background-color: #f8fafc;
    font-family: 'Inter', sans-serif;
}

#calcolatore-wrapper {
    max-width: 1400px;
    margin: 0 auto;
    padding: 15px;
}

.sidebar {
    background-color: white;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    height: auto;
    position: relative;
    width: 100%;
    max-width: 350px;
    margin: 0 auto 1rem;
}

.main-content {
    margin-left: 320px;
    padding: 1rem;
    width: calc(100% - 320px);
}

.form-control {
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    transition: all 0.3s ease;
}

.form-control:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.btn {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-primary {
    background: linear-gradient(145deg, #2563eb, #1d4ed8);
    border: none;
    box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);
}

.risultati .card {
    background-color: white;
    border-radius: 12px;
    border: none;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    padding: 1rem;
    margin-bottom: 1rem;
    transition: transform 0.2s ease;
}

.risultati .card:hover {
    transform: translateY(-2px);
}

.grafico {
    background-color: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.table-container {
    background-color: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

@media (max-width: 767px) {
    #calcolatore-wrapper {
        padding: 10px;
    }

    .sidebar {
        max-width: 100%;
        padding: 1rem;
        margin-bottom: 1rem;
        overflow: visible;
    }

    .main-content {
        padding: 0;
        margin: 0;
        width: 100%;
    }

    .grafico-container {
        height: 300px;
        padding: 0.8rem;
        margin: 0 0 1rem 0;
    }

    .table-responsive {
        padding: 0.8rem;
        margin: 0;
        width: 100%;
        overflow-x: auto;
    }

    #sommario .card {
        margin-bottom: 1rem;
        padding: 0.8rem;
    }

    .table th, 
    .table td {
        padding: 0.5rem;
        font-size: 12px;
        white-space: nowrap;
    }

    .form-control, 
    .form-select, 
    .btn {
        height: 44px;
        font-size: 16px;
    }

    #sommario .row {
        margin: 0 -5px;
    }

    #sommario .col-md-6 {
        padding: 0 5px;
    }

    #sommario .card {
        height: auto;
    }

    .mb-3 {
        margin-bottom: 0.8rem !important;
    }

    .mb-4 {
        margin-bottom: 1rem !important;
    }
}

@media (min-width: 768px) and (max-width: 991px) {
    .sidebar {
        max-width: 100%;
        margin-bottom: 1.5rem;
    }

    .main-content {
        width: 100%;
        margin-left: 0;
        padding: 0;
    }
}

@media (min-width: 992px) {
    .sidebar {
        position: sticky;
        top: 20px;
        height: auto;
        max-height: calc(100vh - 40px);
        overflow-y: auto;
    }

    .main-content {
        padding-left: 2rem;
    }
}

@supports (-webkit-touch-callout: none) {
    .form-control, 
    .form-select {
        font-size: 16px;
    }

    .table-responsive {
        -webkit-overflow-scrolling: touch;
    }

    @media (max-width: 767px) {
        .grafico-container {
            width: 100vw;
            margin-left: -10px;
            margin-right: -10px;
            padding: 10px;
        }
    }
}

/* Stili base per il container dello slider */
.slider-container {
    padding: 20px 0;
    margin: 15px 0;
    position: relative;
    width: 100%;
    touch-action: none;
}

/* Stili per il valore visualizzato */
.value-display {
    font-size: 14px;
    font-weight: 500;
    color: #2563eb;
    position: absolute;
    right: 0;
    top: 0;
}

/* Stili base per lo slider */
.form-range {
    width: 100%;
    height: 30px;
    padding: 0;
    background: transparent;
    -webkit-appearance: none;
    appearance: none;
    cursor: pointer;
}

/* Stili per la traccia dello slider */
.form-range::-webkit-slider-runnable-track {
    width: 100%;
    height: 4px;
    background: #e2e8f0;
    border-radius: 2px;
    border: none;
}

.form-range::-moz-range-track {
    width: 100%;
    height: 4px;
    background: #e2e8f0;
    border-radius: 2px;
    border: none;
}

/* Stili per il thumb dello slider */
.form-range::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #2563eb;
    border: 2px solid #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    margin-top: -10px;
    transition: all 0.2s ease;
}

.form-range::-moz-range-thumb {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #2563eb;
    border: 2px solid #fff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    transition: all 0.2s ease;
}

/* Effetti hover */
.form-range::-webkit-slider-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 3px 6px rgba(0,0,0,0.25);
}

.form-range::-moz-range-thumb:hover {
    transform: scale(1.1);
    box-shadow: 0 3px 6px rgba(0,0,0,0.25);
}

/* Stili specifici per mobile */
@media (max-width: 767px) {
    .form-range {
        height: 44px;
    }

    .form-range::-webkit-slider-thumb {
        width: 28px;
        height: 28px;
    }

    .form-range::-moz-range-thumb {
        width: 28px;
        height: 28px;
    }

    .value-display {
        font-size: 16px;
        margin-bottom: 8px;
    }

    .slider-container {
        padding: 25px 0 15px 0;
    }
}

.analisi-dettagliata .card {
    height: 100%;
}

.alert {
    font-size: 0.9rem;
}

.alert ul {
    padding-left: 1.2rem;
}

.alert-warning {
    background-color: #fff7ed;
    border-color: #ffedd5;
    color: #c2410c;
}

.alert-info {
    background-color: #f0f9ff;
    border-color: #e0f2fe;
    color: #0369a1;
}

.grafico-container {
    background-color: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
    height: 400px;
}

.table-responsive {
    background-color: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    margin: 0 -1rem;
    padding: 1rem;
}

@media (min-width: 992px) {
    .container-fluid {
        padding: 0;
    }
    
    .row {
        margin: 0;
    }
    
    .sidebar {
        margin: 1rem 0 1rem 1rem;
    }
    
    .main-content {
        padding: 1rem 1rem 1rem 2rem;
    }
}

.analisi-dettagliata {
    background-color: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    margin-bottom: 1rem;
}

.risultati {
    max-width: 100%;
    margin: 0 auto;
}

@media (max-width: 992px) {
    .sidebar {
        position: relative;
        height: auto;
        max-width: 100%;
        margin-bottom: 2rem;
    }

    .main-content {
        margin-left: 0;
    }
}

@media (min-width: 993px) {
    .main-content {
        margin-left: calc(25% + 1rem);
    }
}

@media (max-width: 576px) {
    .table th, 
    .table td {
        padding: 0.5rem;
        font-size: 13px;
    }

    .table-responsive {
        margin: 0 -1rem;
        padding: 1rem;
    }
}

.spinner-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.form-select {
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    transition: all 0.3s ease;
    font-size: 16px;
    background-color: white;
}

.form-select:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

/* Stili per i diversi tipi di debito */
.tipo-mutuo .sidebar {
    border-top: 4px solid #2563eb;
}

.tipo-prestito .sidebar {
    border-top: 4px solid #10b981;
}

.tipo-auto .sidebar {
    border-top: 4px solid #f59e0b;
}

.tipo-altro .sidebar {
    border-top: 4px solid #8b5cf6;
}

/* Ottimizzazioni per iOS */
html, body {
    -webkit-overflow-scrolling: touch;
    overflow-x: hidden;
    position: relative;
    height: 100%;
}

#calcolatore-wrapper {
    -webkit-overflow-scrolling: touch;
    overflow-y: visible;
    overflow-x: hidden;
}

@supports (-webkit-touch-callout: none) {
    /* Stili specifici per iOS */
    body {
        cursor: pointer; /* Migliora la reattività del touch */
    }

    .sidebar,
    .main-content,
    .table-responsive {
        -webkit-overflow-scrolling: touch;
    }

    /* Previeni il bounce dello scroll su iOS */
    .sidebar {
        position: relative;
        overflow-y: visible;
    }

    /* Migliora la reattività degli input */
    input[type="number"],
    select,
    .form-control,
    .form-select {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
    }

    /* Ottimizza lo scrolling della tabella */
    .table-responsive {
        overflow-y: hidden;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        margin: 0;
        padding: 10px;
        width: 100vw;
        position: relative;
        left: 50%;
        right: 50%;
        margin-left: -50vw;
        margin-right: -50vw;
    }
}

/* Migliora la performance dello scroll */
* {
    -webkit-tap-highlight-color: transparent;
}

/* Ottimizza il layout per evitare problemi di scroll */
@media (max-width: 767px) {
    .container-fluid {
        overflow-x: hidden;
    }

    .row {
        margin: 0;
    }

    .col-lg-3,
    .col-md-4,
    .col-lg-9,
    .col-md-8 {
        padding: 0;
    }

    .grafico-container {
        margin: 10px 0;
    }

    #sommario .card {
        margin: 5px 0;
    }
}

/* Aggiungi questi stili per ottimizzare il rendering */
.risultati {
    will-change: transform;
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
}

.grafico-container {
    will-change: transform;
    transform: translateZ(0);
    -webkit-transform: translateZ(0);
}

/* Ottimizza lo scrolling su mobile */
@media (max-width: 767px) {
    body {
        overscroll-behavior-y: none;
    }
    
    .risultati {
        overflow: hidden;
        position: relative;
    }

    .table-responsive {
        -webkit-overflow-scrolling: auto;
        overflow-y: hidden;
    }

    #dettaglio-tabella tr {
        contain: content;
    }
    
    .grafico-container {
        contain: content;
        height: 300px !important;
    }
}

/* Modifica gli stili base */
html, body {
    max-width: 100%;
    overflow-x: hidden;
    margin: 0;
    padding: 0;
}

#calcolatore-wrapper {
    width: 100%;
    max-width: 100%;
    margin: 0;
    padding: 10px;
    overflow-x: hidden;
    box-sizing: border-box;
}

/* Modifica gli stili per mobile */
@media (max-width: 767px) {
    .container-fluid {
        padding: 0;
        overflow-x: hidden;
        width: 100%;
    }

    .row {
        margin: 0;
        width: 100%;
    }

    .col-lg-3, 
    .col-md-4, 
    .col-lg-9, 
    .col-md-8 {
        padding: 0;
        width: 100%;
    }

    .table-responsive {
        margin: 0;
        padding: 10px;
        width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
    }

    .grafico-container {
        width: 100%;
        margin: 10px 0;
        padding: 10px;
    }

    .sidebar {
        width: 100%;
        margin: 0 0 1rem 0;
        padding: 1rem;
    }

    .main-content {
        width: 100%;
        margin: 0;
        padding: 0;
    }

    #sommario .row {
        margin: 0;
        width: 100%;
    }

    .risultati {
        width: 100%;
        overflow-x: hidden;
    }
}

/* Rimuovi questi stili che causano lo scroll orizzontale */
@supports (-webkit-touch-callout: none) {
    .table-responsive {
        width: 100%;
        position: static;
        left: auto;
        right: auto;
        margin-left: 0;
        margin-right: 0;
    }
}

/* Migliora gli slider per mobile */
@media (max-width: 767px) {
    .form-range {
        height: 30px; /* Aumenta l'area cliccabile */
    }

    .form-range::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 28px !important;
        height: 28px !important;
        background: #2563eb;
        border: 2px solid #fff;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        margin-top: -14px; /* Centra verticalmente il thumb */
    }

    .form-range::-moz-range-thumb {
        width: 28px !important;
        height: 28px !important;
        background: #2563eb;
        border: 2px solid #fff;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }

    .form-range::-webkit-slider-runnable-track {
        height: 4px;
        background: #e2e8f0;
        border-radius: 2px;
    }

    .form-range::-moz-range-track {
        height: 4px;
        background: #e2e8f0;
        border-radius: 2px;
    }

    /* Aumenta lo spazio per il touch */
    .slider-container {
        padding: 10px 0;
        margin: 15px 0;
    }

    /* Migliora la visualizzazione del valore */
    .value-display {
        font-size: 16px;
        margin-bottom: 8px;
        display: block;
    }
}

/* Correggi lo scroll su mobile */
@media (max-width: 767px) {
    .risultati {
        width: 100%;
        overflow-x: hidden;
    }

    .table-responsive {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        margin: 0;
        padding: 10px;
        width: 100%;
    }

    .grafico-container {
        width: 100%;
        overflow: hidden;
        margin: 10px 0;
    }

    #sommario .row {
        margin: 0 -5px;
    }

    .sidebar {
        overflow: visible;
    }

    .main-content {
        overflow-x: hidden;
    }
}

/* Blocca completamente lo scroll orizzontale */
html, body {
    max-width: 100%;
    overflow-x: hidden !important;
    position: relative;
    touch-action: pan-y pinch-zoom;
    -webkit-overflow-scrolling: touch;
}

#calcolatore-wrapper {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden !important;
    position: relative;
}

/* Modifica gli stili per mobile */
@media (max-width: 767px) {
    .container-fluid,
    .row,
    .col-lg-3,
    .col-md-4,
    .col-lg-9,
    .col-md-8,
    .main-content,
    .risultati,
    .grafico-container,
    .table-responsive {
        width: 100% !important;
        max-width: 100% !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        padding-left: 10px !important;
        padding-right: 10px !important;
        overflow-x: hidden !important;
        position: relative !important;
        left: auto !important;
        right: auto !important;
        transform: none !important;
    }

    .table-responsive {
        overflow-x: auto !important;
        -webkit-overflow-scrolling: touch;
    }
}

/* Rimuovi tutti i margini negativi e le trasformazioni */
@supports (-webkit-touch-callout: none) {
    .table-responsive {
        width: 100% !important;
        position: static !important;
        left: auto !important;
        right: auto !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
        transform: none !important;
    }
} 
