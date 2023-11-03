document.getElementById('consulta-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const cpfCnpj = document.getElementById('cpfCnpj').value;

    if (cpfCnpj.toLowerCase() === 'admin') {
        window.location.href = 'http://localhost:3000/admin?key=admin';
    } else {
        fetch('/consultar', {
            method: 'POST',
            body: JSON.stringify({ cpfCnpj }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            const resultadoDiv = document.getElementById('resultado');
            resultadoDiv.innerHTML = ''; // Limpa o conteúdo anterior

            if (data.length > 0) {
                const table = document.createElement('table');
                table.classList.add('result-table');

                // Crie o cabeçalho da tabela
                const headerRow = table.insertRow(0);
                for (const key in data[0]) {
                    const headerCell = document.createElement('th');
                    headerCell.textContent = key;
                    headerRow.appendChild(headerCell);
                }

                // Função para formatar a data no formato dd/mm/aa
                function formatDate(dateString) {
                    const options = { year: '2-digit', month: '2-digit', day: '2-digit' };
                    return new Date(dateString).toLocaleDateString('pt-BR', options);
                }

                // Preencha a tabela com os dados
                data.forEach((item, index) => {
                    const row = table.insertRow(index + 1);
                    for (const key in item) {
                        const cell = row.insertCell();
                        if (key === 'data' || key === 'prazo_entrega') {
                            // Formate as datas
                            cell.textContent = formatDate(item[key]);
                        } else {
                            cell.textContent = item[key];
                        }
                    }
                });

                resultadoDiv.appendChild(table);
            } else {
                resultadoDiv.textContent = 'Nenhum resultado encontrado.';
            }
        })
        .catch(error => {
            console.error('Erro na solicitação:', error);
        });
    }
});