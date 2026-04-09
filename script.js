// Seteamos la fecha actual al cargar
document.getElementById('fecha-actual').innerText = new Date().toLocaleDateString();

// Inicializamos los eventos por primera vez
vincularEventos();

function agregarFila() {
    const cuerpo = document.getElementById('cuerpo-tabla');
    const filas = document.getElementsByClassName('fila-producto');
    const nuevaFila = filas[0].cloneNode(true);
    
    // Limpieza profunda de la nueva fila
    nuevaFila.querySelectorAll('input').forEach(i => {
        i.value = "";
        i.classList.remove('llegue'); 
        if(i.classList.contains('total-cant')) i.value = 0;
    });
    nuevaFila.querySelector('.fila-subtotal').innerText = "$0";
    
    cuerpo.appendChild(nuevaFila);
    vincularEventos(); // Re-vinculamos los listeners a la nueva fila
}

function vincularEventos() {
    document.querySelectorAll('.fila-producto').forEach(fila => {
        const talles = fila.querySelectorAll('.t');
        const precioI = fila.querySelector('.art-precio');
        
        const calcular = () => {
            let cant = 0;
            talles.forEach(t => cant += Number(t.value || 0));
            
            fila.querySelector('.total-cant').value = cant;
            let p = Number(precioI.value || 0);
            
            // Calculamos subtotal y formateamos con moneda local
            let subtotal = cant * p;
            fila.querySelector('.fila-subtotal').innerText = `$${subtotal.toLocaleString('es-AR')}`;
            
            sumarTodo();
        };

        // Asignamos el evento a cada input de la fila
        talles.forEach(t => t.oninput = calcular);
        precioI.oninput = calcular;
    });
}

function sumarTodo() {
    let total = 0;
    document.querySelectorAll('.fila-subtotal').forEach(s => {
        // Limpiamos el texto para convertirlo a número puro
        let valor = s.innerText.replace(/[$. ]/g, '').replace(',', '.');
        total += Number(valor || 0);
    });
    document.getElementById('total-final').innerText = `$${total.toLocaleString('es-AR')}`;
}

// Marcado rápido con doble click para talles
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
        tablaHTML: document.getElementById('cuerpo-tabla').innerHTML,
        total: document.getElementById('total-final').innerText
    };
    localStorage.setItem(`Pedido_${fabrica}_${nro}`, JSON.stringify(pedido));
    alert("✅ Guardado correctamente");
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
        document.getElementById('total-final').innerText = p.total;
        
        // Re-vincular eventos a los elementos cargados
        vincularEventos();
        alert("📂 Pedido cargado");
    } else { 
        alert("❌ No se encontró el pedido solicitado"); 
    }
}

/**
 * GENERACIÓN DE PDF OPTIMIZADA
 * Ajustado para evitar espacios en blanco superiores
 */
function generarPDF() {
    const elemento = document.getElementById('hoja-pedido');
    const nro = document.getElementById('nro-pedido').value || '001';
    const fabrica = document.getElementById('fabrica-nombre').value || 'PEDIDO';
    
    const opciones = {
        margin: 0, // El margen se controla desde el CSS para mayor precisión
        filename: `${fabrica}_Nro_${nro}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2, 
            useCORS: true,
            letterRendering: true,
            // CORRECCIÓN CLAVE: Forza a la captura a iniciar en el tope absoluto
            scrollY: 0, 
            scrollX: 0,
            windowHeight: elemento.scrollHeight
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' },
        // CLAVE: Evita cortes de fila y gestiona múltiples hojas fluidas
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // Aplicamos la generación
    html2pdf().set(opciones).from(elemento).save();
}

function enviarWhatsapp() {
    const fabrica = document.getElementById('fabrica-nombre').value || "Pedido";
    let mensaje = `*PEDIDO: ${fabrica.toUpperCase()}*%0A`;
    
    document.querySelectorAll('.fila-producto').forEach(fila => {
        const art = fila.querySelector('.art-cod').value;
        const total = fila.querySelector('.total-cant').value;
        if(art && total > 0) mensaje += `• *${art}* | Cant: ${total}%0A`;
    });
    
    mensaje += `*TOTAL: ${document.getElementById('total-final').innerText}*`;
    window.open(`https://wa.me/5493426112097?text=${mensaje}`, '_blank');
}