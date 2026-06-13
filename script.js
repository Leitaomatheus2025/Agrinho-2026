function mostrarPagina(event, id) {
    let paginas = document.querySelectorAll(".pagina");
    paginas.forEach(p => p.classList.remove("ativa"));
    document.getElementById(id).classList.add("ativa");
// A lógica foi criada por IA.
    let botoes = document.querySelectorAll(".nav-btn");
    botoes.forEach(btn => btn.classList.remove("active"));
    event.currentTarget.classList.add("active");
}

let grafico;

function simular() {
    // PEGANDO VALORES
    let pesoInicial = parseFloat(document.getElementById("pesoInicial").value);
    let raca = document.getElementById("raca").value;
    let dieta = document.getElementById("dieta").value;
    let racao = parseFloat(document.getElementById("racao").value);
    let dias = parseFloat(document.getElementById("dias").value);
    let precoArroba = parseFloat(document.getElementById("precoArroba").value);
    let custoRacao = parseFloat(document.getElementById("custoRacao").value);

    if (
        isNaN(pesoInicial) || pesoInicial <= 0 ||
        isNaN(racao) || racao <= 0 ||
        isNaN(dias) || dias <= 0 ||
        isNaN(precoArroba) || precoArroba <= 0 ||
        isNaN(custoRacao) || custoRacao <= 0
    ) {
        alert('Por favor, preencha todos os campos numéricos com valores válidos maiores que zero.');
        return;
    }

    // AJUSTES SEGUNDO RAÇA E DIETA
    let fatorRaca = 1;
    switch(raca){
        case "Angus": fatorRaca = 1.1; break;
        case "Senepol": fatorRaca = 1.05; break;
        case "Cruzamento Industrial": fatorRaca = 1.15; break;
        default: fatorRaca = 1; // Nelore
    }

    let fatorDieta = 1;
    switch(dieta){
        case "balanceada": fatorDieta = 1.2; break;
        case "intensiva": fatorDieta = 1.4; break;
        default: fatorDieta = 1; // econômica
    }

    // CÁLCULO DE GANHO DIÁRIO
    let ganhoDiario = (0.6 + (racao * 0.15)) * fatorRaca * fatorDieta;

    let ganhoTotal = ganhoDiario * dias;
    let pesoFinal = pesoInicial + ganhoTotal;
    let arrobas = pesoFinal / 15;

    // Consumo total de ração
    let consumoRacao = racao * dias;

    // Consumo de água: 50L/dia por animal
    let consumoAgua = 50 * dias;

    // Custo alimentação
    let custoTotal = consumoRacao * custoRacao;

    // Valor do animal
    let valorAnimal = arrobas * precoArroba;

    // Lucro
    let lucro = valorAnimal - custoTotal;

    // Índice de sustentabilidade (kg ração / kg ganho)
    let eficiencia = consumoRacao / ganhoTotal;
    let indicador = "";
    if(eficiencia <= 5) indicador = "🟢 Excelente";
    else if(eficiencia <= 7) indicador = "🟡 Boa";
    else if(eficiencia <= 9) indicador = "🟠 Regular";
    else indicador = "🔴 Baixa";

    // MOSTRAR RESULTADOS
    document.getElementById("resultado").innerHTML = `
        <h3>Resultado da Simulação</h3>
        <p><strong>Peso Inicial:</strong> ${pesoInicial.toFixed(1)} kg</p>
        <p><strong>Ganho de Peso:</strong> ${ganhoTotal.toFixed(1)} kg</p>
        <p><strong>Peso Final:</strong> ${pesoFinal.toFixed(1)} kg</p>
        <p><strong>Arrobas Finais:</strong> ${arrobas.toFixed(2)} @</p>
        <p><strong>Consumo total de ração:</strong> ${consumoRacao.toFixed(1)} kg</p>
        <p><strong>Consumo estimado de água:</strong> ${consumoAgua} L</p>
        <p><strong>Custo total da alimentação:</strong> R$ ${custoTotal.toFixed(2)}</p>
        <p><strong>Valor do animal:</strong> R$ ${valorAnimal.toFixed(2)}</p>
        <p><strong>Lucro estimado:</strong> R$ ${lucro.toFixed(2)}</p>
        <p><strong>Índice de sustentabilidade:</strong> ${indicador}</p>
    `;

    // GRÁFICO DE CRESCIMENTO
    let diasArray = [];
    let pesosArray = [];
    for(let i=0; i<=dias; i+=Math.ceil(dias/10)){
        diasArray.push(i);
        pesosArray.push(pesoInicial + ganhoDiario * i);
    }

    if(grafico) grafico.destroy();

    const ctx = document.getElementById('graficoCrescimento').getContext('2d');
    grafico = new Chart(ctx, {
        type: 'line',
        data: {
            labels: diasArray,
            datasets: [{
                label: 'Peso do Boi (kg)',
                data: pesosArray,
                borderColor: '#2e7d32',
                backgroundColor: 'rgba(46,125,50,0.2)',
                fill: true,
                tension: 0.3,
                pointRadius: 4
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Dias de Confinamento'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Peso (kg)'
                    },
                    beginAtZero: false
                }
            }
        }
    });
}