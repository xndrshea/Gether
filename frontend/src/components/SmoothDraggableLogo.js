'use client'

import { motion, useAnimation, useDragControls } from "framer-motion"
import { useEffect, useState, useRef } from "react"

export default function SmoothDraggableLogo({ constraintsRef, initialX = '30%', initialY = '30%' }) {
  const controls = useAnimation()
  const dragControls = useDragControls()
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const logoRef = useRef(null)

  const calculateInitialPosition = () => {
    if (logoRef.current && typeof window !== 'undefined') {
      const logoRect = logoRef.current.getBoundingClientRect()
      const x = (parseFloat(initialX) / 100) * window.innerWidth - logoRect.width / 2
      const y = (parseFloat(initialY) / 100) * window.innerHeight - logoRect.height / 2
      return { x, y }
    }
    return { x: 0, y: 0 }
  }

  useEffect(() => {
    const initialPos = calculateInitialPosition()
    setPosition(initialPos)
    controls.start({ opacity: 1, x: initialPos.x, y: initialPos.y })
  }, [initialX, initialY, controls])

  const onDragEnd = (event, info) => {
    if (logoRef.current && constraintsRef.current) {
      const logoRect = logoRef.current.getBoundingClientRect()
      const containerRect = constraintsRef.current.getBoundingClientRect()

      let newX = position.x + info.offset.x
      let newY = position.y + info.offset.y

      // Check and adjust for horizontal boundaries
      if (newX < 0) {
        newX = 0
      } else if (newX + logoRect.width > containerRect.width) {
        newX = containerRect.width - logoRect.width
      }

      // Check and adjust for vertical boundaries
      if (newY < 0) {
        newY = 0
      } else if (newY + logoRect.height > containerRect.height) {
        newY = containerRect.height - logoRect.height
      }

      const newPosition = { x: newX, y: newY }
      setPosition(newPosition)
      controls.start({
        x: newPosition.x,
        y: newPosition.y,
        transition: {
          type: "spring",
          damping: 10,
          stiffness: 100,
          mass: 0.5
        }
      })
    }
  }

  return (
    <motion.div 
      ref={logoRef}
      className="fixed z-50 w-20 h-20 bg-[#0066ff] rounded-full flex justify-center items-center text-2xl font-bold cursor-grab active:cursor-grabbing"
      drag
      dragControls={dragControls}
      dragConstraints={constraintsRef}
      dragElastic={0.1}
      dragTransition={{ power: 0.1, timeConstant: 200 }}
      animate={controls}
      onDragEnd={onDragEnd}
      initial={{ opacity: 0, x: 0, y: 0 }}
      style={{
        x: position.x,
        y: position.y
      }}
    >
      <span className="select-none text-white">gether</span>
    </motion.div>
  )
}