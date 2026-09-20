// ==========================
// Portfolio Items
// ==========================
const portfolioItems = [
    {category: "menu", title: "Bakery Menu", image: "assets/menu.png"},
    {category: "posters", title: "AirPods Poster", image: "assets/AIRPODS PRO.png"},
    {category: "posters", title: "Blue Lady Perfume Poster", image: "assets/poster.png"}, 
    {category: "posters", title: "Gaming Mouse Poster", image: "assets/mouse.png"},
    {category: "business", title: "Business Card - Bakers Point", image: "assets/busnesscard.png"},
    {category: "brochures", title: "Marketing Brochure", image: "assets/brochure.png"},
];

const grid = document.getElementById('portfolio-grid');
const filterButtons = document.querySelectorAll('.filter-btn');

// ==========================
// Display Portfolio with Lazy Load
// ==========================
function displayPortfolio(category = 'all') {
    // If running on a page with the authoritative inline portfolio modal (e.g. stunning.html), do not overwrite
    if (document.getElementById('ad-modal') || document.querySelector('.portfolio-grid .portfolio-item')) {
        return;
    }
    if (!grid) return;
    grid.innerHTML = '';
    const filtered = category === 'all' ? portfolioItems : portfolioItems.filter(item => item.category === category);
    filtered.forEach((item,index)=>{
        const div = document.createElement('div');
        div.classList.add('portfolio-item');
        div.innerHTML = `
            <img data-src="${item.image}" alt="${item.title}">
            <div class="portfolio-overlay">${item.title}</div>
        `;
        grid.appendChild(div);

        // Lazy load
        const img = div.querySelector('img');
        if (img) {
            const observer = new IntersectionObserver((entries, obs)=>{
                entries.forEach(entry=>{
                    if(entry.isIntersecting){
                        img.src = img.dataset.src;
                        obs.unobserve(img);
                    }
                });
            },{threshold:0.1});
            observer.observe(img);
        }

        // Tilt hover effect
        div.addEventListener('mousemove', (e)=>{
            const rect = div.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width/2;
            const cy = rect.height/2;
            div.style.transform = `rotateX(${(y-cy)/cy*6}deg) rotateY(${(x-cx)/cx*6}deg) scale(1.03)`;
        });
        div.addEventListener('mouseleave', ()=>{div.style.transform='rotateX(0deg) rotateY(0deg) scale(1)';});
        div.addEventListener('click', ()=>openLightbox(index,filtered));
    });
}
if (grid) displayPortfolio();

// Filter buttons
filterButtons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
        if (document.getElementById('ad-modal') || document.querySelector('.portfolio-grid .portfolio-item')) {
            return;
        }
        filterButtons.forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        if (grid) displayPortfolio(btn.dataset.category || btn.getAttribute('data-filter'));
    });
});

// ==========================
// Lightbox
// ==========================
const lightbox = document.getElementById('lightbox');
const lbImg = lightbox ? lightbox.querySelector('img') : null;
const lbClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;
let lbCurrent = 0;
let lbItems = [];

function openLightbox(index,items){
    if (!lightbox || !lbImg) return;
    lbCurrent=index;
    lbItems=items;
    lbImg.src=items[index].image;
    lightbox.classList.add('active');
}

if (lbClose) {
    lbClose.addEventListener('click', ()=>lightbox.classList.remove('active'));
}
const lbPrev = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
if (lbPrev) {
    lbPrev.addEventListener('click', ()=>{
        lbCurrent = (lbCurrent-1+lbItems.length)%lbItems.length;
        if (lbImg) lbImg.src=lbItems[lbCurrent].image;
    });
}
const lbNext = lightbox ? lightbox.querySelector('.lightbox-next') : null;
if (lbNext) {
    lbNext.addEventListener('click', ()=>{
        lbCurrent = (lbCurrent+1)%lbItems.length;
        if (lbImg) lbImg.src=lbItems[lbCurrent].image;
    });
}

// ==========================
// Contact Form
// ==========================
const form=document.getElementById('contact-form');
const success=document.querySelector('.form-success');
if (form) {
    form.addEventListener('submit',e=>{
        e.preventDefault();
        if (success) success.style.display='block';
        form.reset();
    });
}

// ==========================
// Scroll Animations
// ==========================
const sections=document.querySelectorAll('section');
if (sections.length > 0 && typeof IntersectionObserver !== 'undefined') {
    const sectionObserver=new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
            if(entry.isIntersecting){
                entry.target.style.opacity='1';
                entry.target.style.transform='translateY(0)';
                sectionObserver.unobserve(entry.target);
            }
        });
    },{threshold:0.2});
    sections.forEach(sec=>sectionObserver.observe(sec));
}

// ==========================
// Particle Effects per Section
// ==========================
function createParticles(canvasId,color,num){
    const canvas=document.getElementById(canvasId);
    if(!canvas) return;
    const ctx=canvas.getContext('2d');
    canvas.width=canvas.offsetWidth;
    canvas.height=canvas.offsetHeight;
    const particles=[];
    for(let i=0;i<num;i++){
        particles.push({
            x:Math.random()*canvas.width,
            y:Math.random()*canvas.height,
            r:Math.random()*2+1,
            dx:(Math.random()-0.5)*0.5,
            dy:(Math.random()-0.5)*0.5
        });
    }
    function animate(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        particles.forEach(p=>{
            ctx.beginPath();
            ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
            ctx.fillStyle=color;
            ctx.fill();
            p.x+=p.dx;
            p.y+=p.dy;
            if(p.x<0||p.x>canvas.width)p.dx*=-1;
            if(p.y<0||p.y>canvas.height)p.dy*=-1;
        });
        requestAnimationFrame(animate);
    }
    animate();
    window.addEventListener('resize',()=>{canvas.width=canvas.offsetWidth; canvas.height=canvas.offsetHeight;});
}

// Section-specific colors and particle count
createParticles('hero-particles','rgba(245,210,143,0.3)',50);
createParticles('about-particles','rgba(100,200,245,0.25)',40);
createParticles('services-particles','rgba(245,100,180,0.2)',35);
createParticles('portfolio-particles','rgba(180,245,200,0.2)',40);
createParticles('cta-particles','rgba(255,200,100,0.3)',30);
createParticles('contact-particles','rgba(245,245,245,0.15)',25);
createParticles('social-particles','rgba(180,180,245,0.15)',25);
