import { motion } from 'framer-motion'
import {
  FaJava,
  FaPython,
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaLeaf,
} from 'react-icons/fa'
import { skills } from '../data/content'
import './Skills.css'

const iconMap = {
  java: FaJava,
  python: FaPython,
  react: FaReact,
  'node-js': FaNodeJs,
  database: FaDatabase,
  leaf: FaLeaf,
  js: FaReact,
}

const CIRCUMFERENCE = 2 * Math.PI * 80

export default function Skills() {
  return (
    <section className="skills" id="skills">
      <h1 className="titulo-skills">
        Minhas <span className="accent">Habilidades</span>
      </h1>

      <div className="habilidades">
        <div className="container-skills">
          <h2 className="skill-title">Técnicas</h2>
          <div className="tech-bar">
            {skills.tecnicas.map((s) => {
              const Icon = iconMap[s.icon] ?? FaDatabase
              return (
                <div className="bar" key={s.nome}>
                  <div className="info">
                    <div className="tech-icon">
                      <Icon />
                    </div>
                    <span>{s.nome}</span>
                  </div>
                  <div className="progress">
                    <motion.span
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: s.nivel / 100 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              )
            })}
          </div>

          <div className="ferramentas">
            <h2 className="skill-title">Ferramentas</h2>
            <div className="tag-list">
              {skills.ferramentas.map((f) => (
                <span key={f}>{f}</span>
              ))}
            </div>
          </div>

          <div className="idiomas">
            <h2 className="skill-title">Idiomas</h2>
            <ul>
              {skills.idiomas.map((idm) => (
                <li key={idm.nome}>
                  <span>{idm.nome}</span>
                  <span className="idioma-nivel">{idm.nivel}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="container-skills">
          <h2 className="skill-title">Profissionais</h2>
          <div className="prof-bars">
            {skills.profissionais.map((p) => (
              <div className="prof-bar" key={p.nome}>
                <svg viewBox="0 0 200 200">
                  <circle className="progress-circle" cx="100" cy="100" r="80" />
                  <motion.circle
                    className="path"
                    cx="100"
                    cy="100"
                    r="80"
                    style={{ strokeDasharray: CIRCUMFERENCE }}
                    initial={{ strokeDashoffset: CIRCUMFERENCE }}
                    whileInView={{ strokeDashoffset: CIRCUMFERENCE * (1 - p.perc / 100) }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </svg>
                <div className="perc">{p.perc}%</div>
                <p className="prof-label">{p.nome}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
