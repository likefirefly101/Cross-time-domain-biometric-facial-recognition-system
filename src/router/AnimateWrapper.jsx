import React from 'react'
import { AnimatePresence, motion } from "framer-motion";

const AnimateWrapper = ({ children }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{duration: 0.3}}
        style={{display: 'flex', flexDirection: 'column', minHeight: '100vh'}}
      >
        {children}
      </motion.div>
    );
  }

export default AnimateWrapper