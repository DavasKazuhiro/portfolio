import { motion } from 'framer-motion'
import * as FaIcons from 'react-icons/fa'
import { projects } from '../data/content'
import './Projects.css'

const iconMap = {
  'diagram-project': 'FaProjectDiagram',
  ccg: 'FaProjectDiagram',
  play: 'FaPlay',
  droplet: 'FaTint',
  folder: 'FaFolder',
  calculator: 'FaCalculator',
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const card = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export default function Projects() {
  return (
    <section className="projetos" id="projetos">
      <div className="interface">
        <h1 className="titulo">
          Projetos <span className="accent">e</span> Criações
        </h1>

        <motion.div
          className="lista-projetos"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          {projects.map((p) => {
            const Icon = FaIcons[iconMap[p.icon]] ?? FaIcons.FaFolder
            return (
              <motion.div
                className={`card ${p.destaque ? 'card--destaque' : ''}`}
                key={p.titulo}
                variants={card}
              >
                <div>
                  <Icon className="card-icon" />
                  <h2>{p.titulo}</h2>
                  <p>{p.descricao}</p>
                  {p.tecnologias.length > 0 && (
                    <div className="card-tags">
                      {p.tecnologias.map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
                {p.link && (
                  <a href={p.link} target="_blank" rel="noreferrer">
                    Saiba mais
                  </a>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
