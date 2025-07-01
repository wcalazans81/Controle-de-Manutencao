function ajustarEspacoFooter() {
    const footer = document.querySelector('.card-footer');
    if (!footer) return;
  
    const alturaFooter = footer.offsetHeight;
    const paddingInferior = alturaFooter + 15;
  
    document.body.style.paddingBottom = paddingInferior + 'px';
    footer.style.marginTop = '30px';
  }
  
  window.addEventListener('load', ajustarEspacoFooter);
  window.addEventListener('resize', ajustarEspacoFooter);
  