/* ============================================================
   PORTFOLIO — main.js
   Sections:
   1. Animated Canvas Background
   2. Sidebar Navigation: Smooth Scroll & Scroll-Spy
   3. Typing Role Animation
   4. Theme Toggle (Light / Dark)
   5. Contact Form Validation & Submission
============================================================ */

$(function () {

  /* ── 1. Animated Canvas Background ─────────────────────── */
  var canvas = document.getElementById('bg-canvas');
  var ctx    = canvas.getContext('2d');
  var W, H;
  var particles = [];

  function resizeCanvas() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  $(window).on('resize', resizeCanvas);

  // Create floating star particles
  for (var i = 0; i < 60; i++) {
    particles.push({
      x:  Math.random() * window.innerWidth,
      y:  Math.random() * window.innerHeight,
      r:  Math.random() * 1.5 + 0.3,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      o:  Math.random() * 0.4 + 0.1
    });
  }

  function drawFrame() {
    ctx.clearRect(0, 0, W, H);

    // Glowing orb — top-left (purple)
    var g1 = ctx.createRadialGradient(W * 0.15, H * 0.2, 0, W * 0.15, H * 0.2, W * 0.35);
    g1.addColorStop(0, 'rgba(124,110,245,0.07)');
    g1.addColorStop(1, 'transparent');
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, W, H);

    // Glowing orb — bottom-right (cyan)
    var g2 = ctx.createRadialGradient(W * 0.85, H * 0.7, 0, W * 0.85, H * 0.7, W * 0.3);
    g2.addColorStop(0, 'rgba(56,189,248,0.05)');
    g2.addColorStop(1, 'transparent');
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, W, H);

    // Animate star particles
    particles.forEach(function (p) {
      p.x += p.dx;
      p.y += p.dy;

      // Wrap around edges
      if (p.x < 0)  p.x = W;
      if (p.x > W)  p.x = 0;
      if (p.y < 0)  p.y = H;
      if (p.y > H)  p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(180,160,255,' + p.o + ')';
      ctx.fill();
    });

    requestAnimationFrame(drawFrame);
  }
  drawFrame();


  /* ── 2. Sidebar Navigation: Smooth Scroll & Scroll-Spy ──── */
  $('a[href^="#"]').on('click', function (e) {
    var target = $(this.getAttribute('href'));
    if (target.length) {
      e.preventDefault();
      $('html, body').animate(
        { scrollTop: target.offset().top - 10 },
        550,
        'swing'
      );
    }
  });

  $(window).on('scroll', function () {
    var scrollPos = $(window).scrollTop() + 140;

    $('.content-section[id]').each(function () {
      var id         = $(this).attr('id');
      var sectionTop = $(this).offset().top;
      var sectionBot = sectionTop + $(this).outerHeight();

      if (scrollPos >= sectionTop && scrollPos < sectionBot) {
        $('.sidebar-link').removeClass('active');
        $('.sidebar-link[href="#' + id + '"]').addClass('active');
      }
    });
  });


  /* ── 3. Typing Role Animation ────────────────────────────── */
  var roles = ['ML Engineer' ,'Python Developer', 'UI/UX Designer'];
  var roleIndex = 0, charIndex = 0, deleting = false;
  var $typedRole = $('#typedRole');

  function typeLoop() {
    var current = roles[roleIndex];

    if (!deleting) {
      charIndex++;
      $typedRole.text(current.slice(0, charIndex));
      if (charIndex === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1500);
        return;
      }
    } else {
      charIndex--;
      $typedRole.text(current.slice(0, charIndex));
      if (charIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 40 : 70);
  }
  if ($typedRole.length) typeLoop();


  /* ── 4. Theme Toggle (Light / Dark) ─────────────────────── */
  $('.theme-btn').on('click', function () {
    var theme = $(this).data('theme-btn');
    document.documentElement.setAttribute('data-theme', theme);
    $('.theme-btn').removeClass('active');
    $(this).addClass('active');
  });


  /* ── 5. Contact Form Validation & Submission ────────────── */
  // Uses Formspree (https://formspree.io) to deliver form submissions
  // straight to your email — no custom backend required.
  // 1. Sign up free at formspree.io
  // 2. Create a new form, grab its endpoint (looks like https://formspree.io/f/xxxxxxx)
  // 3. Paste it below in place of YOUR_FORM_ID
  var FORMSPREE_ENDPOINT = 'https://formspree.io/f/mzdlpdor';

  $('#contactForm').on('submit', function (e) {
    e.preventDefault();

    var $form   = $(this);
    var name    = $.trim($('#name').val());
    var email   = $.trim($('#email').val());
    var message = $.trim($('#message').val());
    var emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validation
    if (!name || !email || !message) {
      showFormMsg('Please fill in all fields.', '#f87171');
      return;
    }
    if (!emailRx.test(email)) {
      showFormMsg('Please enter a valid email address.', '#f87171');
      return;
    }

    var $btn = $form.find('.btn-submit');
    $btn.html('<i class="bi bi-hourglass-split"></i> Sending...').prop('disabled', true);

    // Real submission to Formspree — delivers an email to your inbox
    $.ajax({
      url: FORMSPREE_ENDPOINT,
      method: 'POST',
      dataType: 'json',
      data: { name: name, email: email, message: message }
    })
      .done(function () {
        $form[0].reset();
        showFormMsg("Message sent! I'll get back to you soon ✓", '#4ade80');
      })
      .fail(function () {
        showFormMsg('Something went wrong. Please email me directly instead.', '#f87171');
      })
      .always(function () {
        $btn.html('<i class="bi bi-send-fill"></i> Send Message').prop('disabled', false);
        setTimeout(function () { $('#formMsg').fadeOut(); }, 5000);
      });
  });

  function showFormMsg(text, color) {
    $('#formMsg').css('color', color).text(text).fadeIn();
  }

});
