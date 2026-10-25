import { motion } from 'framer-motion'
import { FaUserAstronaut, FaBrain } from 'react-icons/fa'
import { about } from '../data/content'
import './About.css'

const reveal = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function About() {
  return (
    <section className="sobre" id="sobre">
      <div className="interface">
        <motion.div
          className="sobre-row"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          variants={reveal}
        >
          <div className="sobre-icons">
            <FaUserAstronaut />
          </div>
          <div className="sobre-texto">
            <h2>
              Sobre <span className="accent">Mim</span>
            </h2>
            <h4>Quem sou eu?</h4>
            <p>{about.quemSouEu}</p>
          </div>
        </motion.div>

        <motion.div
          className="sobre-row sobre-row--reverse"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.35 }}
          variants={reveal}
        >
          <div className="sobre-texto">
            <h2>
              O Que Me <span className="accent">Move</span>
            </h2>
            <h4>Pesquisa & projetos</h4>
            <p>{about.oQueMeMove}</p>
          </div>
          <div className="sobre-icons">
            <FaBrain />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
