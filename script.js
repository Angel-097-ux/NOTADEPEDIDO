document.getElementById('fecha-actual').innerText = new Date().toLocaleDateString();

function vincularEventos() {
    document.querySelectorAll('.fila-producto').forEach(fila => {
        const talles = fila.querySelectorAll('.t');
        const totalInput = fila.querySelector('.total-cant');
        talles.forEach(t => {
            t.oninput = () => {
                let suma = 0;
                talles.forEach(input => suma += Number(input.value || 0));
                totalInput.value = suma;
            };
        });
    });
}

vincularEventos();

function agregarFila() {
    const cuerpo = document.getElementById('cuerpo-tabla');
    const tr = document.createElement('tr');
    tr.className = 'fila-producto';
    tr.innerHTML = `
        <td><input type="number" class="total-cant" readonly value="0"></td>
        <td><input type="text" class="art-cod"></td>
        <td><input type="text" class="art-color"></td>
        ${'<td><input type="number" class="t"></td>'.repeat(20)}
    `;
    cuerpo.appendChild(tr);
    vincularEventos();
}

function generarPDF() {
    const elemento = document.getElementById('hoja-pedido');
    window.scrollTo(0,0); // Asegura que empiece desde arriba

    const opciones = {
        margin: [10, 5, 10, 5],
        filename: 'Pedido_CON_AMOR.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2, 
            scrollY: 0, 
            useCORS: true,
            windowWidth: 1100 // Fuerza el ancho para que no se corte
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    html2pdf().set(opciones).from(elemento).save();
}

function enviarWhatsapp() {
    const fabrica = document.getElementById('fabrica-nombre').value;
    let texto = `*PEDIDO: ${fabrica}*%0A`;
    document.querySelectorAll('.fila-producto').forEach(f => {
        const art = f.querySelector('.art-cod').value;
        const total = f.querySelector('.total-cant').value;
        if(art && total > 0) texto += `• ${art}: ${total}u.%0A`;
    });
    window.open(`https://wa.me/5493426112097?text=${texto}`, '_blank');
}