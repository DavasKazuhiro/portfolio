import { motion } from 'framer-motion'
import { FaBriefcase, FaFlask, FaGraduationCap } from 'react-icons/fa'
import { experiences, education, extras } from '../data/content'
import './Experience.css'

const icons = {
  trabalho: FaBriefcase,
  pesquisa: FaFlask,
}

export default function Experience() {
  return (
    <section className="experiencia" id="experiencia">
      <div className="interface">
        <h1 className="titulo">
          Experiência <span className="accent">&</span> Formação
        </h1>

        <div className="timeline">
          {experiences.map((exp, i) => {
            const Icon = icons[exp.tipo]
            return (
              <motion.div
                className="timeline-item"
                key={exp.titulo}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="timeline-icon">
                  <Icon />
                </div>
                <div className="timeline-content">
                  <div className="timeline-head">
                    <h3>{exp.titulo}</h3>
                    <span className="timeline-periodo">{exp.periodo}</span>
                  </div>
                  <p className="timeline-local">{exp.local}</p>
                  <ul>
                    {exp.itens.map((txt) => (
                      <li key={txt}>{txt}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          className="edu-card"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="edu-icon">
            <FaGraduationCap />
          </div>
          <div>
            <h3>{education.curso}</h3>
            <p className="edu-meta">
              {education.instituicao} · {education.previsao} · {education.ira}
            </p>
            <div className="edu-tags">
              {education.disciplinas.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </motion.div>

        {extras.map((ex) => (
          <motion.p
            className="extra-nota"
            key={ex.titulo}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.5 }}
          >
            <strong>{ex.titulo}:</strong> {ex.descricao}
          </motion.p>
        ))}
      </div>
    </section>
  )
}
