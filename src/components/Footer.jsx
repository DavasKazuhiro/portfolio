import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin, FaRegEnvelope } from 'react-icons/fa'
import { profile } from '../data/content'
import './Footer.css'

export default function Footer() {
  return (
    <footer id="contato">
      <div className="interface">
        <motion.div
          className="footer"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5 }}
        >
          <h1>
            Vamos <span className="accent">conversar</span>?
          </h1>
          <p>{profile.email} · {profile.location}</p>

          <div className="footer-icons">
            <a href={profile.github} target="_blank" rel="noreferrer" className="footer-link">
              <span className="tech-icon">
                <FaGithub />
              </span>
              Github
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="footer-link">
              <span className="tech-icon">
                <FaLinkedin />
              </span>
              Linkedin
            </a>
            <a href={`mailto:${profile.email}`} className="footer-link">
              <span className="tech-icon">
                <FaRegEnvelope />
              </span>
              E-mail
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
