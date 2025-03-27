document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.clickable-address').forEach(el => {
    el.addEventListener('click', () => {
      const address = el.dataset.address;
      const modal = el.parentElement.querySelector('.map-modal');
      const iframe = modal.querySelector('iframe');

      iframe.src = `https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_KEY}`;
      modal.classList.add('show');
    });
  });

  document.querySelectorAll('.map-close-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.map-modal');
      const iframe = modal.querySelector('iframe');

      iframe.src = '';
      modal.classList.remove('show');
    });
  });
});
