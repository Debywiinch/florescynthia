// ---------- CONFIGURAÇÃO ----------
  const WHATSAPP_NUMBER = "5531971398831"; // número de teste — trocar quando tiver o comercial
  const DEFAULT_MESSAGE = "Olá! Gostaria de encomendar uma coroa de flores.";

  function waLink(message){
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  // links gerais
  document.getElementById('navWa').href = waLink(DEFAULT_MESSAGE);
  document.getElementById('heroWa').href = waLink(DEFAULT_MESSAGE);
  document.getElementById('ctaWa').href = waLink(DEFAULT_MESSAGE);
  document.getElementById('floatWa').href = waLink(DEFAULT_MESSAGE);

  // ---------- CATÁLOGO (exemplo — edite nomes, descrições e preços) ----------
  const products = [
    {
      tag: "Grande",
      name: "Coroa Elegância",
      desc: "Rosas brancas e lírios, com faixa de homenagem personalizada.",
      price: "280",
      leaf: "#7C8B6F", flower: "#F3E9E9"
    },
    {
      tag: "Média",
      name: "Coroa Serenidade",
      desc: "Crisântemos e folhagens nobres em tons suaves.",
      price: "220",
      leaf: "#A8B79C", flower: "#EDE6D8"
    },
    {
      tag: "Compacta",
      name: "Coroa Singela",
      desc: "Arranjo compacto, ideal para espaços reduzidos.",
      price: "160",
      leaf: "#7C8B6F", flower: "#F5F1E8"
    },
    {
      tag: "Extra Grande",
      name: "Coroa Presidencial",
      desc: "Porte imponente, flores nobres e faixa dupla.",
      price: "380",
      leaf: "#5C6B52", flower: "#EFE2C8"
    },
    {
      tag: "Formato especial",
      name: "Coroa Coração",
      desc: "Homenagem em formato de coração, com rosas e lírios.",
      price: "240",
      leaf: "#7C8B6F", flower: "#F0DCE0"
    },
    {
      tag: "Estilo silvestre",
      name: "Coroa Campo",
      desc: "Flores do campo em tons naturais e despojados.",
      price: "200",
      leaf: "#A8B79C", flower: "#E9E2C4"
    }
  ];

  function productArt(p){
    return `<svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="80" cy="80" r="52" stroke="${p.leaf}" stroke-width="2" opacity="0.4"/>
      <g stroke="${p.leaf}" stroke-width="2.4" stroke-linecap="round" fill="none">
        <path d="M80 30c-20 16-24 48-16 82M80 30c20 16 24 48 16 82"/>
      </g>
      <g fill="${p.flower}" stroke="${p.leaf}" stroke-width="1">
        <circle cx="80" cy="32" r="7"/>
        <circle cx="56" cy="46" r="5"/>
        <circle cx="104" cy="46" r="5"/>
        <circle cx="46" cy="76" r="4.5"/>
        <circle cx="114" cy="76" r="4.5"/>
        <circle cx="52" cy="108" r="4.5"/>
        <circle cx="108" cy="108" r="4.5"/>
      </g>
    </svg>`;
  }

  const grid = document.getElementById('catalogGrid');
  products.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card reveal';
    const msg = `Olá! Tenho interesse na ${p.name} (${p.tag}) - R$ ${p.price}. Podemos combinar entrega e pagamento?`;
    card.innerHTML = `
      <div class="card-art">${productArt(p)}</div>
      <div class="card-body">
        <div class="card-tag">${p.tag}</div>
        <h3>${p.name}</h3>
        <p class="desc">${p.desc}</p>
        <div class="card-footer">
          <div class="price"><small>a partir de</small>R$ ${p.price}</div>
          <a class="btn-buy" href="${waLink(msg)}" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.36 5.07L2 22l5.1-1.33A9.94 9.94 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm5.2 14.2c-.22.62-1.27 1.18-1.75 1.24-.45.06-1 .08-1.62-.1-.37-.11-.85-.27-1.46-.53-2.57-1.11-4.24-3.7-4.37-3.87-.13-.17-1.05-1.39-1.05-2.66s.67-1.88.9-2.14c.24-.26.52-.32.7-.32.17 0 .35 0 .5.01.16.01.38-.06.6.46.22.53.75 1.83.82 1.96.07.13.11.29.02.46-.09.17-.14.28-.27.43-.13.15-.28.34-.4.46-.13.13-.27.27-.12.53.15.26.68 1.12 1.46 1.82 1 .89 1.85 1.16 2.11 1.29.26.13.41.11.56-.07.15-.17.65-.75.82-1.01.17-.26.35-.21.58-.13.24.09 1.5.71 1.76.84.26.13.43.19.5.3.06.11.06.63-.16 1.24z"/></svg>
            Comprar
          </a>
        </div>
      </div>
    `;
    grid.appendChild(card);
  });

  // ---------- SCROLL REVEAL ----------
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));