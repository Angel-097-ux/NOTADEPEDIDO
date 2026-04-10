// Fecha automática
document.getElementById('fecha-actual').innerText = new Date().toLocaleDateString();

vincularEventos();

function agregarFila() {
    const cuerpo = document.getElementById('cuerpo-tabla');
    const nuevaFila = document.createElement('tr');
    nuevaFila.className = 'fila-producto';
    
    nuevaFila.innerHTML = `
        <td><input type="number" class="total-cant" readonly value="0"></td>
        <td><input type="text" class="art-cod"></td>
        <td><input type="text" class="art-color"></td>
        ${'<td><input type="number" class="t"></td>'.repeat(20)}
    `;
    
    cuerpo.appendChild(nuevaFila);
    vincularEventos();
}

function vincularEventos() {
    document.querySelectorAll('.fila-producto').forEach(fila => {
        const talles = fila.querySelectorAll('.t');
        const calcular = () => {
            let cant = 0;
            talles.forEach(t => cant += Number(t.value || 0));
            fila.querySelector('.total-cant').value = cant;
        };
        talles.forEach(t => t.oninput = calcular);
    });
}

function generarPDF() {
    const elemento = document.getElementById('hoja-pedido');
    const fabrica = document.getElementById('fabrica-nombre').value || 'PEDIDO';
    const nro = document.getElementById('nro-pedido').value || '000';

    const opciones = {
        margin: [10, 5, 10, 5],
        filename: `${fabrica}_Nro_${nro}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2, 
            scrollY: 0, 
            scrollX: 0,
            useCORS: true,
            windowWidth: 1200 
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    html2pdf().set(opciones).from(elemento).save();
}

// Funciones de Guardado Local
function guardarPedido() {
    const fab = document.getElementById('fabrica-nombre').value;
    const nro = document.getElementById('nro-pedido').value;
    const pedido = {
        fab, nro,
        cliente: document.getElementById('cliente').value,
        loc: document.getElementById('localidad').value,
        trans: document.getElementById('transporte').value,
        obs: document.getElementById('observaciones').value,
        tabla: document.getElementById('cuerpo-tabla').innerHTML
    };
    localStorage.setItem(`Pedido_${fab}_${nro}`, JSON.stringify(pedido));
    alert("✅ Guardado en el navegador");
}

function cargarPedido() {
    const fab = prompt("Fábrica:");
    const nro = prompt("N° Pedido:");
    const datos = localStorage.getItem(`Pedido_${fab}_${nro}`);
    if (datos) {
        const p = JSON.parse(datos);
        document.getElementById('cuerpo-tabla').innerHTML = p.tabla;
        document.getElementById('fabrica-nombre').value = p.fab;
        document.getElementById('nro-pedido').value = p.nro;
        document.getElementById('cliente').value = p.cliente;
        document.getElementById('localidad').value = p.loc;
        document.getElementById('transporte').value = p.trans;
        document.getElementById('observaciones').value = p.obs;
        vincularEventos();
    } else { alert("❌ No encontrado"); }
}

function enviarWhatsapp() {
    const fabrica = document.getElementById('fabrica-nombre').value;
    let msj = `*PEDIDO: ${fabrica}*%0A`;
    document.querySelectorAll('.fila-producto').forEach(f => {
        const art = f.querySelector('.art-cod').value;
        const c = f.querySelector('.total-cant').value;
        if(art && c > 0) msj += `• ${art}: ${c}u.%0A`;
    });
    window.open(`https://wa.me/5493426112097?text=${msj}`, '_blank');
}