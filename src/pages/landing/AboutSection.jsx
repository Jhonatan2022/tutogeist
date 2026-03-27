import React from 'react';

const AboutSection = ({ t }) => (
  <>
    {/* ── QUIÉNES SOMOS ── */}
    <section id="about" className="tg-about">
      <div className="tg-container">
        <div className="tg-section-badge">{t.about.badge}</div>
        <h2 className="tg-section-title">{t.about.title}</h2>

        <div className="tg-about__grid">
          <div className="tg-about__text">
            <p>{t.about.text1}</p>
            <p>{t.about.text2}</p>
            <div className="tg-about__stats">
              <div className="tg-stat">
                <span className="tg-stat__num">12K+</span>
                <span>{t.about.stat1}</span>
              </div>
              <div className="tg-stat">
                <span className="tg-stat__num">40+</span>
                <span>{t.about.stat2}</span>
              </div>
              <div className="tg-stat">
                <span className="tg-stat__num">15</span>
                <span>{t.about.stat3}</span>
              </div>
            </div>
          </div>

          <div className="tg-about__visual">
            <div className="tg-about__card tg-about__card--1">
              <div className="tg-about__card-icon">⚡</div>
              <div>Respuestas instantáneas con IA</div>
            </div>
            <div className="tg-about__card tg-about__card--2">
              <div className="tg-about__card-icon">🎯</div>
              <div>Aprendizaje personalizado</div>
            </div>
            <div className="tg-about__card tg-about__card--3">
              <div className="tg-about__card-icon">🌐</div>
              <div>Disponible en 3 idiomas</div>
            </div>
            <div className="tg-about__card tg-about__card--4">
              <div className="tg-about__card-icon">📊</div>
              <div>Seguimiento de progreso</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* ── PROPÓSITO ── */}
    <section id="purpose" className="tg-purpose">
      <div className="tg-container">
        <div className="tg-purpose__inner">
          <div className="tg-section-badge tg-section-badge--light">{t.purpose.badge}</div>
          <h2 className="tg-section-title tg-section-title--light">{t.purpose.title}</h2>
          <p className="tg-purpose__text">{t.purpose.text}</p>
          <div className="tg-purpose__icons">
            <div className="tg-purpose__icon-item"><span>🚀</span><small>Innovación</small></div>
            <div className="tg-purpose__icon-item"><span>💡</span><small>Accesibilidad</small></div>
            <div className="tg-purpose__icon-item"><span>🤝</span><small>Comunidad</small></div>
            <div className="tg-purpose__icon-item"><span>🌱</span><small>Crecimiento</small></div>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default AboutSection;