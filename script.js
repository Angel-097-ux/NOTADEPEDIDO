function descargarImagen() {
    const elementoOriginal = document.getElementById('seccion-a-imprimir');
    const marca = document.querySelector('.input-marca').value || 'Pedido';
    
    // Clonamos para trabajar tranquilos
    const clon = elementoOriginal.cloneNode(true);
    
    // Convertimos inputs a texto y forzamos estilos de alta visibilidad
    clon.querySelectorAll('input, textarea').forEach(input => {
        const span = document.createElement('span');
        span.innerText = input.value;
        span.style.fontFamily = 'Arial, sans-serif'; // Fuente básica = más nítida
        span.style.fontSize = '14px';
        span.style.fontWeight = 'bold';
        span.style.color = '#000000';
        input.parentNode.replaceChild(span, input);
    });

    // Forzamos bordes negros bien visibles en la copia
    clon.querySelectorAll('table, th, td').forEach(el => {
        el.style.border = '2px solid #000000';
    });

    clon.style.position = 'fixed';
    clon.style.left = '-10000px';
    clon.style.background = 'white';
    document.body.appendChild(clon);

    html2canvas(clon, {
        scale: 5, // Máxima resolución posible
        useCORS: true,
        backgroundColor: "#ffffff",
        letterRendering: true, // Mejora el renderizado de letras
        logging: false
    }).then(canvas => {
        const link = document.createElement('a');
        link.download = marca + '_Angel.png';
        link.href = canvas.toDataURL("image/png", 1.0);
        link.click();
        document.body.removeChild(clon);
    });
}