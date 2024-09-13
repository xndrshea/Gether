'use client'

import { motion, useAnimation, useDragControls } from "framer-motion"
import { useEffect, useRef, useState, useCallback } from "react"
import { useIsPhone } from "../../utils/useMediaQuery"

export default function MovingDraggableLogo({
  constraintsRef,
  initialX = '30%',
  initialY = '25%',
  initialPhoneX = '50%',
  initialPhoneY = '55%',
  initialVelocity = { x: 1.5, y: 1.5 }  // New prop for initial velocity
}) {
  const controls = useAnimation()
  const dragControls = useDragControls()
  const logoRef = useRef(null)
  const isPhone = useIsPhone()
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [velocity, setVelocity] = useState(initialVelocity)  // Use the initialVelocity prop
  const animationRef = useRef(null)
  const isDraggingRef = useRef(false)

  const calculateInitialPosition = useCallback(() => {
    if (logoRef.current && typeof window !== 'undefined') {
      const logoRect = logoRef.current.getBoundingClientRect()
      let x, y
      if (isPhone) {
        x = (parseFloat(initialPhoneX) / 100) * window.innerWidth - logoRect.width / 2
        y = (parseFloat(initialPhoneY) / 100) * window.innerHeight - logoRect.height / 2
      } else {
        x = (parseFloat(initialX) / 100) * window.innerWidth - logoRect.width / 2
        y = (parseFloat(initialY) / 100) * window.innerHeight - logoRect.height / 2
      }
      return { x, y }
    }
    return { x: 0, y: 0 }
  }, [initialX, initialY, initialPhoneX, initialPhoneY, isPhone])

  useEffect(() => {
    const initialPos = calculateInitialPosition()
    setPosition(initialPos)
    controls.start({ opacity: 1, x: initialPos.x, y: initialPos.y })
  }, [calculateInitialPosition, controls])

  const animate = useCallback(() => {
    if (logoRef.current && constraintsRef.current && !isDraggingRef.current) {
      const logoRect = logoRef.current.getBoundingClientRect()
      const containerRect = constraintsRef.current.getBoundingClientRect()

      let newX = position.x + velocity.x
      let newY = position.y + velocity.y
      let newVelocityX = velocity.x
      let newVelocityY = velocity.y

      // Check and adjust for horizontal boundaries
      if (newX < 0 || newX + logoRect.width > containerRect.width) {
        newVelocityX = -newVelocityX
        newX = Math.max(0, Math.min(newX, containerRect.width - logoRect.width))
      }

      // Check and adjust for vertical boundaries
      if (newY < 0 || newY + logoRect.height > containerRect.height - 60) {
        newVelocityY = -newVelocityY
        newY = Math.max(0, Math.min(newY, containerRect.height - logoRect.height - 60))
      }

      setPosition({ x: newX, y: newY })
      setVelocity({ x: newVelocityX, y: newVelocityY })

      controls.set({ x: newX, y: newY })
    }
    animationRef.current = requestAnimationFrame(animate)
  }, [position, velocity, controls])

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [animate])

  const onDragStart = () => {
    isDraggingRef.current = true
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }

  const onDragEnd = (event, info) => {
    isDraggingRef.current = false
    if (logoRef.current && constraintsRef.current) {
      const logoRect = logoRef.current.getBoundingClientRect()
      const containerRect = constraintsRef.current.getBoundingClientRect()

      let newX = position.x + info.offset.x
      let newY = position.y + info.offset.y

      // Ensure the logo stays within boundaries
      newX = Math.max(0, Math.min(newX, containerRect.width - logoRect.width))
      newY = Math.max(0, Math.min(newY, containerRect.height - logoRect.height - 60))

      // Calculate new velocity based on drag angle and speed
      const dragSpeed = Math.sqrt(info.velocity.x ** 2 + info.velocity.y ** 2)
      const dragAngle = Math.atan2(info.velocity.y, info.velocity.x)

      const maxVelocity = 1.5 // Maximum velocity in any direction
      const minVelocity = 1.5 // Minimum velocity to keep the logo moving
      const velocityFactor = 1 // Factor to control how much the drag affects the velocity

      let newSpeed = Math.min(Math.max(dragSpeed * velocityFactor, minVelocity), maxVelocity)

      let newVelocityX = newSpeed * Math.cos(dragAngle)
      let newVelocityY = newSpeed * Math.sin(dragAngle)

      setPosition({ x: newX, y: newY })
      setVelocity({ x: newVelocityX, y: newVelocityY })

      controls.set({ x: newX, y: newY })
      animationRef.current = requestAnimationFrame(animate)
    }
  }

  return (
    <motion.div
      ref={logoRef}
      className="fixed z-50 bg-[#0066ff] rounded-full flex justify-center items-center font-bold cursor-grab active:cursor-grabbing"
      drag
      dragControls={dragControls}
      dragConstraints={constraintsRef}
      dragElastic={0.1}
      dragTransition={{ power: 0.1, timeConstant: 200 }}
      animate={controls}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      initial={{ opacity: 0, x: 0, y: 0 }}
      style={{
        x: position.x,
        y: position.y,
        width: isPhone ? '70px' : '80px',
        height: isPhone ? '70px' : '80px',
      }}
      whileDrag={{
        scale: 0.9,
        transition: { duration: 0.2 }
      }}
      whileTap={{
        scale: 0.9,
        transition: { duration: 0.2 }
      }}
    >
      <span className={`select-none text-white ${isPhone ? 'text-xl' : 'text-2xl'}`}>gether</span>
    </motion.div>
  )
}