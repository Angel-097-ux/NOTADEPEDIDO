// Fecha automática al cargar
document.getElementById('fecha-actual').innerText = new Date().toLocaleDateString();

vincularEventos();

function agregarFila() {
    const cuerpo = document.getElementById('cuerpo-tabla');
    const filas = document.getElementsByClassName('fila-producto');
    const nuevaFila = filas[0].cloneNode(true);
    
    // Limpieza profunda de inputs en la nueva fila
    nuevaFila.querySelectorAll('input').forEach(i => {
        i.value = "";
        i.classList.remove('llegue'); 
        if(i.classList.contains('total-cant')) i.value = 0;
    });
    
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

// Doble click para resaltar talles
document.addEventListener('dblclick', function(e) {
    if(e.target.classList.contains('t')) {
        e.target.classList.toggle('llegue');
    }
});

function guardarPedido() {
    const fabrica = document.getElementById('fabrica-nombre').value;
    const nro = document.getElementById('nro-pedido').value;
    if (!fabrica || !nro) return alert("⚠️ Completa Fábrica y N°");

    const pedido = {
        fabrica, nro,
        cliente: document.getElementById('cliente').value,
        localidad: document.getElementById('localidad').value,
        transporte: document.getElementById('transporte').value,
        obs: document.getElementById('observaciones').value,
        tablaHTML: document.getElementById('cuerpo-tabla').innerHTML
    };
    localStorage.setItem(`Pedido_${fabrica}_${nro}`, JSON.stringify(pedido));
    alert("✅ Pedido Guardado");
}

function cargarPedido() {
    const fabrica = prompt("Nombre de la Fábrica:");
    const nro = prompt("N° de pedido:");
    const datos = localStorage.getItem(`Pedido_${fabrica}_${nro}`);
    
    if (datos) {
        const p = JSON.parse(datos);
        document.getElementById('cuerpo-tabla').innerHTML = p.tablaHTML;
        document.getElementById('fabrica-nombre').value = p.fabrica;
        document.getElementById('nro-pedido').value = p.nro;
        document.getElementById('cliente').value = p.cliente;
        document.getElementById('localidad').value = p.localidad;
        document.getElementById('transporte').value = p.transporte;
        document.getElementById('observaciones').value = p.obs || "";
        
        vincularEventos();
        alert("📂 Pedido cargado con éxito");
    } else { 
        alert("❌ No se encontró el pedido"); 
    }
}

function generarPDF() {
    const elemento = document.getElementById('hoja-pedido');
    const nro = document.getElementById('nro-pedido').value || '001';
    const fabrica = document.getElementById('fabrica-nombre').value || 'PEDIDO';
    
    const opciones = {
        margin: 5,
        filename: `${fabrica}_Nro_${nro}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2, 
            scrollY: 0, 
            windowWidth: 1200 // Asegura que entren todas las columnas de talles
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
        pagebreak: { mode: ['avoid-all'] }
    };

    html2pdf().set(opciones).from(elemento).save();
}

function enviarWhatsapp() {
    const fabrica = document.getElementById('fabrica-nombre').value || "Pedido";
    let mensaje = `*PEDIDO: ${fabrica.toUpperCase()}*%0A`;
    
    document.querySelectorAll('.fila-producto').forEach(fila => {
        const art = fila.querySelector('.art-cod').value;
        const total = fila.querySelector('.total-cant').value;
        if(art && total > 0) mensaje += `• *Art: ${art}* | Cant: ${total}%0A`;
    });
    
    window.open(`https://wa.me/5493426112097?text=${mensaje}`, '_blank');
}