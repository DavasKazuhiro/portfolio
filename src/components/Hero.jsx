import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin, FaRegEnvelope } from 'react-icons/fa'
import { profile } from '../data/content'
import './Hero.css'

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export default function Hero() {
  const [imgError, setImgError] = useState(false)

  return (
    <section className="home" id="home">
      <div className="interface">
        <motion.div
          className="home__flex"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <div className="txt-home">
            <motion.h1 variants={item}>
              Olá! Meu nome é <br />
              {profile.name} <span className="accent">:</span>
            </motion.h1>

            <motion.div className="wrapper-typing" variants={item}>
              <ul className="typing">
                {profile.roles.map((role) => (
                  <li key={role}>
                    <span>{role}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div className="wrapper-icons" variants={item}>
              <IconLink href={profile.github} label="Github">
                <FaGithub />
              </IconLink>
              <IconLink href={profile.linkedin} label="Linkedin">
                <FaLinkedin />
              </IconLink>
              <IconLink href={`mailto:${profile.email}`} label="Mail">
                <FaRegEnvelope />
              </IconLink>
            </motion.div>
          </div>

          <motion.div className="img-home" variants={item}>
            {!imgError ? (
              <img
                src="/foto.jpg"
                alt={profile.name}
                className="foto"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="foto foto--fallback" aria-hidden="true">
                DKN
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

function IconLink({ href, label, children }) {
  return (
    <div className="icon">
      <div className="tip">{label}</div>
      <span>
        <a href={href} target="_blank" rel="noreferrer" aria-label={label}>
          {children}
        </a>
      </span>
    </div>
  )
}
